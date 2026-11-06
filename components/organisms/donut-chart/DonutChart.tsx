import { arc, pie } from "d3-shape";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ACCENT_COLOUR,
  ChartFigure,
  ChartPlot,
  ChartTable,
  Legend,
  formatValue,
  labelOpacity,
  neutralColour,
  spreadLabels,
  useChartViewport,
  useCrosshair,
} from "../../molecules/chart-frame";
import type { LegendItem } from "../../molecules/chart-frame";
import "./donut-chart.css";

export type DonutPart = { id: string; name: string; value: number; highlight?: boolean };

export type DonutChartProps = {
  title: ReactNode;
  label: string;
  parts: DonutPart[];
  /** The figure in the hole, such as "64%" and "invested". */
  centre?: { value: string; label: string };
  format?: (value: number) => string;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

/** A donut has five parts at most; past that, the smallest fold into Other. */
const MAX_PARTS = 5;

type Slice = DonutPart & { colour: string; share: number; folded?: DonutPart[] };

function slices(parts: DonutPart[]): Slice[] {
  const positive = parts.filter((p) => Number.isFinite(p.value) && p.value > 0);
  const total = positive.reduce((s, p) => s + p.value, 0);
  const sorted = [...positive].sort((a, b) => b.value - a.value);
  let kept = sorted;
  let folded: DonutPart[] = [];
  if (sorted.length > MAX_PARTS) {
    // The highlight always keeps its own slice.
    const keep = sorted.filter((p) => p.highlight).concat(sorted.filter((p) => !p.highlight)).slice(0, MAX_PARTS - 1);
    kept = sorted.filter((p) => keep.includes(p));
    folded = sorted.filter((p) => !keep.includes(p));
  }
  let k = 0;
  const out: Slice[] = kept.map((p) => ({ ...p, share: p.value / total, colour: p.highlight ? ACCENT_COLOUR : neutralColour(++k) }));
  if (folded.length) {
    const value = folded.reduce((s, p) => s + p.value, 0);
    out.push({ id: "__other", name: `Other, ${folded.length} parts`, value, share: value / total, colour: neutralColour(4), folded });
  }
  return out;
}

/**
 * Part to whole at a glance: five parts at most, named outside with leaders, the subject in the
 * accent and the rest in warm greys, largest strongest.
 */
export function DonutChart({ title, label, parts, centre, format, titleAs, eyebrow, description, caption, tableCaption, emptyText = "No data to show yet.", keys }: DonutChartProps) {
  const data = useMemo(() => slices(parts), [parts]);
  const digits = Math.min(2, Math.max(0, ...parts.map((p) => (String(p.value).split(".")[1] ?? "").length)));
  const fmt = format ?? ((v: number) => formatValue(v, digits));
  // A sliver under 1% says so, rather than rounding to a misleading 0% or 1%.
  const pct = (s: number) => (s > 0 && s < 0.01 ? "<1%" : `${Math.round(s * 100)}%`);
  const { plotRef, size, reveal, advance } = useChartViewport({ i0: 0, i1: 1, y0: 0, y1: 1 }, { width: 480, height: 300 });

  const nameRoom = Math.max(...data.map((d) => (d.name.length + 5) * advance * 0.82), 40) + 30;
  const R = Math.max(30, Math.min(size.height / 2 - 8, (size.width - nameRoom * 2) / 2));
  const r = R * 0.64;
  const cx = size.width / 2;
  const cy = size.height / 2;
  const angles = useMemo(
    () =>
      pie<Slice>()
        .value((d) => d.value)
        .sort(null)(data),
    [data],
  );
  const shape = arc<{ startAngle: number; endAngle: number }>().innerRadius(r).outerRadius(R).padAngle(2 / R).cornerRadius(1.5);
  const sweep = reveal * Math.PI * 2;

  const describe = useCallback((k: number) => `${data[k].name}. ${fmt(data[k].value)}, ${pct(data[k].share)} of the whole${data[k].folded ? `: ${data[k].folded!.map((p) => p.name).join(", ")}` : ""}.`, [data]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useCrosshair({
    min: 0,
    max: Math.max(0, data.length - 1),
    start: 0,
    stride: 1,
    indexAt: (x, y) => {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < r - 4 || dist > R + 8) return -1;
      const a = (Math.atan2(dx, -dy) + Math.PI * 2) % (Math.PI * 2);
      return angles.findIndex((s) => a >= s.startAngle && a < s.endAngle);
    },
    describe,
  });

  if (!data.length) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Part" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  // Names sit outside, left or right of the ring, spread apart and joined back by leaders.
  const mid = (s: { startAngle: number; endAngle: number }) => (s.startAngle + s.endAngle) / 2;
  const sides = angles.map((s) => Math.sin(mid(s)) >= 0);
  const placed = new Array<number>(data.length);
  [true, false].forEach((right) => {
    const idx = angles.map((_, k) => k).filter((k) => sides[k] === right);
    const ys = spreadLabels(
      idx.map((k) => cy - Math.cos(mid(angles[k])) * (R + 14)),
      Math.round(advance * 1.9),
      8,
      size.height - 8,
    );
    idx.forEach((k, j) => (placed[k] = ys[j]));
  });
  const active = reading.index;
  const legend: LegendItem[] = data.map((d) => ({ label: d.name, key: "area", colour: d.colour }));
  const crosshair =
    active == null
      ? null
      : {
          x: cx + Math.sin(mid(angles[active])) * R,
          top: 0,
          bottom: size.height,
          line: false,
          anchorY: Math.max(0, cy - Math.cos(mid(angles[active])) * R - 30),
          tooltip: { title: data[active].name, rows: [{ value: fmt(data[active].value), label: `${pct(data[active].share)} of the whole`, colour: data[active].colour, key: "swatch" as const }], note: data[active].folded?.map((p) => `${p.name} ${fmt(p.value)}`).join(", ") },
        };

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
          columns={[{ label: "Part" }, { label: "Value", numeric: true }, { label: "Share", numeric: true }]}
          rows={[...data.flatMap((d) => (d.folded ? d.folded.map((p) => ({ ...p, share: p.value / data.reduce((s, x) => s + x.value, 0) })) : [d])).map((d) => ({ header: d.name, cells: [fmt(d.value), pct(d.share)] }))]}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-donut" data-reading={active == null ? undefined : ""} transform={`translate(${cx} ${cy})`}>
          {angles.map((s, k) => {
            const end = Math.min(s.endAngle, sweep);
            if (end <= s.startAngle) return null;
            const lift = active === k ? 5 : 0;
            const m = mid(s);
            return (
              <path
                key={data[k].id}
                className="mk-donut-slice"
                data-active={active === k ? "" : undefined}
                data-highlight={data[k].highlight ? "" : undefined}
                d={shape({ startAngle: s.startAngle, endAngle: end }) ?? ""}
                transform={lift ? `translate(${Math.sin(m) * lift} ${-Math.cos(m) * lift})` : undefined}
                style={{ fill: data[k].colour }}
              />
            );
          })}
          {centre ? (
            <g className="mk-donut-centre">
              <text className="mk-donut-figure" y={r * 0.12} textAnchor="middle" style={{ fontSize: Math.round(r * 0.48) }}>
                {centre.value}
              </text>
              <text y={r * 0.12 + Math.round(r * 0.32)} textAnchor="middle">
                {centre.label}
              </text>
            </g>
          ) : null}
        </g>
        <g opacity={labelOpacity(reveal)}>
          {angles.map((s, k) => {
            const m = mid(s);
            const right = sides[k];
            const ex = cx + Math.sin(m) * (R + 4);
            const ey = cy - Math.cos(m) * (R + 4);
            const tx = right ? cx + R + 24 : cx - R - 24;
            return (
              <g key={data[k].id} className="mk-donut-label">
                <path className="mk-donut-leader" d={`M${ex} ${ey}L${right ? tx - 6 : tx + 6} ${placed[k]}`} />
                <text className="mk-chart-value" x={tx} y={placed[k] + 4} textAnchor={right ? "start" : "end"}>
                  {right ? (
                    <>
                      <tspan className="mk-chart-strong">{pct(data[k].share)}</tspan> {data[k].name}
                    </>
                  ) : (
                    <>
                      {data[k].name} <tspan className="mk-chart-strong">{pct(data[k].share)}</tspan>
                    </>
                  )}
                </text>
              </g>
            );
          })}
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
