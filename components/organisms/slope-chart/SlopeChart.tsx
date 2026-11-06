import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ACCENT_COLOUR,
  CONTEXT_COLOUR,
  ChartFigure,
  ChartPlot,
  ChartTable,
  LEAD_COLOUR,
  Legend,
  PlotLayer,
  formatValue,
  labelOpacity,
  nearestIndex,
  signed,
  spreadLabels,
  useChartViewport,
  useCrosshair,
} from "../../molecules/chart-frame";
import type { LegendItem } from "../../molecules/chart-frame";
import "./slope-chart.css";

export type SlopeItem = {
  id: string;
  name: string;
  from: number | null;
  to: number | null;
  /** The line the title is about, in the accent. The rest fall back to grey. */
  highlight?: boolean;
};

export type SlopeChartProps = {
  title: ReactNode;
  label: string;
  items: SlopeItem[];
  /** Names the two moments, such as "Jan 2026" and "Now". */
  fromLabel: string;
  toLabel: string;
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

/**
 * Change between two moments, one line per item, named at both ends. With a highlight, that line
 * wears the accent and the rest fall back to grey; without one, every line wears the lead.
 */
export function SlopeChart({ title, label, items, fromLabel, toLabel, format, titleAs, eyebrow, description, caption, tableCaption, emptyText = "No data to show yet.", keys }: SlopeChartProps) {
  const sorted = useMemo(() => [...items].sort((a, b) => (finite(b.to) ? b.to : -Infinity) - (finite(a.to) ? a.to : -Infinity)), [items]);
  const values = sorted.flatMap((i) => [i.from, i.to]).filter(finite);
  const hasData = values.length > 0;
  const anyHighlight = sorted.some((i) => i.highlight);
  const digits = Math.min(2, Math.max(0, ...values.map((v) => (String(v).split(".")[1] ?? "").length)));
  const fmt = format ?? ((v: number) => formatValue(v, digits));

  const target = useMemo(() => {
    let lo = Math.min(...values, Infinity);
    let hi = Math.max(...values, -Infinity);
    if (!Number.isFinite(lo)) [lo, hi] = [0, 1];
    if (lo === hi) [lo, hi] = [lo - 1, hi + 1];
    const [y0, y1] = scaleLinear().domain([lo, hi]).nice(4).domain();
    return { i0: 0, i1: 1, y0, y1 };
  }, [values.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const { plotRef, size, reveal, advance, view } = useChartViewport(target, { width: 520, height: 300 });
  const nameWidth = (side: "from" | "to") => Math.max(...sorted.map((i) => (i.name.length + fmt((side === "from" ? i.from : i.to) ?? 0).length + 1) * advance * 0.82), 40);
  const m = { t: 30, b: 10, l: Math.min(size.width * 0.32, nameWidth("from") + 16), r: Math.min(size.width * 0.32, nameWidth("to") + 16) };
  const x0 = m.l;
  const x1 = size.width - m.r;
  const y = scaleLinear().domain([view.y0, view.y1]).range([size.height - m.b, m.t]);
  const lineGap = Math.round(advance * 1.85);
  const leftY = spreadLabels(sorted.map((i) => (finite(i.from) ? y(i.from) : y(view.y0))), lineGap, m.t, size.height - m.b);
  const rightY = spreadLabels(sorted.map((i) => (finite(i.to) ? y(i.to) : y(view.y0))), lineGap, m.t, size.height - m.b);
  const colourOf = (i: SlopeItem) => (anyHighlight ? (i.highlight ? ACCENT_COLOUR : CONTEXT_COLOUR) : LEAD_COLOUR);

  const describe = useCallback(
    (k: number) => {
      const it = sorted[k];
      const change = finite(it.from) && finite(it.to) ? `, a change of ${signed(it.to - it.from, digits)}` : "";
      return `${it.name}. ${fromLabel} ${finite(it.from) ? fmt(it.from) : "no value"}, ${toLabel} ${finite(it.to) ? fmt(it.to) : "no value"}${change}.`;
    },
    [sorted, fromLabel, toLabel, digits], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const reading = useCrosshair({ min: 0, max: Math.max(0, sorted.length - 1), start: 0, axis: "y", indexAt: (pos) => nearestIndex(rightY, pos), describe, stride: 3 });

  if (!hasData) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Item" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  // Highlighted lines draw last, so they sit on top.
  const drawOrder = sorted.map((_, k) => k).sort((a, b) => Number(Boolean(sorted[a].highlight)) - Number(Boolean(sorted[b].highlight)));
  const legend: LegendItem[] = anyHighlight
    ? [...sorted.filter((i) => i.highlight).map((i) => ({ label: i.name, key: "line" as const, colour: ACCENT_COLOUR })), { label: "The rest", key: "context" as const }]
    : [{ label: label, key: "line", colour: LEAD_COLOUR }];
  const crosshair =
    active == null
      ? null
      : {
          x: x1,
          top: m.t,
          bottom: size.height - m.b,
          line: false,
          anchorY: Math.max(0, rightY[active] - 30),
          tooltip: {
            title: sorted[active].name,
            rows: [
              { value: finite(sorted[active].from) ? fmt(sorted[active].from as number) : "–", label: fromLabel, colour: colourOf(sorted[active]) },
              { value: finite(sorted[active].to) ? fmt(sorted[active].to as number) : "–", label: toLabel, colour: colourOf(sorted[active]) },
            ],
            note: finite(sorted[active].from) && finite(sorted[active].to) ? `${signed((sorted[active].to as number) - (sorted[active].from as number), digits)} change` : undefined,
          },
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
          columns={[{ label: "Item" }, { label: fromLabel, numeric: true }, { label: toLabel, numeric: true }, { label: "Change", numeric: true }]}
          rows={sorted.map((i) => ({ header: i.name, cells: [finite(i.from) ? fmt(i.from) : "–", finite(i.to) ? fmt(i.to) : "–", finite(i.from) && finite(i.to) ? signed(i.to - i.from, digits) : "–"] }))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-slope" data-reading={active == null ? undefined : ""}>
          <line className="mk-slope-axis" x1={Math.round(x0) + 0.5} x2={Math.round(x0) + 0.5} y1={m.t - 8} y2={size.height - m.b} />
          <line className="mk-slope-axis" x1={Math.round(x1) + 0.5} x2={Math.round(x1) + 0.5} y1={m.t - 8} y2={size.height - m.b} />
          <text x={x0} y={14} textAnchor="middle">
            {fromLabel}
          </text>
          <text x={x1} y={14} textAnchor="middle">
            {toLabel}
          </text>
          <PlotLayer box={{ x: 0, y: 0, width: size.width, height: size.height }} reveal={reveal}>
            {drawOrder.map((k) => {
              const it = sorted[k];
              const c = colourOf(it);
              return (
                <g key={it.id} className="mk-slope-item" data-highlight={it.highlight ? "" : undefined} data-active={active === k ? "" : undefined} style={{ color: c }}>
                  {finite(it.from) && finite(it.to) ? <line x1={x0} y1={y(it.from)} x2={x1} y2={y(it.to)} /> : null}
                  {finite(it.from) ? <circle className="mk-chart-dot" cx={x0} cy={y(it.from)} r={4} style={{ fill: c }} /> : null}
                  {finite(it.to) ? <circle className="mk-chart-dot" cx={x1} cy={y(it.to)} r={4} style={{ fill: c }} /> : null}
                </g>
              );
            })}
          </PlotLayer>
          <g opacity={labelOpacity(reveal)}>
            {sorted.map((it, k) => (
              <g key={it.id}>
                <text className="mk-chart-value mk-slope-name" x={x0 - 10} y={leftY[k] + 4} textAnchor="end">
                  {it.name} <tspan className="mk-chart-strong">{finite(it.from) ? fmt(it.from) : "–"}</tspan>
                </text>
                <text className="mk-chart-value mk-slope-name" x={x1 + 10} y={rightY[k] + 4}>
                  <tspan className="mk-chart-strong">{finite(it.to) ? fmt(it.to) : "–"}</tspan> {it.name}
                </text>
              </g>
            ))}
          </g>
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
