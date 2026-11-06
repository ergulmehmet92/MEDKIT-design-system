import { scaleLinear } from "d3-scale";
import { area, line, stack, stackOffsetDiverging, stackOffsetExpand, stackOffsetWiggle, stackOrderInsideOut, stackOrderNone } from "d3-shape";
import type { SeriesPoint } from "d3-shape";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  AxisX,
  CONTEXT_COLOUR,
  ChartFigure,
  ChartPlot,
  ChartTable,
  GridY,
  Legend,
  PlotLayer,
  calendarTicks,
  formatDay,
  formatMonth,
  formatValue,
  labelOpacity,
  monthEnds,
  numberTicks,
  slotColour,
  spreadLabels,
  tickFormatter,
  useChartViewport,
  useCrosshair,
} from "../../molecules/chart-frame";
import type { LegendItem, TooltipRow } from "../../molecules/chart-frame";
import "./area-chart.css";

export type AreaSeries = {
  id: string;
  name: string;
  /** One value per x. Null counts as zero in a stack. */
  values: (number | null)[];
  /** Pins a slot, so a series keeps its colour across a view. */
  slot?: number;
};

export type AreaLayout = "stacked" | "percent" | "stream";

export type AreaChartProps = {
  title: ReactNode;
  /** Names the plot for assistive technology, and captions the table. */
  label: string;
  x: (Date | number)[];
  /** Bottom layer first. */
  series: AreaSeries[];
  /** Stacked shows totals, percent shows shares of each total, stream shows shape over time without an axis. */
  layout?: AreaLayout;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  window?: [number, number];
  format?: (value: number) => string;
  /** Names the sum in the tooltip and table. */
  totalLabel?: string;
  tableCaption?: string;
  emptyText?: string;
};

const MAX_LAYERS = 8;

type Layer = { id: string; name: string; values: number[]; colour: string };

/** Keeps seven layers in their slots and folds the rest into Other, in muted ink, past eight. */
function layersOf(series: AreaSeries[], n: number): Layer[] {
  const clean = (values: (number | null)[]) => Array.from({ length: n }, (_, i) => (typeof values[i] === "number" && Number.isFinite(values[i]) ? (values[i] as number) : 0));
  let next = 1;
  const taken = new Set(series.map((s) => s.slot).filter(Boolean));
  const slotted = series.map((s) => {
    let slot = s.slot ?? 0;
    if (!slot) {
      while (taken.has(next)) next++;
      slot = next++;
    }
    return { ...s, slot };
  });
  if (slotted.length <= MAX_LAYERS) return slotted.map((s) => ({ id: s.id, name: s.name, values: clean(s.values), colour: slotColour(s.slot) }));
  const kept = slotted.slice(0, MAX_LAYERS - 1);
  const rest = slotted.slice(MAX_LAYERS - 1);
  const other = Array.from({ length: n }, (_, i) => rest.reduce((sum, s) => sum + clean(s.values)[i], 0));
  return [
    ...kept.map((s) => ({ id: s.id, name: s.name, values: clean(s.values), colour: slotColour(s.slot) })),
    { id: "__other", name: `Other, ${rest.length} series`, values: other, colour: CONTEXT_COLOUR },
  ];
}

/**
 * Parts of a whole over time. Layers are tints of their slot with a full-colour edge, so a large
 * area never shouts, and each one is named where it ends.
 */
export function AreaChart({
  title,
  label,
  x: xs,
  series,
  layout = "stacked",
  titleAs,
  eyebrow,
  description,
  caption,
  window,
  format,
  totalLabel = "Total",
  tableCaption,
  emptyText = "No data to show yet.",
}: AreaChartProps) {
  const n = xs.length;
  const dates = n > 0 && xs.every((v) => v instanceof Date) ? (xs as Date[]) : null;
  const layers = useMemo(() => layersOf(series, n), [series, n]);
  const totals = useMemo(() => Array.from({ length: n }, (_, i) => layers.reduce((sum, l) => sum + l.values[i], 0)), [layers, n]);
  const hasData = layers.some((l) => l.values.some((v) => v !== 0));
  const percent = layout === "percent";
  const stream = layout === "stream";

  const stacked = useMemo(() => {
    const rows = Array.from({ length: n }, (_, i) => layers.map((l) => l.values[i]));
    return stack<number[], number>()
      .keys(layers.map((_, k) => k))
      .value((row, k) => row[k])
      .order(stream ? stackOrderInsideOut : stackOrderNone)
      .offset(percent ? stackOffsetExpand : stream ? stackOffsetWiggle : stackOffsetDiverging)(rows);
  }, [layers, n, percent, stream]);

  const [w0, w1] = window ?? [0, Math.max(0, n - 1)];
  const target = useMemo(() => {
    if (percent) return { i0: w0 === w1 ? w0 - 1 : w0, i1: w0 === w1 ? w1 + 1 : w1, y0: 0, y1: 1 };
    let lo = stream ? Infinity : 0;
    let hi = -Infinity;
    for (const layer of stacked) {
      for (let i = Math.max(0, Math.ceil(w0)); i <= Math.min(n - 1, Math.floor(w1)); i++) {
        lo = Math.min(lo, layer[i][0], layer[i][1]);
        hi = Math.max(hi, layer[i][0], layer[i][1]);
      }
    }
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo === hi) [lo, hi] = [0, 1];
    const [y0, y1] = stream ? [lo, hi] : scaleLinear().domain([lo, hi]).nice(4).domain();
    return { i0: w0 === w1 ? w0 - 1 : w0, i1: w0 === w1 ? w1 + 1 : w1, y0, y1 };
  }, [stacked, percent, stream, w0, w1, n]);

  const { plotRef, size, node, density, reveal, advance, view } = useChartViewport(target);
  const dense = density === "analytical";
  const narrow = size.width < 560;
  const ticks = stream ? [] : scaleLinear().domain([view.y0, view.y1]).ticks(4);
  const tickText = percent ? (v: number) => `${Math.round(v * 100)}%` : (format ?? tickFormatter(ticks));
  const fmt = format ?? ((v: number) => formatValue(v, 0));
  const share = (k: number, i: number) => (totals[i] ? layers[k].values[i] / totals[i] : 0);
  const valueText = (k: number, i: number) => (percent ? `${Math.round(share(k, i) * 100)}%` : fmt(layers[k].values[i]));
  const lastI = Math.min(n - 1, Math.floor(view.i1));

  const labelWidth = Math.max(0, ...layers.map((l, k) => (l.name.length + valueText(k, Math.max(0, lastI)).length + 2) * advance * 0.8));
  const m = { t: dense ? 12 : 16, r: narrow ? 8 : Math.min(260, labelWidth + 30), b: dense ? 24 : 34, l: stream ? 0 : dense ? 34 : 44 };
  const box = { x: m.l, y: m.t, width: Math.max(0, size.width - m.l - m.r), height: Math.max(0, size.height - m.t - m.b) };
  const bottom = box.y + box.height;
  const x = scaleLinear().domain([view.i0, view.i1]).range([box.x, box.x + box.width]);
  const y = scaleLinear().domain([view.y0, view.y1]).range([bottom, box.y]);

  const describe = useCallback(
    (i: number) => {
      const xText = dates ? formatDay(dates[i]) : String(xs[i]);
      const parts = layers.map((l, k) => `${l.name} ${valueText(k, i)}`).reverse();
      return `${xText}. ${parts.join(", ")}${percent ? "" : `. ${totalLabel} ${fmt(totals[i])}`}.`;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layers, totals, percent, fmt],
  );
  const reading = useCrosshair({ min: Math.max(0, Math.ceil(view.i0)), max: Math.max(0, lastI), start: Math.max(0, lastI), indexAt: (px) => Math.round(x.invert(px)), describe });

  if (!hasData || n === 0) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Point" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const single = n === 1;
  const fill = (colour: string) => `color-mix(in oklab, ${colour} calc(var(--mk-dataviz-tint) * 100%), var(--mk-color-surface-default))`;
  const shape = area<SeriesPoint<number[]>>()
    .x((_, i) => x(i))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]));
  // The full-colour edge runs along a layer's outer side: its top above zero, its bottom below.
  const edge = (k: number) =>
    line<SeriesPoint<number[]>>()
      .x((_, i) => x(i))
      .y((d, i) => y(layers[k].values[i] < 0 ? d[0] : d[1]));

  const i = reading.index;
  const crosshair =
    i == null
      ? null
      : {
          x: x(i),
          top: box.y,
          bottom,
          dots: stacked.map((layer) => ({ y: y(layers[layer.key].values[i] < 0 ? layer[i][0] : layer[i][1]), colour: layers[layer.key].colour })),
          tooltip: {
            title: dates ? formatDay(dates[i]) : String(xs[i]),
            rows: [...layers.keys()].reverse().map((k): TooltipRow => ({ value: valueText(k, i), label: layers[k].name, colour: layers[k].colour, key: "swatch" })),
            note: percent ? undefined : `${totalLabel} ${fmt(totals[i])}`,
          },
        };

  // Names where each layer ends, spread apart with leaders back to the layer's middle.
  const ends = narrow || lastI < 0 ? [] : stacked.map((layer) => ({ k: layer.key, mid: y((layer[lastI][0] + layer[lastI][1]) / 2) }));
  const spread = spreadLabels(
    ends.map((e) => e.mid),
    dense ? 15 : 18,
    box.y + 6,
    bottom - 4,
  );
  const right = box.x + box.width;

  const legend: LegendItem[] = layers.map((l) => ({ label: l.name, key: "area", colour: fill(l.colour) }));
  const rowsAt = dates ? monthEnds(dates, 0, n - 1) : Array.from({ length: Math.min(n, 40) }, (_, k) => Math.round((k * (n - 1)) / Math.max(1, Math.min(n, 40) - 1)));
  const tableRows = [...new Set(rowsAt)].map((k) => ({
    header: dates ? formatMonth(dates[k]) : String(xs[k]),
    cells: [...layers.map((_, j) => valueText(j, k)), ...(percent ? [] : [fmt(totals[k])])],
  }));
  const xTicks = (dates ? calendarTicks(dates, view.i0, view.i1) : numberTicks(xs as number[], view.i0, view.i1, 6)).map((t) => ({ x: x(t.index), label: t.label }));

  return (
    <ChartFigure
      title={title}
      titleAs={titleAs}
      eyebrow={eyebrow}
      description={description}
      caption={caption}
      legend={<Legend items={legend} />}
      table={
        <ChartTable
          caption={tableCaption ?? label}
          columns={[{ label: dates ? "Month" : "Point" }, ...layers.map((l) => ({ label: l.name, numeric: true })), ...(percent ? [] : [{ label: totalLabel, numeric: true }])]}
          rows={tableRows}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        {stream ? null : <GridY ticks={ticks} y={y} left={box.x} right={right} format={tickText} reference={0} />}
        {stream || !ticks.length ? null : (
          <g className="mk-area-ticks">
            {ticks.map((t) => (
              <text key={t} x={box.x - 8} y={y(t) + 4} textAnchor="end">
                {tickText(t)}
              </text>
            ))}
          </g>
        )}
        <AxisX ticks={xTicks} y={size.height - m.b + (dense ? 17 : 24)} advance={advance} bounds={[0, size.width]} />
        <PlotLayer box={box} reveal={reveal}>
          {stacked.map((layer) =>
            single ? (
              <rect key={layers[layer.key].id} className="mk-area-layer" x={x(0) - 12} width={24} y={y(Math.max(layer[0][0], layer[0][1]))} height={Math.abs(y(layer[0][0]) - y(layer[0][1]))} style={{ fill: fill(layers[layer.key].colour), stroke: layers[layer.key].colour }} />
            ) : (
              <g key={layers[layer.key].id} className="mk-area-layer">
                <path d={shape(layer) ?? ""} style={{ fill: fill(layers[layer.key].colour) }} />
                <path className="mk-area-edge" d={edge(layer.key)(layer) ?? ""} style={{ stroke: layers[layer.key].colour }} />
              </g>
            ),
          )}
        </PlotLayer>
        <g opacity={labelOpacity(reveal)} className="mk-area-labels">
          {ends.map((e, k) => (
            <g key={layers[e.k].id}>
              <path className="mk-area-leader" d={`M${right + 2} ${e.mid}L${right + 12} ${spread[k]}h4`} style={{ stroke: layers[e.k].colour }} />
              <text className="mk-chart-value" x={right + 20} y={spread[k] + 4}>
                <tspan className="mk-chart-strong">{valueText(e.k, lastI)}</tspan> {layers[e.k].name}
              </text>
            </g>
          ))}
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
