import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ACCENT_COLOUR,
  CONTEXT_COLOUR,
  ChartFigure,
  ChartPlot,
  ChartTable,
  DOWN_COLOUR,
  GridY,
  LEAD_COLOUR,
  Legend,
  PlotLayer,
  UP_COLOUR,
  barPath,
  formatValue,
  labelOpacity,
  neutralColour,
  slotColour,
  tickFormatter,
  useChartViewport,
  useCrosshair,
  wrapLabel,
} from "../../molecules/chart-frame";
import type { LegendItem, TooltipRow } from "../../molecules/chart-frame";
import "./bar-chart.css";

export type BarSeries = {
  id: string;
  name: string;
  /** One value per category. Null is missing and draws nothing. */
  values: (number | null)[];
  /** The comparison, such as last quarter, in grey. */
  context?: boolean;
  /** The part the title is about, in the accent. */
  highlight?: boolean;
  /** Pins a categorical slot, for views with several series of equal weight. */
  slot?: number;
};

export type BarLayout = "grouped" | "stacked" | "diverging";

export type BarChartProps = {
  title: ReactNode;
  /** Names the plot for assistive technology, and captions the table. */
  label: string;
  categories: string[];
  series: BarSeries[];
  /** Grouped sets series side by side, stacked piles them, diverging colours one series by its sign. */
  layout?: BarLayout;
  /** Diverging bars read best sideways, so that's their default. */
  orientation?: "vertical" | "horizontal";
  /** Largest first. Diverging bars sort by default; time-ordered categories shouldn't. */
  sort?: "none" | "descending";
  /** Which values get a label: every bar, only the extreme and the last, or none. */
  values?: "all" | "ends" | "none";
  format?: (value: number) => string;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

const finite = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v);

type Painted = BarSeries & { colour: string };

/** Direction B: the story in the lead, comparisons in grey, parts in warm greys, the subject in the accent. */
function paint(series: BarSeries[], layout: BarLayout): Painted[] {
  if (layout === "diverging") return series.slice(0, 1).map((s) => ({ ...s, colour: LEAD_COLOUR }));
  const stories = series.filter((s) => !s.context);
  if (layout === "stacked") {
    if (series.length <= 4) {
      let k = 0;
      return series.map((s) => ({ ...s, colour: s.highlight ? ACCENT_COLOUR : s.context ? CONTEXT_COLOUR : neutralColour(++k) }));
    }
    return series.map((s, i) => ({ ...s, colour: s.highlight ? ACCENT_COLOUR : slotColour(s.slot ?? Math.min(8, i + 1)) }));
  }
  if (stories.length <= 1) return series.map((s) => ({ ...s, colour: s.context ? CONTEXT_COLOUR : s.highlight ? ACCENT_COLOUR : LEAD_COLOUR }));
  let next = 1;
  return series.map((s) => ({ ...s, colour: s.context ? CONTEXT_COLOUR : s.highlight ? ACCENT_COLOUR : slotColour(s.slot ?? Math.min(8, next++)) }));
}

/**
 * Comparison by length: grouped, stacked or diverging, upright or sideways. Bars are 24px at most,
 * rounded at the data and square at the baseline, separated by 2px of surface, and start at zero.
 */
export function BarChart({
  title,
  label,
  categories: rawCategories,
  series: rawSeries,
  layout = "grouped",
  orientation,
  sort,
  values,
  format,
  titleAs,
  eyebrow,
  description,
  caption,
  tableCaption,
  emptyText = "No data to show yet.",
  keys,
}: BarChartProps) {
  const horizontal = (orientation ?? (layout === "diverging" ? "horizontal" : "vertical")) === "horizontal";
  const order = useMemo(() => {
    const idx = rawCategories.map((_, i) => i);
    if ((sort ?? (layout === "diverging" ? "descending" : "none")) === "descending") {
      const key = (i: number) => rawSeries.reduce((s, ser) => s + (finite(ser.values[i]) ? (ser.values[i] as number) : 0), 0);
      idx.sort((a, b) => key(b) - key(a));
    }
    return idx;
  }, [rawCategories, rawSeries, sort, layout]);
  const categories = order.map((i) => rawCategories[i]);
  const series = useMemo(() => paint(rawSeries, layout).map((s) => ({ ...s, values: order.map((i) => s.values[i] ?? null) })), [rawSeries, layout, order]);
  const n = categories.length;
  const hasData = series.some((s) => s.values.some(finite));
  const stacked = layout === "stacked";

  // Stacks pile positives up and negatives down from zero, so a negative total still reads.
  const stacks = useMemo(
    () =>
      categories.map((_, i) => {
        let up = 0;
        let down = 0;
        return series.map((s) => {
          const v = finite(s.values[i]) ? (s.values[i] as number) : 0;
          if (v >= 0) {
            const seg = [up, up + v];
            up += v;
            return seg;
          }
          const seg = [down, down + v];
          down += v;
          return seg;
        });
      }),
    [categories, series],
  );
  const totals = categories.map((_, i) => series.reduce((s, ser) => s + (finite(ser.values[i]) ? (ser.values[i] as number) : 0), 0));

  const target = useMemo(() => {
    let lo = 0;
    let hi = 0;
    if (stacked) stacks.forEach((segs) => segs.forEach(([a, b]) => ((lo = Math.min(lo, a, b)), (hi = Math.max(hi, a, b)))));
    else series.forEach((s) => s.values.forEach((v) => finite(v) && ((lo = Math.min(lo, v)), (hi = Math.max(hi, v)))));
    if (lo === hi) hi = 1;
    if (layout === "diverging") {
      const m = Math.max(Math.abs(lo), Math.abs(hi));
      [lo, hi] = [lo < 0 ? -m : 0, hi > 0 ? m : 0];
    }
    const [y0, y1] = scaleLinear().domain([lo, hi]).nice(4).domain();
    return { i0: 0, i1: Math.max(0, n - 1), y0, y1 };
  }, [stacks, series, stacked, layout, n]);

  const { plotRef, size, density, reveal, advance, view } = useChartViewport(target, { width: 640, height: 300 });
  const dense = density === "analytical";
  const ticks = scaleLinear().domain([view.y0, view.y1]).ticks(dense ? 4 : 5);
  const tickText = tickFormatter(ticks);
  // Values keep the decimals the data has, up to two: 18 trades stay 18, and 8.4% stays 8.4.
  const digits = Math.min(2, Math.max(0, ...series.flatMap((ser) => ser.values.filter(finite).map((x) => (String(x).split(".")[1] ?? "").length))));
  const fmt = format ?? ((x: number) => formatValue(x, digits));
  const lineHeight = Math.round(advance * 1.9);

  // Layout: categories along the bottom when upright, down the left when sideways.
  const labelColumn = horizontal ? Math.min(size.width * 0.38, Math.max(...categories.map((c) => c.length * advance), 40) + 12) : 0;
  const band = horizontal ? 0 : (size.width - 8) / Math.max(1, n);
  const wrapped = horizontal ? [] : categories.map((c) => wrapLabel(c, band - 6, advance));
  const labelRows = horizontal ? 0 : Math.max(1, ...wrapped.map((w) => w.length));
  const valueRoom = Math.max(...series.flatMap((s) => s.values.filter(finite).map((v) => fmt(v as number).length)), 3) * advance + 10;
  const m = horizontal ? { t: 6, r: values === "none" ? 8 : valueRoom, b: 24, l: labelColumn } : { t: 22, r: 4, b: labelRows * lineHeight + 12, l: 4 };
  const box = { x: m.l, y: m.t, width: Math.max(0, size.width - m.l - m.r), height: Math.max(0, size.height - m.t - m.b) };
  const v = scaleLinear().domain([view.y0, view.y1]);
  if (horizontal) v.range([box.x, box.x + box.width]);
  else v.range([box.y + box.height, box.y]);
  const step = (horizontal ? box.height : box.width) / Math.max(1, n);
  const centre = (i: number) => (horizontal ? box.y : box.x) + step * (i + 0.5);
  const thickness = Math.min(24, step * (stacked || layout === "diverging" ? 0.62 : 0.7) / (stacked || layout === "diverging" ? 1 : Math.max(1, series.length)) - (stacked ? 0 : 2));

  const rowText = (i: number) => series.filter((s) => finite(s.values[i])).map((s) => `${s.name} ${fmt(s.values[i] as number)}`);
  const describe = useCallback((i: number) => `${categories[i]}. ${[...rowText(i), ...(stacked ? [`Total ${fmt(totals[i])}`] : [])].join(", ") || "No value"}.`, [categories, series, totals, stacked]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useCrosshair({
    min: 0,
    max: Math.max(0, n - 1),
    start: 0,
    axis: horizontal ? "y" : "x",
    indexAt: (pos) => Math.floor((pos - (horizontal ? box.y : box.x)) / step),
    describe,
    stride: 3,
  });

  if (!hasData || n === 0) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Category" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  const signColour = (x: number) => (x >= 0 ? UP_COLOUR : DOWN_COLOUR);
  const colourOf = (s: Painted, x: number) => (layout === "diverging" ? signColour(x) : s.colour);
  const show = values ?? (layout === "stacked" ? "ends" : "all");
  const maxI = totals.indexOf(Math.max(...totals));
  const labelled = (i: number) => show === "all" || (show === "ends" && (i === maxI || i === n - 1));

  // One bar in data space, drawn from the zero line.
  const bar = (i: number, from: number, to: number, offset: number, width: number) => {
    const c = centre(i) + offset;
    if (horizontal) return barPath(v(from), c - width / 2, v(to), c + width / 2, to >= from ? "right" : "left");
    return barPath(c - width / 2, v(from), c + width / 2, v(to), to >= from ? "top" : "bottom");
  };

  const marks = categories.map((_, i) => {
    const parts: ReactNode[] = [];
    if (stacked) {
      const live = series.map((s, k) => ({ s, k, seg: stacks[i][k] })).filter(({ seg }) => seg[1] !== seg[0]);
      const outerUp = live.filter(({ seg }) => seg[1] > seg[0]).pop()?.k;
      const outerDown = live.filter(({ seg }) => seg[1] < seg[0]).pop()?.k;
      live.forEach(({ s, k, seg }) => {
        const [a, b] = seg;
        const outer = k === outerUp || k === outerDown;
        // A 2px surface gap between touching segments: each gives up a pixel at its inner edges.
        const gap = (px: number) => (horizontal ? px : -px);
        const pa = v(a) + (a !== 0 ? gap(b > a ? 1 : -1) : 0);
        const pb = v(b) - (outer ? 0 : gap(b > a ? 1 : -1));
        const c = centre(i);
        const d = horizontal
          ? outer
            ? barPath(pa, c - thickness / 2, pb, c + thickness / 2, b > a ? "right" : "left")
            : `M${Math.min(pa, pb)} ${c - thickness / 2}H${Math.max(pa, pb)}V${c + thickness / 2}H${Math.min(pa, pb)}Z`
          : outer
            ? barPath(c - thickness / 2, pa, c + thickness / 2, pb, b > a ? "top" : "bottom")
            : `M${c - thickness / 2} ${Math.min(pa, pb)}H${c + thickness / 2}V${Math.max(pa, pb)}H${c - thickness / 2}Z`;
        if (d) parts.push(<path key={s.id} className="mk-bar" d={d} style={{ fill: s.colour }} />);
      });
    } else {
      const k = series.length;
      series.forEach((s, j) => {
        const x = s.values[i];
        if (!finite(x)) return;
        const offset = layout === "diverging" ? 0 : (j - (k - 1) / 2) * (thickness + 2);
        const d = bar(i, 0, x, offset, thickness);
        if (d) parts.push(<path key={s.id} className="mk-bar" d={d} style={{ fill: colourOf(s, x) }} />);
      });
    }
    return (
      <g key={categories[i]} className="mk-bar-group" data-active={active === i ? "" : undefined}>
        {parts}
      </g>
    );
  });

  // Value labels sit just past each bar's end, in ink.
  const valueLabels = categories.flatMap((_, i) => {
    if (!labelled(i)) return [];
    if (stacked) {
      const t = totals[i];
      const end = t >= 0 ? Math.max(...stacks[i].map(([, b]) => b), 0) : Math.min(...stacks[i].map(([, b]) => b), 0);
      return [horizontal ? <text key={i} className="mk-chart-value" x={v(end) + (t >= 0 ? 6 : -6)} y={centre(i) + 4} textAnchor={t >= 0 ? "start" : "end"}>{fmt(t)}</text> : <text key={i} className="mk-chart-value" x={centre(i)} y={v(end) + (t >= 0 ? -6 : 14)} textAnchor="middle">{fmt(t)}</text>];
    }
    const which = layout === "grouped" ? series.filter((s) => !s.context).slice(0, series.length > 2 ? 0 : 1) : series;
    return which.flatMap((s) => {
      const x = s.values[i];
      if (!finite(x)) return [];
      const j = series.indexOf(s);
      const offset = layout === "diverging" ? 0 : (j - (series.length - 1) / 2) * (thickness + 2);
      return horizontal
        ? [<text key={`${i}-${s.id}`} className="mk-chart-value" x={v(x) + (x >= 0 ? 6 : -6)} y={centre(i) + offset + 4} textAnchor={x >= 0 ? "start" : "end"}>{layout === "diverging" ? (x > 0 ? "+" : "") + fmt(x) : fmt(x)}</text>]
        : [<text key={`${i}-${s.id}`} className="mk-chart-value" x={centre(i) + offset} y={v(x) + (x >= 0 ? -6 : 14)} textAnchor="middle">{layout === "diverging" ? (x > 0 ? "+" : "") + fmt(x) : fmt(x)}</text>];
    });
  });

  const tooltipRows = (i: number): TooltipRow[] =>
    [...series]
      .reverse()
      .filter((s) => finite(s.values[i]))
      .map((s) => ({ value: (layout === "diverging" && (s.values[i] as number) > 0 ? "+" : "") + fmt(s.values[i] as number), label: s.name, colour: colourOf(s, s.values[i] as number), key: "swatch" as const }));
  const crosshair =
    active == null
      ? null
      : {
          x: horizontal ? Math.min(box.x + box.width, v(Math.max(0, ...series.map((s) => (finite(s.values[active]) ? (s.values[active] as number) : 0))))) : centre(active),
          top: box.y,
          bottom: box.y + box.height,
          line: false,
          anchorY: horizontal ? Math.max(0, centre(active) - 30) : box.y,
          tooltip: { title: categories[active], rows: tooltipRows(active), note: stacked ? `Total ${fmt(totals[active])}` : undefined },
        };

  const legend: LegendItem[] =
    layout === "diverging"
      ? [
          { label: "Above zero", key: "area", colour: UP_COLOUR },
          { label: "Below zero", key: "area", colour: DOWN_COLOUR },
        ]
      : series.map((s) => ({ label: s.name, key: "area", colour: s.colour }));
  const zero = horizontal ? Math.round(v(0)) + 0.5 : Math.round(v(0)) + 0.5;

  return (
    <ChartFigure
      title={title}
      titleAs={titleAs}
      eyebrow={eyebrow}
      description={description}
      caption={caption}
      keys={keys}
      legend={<Legend items={legend} />}
      table={
        <ChartTable
          caption={tableCaption ?? label}
          columns={[{ label: "Category" }, ...series.map((s) => ({ label: s.name, numeric: true })), ...(stacked ? [{ label: "Total", numeric: true }] : [])]}
          rows={categories.map((c, i) => ({ header: c, cells: [...series.map((s) => (finite(s.values[i]) ? fmt(s.values[i] as number) : "–")), ...(stacked ? [fmt(totals[i])] : [])] }))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-bar-plot" data-reading={active == null ? undefined : ""}>
          {horizontal ? (
            <g className="mk-chart-grid">
              {ticks.map((t) => (
                <g key={t} data-reference={t === 0 ? "" : undefined}>
                  <line x1={Math.round(v(t)) + 0.5} x2={Math.round(v(t)) + 0.5} y1={box.y} y2={box.y + box.height} />
                  <text x={v(t)} y={size.height - 6} textAnchor="middle">
                    {tickText(t)}
                  </text>
                </g>
              ))}
            </g>
          ) : (
            <GridY ticks={ticks} y={v} left={box.x} right={box.x + box.width} format={tickText} reference={0} />
          )}
          <PlotLayer box={box} reveal={reveal}>
            {marks}
          </PlotLayer>
          {horizontal ? <line className="mk-bar-zero" x1={zero} x2={zero} y1={box.y} y2={box.y + box.height} /> : null}
          <g opacity={labelOpacity(reveal)}>
            {show === "none" ? null : valueLabels}
            {categories.map((c, i) =>
              horizontal ? (
                <text key={c} className="mk-bar-category" x={0} y={centre(i) + 4}>
                  {wrapLabel(c, labelColumn - 12, advance, 1)[0]}
                </text>
              ) : (
                <text key={c} className="mk-bar-category" textAnchor="middle">
                  {wrapped[i].map((line, k) => (
                    <tspan key={k} x={centre(i)} y={box.y + box.height + 18 + k * lineHeight}>
                      {line}
                    </tspan>
                  ))}
                </text>
              ),
            )}
          </g>
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
