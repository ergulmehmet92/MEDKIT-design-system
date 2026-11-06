import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
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
  signed,
  tickFormatter,
  useChartViewport,
  useCrosshair,
  wrapLabel,
} from "../../molecules/chart-frame";
import type { LegendItem } from "../../molecules/chart-frame";
import "./waterfall-chart.css";

export type WaterfallStep = { id: string; name: string; value: number };

export type WaterfallChartProps = {
  title: ReactNode;
  label: string;
  steps: WaterfallStep[];
  /** Where the walk begins, drawn from zero in the lead. Without it, the walk starts at zero. */
  start?: { name: string; value: number };
  /** Names the final bar. */
  totalLabel?: string;
  format?: (value: number) => string;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

/**
 * How a total builds up: each step floats from where the last ended, green up and red down, joined
 * by hairline connectors, and the total stands from zero in the lead.
 */
export function WaterfallChart({ title, label, steps, start, totalLabel = "Net", format, titleAs, eyebrow, description, caption, tableCaption, emptyText = "No data to show yet.", keys }: WaterfallChartProps) {
  const digits = Math.min(2, Math.max(0, ...steps.map((s) => (String(s.value).split(".")[1] ?? "").length), start ? (String(start.value).split(".")[1] ?? "").length : 0));
  const fmt = format ?? ((v: number) => formatValue(v, digits));
  const sign = (v: number) => (v > 0 ? "+" : "") + fmt(v);

  // Bars in order: the optional start, each step floating, then the total from zero.
  const bars = useMemo(() => {
    let acc = start?.value ?? 0;
    const out: { name: string; from: number; to: number; kind: "start" | "step" | "total"; value: number }[] = [];
    if (start) out.push({ name: start.name, from: 0, to: start.value, kind: "start", value: start.value });
    steps.forEach((s) => {
      out.push({ name: s.name, from: acc, to: acc + s.value, kind: "step", value: s.value });
      acc += s.value;
    });
    out.push({ name: totalLabel, from: 0, to: acc, kind: "total", value: acc });
    return out;
  }, [steps, start, totalLabel]);
  const n = bars.length;
  const hasData = steps.length > 0;

  const target = useMemo(() => {
    const all = bars.flatMap((b) => [b.from, b.to, 0]);
    const [y0, y1] = scaleLinear().domain([Math.min(...all), Math.max(...all)]).nice(4).domain();
    return { i0: 0, i1: Math.max(0, n - 1), y0, y1: y1 === y0 ? y0 + 1 : y1 };
  }, [bars, n]);
  const { plotRef, size, density, reveal, advance, view } = useChartViewport(target, { width: 520, height: 300 });
  const dense = density === "analytical";
  const band = (size.width - 8) / Math.max(1, n);
  const wrapped = bars.map((b) => wrapLabel(b.name, band - 6, advance));
  const lineHeight = Math.round(advance * 1.9);
  const m = { t: 22, b: Math.max(...wrapped.map((w) => w.length)) * lineHeight + 12, l: 4, r: 4 };
  const y = scaleLinear().domain([view.y0, view.y1]).range([size.height - m.b, m.t]);
  const ticks = y.ticks(dense ? 4 : 5);
  const tickText = tickFormatter(ticks);
  const centre = (k: number) => m.l + band * (k + 0.5);
  const width = Math.min(24, band * 0.62);
  const colourOf = (b: (typeof bars)[number]) => (b.kind === "step" ? (b.value >= 0 ? UP_COLOUR : DOWN_COLOUR) : LEAD_COLOUR);

  const describe = useCallback(
    (k: number) => {
      const b = bars[k];
      return b.kind === "step" ? `${b.name}. ${sign(b.value)}, running total ${fmt(b.to)}.` : `${b.name}. ${fmt(b.value)}.`;
    },
    [bars], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const reading = useCrosshair({ min: 0, max: Math.max(0, n - 1), start: 0, indexAt: (pos) => Math.floor((pos - m.l) / band), describe, stride: 3 });

  if (!hasData) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Step" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  const legend: LegendItem[] = [
    { label: "Added", key: "area", colour: UP_COLOUR },
    { label: "Took away", key: "area", colour: DOWN_COLOUR },
    { label: start ? `${start.name} and ${totalLabel}` : totalLabel, key: "area", colour: LEAD_COLOUR },
  ];
  const crosshair =
    active == null
      ? null
      : {
          x: centre(active),
          top: m.t,
          bottom: size.height - m.b,
          line: false,
          tooltip: {
            title: bars[active].name,
            rows: [{ value: bars[active].kind === "step" ? sign(bars[active].value) : fmt(bars[active].value), label: bars[active].kind === "step" ? "Change" : bars[active].kind === "start" ? "Start" : "Total", colour: colourOf(bars[active]) }],
            note: bars[active].kind === "step" ? `Running total ${fmt(bars[active].to)}` : undefined,
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
          columns={[{ label: "Step" }, { label: "Change", numeric: true }, { label: "Running total", numeric: true }]}
          rows={bars.map((b) => ({ header: b.name, cells: [b.kind === "step" ? signed(b.value, digits) : fmt(b.value), fmt(b.to)] }))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-waterfall" data-reading={active == null ? undefined : ""}>
          <GridY ticks={ticks} y={y} left={0} right={size.width} format={tickText} reference={0} />
          <PlotLayer box={{ x: 0, y: m.t, width: size.width, height: size.height - m.t - m.b }} reveal={reveal}>
            {bars.map((b, k) => (
              <g key={`${b.name}-${k}`} className="mk-waterfall-step" data-active={active === k ? "" : undefined}>
                <path className="mk-waterfall-bar" d={barPath(centre(k) - width / 2, y(b.from), centre(k) + width / 2, y(b.to), b.to >= b.from ? "top" : "bottom")} style={{ fill: colourOf(b) }} />
                {k < n - 1 && b.kind !== "total" ? <line className="mk-waterfall-link" x1={centre(k) + width / 2} x2={centre(k + 1) - width / 2} y1={Math.round(y(b.to)) + 0.5} y2={Math.round(y(b.to)) + 0.5} /> : null}
              </g>
            ))}
          </PlotLayer>
          <g opacity={labelOpacity(reveal)}>
            {bars.map((b, k) => (
              <g key={`l-${k}`}>
                <text className={b.kind === "step" ? "mk-chart-value" : "mk-chart-value mk-chart-strong"} x={centre(k)} y={b.to >= b.from ? y(b.to) - 6 : y(b.to) + 14} textAnchor="middle">
                  {b.kind === "step" ? sign(b.value) : fmt(b.value)}
                </text>
                <text className="mk-waterfall-name" textAnchor="middle">
                  {wrapped[k].map((line, i) => (
                    <tspan key={i} x={centre(k)} y={size.height - m.b + 18 + i * lineHeight}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            ))}
          </g>
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
