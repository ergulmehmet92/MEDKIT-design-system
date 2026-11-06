import { deviation, quantile } from "d3-array";
import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ACCENT_COLOUR,
  CONTEXT_COLOUR,
  ChartFigure,
  ChartPlot,
  ChartTable,
  Legend,
  labelOpacity,
  neutralColour,
  useChartViewport,
  useCrosshair,
} from "../../molecules/chart-frame";
import type { LegendItem } from "../../molecules/chart-frame";
import "./ridgeline-chart.css";

export type RidgelineSeries = { id: string; name: string; values: number[]; highlight?: boolean };

export type RidgelineChartProps = {
  title: ReactNode;
  label: string;
  series: RidgelineSeries[];
  /** The range shown. Defaults to the 1st to 99th percentile of everything. */
  domain?: [number, number];
  /** How far each ridge rises into the one above, in rows. */
  overlap?: number;
  format?: (value: number) => string;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

/** Gaussian kernel density, with Silverman's bandwidth unless the spread is zero. */
export function density(values: number[], xs: number[], span: number): number[] {
  const n = values.length;
  const sd = n > 1 ? (deviation(values) ?? 0) : 0;
  const bw = sd > 0 ? 1.06 * sd * n ** -0.2 : span / 40 || 1;
  const k = 1 / (n * bw * Math.sqrt(2 * Math.PI));
  return xs.map((x) => values.reduce((s, v) => s + Math.exp(-0.5 * ((x - v) / bw) ** 2), 0) * k);
}

/**
 * How a spread changes across groups: one smoothed shape per row, overlapping the row above. Quiet
 * ridges are warm grey with a grey edge; the subject ridges wear the accent.
 */
export function RidgelineChart({ title, label, series, domain, overlap = 1.8, format = (v) => String(Math.round(v * 100) / 100).replace("-", "−"), titleAs, eyebrow, description, caption, tableCaption, emptyText = "No data to show yet.", keys }: RidgelineChartProps) {
  const live = useMemo(() => series.map((s) => ({ ...s, values: s.values.filter(Number.isFinite).sort((a, b) => a - b) })).filter((s) => s.values.length), [series]);
  const all = useMemo(() => live.flatMap((s) => s.values).sort((a, b) => a - b), [live]);
  const [lo, hi] = useMemo(() => {
    if (domain) return domain;
    if (!all.length) return [0, 1];
    let a = quantile(all, 0.01) ?? all[0];
    let b = quantile(all, 0.99) ?? all[all.length - 1];
    if (a === b) [a, b] = [a - 1, b + 1];
    return scaleLinear().domain([a, b]).nice(5).domain() as [number, number];
  }, [all, domain]);
  const xs = useMemo(() => Array.from({ length: 81 }, (_, k) => lo + ((hi - lo) * k) / 80), [lo, hi]);
  const curves = useMemo(() => live.map((s) => density(s.values, xs, hi - lo)), [live, xs, hi, lo]);
  const peak = Math.max(1e-9, ...curves.flat());
  const { plotRef, size, reveal, advance } = useChartViewport({ i0: 0, i1: 1, y0: lo, y1: hi }, { width: 520, height: 340 });
  const nameColumn = Math.min(size.width * 0.22, Math.max(...live.map((s) => s.name.length * advance), 24) + 14);
  const m = { t: 8, b: 24, l: nameColumn, r: 6 };
  const x = scaleLinear().domain([lo, hi]).range([m.l, size.width - m.r]);
  const step = (size.height - m.t - m.b) / (live.length + overlap - 1 || 1);
  const base = (k: number) => m.t + step * (k + overlap);
  const tall = step * overlap;
  const colourOf = (s: RidgelineSeries) => (s.highlight ? ACCENT_COLOUR : CONTEXT_COLOUR);
  const fillOf = (s: RidgelineSeries) => (s.highlight ? ACCENT_COLOUR : neutralColour(3));
  const sdOf = (s: RidgelineSeries) => (s.values.length > 1 ? (deviation(s.values) ?? 0) : 0);

  const describe = useCallback((k: number) => {
    const s = live[k];
    return `${s.name}. ${s.values.length} values, median ${format(quantile(s.values, 0.5) ?? 0)}, typical spread ${format(sdOf(s))}, from ${format(s.values[0])} to ${format(s.values.at(-1)!)}.`;
  }, [live]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useCrosshair({ min: 0, max: Math.max(0, live.length - 1), start: 0, axis: "y", indexAt: (py) => Math.min(live.length - 1, Math.max(0, Math.floor((py - m.t) / step - overlap + 1))), describe, stride: 3 });

  if (!live.length) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Group" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  const legend: LegendItem[] = [
    { label: "Each group's spread", key: "area", colour: neutralColour(3) },
    ...(live.some((s) => s.highlight) ? [{ label: "The groups in the title", key: "area" as const, colour: ACCENT_COLOUR }] : []),
  ];
  const crosshair =
    active == null || !live[active]
      ? null
      : {
          x: x(quantile(live[active].values, 0.5) ?? lo),
          top: m.t,
          bottom: size.height - m.b,
          line: false,
          anchorY: Math.max(0, base(active) - tall),
          tooltip: {
            title: live[active].name,
            rows: [
              { value: format(quantile(live[active].values, 0.5) ?? 0), label: "Median", colour: colourOf(live[active]) },
              { value: format(sdOf(live[active])), label: "Typical spread" },
              { value: `${format(live[active].values[0])} to ${format(live[active].values.at(-1)!)}`, label: "Range" },
            ],
          },
        };
  const ticks = x.ticks(5);

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
          columns={[{ label: "Group" }, { label: "Count", numeric: true }, { label: "Median", numeric: true }, { label: "Typical spread", numeric: true }, { label: "Lowest", numeric: true }, { label: "Highest", numeric: true }]}
          rows={live.map((s) => ({ header: s.name, cells: [String(s.values.length), format(quantile(s.values, 0.5) ?? 0), format(sdOf(s)), format(s.values[0]), format(s.values.at(-1)!)] }))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-ridgeline" data-reading={active == null ? undefined : ""}>
          {live.map((s, k) => {
            const y = (d: number) => base(k) - (d / peak) * tall * Math.min(1, reveal * 1.4);
            const top = xs.map((v, i) => `${x(v)} ${y(curves[k][i])}`).join("L");
            return (
              <g key={s.id} className="mk-ridge" data-active={active === k ? "" : undefined} data-highlight={s.highlight ? "" : undefined} style={{ color: fillOf(s) }}>
                <path className="mk-ridge-fill" d={`M${x(lo)} ${base(k)}L${top}L${x(hi)} ${base(k)}Z`} />
                <path className="mk-ridge-edge" d={`M${top}`} style={{ stroke: colourOf(s) }} />
              </g>
            );
          })}
          <g opacity={labelOpacity(reveal)}>
            {live.map((s, k) => (
              <text key={s.id} className="mk-ridge-name" x={0} y={base(k)}>
                {s.name}
              </text>
            ))}
            {ticks.map((t) => (
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
