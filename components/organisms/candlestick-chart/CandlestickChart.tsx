import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  AxisX,
  ChartFigure,
  ChartPlot,
  ChartTable,
  EventRail,
  GridY,
  Legend,
  MarkerLine,
  PlotLayer,
  calendarTicks,
  decimalsFor,
  formatDay,
  formatMonth,
  formatValue,
  labelOpacity,
  signed,
  tickFormatter,
  useChartViewport,
  useCrosshair,
} from "../../molecules/chart-frame";
import type { LegendItem, TooltipRow } from "../../molecules/chart-frame";
import "./candlestick-chart.css";

export type Candle = {
  x: Date;
  /** Null on a day with no trading, which leaves a gap. */
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume?: number | null;
};

export type CandlestickChartProps = {
  title: ReactNode;
  /** Names the plot for assistive technology, and captions the table. */
  label: string;
  data: Candle[];
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  window?: [number, number];
  /** Shows volume in its own panel below prices. On by default when the data has volume. */
  volume?: boolean;
  today?: number;
  events?: { id: string; at: number; label: string; detail?: string }[];
  reference?: { value: number; label?: string };
  format?: (value: number) => string;
  tableCaption?: string;
  emptyText?: string;
};

const RISE = "var(--mk-color-dataviz-diverging-above-2)";
const FALL = "var(--mk-color-dataviz-diverging-below-2)";

type Day = { open: number; high: number; low: number; close: number; volume: number | null };
const whole = (c: Candle): Day | null =>
  [c.open, c.high, c.low, c.close].every((v) => typeof v === "number" && Number.isFinite(v))
    ? { open: c.open as number, high: c.high as number, low: c.low as number, close: c.close as number, volume: c.volume ?? null }
    : null;

/**
 * Price over time as candles. Rising days are hollow and falling days filled, in the polarity
 * scale's two arms, so direction never rests on colour. As days crowd, candles thin to bars and
 * then to a closing line.
 */
export function CandlestickChart({
  title,
  label,
  data,
  titleAs,
  eyebrow,
  description,
  caption,
  window,
  volume,
  today,
  events = [],
  reference,
  format,
  tableCaption,
  emptyText = "No trading data to show yet.",
}: CandlestickChartProps) {
  const n = data.length;
  const days = useMemo(() => data.map(whole), [data]);
  const dates = useMemo(() => data.map((c) => c.x), [data]);
  const hasData = days.some(Boolean);
  const showVolume = volume ?? days.some((d) => d?.volume != null);
  const [w0, w1] = window ?? [0, Math.max(0, n - 1)];

  const target = useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = Math.max(0, Math.ceil(w0)); i <= Math.min(n - 1, Math.floor(w1)); i++) {
      const d = days[i];
      if (!d) continue;
      lo = Math.min(lo, d.low);
      hi = Math.max(hi, d.high);
    }
    if (lo === Infinity) [lo, hi] = [0, 1];
    if (lo === hi) [lo, hi] = [lo - (Math.abs(lo) * 0.05 || 1), hi + (Math.abs(hi) * 0.05 || 1)];
    const [y0, y1] = scaleLinear().domain([lo - (hi - lo) * 0.04, hi + (hi - lo) * 0.04]).nice(5).domain();
    return { i0: w0 - 0.5, i1: w1 + 0.5, y0, y1 };
  }, [days, w0, w1, n]);

  const { plotRef, size, density, reveal, advance, view } = useChartViewport(target);
  const dense = density === "analytical";
  const narrow = size.width < 560;
  const ticks = scaleLinear().domain([view.y0, view.y1]).ticks(dense ? 4 : 5);
  const tickText = tickFormatter(ticks);
  const digits = Math.min(2, decimalsFor(ticks.length > 1 ? ticks[1] - ticks[0] : 1) + 1);
  const fmt = format ?? ((v: number) => formatValue(v, digits));

  const m = { t: events.length ? (dense || narrow ? 40 : 64) : dense ? 16 : 24, r: 8, b: dense ? 24 : 34, l: 0 };
  const full = { x: m.l, y: m.t, width: Math.max(0, size.width - m.l - m.r), height: Math.max(0, size.height - m.t - m.b) };
  // Volume gets its own small panel under prices: one measure per axis, never two on one.
  const volumeHeight = showVolume ? Math.round(full.height * 0.2) : 0;
  const box = { ...full, height: full.height - (showVolume ? volumeHeight + 12 : 0) };
  const bottom = box.y + box.height;
  const x = scaleLinear().domain([view.i0, view.i1]).range([box.x, box.x + box.width]);
  const y = scaleLinear().domain([view.y0, view.y1]).range([bottom, box.y]);
  const band = box.width / Math.max(1, view.i1 - view.i0);
  const mode = band >= 5 ? "candles" : band >= 2.5 ? "bars" : "line";
  const bodyWidth = Math.max(2, Math.min(14, band * 0.62));

  const previousClose = (i: number) => {
    for (let k = i - 1; k >= 0; k--) if (days[k]) return days[k]!.close;
    return null;
  };
  const changeOf = (i: number) => {
    const before = previousClose(i);
    const d = days[i];
    return before && d ? (d.close / before - 1) * 100 : null;
  };

  const describe = useCallback(
    (i: number) => {
      const d = days[i];
      if (!d) return `${formatDay(dates[i])}. No trading.`;
      const change = changeOf(i);
      const move = change == null ? "" : `, ${change >= 0 ? "up" : "down"} ${Math.abs(change).toFixed(1)}% on the day`;
      const vol = d.volume != null ? `, volume ${formatValue(d.volume, 0)}` : "";
      return `${formatDay(dates[i])}. Open ${fmt(d.open)}, high ${fmt(d.high)}, low ${fmt(d.low)}, close ${fmt(d.close)}${move}${vol}.`;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [days, dates, fmt],
  );
  const lastI = Math.min(n - 1, Math.floor(view.i1));
  const reading = useCrosshair({ min: Math.max(0, Math.ceil(view.i0)), max: Math.max(0, lastI), start: today ?? Math.max(0, lastI), indexAt: (px) => Math.round(x.invert(px)), describe });

  if (!hasData) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Day" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const maxVolume = Math.max(1, ...days.map((d, i) => (d?.volume != null && i >= view.i0 && i <= view.i1 ? d.volume : 0)));
  const vTop = bottom + 12;
  const vy = (v: number) => vTop + volumeHeight - (v / maxVolume) * volumeHeight;

  const i = reading.index;
  const crosshair = (() => {
    if (i == null) return null;
    const d = days[i];
    const rows: TooltipRow[] = d
      ? [
          { value: fmt(d.open), label: "Open" },
          { value: fmt(d.high), label: "High" },
          { value: fmt(d.low), label: "Low" },
          { value: fmt(d.close), label: "Close", colour: d.close >= d.open ? RISE : FALL, key: "swatch" },
          ...(d.volume != null ? [{ value: formatValue(d.volume, 0), label: "Volume" }] : []),
        ]
      : [];
    const change = changeOf(i);
    const event = events.find((e) => Math.abs(e.at - i) <= 1);
    const note = [change == null ? null : `${change >= 0 ? "▲" : "▼"} ${signed(change)}% on the day`, event ? [event.label, event.detail].filter(Boolean).join(". ") : null].filter(Boolean).join(" · ");
    return { x: x(i), top: box.y, bottom: showVolume ? vTop + volumeHeight : bottom, dots: [], tooltip: { title: formatDay(dates[i]), rows: d ? rows : [{ value: "–", label: "No trading" }], note: note || undefined } };
  })();

  const closeLine = line<Day | null>()
    .defined((d) => d != null)
    .x((_, k) => x(k))
    .y((d) => y(d!.close));

  // Tables over long spans roll days up into months: first open, highest high, lowest low, last close.
  const tableRows = (() => {
    const from = Math.max(0, Math.ceil(w0));
    const to = Math.min(n - 1, Math.floor(w1));
    const pick = (k: number) => days[k];
    if (to - from <= 90) {
      return Array.from({ length: to - from + 1 }, (_, k) => from + k)
        .filter((k) => pick(k))
        .map((k) => ({ header: formatDay(dates[k]), cells: [fmt(pick(k)!.open), fmt(pick(k)!.high), fmt(pick(k)!.low), fmt(pick(k)!.close)] }));
    }
    const months = new Map<string, Day>();
    const order: string[] = [];
    for (let k = from; k <= to; k++) {
      const d = pick(k);
      if (!d) continue;
      const key = formatMonth(dates[k]);
      const seen = months.get(key);
      if (!seen) {
        months.set(key, { ...d });
        order.push(key);
      } else months.set(key, { open: seen.open, high: Math.max(seen.high, d.high), low: Math.min(seen.low, d.low), close: d.close, volume: null });
    }
    return order.map((key) => {
      const d = months.get(key)!;
      return { header: key, cells: [fmt(d.open), fmt(d.high), fmt(d.low), fmt(d.close)] };
    });
  })();

  const legend: LegendItem[] =
    mode === "line"
      ? [{ label: "Close", key: "line", colour: "var(--mk-color-dataviz-category-1)" }]
      : [
          { label: "Close above open", key: "rise", colour: RISE },
          { label: "Close below open", key: "fall", colour: FALL },
          ...(events.some((e) => today === undefined || e.at <= today) ? [{ label: "Past event", key: "past" as const }] : []),
          ...(today !== undefined && events.some((e) => e.at > today) ? [{ label: "Upcoming", key: "next" as const }] : []),
        ];
  const xTicks = calendarTicks(dates, view.i0, view.i1).map((t) => ({ x: x(t.index), label: t.label.toUpperCase() }));
  const visible = days.map((d, k) => (d && k >= view.i0 - 1 && k <= view.i1 + 1 ? k : -1)).filter((k) => k >= 0);

  return (
    <ChartFigure
      title={title}
      titleAs={titleAs}
      eyebrow={eyebrow}
      description={description}
      caption={caption}
      legend={<Legend items={legend} />}
      table={<ChartTable caption={tableCaption ?? label} columns={[{ label: tableRows.length && tableRows[0].header.length > 9 ? "Day" : "Month" }, { label: "Open", numeric: true }, { label: "High", numeric: true }, { label: "Low", numeric: true }, { label: "Close", numeric: true }]} rows={tableRows} />}
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <GridY ticks={ticks} y={y} left={box.x} right={box.x + box.width} format={tickText} reference={reference?.value} referenceLabel={reference?.label} referenceInside />
        <AxisX ticks={xTicks} y={size.height - m.b + (dense ? 17 : 24)} advance={advance} bounds={[0, size.width]} />
        <PlotLayer box={{ ...full }} reveal={reveal}>
          {mode === "line" ? (
            <path className="mk-chart-line" d={closeLine(days) ?? ""} style={{ stroke: "var(--mk-color-dataviz-category-1)" }} />
          ) : (
            visible.map((k) => {
              const d = days[k]!;
              const rise = d.close >= d.open;
              const cx = Math.round(x(k)) + 0.5;
              const colour = rise ? RISE : FALL;
              if (mode === "bars") {
                const tick = Math.max(1, band * 0.4);
                return (
                  <path key={k} className="mk-candle-bar" data-direction={rise ? "rise" : "fall"} d={`M${cx} ${y(d.high)}V${y(d.low)}M${cx - tick} ${y(d.open)}H${cx}M${cx} ${y(d.close)}H${cx + tick}`} style={{ stroke: colour }} />
                );
              }
              const top = y(Math.max(d.open, d.close));
              const height = Math.max(1, Math.abs(y(d.open) - y(d.close)));
              return (
                <g key={k} className="mk-candle" data-direction={rise ? "rise" : "fall"} style={{ color: colour }}>
                  <line x1={cx} x2={cx} y1={y(d.high)} y2={y(d.low)} />
                  <rect x={cx - bodyWidth / 2} y={top} width={bodyWidth} height={height} />
                </g>
              );
            })
          )}
          {showVolume ? (
            <g className="mk-candle-volume">
              {visible.map((k) =>
                days[k]!.volume != null ? <rect key={k} x={x(k) - Math.max(0.5, Math.min(14, band * 0.62)) / 2} y={vy(days[k]!.volume!)} width={Math.max(0.5, Math.min(14, band * 0.62))} height={vTop + volumeHeight - vy(days[k]!.volume!)} /> : null,
              )}
            </g>
          ) : null}
        </PlotLayer>
        {showVolume ? (
          <g className="mk-candle-volume-axis">
            <line x1={box.x} x2={box.x + box.width} y1={vTop + volumeHeight + 0.5} y2={vTop + volumeHeight + 0.5} />
            <text x={box.x} y={vTop + 10}>
              VOLUME · {formatValue(maxVolume, 0)}
            </text>
          </g>
        ) : null}
        <g opacity={labelOpacity(reveal)}>
          {events.length ? (
            <EventRail
              events={events.map((e) => ({ id: e.id, x: x(e.at), label: e.label.toUpperCase(), when: today !== undefined && e.at > today ? "next" : "past" }))}
              y={box.y - (dense || narrow ? 16 : 22)}
              bottom={bottom}
              rows={dense || narrow ? 1 : 2}
              advance={advance}
              limit={size.width}
              active={i == null ? undefined : events.find((e) => Math.abs(e.at - i) <= 1)?.id}
            />
          ) : null}
          {today !== undefined ? <MarkerLine x={x(today)} top={box.y} bottom={bottom} label={narrow ? undefined : "Today"} /> : null}
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
