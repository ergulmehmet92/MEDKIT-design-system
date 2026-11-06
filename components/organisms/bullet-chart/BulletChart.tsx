import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ChartFigure,
  ChartPlot,
  ChartTable,
  DOWN_COLOUR,
  LEAD_COLOUR,
  Legend,
  PlotLayer,
  barPath,
  formatValue,
  labelOpacity,
  tickFormatter,
  useChartViewport,
  useCrosshair,
  wrapLabel,
} from "../../molecules/chart-frame";
import type { LegendItem } from "../../molecules/chart-frame";
import "./bullet-chart.css";

export type BulletItem = {
  id: string;
  name: string;
  value: number | null;
  /** Drawn as a tick across the bar. */
  target?: number;
  /** The allowed range. Outside it, the bar turns red and says so. */
  range?: [number, number];
};

export type BulletChartProps = {
  title: ReactNode;
  label: string;
  items: BulletItem[];
  /** The scale's end. Defaults to the largest value, target or range, rounded up. */
  max?: number;
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

const status = (it: BulletItem): "over" | "under" | null => (!finite(it.value) || !it.range ? null : it.value > it.range[1] ? "over" : it.value < it.range[0] ? "under" : null);

/**
 * A measure against its target and allowed range, one row each: the value as a bar in the lead, the
 * target as a tick, the range as a quiet band. A bar outside its range turns red and says over or under.
 */
export function BulletChart({ title, label, items, max, format, titleAs, eyebrow, description, caption, tableCaption, emptyText = "No data to show yet.", keys }: BulletChartProps) {
  const hasData = items.some((i) => finite(i.value));
  const digits = Math.min(2, Math.max(0, ...items.flatMap((i) => [i.value, i.target]).filter(finite).map((v) => (String(v).split(".")[1] ?? "").length)));
  const fmt = format ?? ((v: number) => formatValue(v, digits));
  const top = useMemo(() => max ?? scaleLinear().domain([0, Math.max(1, ...items.flatMap((i) => [i.value, i.target, i.range?.[1]]).filter(finite))]).nice(4).domain()[1], [items, max]);
  const { plotRef, size, reveal, advance, view } = useChartViewport({ i0: 0, i1: Math.max(0, items.length - 1), y0: 0, y1: top }, { width: 520, height: 300 });

  const nameColumn = Math.min(size.width * 0.3, Math.max(...items.map((i) => i.name.length * advance), 32) + 12);
  const valueColumn = Math.max(...items.map((i) => ((finite(i.value) ? fmt(i.value) : "–").length + (status(i) ? 6 : 0)) * advance), 30) + 16;
  const m = { t: 4, b: 26, l: nameColumn, r: valueColumn };
  const x = scaleLinear().domain([0, view.y1]).range([m.l, size.width - m.r]);
  const ticks = x.ticks(4);
  const tickText = tickFormatter(ticks);
  const step = (size.height - m.t - m.b) / Math.max(1, items.length);
  const centre = (k: number) => m.t + step * (k + 0.5);
  const band = Math.min(30, step * 0.66);
  const barH = Math.max(4, Math.min(10, band * 0.36));

  const describe = useCallback(
    (k: number) => {
      const it = items[k];
      const s = status(it);
      const parts = [finite(it.value) ? `${fmt(it.value)}` : "no value"];
      if (finite(it.target)) parts.push(`target ${fmt(it.target)}`);
      if (it.range) parts.push(`allowed ${fmt(it.range[0])} to ${fmt(it.range[1])}`);
      if (s && finite(it.value) && it.range) parts.push(`${s} by ${fmt(Math.round(Math.abs(s === "over" ? it.value - it.range[1] : it.range[0] - it.value) * 1e6) / 1e6)}`);
      return `${it.name}. ${parts.join(", ")}.`;
    },
    [items], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const reading = useCrosshair({ min: 0, max: Math.max(0, items.length - 1), start: 0, axis: "y", indexAt: (pos) => Math.floor((pos - m.t) / step), describe, stride: 3 });

  if (!hasData) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Item" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  const colourOf = (it: BulletItem) => (status(it) ? DOWN_COLOUR : LEAD_COLOUR);
  const legend: LegendItem[] = [
    { label: "Value", key: "area", colour: LEAD_COLOUR },
    { label: "Outside its range", key: "area", colour: DOWN_COLOUR },
    { label: "Allowed range", key: "range" },
  ];
  const crosshair =
    active == null
      ? null
      : {
          x: finite(items[active].value) ? x(items[active].value as number) : m.l,
          top: m.t,
          bottom: size.height - m.b,
          line: false,
          anchorY: Math.max(0, centre(active) - 30),
          tooltip: {
            title: items[active].name,
            rows: [
              { value: finite(items[active].value) ? fmt(items[active].value as number) : "–", label: "Value", colour: colourOf(items[active]) },
              ...(finite(items[active].target) ? [{ value: fmt(items[active].target as number), label: "Target", colour: "var(--mk-color-text-default)", key: "line" as const }] : []),
              ...(items[active].range ? [{ value: `${fmt(items[active].range![0])}–${fmt(items[active].range![1])}`, label: "Allowed" }] : []),
            ],
            note: status(items[active]) ? `${status(items[active]) === "over" ? "Over" : "Under"} its allowed range.` : undefined,
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
          columns={[{ label: "Item" }, { label: "Value", numeric: true }, { label: "Target", numeric: true }, { label: "Allowed", numeric: true }, { label: "Status" }]}
          rows={items.map((i) => ({ header: i.name, cells: [finite(i.value) ? fmt(i.value) : "–", finite(i.target) ? fmt(i.target) : "–", i.range ? `${fmt(i.range[0])}–${fmt(i.range[1])}` : "–", status(i) ?? "within"] }))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-bullet" data-reading={active == null ? undefined : ""}>
          {items.map((it, k) => {
            const cy = centre(k);
            const s = status(it);
            return (
              <g key={it.id} className="mk-bullet-row" data-active={active === k ? "" : undefined} data-status={s ?? undefined}>
                <rect className="mk-bullet-track" x={x(0)} y={cy - band / 2} width={Math.max(0, x(view.y1) - x(0))} height={band} rx={2} />
                {it.range ? <rect className="mk-bullet-range" x={x(it.range[0])} y={cy - band / 2} width={Math.max(0, x(it.range[1]) - x(it.range[0]))} height={band} /> : null}
                <PlotLayer box={{ x: x(0), y: cy - band, width: x(view.y1) - x(0) + 4, height: band * 2 }} reveal={reveal}>
                  {finite(it.value) ? <path className="mk-bullet-bar" d={barPath(x(0), cy - barH / 2, x(Math.min(it.value, view.y1)), cy + barH / 2, "right")} style={{ fill: colourOf(it) }} /> : null}
                </PlotLayer>
                {finite(it.target) ? <line className="mk-bullet-target" x1={x(it.target)} x2={x(it.target)} y1={cy - band / 2 - 3} y2={cy + band / 2 + 3} /> : null}
                <g opacity={labelOpacity(reveal)}>
                  <text className="mk-bullet-name" x={0} y={cy + 4}>
                    {wrapLabel(it.name, nameColumn - 12, advance, 1)[0]}
                  </text>
                  <text className="mk-chart-value" x={size.width - m.r + 10} y={cy + 4}>
                    <tspan className="mk-chart-strong">{finite(it.value) ? fmt(it.value) : "–"}</tspan>
                    {s ? ` ${s}` : ""}
                  </text>
                </g>
              </g>
            );
          })}
          {ticks.map((t) => (
            <text key={t} x={x(t)} y={size.height - 6} textAnchor="middle">
              {tickText(t)}
            </text>
          ))}
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
