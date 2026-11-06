import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { LineChart } from "./LineChart";
import type { LineChartProps } from "./LineChart";
import { predictorYear, seeded, tradingDays } from "./predictor.sample";

const year = predictorYear();
const fall = ((year.port[year.today]! / year.port[year.peak]! - 1) * 100).toFixed(1).replace("-", "");
const hero: LineChartProps = {
  eyebrow: "[06] Predictor",
  title: `The portfolio sits ${fall}% below its September peak, and the range ahead is wide.`,
  description: "Both lines start at 100 on 6 November 2025. The forecast shows where half and four in five simulated outcomes land. It's a range, not a target.",
  caption: "Sample data, shaped like Predictor's.",
  label: "Portfolio and S&P 500, indexed to 100, with a 12-week forecast",
  x: year.days,
  series: [
    { id: "port", name: "Portfolio", values: year.port },
    { id: "bench", name: "S&P 500", values: year.bench, context: true },
  ],
  forecast: year.forecast,
  today: year.today,
  reference: { value: 100, label: "100 START" },
  ranges: [{ id: "dd", from: year.peak, to: year.today, label: "Drawdown" }],
  measures: [{ series: "port", from: year.peak, to: year.today, fromLabel: "Peak" }],
  notes: [{ series: "port", at: year.dip, lines: [`${Math.round((year.dip - year.march) / 5)} weeks after the March rate`, "decision, the portfolio had", `given back ${Math.round(year.port[year.march]! - year.port[year.dip]!)} points.`] }],
  events: year.events,
};

const meta = { title: "Organisms/LineChart", component: LineChart } satisfies Meta<typeof LineChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The hero from Data board 1. Switch density in the toolbar for the dashboard version. */
export const Hero: Story = { args: hero };

/** A range filter above the chart glides it between windows. */
export const Ranges: Story = {
  args: hero,
  render: (args) => {
    const [range, setRange] = useState<"3M" | "6M" | "1Y">("1Y");
    const from = { "3M": year.today - 63, "6M": year.today - 126, "1Y": 0 }[range];
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <div role="group" aria-label="Range" style={{ display: "flex", gap: 8 }}>
          {(["3M", "6M", "1Y"] as const).map((r) => (
            <button key={r} type="button" className="mk-button" data-variant="quiet" aria-pressed={r === range} onClick={() => setRange(r)}>
              {r}
            </button>
          ))}
        </div>
        <LineChart {...args} title="Portfolio against the S&P 500" eyebrow={undefined} description={undefined} notes={[]} window={[from, year.days.length - 1]} />
      </div>
    );
  },
};

const rand = seeded(11);
const sectors = ["AI compute", "Power", "Grid", "Chip equipment", "Cloud", "Nuclear", "Memory", "Networking", "Solar", "Uranium", "Data centres"];
const months = tradingDays("2026-01-02", "2026-10-30");

/** Eleven series: eight take colour slots and shape markers, the rest fold into Other in muted ink. */
export const ElevenSeries: Story = {
  args: {
    title: "Theme returns this year",
    label: "Return by theme, indexed to 100",
    x: months,
    reference: { value: 100 },
    series: sectors.map((name, k) => {
      let v = 100;
      const drift = (rand() - 0.4) * 0.004;
      return { id: name, name, values: months.map(() => (v *= 1 + drift + (rand() - 0.5) * 0.02)) };
    }),
  },
};

/** Gaps break the line, and a lone point gets a dot. */
export const Gaps: Story = {
  args: {
    title: "Signal strength, with missing days",
    label: "Signal strength by day",
    x: months.slice(0, 60),
    series: [{ id: "s", name: "Signal", values: months.slice(0, 60).map((_, i) => (i % 17 < 3 || i === 38 || i === 40 ? null : 50 + 20 * Math.sin(i / 6))) }],
  },
};

/** Values below zero get a zero line. */
export const Negative: Story = {
  args: {
    title: "Excess return against the benchmark",
    label: "Excess return in percentage points",
    x: months.slice(0, 120),
    series: [{ id: "x", name: "Excess return", values: months.slice(0, 120).map((_, i) => 6 * Math.sin(i / 14) - 1.5 + (rand() - 0.5)) }],
    format: (v) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(1)} pts`,
  },
};

/** Values over five orders of magnitude, on a log scale. */
export const HugeRange: Story = {
  args: {
    title: "Model parameters by year",
    label: "Largest model parameters by year, log scale",
    x: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
    yScale: "log",
    series: [{ id: "p", name: "Parameters", values: [1.1e8, 1.5e9, 1.75e11, 5.3e11, 5.4e11, 1.8e12, 2e12, 4e12, 1e13] }],
  },
};

export const SinglePoint: Story = {
  args: { title: "First reading", label: "First reading", x: [new Date("2026-11-06T12:00:00Z")], series: [{ id: "a", name: "Reading", values: [42] }] },
};

export const Empty: Story = {
  args: { title: "No readings yet", label: "Readings", x: months.slice(0, 10), series: [{ id: "a", name: "Reading", values: Array(10).fill(null) }] },
};
