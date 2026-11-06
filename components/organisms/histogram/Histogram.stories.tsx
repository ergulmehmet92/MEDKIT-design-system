import type { Meta, StoryObj } from "@storybook/react-vite";
import { Histogram } from "./Histogram";

const sample = (n: number, seed = 7) => {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const g = () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
  return Array.from({ length: n }, () => (r() < 0.04 ? g() * 3.4 : g() * 1.25) + 0.08);
};
const pct = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(Math.round(v * 100) / 100)}%`;

const meta = { title: "Organisms/Histogram", component: Histogram } satisfies Meta<typeof Histogram>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: daily returns, with days worse than −4% in red. */
export const DailyReturns: Story = {
  args: {
    title: "Most days move less than one and a half percent.",
    label: "Daily returns over the last year, in percent",
    values: sample(252),
    domain: [-5, 5],
    binWidth: 0.5,
    tail: { below: -4 },
    unit: ["day", "days"],
    format: pct,
  },
};

/** Twenty thousand values, with the default range and bins. */
export const Thousands: Story = { args: { title: "Simulated monthly returns", label: "Simulated monthly returns, in percent", values: sample(20000, 3), format: pct, unit: ["path", "paths"] } };

/** Two wild outliers fold into the edge bins, which say so. */
export const Outliers: Story = { args: { title: "Two days broke the scale", label: "Daily returns with outliers, in percent", values: [...sample(250), 18, -22], format: pct, unit: ["day", "days"] } };

export const SingleValue: Story = { args: { title: "One reading", label: "One reading", values: [2.4] } };
