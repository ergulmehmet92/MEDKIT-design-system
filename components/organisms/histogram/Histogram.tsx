import { bin, deviation, mean, quantile } from "d3-array";
import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ACCENT_COLOUR,
  ChartFigure,
  ChartPlot,
  ChartTable,
  DOWN_COLOUR,
  GridY,
  Legend,
  PlotLayer,
  UP_COLOUR,
  barPath,
  labelOpacity,
  neutralColour,
  tickFormatter,
  useChartViewport,
  useCrosshair,
} from "../../molecules/chart-frame";
import type { LegendItem } from "../../molecules/chart-frame";
import "./histogram.css";

export type HistogramProps = {
  title: ReactNode;
  label: string;
  values: number[];
  /** Bin width. Defaults to about 20 bins over the shown range. */
  binWidth?: number;
  /** The range shown. Defaults to the 1st to 99th percentile; values past it join the edge bins. */
  domain?: [number, number];
  /** Bins wholly past these values wear down (below) or up (above), with a count. */
  tail?: { below?: number; above?: number };
  /** Marks the mean with a line in the accent. */
  showMean?: boolean;
  /** Washes the band one standard deviation either side of the mean. */
  showSpread?: boolean;
  /** Formats values on the axis and in the readout, such as percentages. */
  format?: (value: number) => string;
  /** What one count is, singular and plural, such as ["day", "days"]. */
  unit?: [string, string];
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

/**
 * How values spread: one series in a warm grey, its spread as a wash, its mean in the accent, and
 * a bad or good tail in red or green. Outliers join the edge bins, which say so.
 */
export function Histogram({
  title,
  label,
  values: raw,
  binWidth,
  domain,
  tail,
  showMean = true,
  showSpread = true,
  format = (v) => String(Math.round(v * 100) / 100).replace("-", "−"),
  unit = ["value", "values"],
  titleAs,
  eyebrow,
  description,
  caption,
  tableCaption,
  emptyText = "No data to show yet.",
  keys,
}: HistogramProps) {
  const values = useMemo(() => raw.filter(Number.isFinite).sort((a, b) => a - b), [raw]);
  const count = (n: number) => `${n} ${n === 1 ? unit[0] : unit[1]}`;

  const bins = useMemo(() => {
    if (!values.length) return [];
    let [lo, hi] = domain ?? [quantile(values, 0.01) ?? values[0], quantile(values, 0.99) ?? values[values.length - 1]];
    if (lo === hi) [lo, hi] = [lo - 0.5, hi + 0.5];
    const width = binWidth ?? scaleLinear().domain([lo, hi]).nice(20).ticks(20).reduce((s, t, i, a) => (i ? Math.min(s, t - a[i - 1]) : s), Infinity);
    const start = Math.floor(lo / width) * width;
    const end = Math.ceil(hi / width) * width;
    const thresholds = Array.from({ length: Math.round((end - start) / width) + 1 }, (_, k) => start + k * width);
    // Outliers fold into the edge bins, which say "or less" and "or more".
    const clamp = (v: number) => Math.min(end - width / 2, Math.max(start + width / 2, v));
    const made = bin<number, number>()
      .domain([start, end])
      .thresholds(thresholds)
      .value(clamp)(values);
    return made.map((b, k) => ({ a: b.x0 ?? start, b: b.x1 ?? end, n: b.length, low: k === 0 && values[0] < start, high: k === made.length - 1 && values[values.length - 1] > end }));
  }, [values, domain, binWidth]);

  const avg = values.length ? (mean(values) ?? 0) : 0;
  const sd = values.length > 1 ? (deviation(values) ?? 0) : 0;
  const top = Math.max(1, ...bins.map((b) => b.n));
  const target = useMemo(() => ({ i0: 0, i1: Math.max(0, bins.length - 1), y0: 0, y1: scaleLinear().domain([0, top]).nice(4).domain()[1] }), [bins.length, top]);
  const { plotRef, size, reveal, view } = useChartViewport(target, { width: 520, height: 300 });

  const m = { t: 24, b: 24, l: 0, r: 0 };
  const x = scaleLinear().domain([bins[0]?.a ?? 0, bins.at(-1)?.b ?? 1]).range([m.l, size.width - m.r]);
  const y = scaleLinear().domain([0, view.y1]).range([size.height - m.b, m.t]);
  const ticks = y.ticks(4);
  const xTicks = x.ticks(5);
  const colourOf = (b: (typeof bins)[number]) => (tail?.below !== undefined && b.b <= tail.below ? DOWN_COLOUR : tail?.above !== undefined && b.a >= tail.above ? UP_COLOUR : neutralColour(2));
  const binName = (b: (typeof bins)[number]) => (b.low ? `${format(b.b)} or less` : b.high ? `${format(b.a)} or more` : `${format(b.a)} to ${format(b.b)}`);

  const describe = useCallback((k: number) => `${binName(bins[k])}. ${count(bins[k].n)}.`, [bins]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useCrosshair({ min: 0, max: Math.max(0, bins.length - 1), start: bins.findIndex((b) => avg >= b.a && avg < b.b), indexAt: (px) => bins.findIndex((b) => px >= x(b.a) && px < x(b.b)), describe, stride: 3 });

  if (!values.length) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Range" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  const below = tail?.below !== undefined ? values.filter((v) => v < tail.below!).length : 0;
  const above = tail?.above !== undefined ? values.filter((v) => v > tail.above!).length : 0;
  const legend: LegendItem[] = [
    { label: unit[1][0].toUpperCase() + unit[1].slice(1), key: "area", colour: neutralColour(2) },
    ...(tail?.below !== undefined ? [{ label: `Below ${format(tail.below)}`, key: "area" as const, colour: DOWN_COLOUR }] : []),
    ...(tail?.above !== undefined ? [{ label: `Above ${format(tail.above)}`, key: "area" as const, colour: UP_COLOUR }] : []),
    ...(showSpread && sd ? [{ label: "One standard deviation", key: "range" as const }] : []),
    ...(showMean ? [{ label: "Mean", key: "line" as const, colour: ACCENT_COLOUR }] : []),
  ];
  const crosshair =
    active == null || !bins[active]
      ? null
      : { x: x((bins[active].a + bins[active].b) / 2), top: m.t, bottom: size.height - m.b, line: false, tooltip: { title: binName(bins[active]), rows: [{ value: String(bins[active].n), label: bins[active].n === 1 ? unit[0] : unit[1], colour: colourOf(bins[active]) }] } };

  return (
    <ChartFigure
      title={title}
      titleAs={titleAs}
      eyebrow={eyebrow}
      description={description}
      caption={caption}
      keys={keys}
      legend={<Legend items={legend} />}
      table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Range" }, { label: "Count", numeric: true }]} rows={bins.map((b) => ({ header: binName(b), cells: [String(b.n)] }))} />}
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-histogram" data-reading={active == null ? undefined : ""}>
          {showSpread && sd ? <rect className="mk-histogram-spread" x={x(avg - sd)} y={m.t} width={Math.max(0, x(avg + sd) - x(avg - sd))} height={size.height - m.t - m.b} /> : null}
          <GridY ticks={ticks} y={y} left={0} right={size.width} format={tickFormatter(ticks)} reference={0} />
          <PlotLayer box={{ x: 0, y: m.t, width: size.width, height: size.height - m.t - m.b }} reveal={reveal}>
            {bins.map((b, k) => (
              <path key={k} className="mk-histogram-bin" data-active={active === k ? "" : undefined} d={barPath(x(b.a) + 1, y(0), x(b.b) - 1, y(b.n), "top")} style={{ fill: colourOf(b) }} />
            ))}
          </PlotLayer>
          <g opacity={labelOpacity(reveal)}>
            {showMean ? (
              <g className="mk-histogram-mean">
                <line x1={Math.round(x(avg)) + 0.5} x2={Math.round(x(avg)) + 0.5} y1={m.t - 6} y2={size.height - m.b} />
                <text className="mk-chart-value mk-chart-halo" x={x(avg) + 6} y={m.t + 4}>
                  Mean {format(avg)}
                </text>
              </g>
            ) : null}
            {below ? (
              <text className="mk-chart-value mk-chart-halo" x={x(tail!.below!) + 6} y={y(top * 0.5)}>
                {count(below)} below {format(tail!.below!)}
              </text>
            ) : null}
            {above ? (
              <text className="mk-chart-value mk-chart-halo" x={x(tail!.above!) - 6} y={y(top * 0.5)} textAnchor="end">
                {count(above)} above {format(tail!.above!)}
              </text>
            ) : null}
            {xTicks.map((t) => (
              <text key={t} x={x(t)} y={size.height - 6} textAnchor="middle">
                {format(t)}
              </text>
            ))}
          </g>
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
