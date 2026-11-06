import type { Meta, StoryObj } from "@storybook/react-vite";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { useCallback, useMemo } from "react";
import { ChartFigure } from "./ChartFigure";
import { ChartPlot } from "./ChartPlot";
import { ChartTable } from "./ChartTable";
import { useCrosshair, useElementSize, useLabelAdvance, useReveal } from "./hooks";
import { signed } from "./layout";
import { Legend } from "./Legend";
import { AxisX, Bracket, EndLabel, EventRail, GridY, MarkerLine, Note, PlotLayer, RangeBand, labelOpacity } from "./parts";

// Sample data in the shape of Predictor's: a portfolio and a benchmark indexed to 100 over a year
// of trading days, then a forecast. Seeded, so every render is the same.
function sample() {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const story = [
    [0, 100, 100], [27, 104, 102], [56, 112, 104.5], [74, 118, 105.5], [92, 116, 104], [117, 107.5, 100.5],
    [151, 119, 105], [187, 127, 109], [219, 134, 112], [235, 126, 109.5], [256, 123, 108.1],
  ];
  const at = (i: number, k: 1 | 2) => {
    const s = story.findIndex((p, n) => n < story.length - 1 && i >= p[0] && i <= story[n + 1][0]);
    const [a, z] = [story[s], story[s + 1]];
    return a[k] + ((z[k] - a[k]) * (i - a[0])) / (z[0] - a[0]);
  };
  const days = Array.from({ length: 257 }, (_, i) => new Date(Date.UTC(2025, 10, 6) + Math.floor(i * 1.4) * 864e5));
  let noise = 0;
  let calm = 0;
  const port: number[] = [];
  const bench: number[] = [];
  days.forEach((_, i) => {
    const shock = rand() - 0.5;
    noise = 0.85 * noise + (0.7 * shock + 0.7 * (rand() - 0.5)) * 0.02;
    calm = 0.85 * calm + shock * 0.012;
    port.push(i === 0 ? 100 : at(i, 1) * (1 + noise));
    bench.push(i === 0 ? 100 : at(i, 2) * (1 + calm));
  });
  const ahead = 57;
  const last = port[port.length - 1];
  const forecast = Array.from({ length: ahead + 1 }, (_, t) => {
    const median = last * (1 + 0.0004 * t);
    const sd = last * 0.0128 * Math.sqrt(t);
    return { median, inner: [median - 0.674 * sd, median + 0.674 * sd], outer: [median - 1.2816 * sd, median + 1.2816 * sd] };
  });
  const future = Array.from({ length: ahead }, (_, t) => new Date(days[days.length - 1].getTime() + Math.floor((t + 1) * 1.4) * 864e5));
  return { days: [...days, ...future], port, bench, forecast, today: days.length - 1 };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dateText = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

function FrameAnatomy({ dense = false }: { dense?: boolean }) {
  const data = useMemo(sample, []);
  const [plotRef, size, node] = useElementSize<HTMLDivElement>({ width: 960, height: dense ? 280 : 520 });
  const reveal = useReveal(node);
  const advance = useLabelAdvance(node);
  const { days, port, bench, forecast, today } = data;
  const last = days.length - 1;
  // Narrow plots give up the right margin: labels move inside, and the note and some event names drop out.
  const narrow = size.width < 560;
  const m = { t: dense || narrow ? 40 : 64, r: narrow ? 8 : dense ? 86 : 136, b: dense ? 24 : 34, l: 0 };
  const box = { x: m.l, y: m.t, width: Math.max(0, size.width - m.l - m.r), height: Math.max(0, size.height - m.t - m.b) };
  const x = scaleLinear().domain([0, last]).range([box.x, box.x + box.width]);
  const lows = [...port, ...bench, ...forecast.map((f) => f.outer[0])];
  const highs = [...port, ...bench, ...forecast.map((f) => f.outer[1])];
  const y = scaleLinear().domain([Math.min(...lows), Math.max(...highs)]).nice(5).range([box.y + box.height, box.y]);
  const path = line<number>().x((_, i) => x(i)).y((v) => y(v));
  const forecastAt = (t: number) => x(today + t);
  const fan = (k: "inner" | "outer") =>
    `M${forecast.map((f, t) => `${forecastAt(t)} ${y(f[k][1])}`).join("L")}L${forecast
      .map((f, t) => `${forecastAt(t)} ${y(f[k][0])}`)
      .reverse()
      .join("L")}Z`;
  const peak = port.indexOf(Math.max(...port));
  const fall = (port[today] / port[peak] - 1) * 100;
  const months = days.flatMap((d, i) => (i > 0 && d.getUTCMonth() !== days[i - 1].getUTCMonth() ? [{ x: x(i), label: MONTHS[d.getUTCMonth()] }] : []));
  const events = [
    { id: "a", i: 58, label: "Rate decision" }, { id: "b", i: 93, label: "Rate decision" }, { id: "c", i: 140, label: "NVDA earnings" },
    { id: "d", i: 220, label: "Rate decision" }, { id: "e", i: 265, label: "NVDA earnings" }, { id: "f", i: 280, label: "Rate decision" },
    { id: "g", i: 281, label: "Inflation print" },
  ];
  const dip = port.slice(93, 130).reduce((best, v, k) => (v < port[best] ? 93 + k : best), 93);

  const describe = useCallback(
    (i: number) =>
      i <= today
        ? `${dateText(days[i])}. Portfolio ${port[i].toFixed(1)}, S&P 500 ${bench[i].toFixed(1)}.`
        : `${dateText(days[i])}, forecast. Median ${forecast[i - today].median.toFixed(1)}, 80% range ${forecast[i - today].outer[0].toFixed(1)} to ${forecast[i - today].outer[1].toFixed(1)}.`,
    [days, port, bench, forecast, today],
  );
  const reading = useCrosshair({ min: 0, max: last, start: today, indexAt: (px) => Math.round(x.invert(px)), describe });
  const i = reading.index;
  const event = i == null ? undefined : events.find((e) => Math.abs(e.i - i) <= 1);
  const crosshair =
    i == null
      ? null
      : {
          x: x(i),
          top: box.y,
          bottom: box.y + box.height,
          dots:
            i <= today
              ? [{ y: y(bench[i]), colour: "var(--mk-color-text-muted)" }, { y: y(port[i]), colour: "var(--mk-color-dataviz-lead)" }]
              : [{ y: y(forecast[i - today].median), colour: "var(--mk-color-dataviz-accent)" }],
          tooltip: {
            title: dateText(days[i]) + (i > today ? " · forecast" : ""),
            rows:
              i <= today
                ? [
                    { value: port[i].toFixed(1), label: "Portfolio", colour: "var(--mk-color-dataviz-lead)" },
                    { value: bench[i].toFixed(1), label: "S&P 500", colour: "var(--mk-color-text-muted)" },
                  ]
                : [
                    { value: forecast[i - today].median.toFixed(1), label: "Median", colour: "var(--mk-color-dataviz-accent)", key: "dotted" as const },
                    { value: forecast[i - today].outer.map((v) => v.toFixed(1)).join("–"), label: "80% range", colour: "var(--mk-color-dataviz-accent)", key: "swatch" as const },
                  ],
            note: event?.label,
          },
        };
  const fade = labelOpacity(reveal);

  return (
    <ChartFigure
      eyebrow={dense ? undefined : "[06] Predictor"}
      title={dense ? "Portfolio against the S&P 500" : `The portfolio sits ${Math.abs(fall).toFixed(1)}% below its peak, and the range ahead is wide.`}
      description={dense ? undefined : "Both lines start at 100. The forecast shows where half and four in five simulated outcomes land."}
      legend={
        <Legend
          items={[
            { label: "Portfolio", key: "line", colour: "var(--mk-color-dataviz-lead)" },
            { label: "S&P 500", key: "context" },
            { label: dense ? "Forecast" : "Forecast, 50% and 80% ranges", key: "forecast", colour: "var(--mk-color-dataviz-accent)" },
            { label: "Past catalyst", key: "past" },
            { label: "Upcoming", key: "next" },
          ]}
        />
      }
      table={
        <ChartTable
          caption="Portfolio and S&P 500, indexed to 100, at each month's end"
          columns={[{ label: "Month" }, { label: "Portfolio", numeric: true }, { label: "S&P 500", numeric: true }]}
          rows={months.map((mo) => {
            const k = Math.max(0, Math.round(x.invert(mo.x)) - 1);
            return k <= today ? { header: dateText(days[k]), cells: [port[k].toFixed(1), bench[k].toFixed(1)] } : { header: `${dateText(days[k])}, forecast`, cells: [forecast[k - today].median.toFixed(1), "–"] };
          })}
        />
      }
      caption={<span>Sample data, shaped like Predictor's.</span>}
    >
      <ChartPlot label="Portfolio and S&P 500, indexed to 100, with a forecast" plotRef={plotRef} reading={{ handlers: reading.handlers, announcement: reading.announcement }} crosshair={crosshair}>
        <GridY ticks={y.ticks(dense ? 4 : 5)} y={y} left={box.x} right={box.x + box.width} reference={100} referenceLabel="100 start" referenceInside={narrow} />
        <AxisX ticks={months} y={size.height - m.b + (dense ? 17 : 24)} advance={advance} />
        <RangeBand x0={x(peak)} x1={x(today)} top={box.y} bottom={box.y + box.height} label="Drawdown" advance={advance} />
        <PlotLayer box={box} reveal={reveal}>
          <path d={fan("outer")} style={{ fill: "color-mix(in oklab, var(--mk-color-dataviz-accent) var(--mk-chart-band-outer), transparent)" }} />
          <path d={fan("inner")} style={{ fill: "color-mix(in oklab, var(--mk-color-dataviz-accent) var(--mk-chart-band-inner), transparent)" }} />
          <path className="mk-chart-line" data-context="" d={path(bench) ?? ""} />
          <path className="mk-chart-line" d={path(port) ?? ""} style={{ stroke: "var(--mk-color-dataviz-lead)" }} />
          <path className="mk-chart-line" data-forecast="" d={`M${forecast.map((f, t) => `${forecastAt(t)} ${y(f.median)}`).join("L")}`} style={{ stroke: "var(--mk-color-dataviz-accent)" }} />
        </PlotLayer>
        <g opacity={fade}>
          <EventRail
            events={events.map((e) => ({ id: e.id, x: x(e.i), label: e.label, when: e.i <= today ? "past" : "next" }))}
            y={box.y - (dense || narrow ? 16 : 22)}
            bottom={box.y + box.height}
            rows={dense || narrow ? 1 : 2}
            advance={advance}
            limit={size.width}
            active={event?.id}
          />
          {narrow ? null : <Bracket x={x(today) - 14} from={y(port[peak])} to={y(port[today])} fromX={x(peak)} label={`${signed(fall)}%`} direction="down" />}
          <MarkerLine x={x(today)} top={box.y} bottom={box.y + box.height} label={narrow ? undefined : "Today"} />
          <EndLabel x={x(today)} y={y(port[today])} name="Portfolio" value={port[today].toFixed(1)} colour="var(--mk-color-dataviz-lead)" dy={narrow ? -14 : -12} side={narrow ? "start" : "end"} />
          <EndLabel x={x(today)} y={y(bench[today])} name="S&P 500" value={bench[today].toFixed(1)} colour="var(--mk-color-text-muted)" dy={18} side={narrow ? "start" : "end"} />
          {dense ? null : (
            <Note
              anchor={{ x: x(dip), y: y(port[dip]) }}
              lines={["After the March rate decision,", `the portfolio gave back ${Math.round(port[93] - port[dip])} points.`]}
              avoid={[...port, ...bench].map((v, k) => ({ x: x(k % port.length), y: y(v) }))}
              bounds={box}
              width={260}
              lineHeight={22}
            />
          )}
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}

const meta = {
  title: "Molecules/ChartFrame",
  component: FrameAnatomy,
  parameters: { docs: { description: { component: "The frame every chart is built on. This story composes its parts by hand; the chart components do the same." } } },
} satisfies Meta<typeof FrameAnatomy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Anatomy: Story = { render: (_, { globals }) => <FrameAnatomy dense={globals.density === "analytical"} /> };

export const Narrow: Story = {
  render: (_, { globals }) => (
    <div style={{ maxInlineSize: 340 }}>
      <FrameAnatomy dense={globals.density === "analytical"} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <ChartFigure title="Portfolio against the S&P 500" table={<ChartTable caption="No data yet" columns={[{ label: "Date" }]} rows={[]} />}>
      <ChartPlot label="Portfolio against the S&P 500" empty="No data for this range yet." />
    </ChartFigure>
  ),
};

export const LegendKeys: Story = {
  render: () => (
    <Legend
      items={[
        ...Array.from({ length: 8 }, (_, k) => ({ label: `Slot ${k + 1}`, key: "line" as const, colour: `var(--mk-color-dataviz-category-${k + 1})` })),
        { label: "Context", key: "context" },
        { label: "Forecast", key: "forecast", colour: "var(--mk-color-dataviz-accent)" },
        { label: "Area", key: "area", colour: "var(--mk-color-dataviz-category-2)" },
        { label: "Range", key: "range" },
        { label: "Past", key: "past" },
        { label: "Upcoming", key: "next" },
      ]}
    />
  ),
};
