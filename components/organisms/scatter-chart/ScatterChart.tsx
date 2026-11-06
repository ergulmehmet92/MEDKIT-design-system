import { scaleLinear, scaleSqrt } from "d3-scale";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ACCENT_COLOUR,
  CONTEXT_COLOUR,
  ChartFigure,
  ChartPlot,
  ChartTable,
  GridY,
  LEAD_COLOUR,
  Legend,
  formatValue,
  labelOpacity,
  tickFormatter,
  useChartViewport,
  useCrosshair,
} from "../../molecules/chart-frame";
import type { LegendItem } from "../../molecules/chart-frame";
import "./scatter-chart.css";

export type ScatterPoint = { id: string; name: string; x: number; y: number; size?: number; group?: string };
export type ScatterGroup = { id: string; name: string; highlight?: boolean };

export type ScatterChartProps = {
  title: ReactNode;
  label: string;
  points: ScatterPoint[];
  /** Up to three groups get their own colour; any more fold into Other, in grey. */
  groups?: ScatterGroup[];
  xLabel: string;
  yLabel: string;
  /** Names what `size` measures, which turns dots into bubbles. */
  sizeLabel?: string;
  /** Lines at meaningful values, such as the portfolio's own risk. Zero gets one when values cross it. */
  references?: { x?: { value: number; label?: string }; y?: { value: number; label?: string } };
  /** Points to name on the chart. Defaults to the highest, the lowest and the largest. */
  named?: string[];
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  formatSize?: (value: number) => string;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

const MAX_COLOURS = 3;

/**
 * Two measures against each other, one dot per item, sized by a third when given. Three colours at
 * most, because any two dots can sit side by side; the subject group wears the accent. Hovering reads
 * the nearest dot, so nobody has to land on a pixel.
 */
export function ScatterChart({
  title,
  label,
  points: raw,
  groups = [],
  xLabel,
  yLabel,
  sizeLabel,
  references,
  named,
  formatX = (v) => formatValue(v, 1),
  formatY = (v) => formatValue(v, 1),
  formatSize = (v) => formatValue(v, 1),
  titleAs,
  eyebrow,
  description,
  caption,
  tableCaption,
  emptyText = "No data to show yet.",
  keys,
}: ScatterChartProps) {
  const points = useMemo(() => raw.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)).sort((a, b) => a.x - b.x), [raw]);
  // Colour groups: the highlight in the accent, the next in the lead, a third in grey; the rest join it as Other.
  const colourOf = useMemo(() => {
    const ordered = [...groups.filter((g) => g.highlight), ...groups.filter((g) => !g.highlight)];
    const map = new Map<string, string>();
    ordered.forEach((g, k) => map.set(g.id, k >= MAX_COLOURS - 1 ? CONTEXT_COLOUR : g.highlight ? ACCENT_COLOUR : k === 0 || (k === 1 && ordered[0].highlight) ? LEAD_COLOUR : CONTEXT_COLOUR));
    return (p: ScatterPoint) => (p.group ? (map.get(p.group) ?? CONTEXT_COLOUR) : groups.length ? CONTEXT_COLOUR : LEAD_COLOUR);
  }, [groups]);
  const groupName = (id?: string) => groups.find((g) => g.id === id)?.name;

  const target = useMemo(() => {
    const xs = points.map((p) => p.x).concat(references?.x ? [references.x.value] : []);
    const ys = points.map((p) => p.y).concat(references?.y ? [references.y.value] : []);
    const pad = (lo: number, hi: number) => (lo === hi ? [lo - 1, hi + 1] : [lo - (hi - lo) * 0.06, hi + (hi - lo) * 0.06]);
    const [x0, x1] = scaleLinear().domain(pad(Math.min(...xs, Infinity), Math.max(...xs, -Infinity))).nice(5).domain();
    const [y0, y1] = scaleLinear().domain(pad(Math.min(...ys, Infinity), Math.max(...ys, -Infinity))).nice(5).domain();
    return { i0: x0, i1: x1, y0, y1 };
  }, [points, references]);
  const { plotRef, size, density, reveal, advance, view } = useChartViewport(points.length ? target : { i0: 0, i1: 1, y0: 0, y1: 1 }, { width: 560, height: 320 });
  const dense = density === "analytical";
  const m = { t: 34, r: 12, b: 34, l: 0 };
  const x = scaleLinear().domain([view.i0, view.i1]).range([m.l + 8, size.width - m.r]);
  const y = scaleLinear().domain([view.y0, view.y1]).range([size.height - m.b, m.t]);
  const maxSize = Math.max(0, ...points.map((p) => p.size ?? 0));
  const radius = scaleSqrt().domain([0, maxSize || 1]).range([3, dense ? 11 : 15]);
  const r = (p: ScatterPoint) => (sizeLabel && p.size !== undefined ? radius(Math.max(0, p.size)) : dense ? 3.5 : 4.5);
  const yTicks = y.ticks(dense ? 4 : 5);
  const xTicks = x.ticks(5);

  const toName = useMemo(() => {
    if (named) return new Set(named);
    if (points.length < 4) return new Set(points.map((p) => p.id));
    const by = (f: (p: ScatterPoint) => number) => [...points].sort((a, b) => f(b) - f(a))[0].id;
    return new Set([by((p) => p.y), by((p) => -p.y), ...(sizeLabel ? [by((p) => p.size ?? 0)] : [])]);
  }, [points, named, sizeLabel]);

  const describe = useCallback((k: number) => {
    const p = points[k];
    return `${p.name}${p.group ? `, ${groupName(p.group)}` : ""}. ${xLabel} ${formatX(p.x)}, ${yLabel} ${formatY(p.y)}${sizeLabel && p.size !== undefined ? `, ${sizeLabel} ${formatSize(p.size)}` : ""}.`;
  }, [points, groups]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useCrosshair({
    min: 0,
    max: Math.max(0, points.length - 1),
    start: 0,
    stride: 5,
    indexAt: (px, py) => {
      let best = -1;
      let bd = 36;
      points.forEach((p, k) => {
        const d = Math.hypot(x(p.x) - px, y(p.y) - py) - r(p);
        if (d < bd) {
          bd = d;
          best = k;
        }
      });
      return best;
    },
    describe,
  });

  if (!points.length) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Item" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  // One key per colour. Grey names its group, or "Other" when several groups share it.
  const greys = groups.filter((g) => colourOf({ id: "", name: "", x: 0, y: 0, group: g.id }) === CONTEXT_COLOUR);
  const legend: LegendItem[] = groups
    .map((g) => ({ g, colour: colourOf({ id: "", name: "", x: 0, y: 0, group: g.id }) }))
    .filter(({ colour }, k, all) => all.findIndex((o) => o.colour === colour) === k)
    .map(({ g, colour }) => ({ label: colour === CONTEXT_COLOUR && greys.length > 1 ? "Other" : g.name, key: "area" as const, colour }));
  const ref = { x: references?.x ?? (view.i0 < 0 && view.i1 > 0 ? { value: 0 } : undefined), y: references?.y ?? (view.y0 < 0 && view.y1 > 0 ? { value: 0 } : undefined) };
  const crosshair =
    active == null || !points[active]
      ? null
      : {
          x: x(points[active].x),
          top: m.t,
          bottom: size.height - m.b,
          line: false,
          anchorY: Math.max(0, y(points[active].y) - 30),
          tooltip: {
            title: points[active].name,
            rows: [
              { value: formatY(points[active].y), label: yLabel, colour: colourOf(points[active]), key: "swatch" as const },
              { value: formatX(points[active].x), label: xLabel },
              ...(sizeLabel && points[active].size !== undefined ? [{ value: formatSize(points[active].size!), label: sizeLabel }] : []),
            ],
            note: groupName(points[active].group),
          },
        };
  // Biggest first, so small dots sit on top of large ones.
  const drawOrder = points.map((_, k) => k).sort((a, b) => r(points[b]) - r(points[a]));

  return (
    <ChartFigure
      title={title}
      titleAs={titleAs}
      eyebrow={eyebrow}
      description={description}
      caption={caption}
      keys={keys}
      legend={legend.length > 1 ? <Legend items={legend} /> : undefined}
      table={
        <ChartTable
          caption={tableCaption ?? label}
          columns={[{ label: "Item" }, ...(groups.length ? [{ label: "Group" }] : []), { label: xLabel, numeric: true }, { label: yLabel, numeric: true }, ...(sizeLabel ? [{ label: sizeLabel, numeric: true }] : [])]}
          rows={points.map((p) => ({ header: p.name, cells: [...(groups.length ? [groupName(p.group) ?? "–"] : []), formatX(p.x), formatY(p.y), ...(sizeLabel ? [p.size !== undefined ? formatSize(p.size) : "–"] : [])] }))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-scatter" data-reading={active == null ? undefined : ""}>
          <GridY ticks={yTicks} y={y} left={0} right={size.width} format={formatY ?? tickFormatter(yTicks)} reference={ref.y?.value} referenceLabel={ref.y?.label} referenceInside />
          {ref.x ? (
            <g className="mk-scatter-reference">
              <line x1={Math.round(x(ref.x.value)) + 0.5} x2={Math.round(x(ref.x.value)) + 0.5} y1={m.t} y2={size.height - m.b} />
              {ref.x.label ? (
                <text className="mk-chart-halo" x={x(ref.x.value) + 6} y={m.t + 12}>
                  {ref.x.label}
                </text>
              ) : null}
            </g>
          ) : null}
          <g opacity={Math.min(1, reveal * 1.5)}>
            {drawOrder.map((k) => (
              <circle key={points[k].id} className="mk-scatter-dot" data-active={active === k ? "" : undefined} data-bubble={sizeLabel ? "" : undefined} cx={x(points[k].x)} cy={y(points[k].y)} r={r(points[k])} style={{ fill: colourOf(points[k]) }} />
            ))}
          </g>
          <g opacity={labelOpacity(reveal)}>
            {points.map((p) => {
              if (!toName.has(p.id)) return null;
              const right = x(p.x) + r(p) + 6 + p.name.length * advance < size.width;
              return (
                <text key={p.id} className="mk-chart-halo mk-scatter-name" x={right ? x(p.x) + r(p) + 6 : x(p.x) - r(p) - 6} y={y(p.y) + 4} textAnchor={right ? "start" : "end"}>
                  {p.name}
                </text>
              );
            })}
            {xTicks.map((t) => (
              <text key={t} x={x(t)} y={size.height - m.b + 16} textAnchor="middle">
                {formatX(t)}
              </text>
            ))}
            <text className="mk-scatter-axis" x={size.width - m.r} y={size.height - 2} textAnchor="end">
              {xLabel} →
            </text>
            <text className="mk-scatter-axis" x={m.l} y={12}>
              ↑ {yLabel}
            </text>
          </g>
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
