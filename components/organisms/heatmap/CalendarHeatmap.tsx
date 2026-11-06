import { quantile } from "d3-array";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { ChartFigure, ChartPlot, ChartTable, formatDay, formatMonth, formatValue, labelOpacity, useChartViewport, useCrosshair } from "../../molecules/chart-frame";
import { HeatKey } from "./HeatKey";
import { heatColour } from "./scale";
import type { HeatPalette, HeatScale } from "./scale";
import "./heatmap.css";

export type CalendarDay = { date: Date; value: number | null };

export type CalendarHeatmapProps = {
  title: ReactNode;
  label: string;
  days: CalendarDay[];
  /** Sequential for counts, diverging for gains and losses around `centre`. */
  scale?: HeatScale;
  centre?: number;
  palette?: HeatPalette;
  format?: (value: number) => string;
  /** What one value counts, singular and plural, such as ["commit", "commits"]. */
  unit?: [string, string];
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_MS = 864e5;

/**
 * A year of days as a grid of weeks, Monday at the top. Zero and missing days are hairline grey; the
 * rest take ordered steps of one hue, or a diverging scale centred on a meaningful value.
 */
export function CalendarHeatmap({ title, label, days: raw, scale = "sequential", centre = 0, palette = "direction", format, unit = ["", ""], titleAs, eyebrow, description, caption, tableCaption, emptyText = "No data to show yet.", keys }: CalendarHeatmapProps) {
  const days = useMemo(() => [...raw].sort((a, b) => a.date.getTime() - b.date.getTime()), [raw]);
  const known = days.map((d) => d.value).filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const nonZero = known.filter((v) => v !== 0).sort((a, b) => a - b);
  const lo = scale === "sequential" ? (nonZero[0] ?? 0) : Math.min(...known);
  const hi = scale === "sequential" ? (quantile(nonZero, 0.95) ?? lo) : Math.max(...known);
  const fmt = format ?? ((v: number) => formatValue(v, 0));
  const say = (v: number) => `${fmt(v)}${unit[0] ? ` ${v === 1 ? unit[0] : unit[1]}` : ""}`;
  const { plotRef, size, reveal, advance } = useChartViewport({ i0: 0, i1: 1, y0: 0, y1: 1 }, { width: 760, height: 170 });

  // Weeks start on Monday, from the Monday on or before the first day.
  const start = days.length ? new Date(days[0].date.getTime() - ((days[0].date.getUTCDay() + 6) % 7) * DAY_MS) : new Date(0);
  const place = (d: Date) => {
    const offset = Math.round((d.getTime() - start.getTime()) / DAY_MS);
    return { week: Math.floor(offset / 7), dow: offset % 7 };
  };
  const weeks = days.length ? place(days[days.length - 1].date).week + 1 : 0;
  const dayColumn = advance * 4;
  const head = advance * 2.2;
  const cell = Math.max(6, Math.min((size.width - dayColumn) / Math.max(1, weeks), (size.height - head) / 7));

  const describe = useCallback((k: number) => {
    const d = days[k];
    return `${formatDay(d.date)}. ${typeof d.value === "number" ? say(d.value) : "No data"}.`;
  }, [days]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useCrosshair({
    min: 0,
    max: Math.max(0, days.length - 1),
    start: days.length - 1,
    stride: 7,
    indexAt: (px, py) => {
      const week = Math.floor((px - dayColumn) / cell);
      const dow = Math.floor((py - head) / cell);
      if (week < 0 || dow < 0 || dow > 6) return -1;
      return days.findIndex((d) => {
        const p = place(d.date);
        return p.week === week && p.dow === dow;
      });
    },
    describe,
  });

  if (!known.length) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Day" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  const colourFor = (v: number | null) => (typeof v !== "number" || (scale === "sequential" && v === 0) ? undefined : heatColour(v, scale, lo, hi, centre, palette).colour);
  const months = days.filter((d, k) => k === 0 || d.date.getUTCMonth() !== days[k - 1].date.getUTCMonth());
  const monthTotals = months.map((m) => {
    const inMonth = days.filter((d) => d.date.getUTCFullYear() === m.date.getUTCFullYear() && d.date.getUTCMonth() === m.date.getUTCMonth());
    return { m, total: inMonth.reduce((s, d) => s + (d.value ?? 0), 0), busiest: inMonth.reduce((b, d) => ((d.value ?? -Infinity) > (b.value ?? -Infinity) ? d : b), inMonth[0]) };
  });
  const crosshair =
    active == null || !days[active]
      ? null
      : {
          x: dayColumn + (place(days[active].date).week + 1) * cell,
          top: 0,
          bottom: size.height,
          line: false,
          anchorY: 0,
          tooltip: { title: formatDay(days[active].date), rows: [{ value: typeof days[active].value === "number" ? fmt(days[active].value as number) : "–", label: unit[1] || label, colour: colourFor(days[active].value), key: "swatch" as const }] },
        };

  return (
    <ChartFigure
      title={title}
      titleAs={titleAs}
      eyebrow={eyebrow}
      description={description}
      caption={caption}
      keys={keys}
      legend={<HeatKey scale={scale} palette={palette} lo={fmt(lo)} hi={`${fmt(hi)}+`} centre={scale === "diverging" ? fmt(centre) : undefined} empty={scale === "sequential" ? "None" : undefined} />}
      table={
        <ChartTable
          caption={tableCaption ?? label}
          columns={[{ label: "Month" }, { label: "Total", numeric: true }, { label: "Busiest day" }]}
          rows={monthTotals.map(({ m, total, busiest }) => ({ header: formatMonth(m.date), cells: [fmt(total), typeof busiest.value === "number" ? `${formatDay(busiest.date)}, ${say(busiest.value)}` : "–"] }))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-heatmap" data-reading={active == null ? undefined : ""}>
          <g opacity={Math.min(1, reveal * 1.5)}>
            {days.map((d, k) => {
              const p = place(d.date);
              const colour = colourFor(d.value);
              return <rect key={d.date.getTime()} className="mk-heat-cell" data-active={active === k ? "" : undefined} data-empty={colour ? undefined : ""} x={dayColumn + p.week * cell + 1} y={head + p.dow * cell + 1} width={cell - 2} height={cell - 2} rx={2} style={colour ? { fill: colour } : undefined} />;
            })}
          </g>
          <g opacity={labelOpacity(reveal)}>
            {["Mon", "Wed", "Fri"].map((name, k) => (
              <text key={name} className="mk-heat-name" x={0} y={head + (k * 2 + 0.5) * cell + 4}>
                {name}
              </text>
            ))}
            {months.map((m) => (
              <text key={m.date.getTime()} className="mk-heat-name" x={dayColumn + place(m.date).week * cell} y={head - 8}>
                {MON[m.date.getUTCMonth()]}
              </text>
            ))}
          </g>
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
