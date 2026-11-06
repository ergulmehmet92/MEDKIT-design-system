import type { Meta, StoryObj } from "@storybook/react-vite";
import { Beeswarm } from "./Beeswarm";

const sample = (n: number, mean: number, spread: number, seed: number) => {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r()) * spread + mean);
};
const pct = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(Math.round(v * 10) / 10)}%`;

const meta = { title: "Organisms/Beeswarm", component: Beeswarm } satisfies Meta<typeof Beeswarm>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: every closed call, your overrides in the accent. */
export const Calls: Story = {
  args: {
    title: "Your overrides did worse than the gauge.",
    label: "Every closed call, by its return, in percent",
    format: pct,
    groups: [
      { id: "gauge", name: "Gauge", values: sample(46, 2.1, 4, 19) },
      { id: "override", name: "Overrides", values: sample(22, -0.8, 5, 23), highlight: true },
    ],
  },
};

/** Three thousand values in one row: dots shrink, then overlap faintly. */
export const Thousands: Story = { args: { title: "Every trade this decade", label: "Return of every trade, in percent", format: pct, groups: [{ id: "all", name: "Trades", values: sample(3000, 0.4, 6, 5) }] } };

export const SingleValue: Story = { args: { title: "The first call", label: "The first call", format: pct, groups: [{ id: "a", name: "Gauge", values: [3.2] }] } };
