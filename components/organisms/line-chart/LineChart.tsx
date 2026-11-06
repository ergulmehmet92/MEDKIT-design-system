import { scaleLinear, scaleLog } from "d3-scale";
import { area, line } from "d3-shape";
import { useCallback, useId, useMemo } from "react";
import type { ReactNode } from "react";
import {
  AxisX,
  Bracket,
  CONTEXT_COLOUR,
  ChartFigure,
  ChartPlot,
  ChartTable,
  EventRail,
  GridY,
  Legend,
  MarkerLine,
  Note,
  PlotLayer,
  RangeBand,
  SeriesMarker,
  calendarTicks,
  decimalsFor,
  formatDay,
  formatMonth,
  formatValue,
  labelOpacity,
  monthEnds,
  numberTicks,
  signed,
  slotColour,
  slotShape,
  spreadLabels,
  tickFormatter,
  useChartViewport,
  useCrosshair,
} from "../../molecules/chart-frame";
import type { LegendItem, TooltipRow } from "../../molecules/chart-frame";
import "./line-chart.css";

export type LineSeries = {
  id: string;
  name: string;
  /** One value per x. Null is a gap. */
  values: (number | null)[];
  /** Context, such as a benchmark, wears muted ink instead of a colour slot. */
  context?: boolean;
  /** Pins a slot, so a series keeps its colour across every chart in a view. */
  slot?: number;
};

export type LineForecast = {
  /** The series it continues. */
  series: string;
  /** Index of the last actual value. The forecast's first value sits here. */
  start: number;
  median: number[];
  /** The 50% range, low and high, per step. */
  inner?: [number, number][];
  /** The 80% range. */
  outer?: [number, number][];
};

export type ChartRange = { id: string; from: number; to: number; label: string };
export type ChartMeasure = { series: string; from: number; to: number; label?: string; fromLabel?: string };
export type ChartNote = { series: string; at: number; lines: string[] };
export type ChartEventInput = { id: string; at: number; label: string; detail?: string };

export type LineChartProps = {
  title: ReactNode;
  /** Names the plot for assistive technology. */
  label: string;
  /** One position per point: dates, spaced by index so weekends leave no gaps, or plain numbers. */
  x: (Date | number)[];
  series: LineSeries[];
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  forecast?: LineForecast;
  /** Index of today: draws a marker and splits events into past and upcoming. */
  today?: number;
  /** A value with a stronger line, such as 100 on an indexed chart. Zero gets one by default. */
  reference?: { value: number; label?: string };
  ranges?: ChartRange[];
  measures?: ChartMeasure[];
  notes?: ChartNote[];
  events?: ChartEventInput[];
  /** First and last index to show. Changing it glides. */
  window?: [number, number];
  /** Formats values in labels, the tooltip and the table. */
  format?: (value: number) => string;
  /** Log for values spanning several orders of magnitude. Needs every value above zero. */
  yScale?: "linear" | "log";
  tableCaption?: string;
  /** Shown instead of the plot when no series has a value. */
  emptyText?: string;
};

const MAX_SLOTS = 8;
const DIRECT_LABELS = 4;

type Drawn = Omit<LineSeries, "slot"> & { colour: string; slot: number | null; other: boolean };

/** Assigns slots in order, keeps pinned ones, and sends series past the eighth to muted ink. */
function assign(series: LineSeries[]): Drawn[] {
  let next = 1;
  const taken = new Set(series.map((s) => s.slot).filter(Boolean));
  return series.map((s) => {
    if (s.context) return { ...s, colour: CONTEXT_COLOUR, slot: null, other: false };
    let slot = s.slot ?? 0;
    if (!slot) {
      while (taken.has(next)) next++;
      slot = next++;
    }
    const other = slot > MAX_SLOTS;
    return { ...s, slot: other ? null : slot, colour: other ? CONTEXT_COLOUR : slotColour(slot), other };
  });
}

const finite = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v);

/**
 * A line chart over time or any ordered x, built on the chart frame: a story in colour against
 * context in ink, with forecasts, ranges, measured brackets, notes and events, read by pointer or
 * keyboard, with a table behind it.
 */
export function LineChart({
  title,
  label,
  x: xs,
  series,
  titleAs,
  eyebrow,
  description,
  caption,
  forecast,
  today,
  reference,
  ranges = [],
  measures = [],
  notes = [],
  events = [],
  window,
  format,
  yScale = "linear",
  tableCaption,
  emptyText = "No data to show yet.",
}: LineChartProps) {
  const washId = useId().replace(/:/g, "");
  const n = xs.length;
  const dates = n > 0 && xs.every((v) => v instanceof Date) ? (xs as Date[]) : null;
  const drawn = useMemo(() => assign(series), [series]);
  const coloured = drawn.filter((s) => s.slot !== null);
  const others = drawn.filter((s) => s.other);
  const hasData = drawn.some((s) => s.values.some(finite));
  const fcSeries = forecast ? drawn.find((s) => s.id === forecast.series) : undefined;
  const [w0, w1] = window ?? [0, Math.max(0, n - 1)];
  const log = yScale === "log" && drawn.every((s) => s.values.every((v) => !finite(v) || v > 0));

  // The domain covers what's in the window, including the forecast's ranges, then rounds to nice ticks.
  const target = useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    const take = (v: number | null | undefined) => {
      if (finite(v)) {
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
    };
    for (const s of drawn) for (let i = Math.max(0, Math.ceil(w0)); i <= Math.min(n - 1, Math.floor(w1)); i++) take(s.values[i]);
    if (forecast) {
      forecast.median.forEach((v, t) => {
        const i = forecast.start + t;
        if (i < w0 || i > w1) return;
        take(v);
        take(forecast.outer?.[t]?.[0] ?? forecast.inner?.[t]?.[0]);
        take(forecast.outer?.[t]?.[1] ?? forecast.inner?.[t]?.[1]);
      });
    }
    if (reference && hi > -Infinity) take(reference.value);
    if (lo === Infinity) [lo, hi] = [0, 1];
    if (lo === hi) [lo, hi] = [lo - (Math.abs(lo) * 0.1 || 1), hi + (Math.abs(hi) * 0.1 || 1)];
    const scale = log ? scaleLog().domain([lo, hi]).nice() : scaleLinear().domain([lo - (hi - lo) * 0.04, hi + (hi - lo) * 0.04]).nice(5);
    const [y0, y1] = scale.domain();
    const i0 = w1 > w0 ? w0 : w0 - 1;
    const i1 = w1 > w0 ? w1 : w1 + 1;
    return { i0, i1, y0, y1 };
  }, [drawn, forecast, reference, w0, w1, n, log]);

  const { plotRef, size, node, density, reveal, advance, view } = useChartViewport(target);
  const dense = density === "analytical";
  const narrow = size.width < 560;
  const labelled = drawn.filter((s) => !s.other).length <= DIRECT_LABELS;
  const lastIndex = (s: Drawn) => {
    for (let i = Math.min(n - 1, Math.floor(view.i1)); i >= 0; i--) if (finite(s.values[i])) return i;
    return -1;
  };

  // Ticks first, so value labels use one more decimal than the axis.
  const yProbe = (log ? scaleLog() : scaleLinear()).domain([view.y0, view.y1]);
  const ticks = yProbe.ticks(dense ? 4 : 5);
  const tickText = tickFormatter(ticks);
  const digits = Math.min(2, decimalsFor(ticks.length > 1 ? ticks[1] - ticks[0] : 1) + 1);
  const fmt = format ?? ((v: number) => formatValue(v, digits));

  const endWidth = Math.max(0, ...drawn.filter((s) => !s.other).map((s) => (s.name.length + 7) * advance * 0.8));
  const top = events.length ? (dense || narrow ? 40 : 64) : dense ? 16 : 24;
  const right = narrow ? 8 : forecast ? (dense ? 86 : 136) : labelled ? Math.min(240, endWidth + 24) : 8;
  const m = { t: top, r: right, b: dense ? 24 : 34, l: 0 };
  const box = { x: m.l, y: m.t, width: Math.max(0, size.width - m.l - m.r), height: Math.max(0, size.height - m.t - m.b) };
  const bottom = box.y + box.height;
  const x = scaleLinear().domain([view.i0, view.i1]).range([box.x, box.x + box.width]);
  const y = (log ? scaleLog() : scaleLinear()).domain([view.y0, view.y1]).range([bottom, box.y]);
  const ref = reference ?? (view.y0 < 0 && view.y1 > 0 ? { value: 0 } : undefined);
  const path = line<number | null>()
    .defined(finite)
    .x((_, i) => x(i))
    .y((v) => y(v as number));

  // The wash follows each run of values, so a gap leaves a gap beneath it too.
  const wash = area<number | null>()
    .defined(finite)
    .x((_, i) => x(i))
    .y0(bottom)
    .y1((v) => y(v as number));

  const xTicks = (dates ? calendarTicks(dates, view.i0, view.i1) : numberTicks(xs as number[], view.i0, view.i1, 6)).map((t) => ({ x: x(t.index), label: t.label.toUpperCase() }));
  const xText = (i: number) => (dates ? formatDay(dates[i]) : String(xs[i]));
  const when = (at: number) => (today !== undefined && at > today ? "next" : "past");

  const describe = useCallback(
    (i: number) => {
      const parts = drawn.filter((s) => finite(s.values[i])).map((s) => `${s.name} ${fmt(s.values[i] as number)}`);
      if (forecast && i > forecast.start && forecast.median[i - forecast.start] !== undefined) {
        const t = i - forecast.start;
        parts.push(`forecast median ${fmt(forecast.median[t])}`);
        const range = forecast.outer?.[t] ?? forecast.inner?.[t];
        if (range) parts.push(`${forecast.outer ? "80%" : "50%"} range ${fmt(range[0])} to ${fmt(range[1])}`);
      }
      const event = events.find((e) => e.at === i);
      if (event) parts.push(event.label);
      return `${xText(i)}. ${parts.length ? parts.join(", ") : "No value"}.`;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drawn, forecast, events, fmt],
  );
  const reading = useCrosshair({
    min: Math.max(0, Math.ceil(view.i0)),
    max: Math.min(n - 1, Math.floor(view.i1)),
    start: today ?? Math.min(n - 1, Math.floor(view.i1)),
    indexAt: (px) => Math.round(x.invert(px)),
    describe,
  });

  if (!hasData || n === 0) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Point" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  // Crosshair: one dot per series at the index, and every value in one tooltip, values first.
  const i = reading.index;
  const crosshair = (() => {
    if (i == null) return null;
    const rows: TooltipRow[] = [];
    const dots: { y: number; colour: string }[] = [];
    const listed = drawn.filter((s) => finite(s.values[i]));
    listed.slice(0, MAX_SLOTS).forEach((s) => {
      rows.push({ value: fmt(s.values[i] as number), label: s.name, colour: s.colour });
      dots.push({ y: y(s.values[i] as number), colour: s.colour });
    });
    let note = listed.length > MAX_SLOTS ? `${listed.length - MAX_SLOTS} more in the table.` : undefined;
    if (forecast && fcSeries && i > forecast.start && forecast.median[i - forecast.start] !== undefined) {
      const t = i - forecast.start;
      rows.push({ value: fmt(forecast.median[t]), label: "Median", colour: fcSeries.colour, key: "dotted" });
      if (forecast.inner?.[t]) rows.push({ value: forecast.inner[t].map(fmt).join("–"), label: "50% range", colour: `color-mix(in oklab, ${fcSeries.colour} 45%, transparent)`, key: "swatch" });
      if (forecast.outer?.[t]) rows.push({ value: forecast.outer[t].map(fmt).join("–"), label: "80% range", colour: `color-mix(in oklab, ${fcSeries.colour} 22%, transparent)`, key: "swatch" });
      dots.push({ y: y(forecast.median[t]), colour: fcSeries.colour });
    }
    const event = events.find((e) => Math.abs(e.at - i) <= 1);
    if (event) note = [event.label + (when(event.at) === "next" ? ", upcoming" : ""), event.detail].filter(Boolean).join(". ") + ".";
    const suffix = forecast && i > forecast.start ? " · forecast" : today === i ? " · today" : "";
    return { x: x(i), top: box.y, bottom, dots, tooltip: { title: xText(i) + suffix, rows, note } };
  })();

  // Direct labels for up to four series, spread apart and joined back to their last point.
  const ends = labelled
    ? drawn
        .map((s) => ({ s, at: lastIndex(s) }))
        .filter(({ at }) => at >= 0)
        .map(({ s, at }) => ({ s, at, px: x(at), py: y(s.values[at] as number) }))
    : [];
  const spread = spreadLabels(
    ends.map((e) => e.py),
    18,
    box.y + 6,
    bottom - 4,
  );
  const fade = labelOpacity(reveal);
  const story = coloured.length === 1 ? coloured[0] : undefined;
  const fx = (t: number) => x((forecast?.start ?? 0) + t);
  const band = (rangeOf: [number, number][]) =>
    `M${rangeOf.map((r, t) => `${fx(t)} ${y(r[1])}`).join("L")}L${rangeOf
      .map((r, t) => `${fx(t)} ${y(r[0])}`)
      .reverse()
      .join("L")}Z`;
  const ruler = forecast && !narrow ? (forecast.outer ?? forecast.inner) : undefined;
  const T = forecast ? forecast.median.length - 1 : 0;

  const legend: LegendItem[] = [
    ...drawn.filter((s) => !s.other).map((s): LegendItem => (s.slot ? { label: s.name, key: "line", colour: s.colour, marker: coloured.length > DIRECT_LABELS ? slotShape(s.slot) : undefined } : { label: s.name, key: "context" })),
    ...(others.length ? [{ label: `Other, ${others.length} series`, key: "context" as const }] : []),
    ...(forecast && fcSeries ? [{ label: dense ? "Forecast" : `Forecast, ${[forecast.inner && "50%", forecast.outer && "80%"].filter(Boolean).join(" and ")} ranges`, key: "forecast" as const, colour: fcSeries.colour }] : []),
    ...(events.some((e) => when(e.at) === "past") ? [{ label: "Past event", key: "past" as const }] : []),
    ...(events.some((e) => when(e.at) === "next") ? [{ label: "Upcoming", key: "next" as const }] : []),
    ...[...new Set(ranges.map((r) => r.label))].map((r) => ({ label: r, key: "range" as const })),
  ];

  const rowsAt = dates ? monthEnds(dates, 0, today ?? n - 1) : Array.from({ length: Math.min(n, 40) }, (_, k) => Math.round((k * (n - 1)) / Math.max(1, Math.min(n, 40) - 1)));
  const tableRows = [...new Set(rowsAt)]
    .filter((k) => drawn.some((s) => finite(s.values[k])))
    .map((k) => ({ header: dates ? formatMonth(dates[k]) + (k === today ? ", today" : "") : String(xs[k]), cells: drawn.map((s) => (finite(s.values[k]) ? fmt(s.values[k] as number) : "–")) }));
  if (forecast && dates) {
    monthEnds(dates, forecast.start + 1, forecast.start + T).forEach((k) => {
      const t = k - forecast.start;
      const range = forecast.outer?.[t] ?? forecast.inner?.[t];
      tableRows.push({ header: `${formatMonth(dates[k])}, forecast`, cells: drawn.map((s) => (s.id === forecast.series ? fmt(forecast.median[t]) + (range ? ` (${forecast.outer ? "80%" : "50%"}: ${fmt(range[0])}–${fmt(range[1])})` : "") : "–")) });
    });
  }

  return (
    <ChartFigure
      title={title}
      titleAs={titleAs}
      eyebrow={eyebrow}
      description={description}
      caption={caption}
      legend={legend.length > 1 ? <Legend items={legend} /> : undefined}
      table={<ChartTable caption={tableCaption ?? label} columns={[{ label: dates ? "Month" : "Point" }, ...drawn.map((s) => ({ label: s.name, numeric: true }))]} rows={tableRows} />}
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <defs>
          <linearGradient id={washId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: story?.colour, stopOpacity: 0.2 }} />
            <stop offset="1" style={{ stopColor: story?.colour, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <GridY ticks={ticks} y={y} left={box.x} right={box.x + box.width} format={tickText} reference={ref?.value} referenceLabel={ref?.label} referenceInside={narrow} />
        <AxisX ticks={xTicks} y={size.height - m.b + (dense ? 17 : 24)} advance={advance} bounds={[0, size.width]} />
        {ranges.map((r) => (
          <RangeBand key={r.id} x0={x(r.from)} x1={x(r.to)} top={box.y} bottom={bottom} label={r.label} advance={advance} />
        ))}
        <PlotLayer box={box} reveal={reveal}>
          {forecast && fcSeries ? (
            <g className="mk-line-forecast" style={{ color: fcSeries.colour }}>
              {forecast.outer ? <path data-band="outer" d={band(forecast.outer)} /> : null}
              {forecast.inner ? <path data-band="inner" d={band(forecast.inner)} /> : null}
            </g>
          ) : null}
          {story ? <path className="mk-line-wash" d={wash(story.values) ?? ""} fill={`url(#${washId})`} /> : null}
          {[...drawn].reverse().map((s) => (
            <path key={s.id} className="mk-chart-line" data-context={s.slot ? undefined : ""} data-other={s.other ? "" : undefined} d={path(s.values) ?? ""} style={s.slot ? { stroke: s.colour } : undefined} />
          ))}
          {forecast && fcSeries ? <path className="mk-chart-line" data-forecast="" d={`M${forecast.median.map((v, t) => `${fx(t)} ${y(v)}`).join("L")}`} style={{ stroke: fcSeries.colour }} /> : null}
          {drawn.map((s) =>
            s.values.map((v, k) =>
              finite(v) && !finite(s.values[k - 1]) && !finite(s.values[k + 1]) ? <circle key={`${s.id}-${k}`} className="mk-chart-dot" cx={x(k)} cy={y(v)} r={3} style={{ fill: s.colour }} /> : null,
            ),
          )}
        </PlotLayer>
        <g opacity={fade}>
          {events.length ? (
            <EventRail
              events={events.map((e) => ({ id: e.id, x: x(e.at), label: e.label.toUpperCase(), when: when(e.at) }))}
              y={box.y - (dense || narrow ? 16 : 22)}
              bottom={bottom}
              rows={dense || narrow ? 1 : 2}
              advance={advance}
              limit={size.width}
              active={i == null ? undefined : events.find((e) => Math.abs(e.at - i) <= 1)?.id}
            />
          ) : null}
          {narrow
            ? null
            : measures.map((mz) => {
                const s = drawn.find((d) => d.id === mz.series);
                const a = s?.values[mz.from];
                const b = s?.values[mz.to];
                if (!s || !finite(a) || !finite(b)) return null;
                return (
                  <g key={`${mz.series}-${mz.from}-${mz.to}`}>
                    <Bracket x={x(mz.to) - 14} from={y(a)} to={y(b)} fromX={x(mz.from)} label={mz.label ?? `${signed((b / a - 1) * 100)}%`} />
                    <circle className="mk-chart-dot" cx={x(mz.from)} cy={y(a)} r={3} style={{ fill: "var(--mk-color-text-default)" }} />
                    {mz.fromLabel ? (
                      <text className="mk-chart-value mk-chart-halo" x={x(mz.from)} y={y(a) - 12} textAnchor="middle">
                        {mz.fromLabel} {fmt(a)}
                      </text>
                    ) : null}
                  </g>
                );
              })}
          {today !== undefined ? <MarkerLine x={x(today)} top={box.y} bottom={bottom} label={narrow ? undefined : "Today"} limit={size.width} advance={advance} /> : null}
          {ends.map((e, k) => {
            const side = narrow ? "start" : "end";
            const tx = side === "end" ? e.px + 10 : e.px - 10;
            const ty = spread[k];
            return (
              <g key={e.s.id} className="mk-chart-end">
                {Math.abs(ty - e.py) > 3 ? <line className="mk-line-leader" x1={e.px + (side === "end" ? 5 : -5)} y1={e.py} x2={tx + (side === "end" ? -3 : 3)} y2={ty - 4} /> : null}
                <SeriesMarker x={e.px} y={e.py} shape={e.s.slot && coloured.length > DIRECT_LABELS ? slotShape(e.s.slot) : "circle"} colour={e.s.colour} />
                <text className="mk-chart-value mk-chart-halo" x={tx} y={ty} textAnchor={side === "end" ? "start" : "end"}>
                  {e.s.name} <tspan className="mk-chart-strong">{fmt(e.s.values[e.at] as number)}</tspan>
                </text>
              </g>
            );
          })}
          {!labelled
            ? coloured.map((s) => {
                const at = lastIndex(s);
                return at >= 0 && s.slot ? <SeriesMarker key={s.id} x={x(at)} y={y(s.values[at] as number)} shape={slotShape(s.slot)} colour={s.colour} /> : null;
              })
            : null}
          {ruler ? (
            <g className="mk-line-ruler">
              <path className="mk-line-ruler-bracket" d={`M${size.width - m.r + 2} ${y(ruler[T][1])}h4V${y(ruler[T][0])}h-4`} />
              <text x={size.width - m.r + 10} y={y(ruler[T][1]) - 10}>
                {forecast?.outer ? "80% RANGE" : "50% RANGE"}
              </text>
              <text className="mk-chart-value" x={size.width - m.r + 10} y={y(ruler[T][1]) + 4}>
                {fmt(ruler[T][1])}
              </text>
              <text className="mk-chart-value" x={size.width - m.r + 10} y={y(ruler[T][0]) + 4}>
                {fmt(ruler[T][0])}
              </text>
              <text x={size.width - m.r + 10} y={y(forecast!.median[T]) - 4}>
                MEDIAN
              </text>
              <text className="mk-chart-value mk-chart-strong" x={size.width - m.r + 10} y={y(forecast!.median[T]) + (dense ? 13 : 16)}>
                {fmt(forecast!.median[T])}
              </text>
            </g>
          ) : null}
          {dense || narrow
            ? null
            : notes.map((note) => {
                const s = drawn.find((d) => d.id === note.series);
                const v = s?.values[note.at];
                if (!s || !finite(v)) return null;
                const avoid = drawn.flatMap((d) => d.values.flatMap((w, k) => (finite(w) && k % 2 === 0 ? [{ x: x(k), y: y(w) }] : [])));
                return <Note key={`${note.series}-${note.at}`} anchor={{ x: x(note.at), y: y(v) }} lines={note.lines} avoid={avoid} bounds={box} width={Math.max(...note.lines.map((l) => l.length)) * advance * 0.82} lineHeight={dense ? 19 : 22} />;
              })}
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
