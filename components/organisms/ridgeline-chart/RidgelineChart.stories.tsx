import type { Meta, StoryObj } from "@storybook/react-vite";
import { RidgelineChart } from "./RidgelineChart";

const sample = (n: number, spread: number, seed: number) => {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r()) * spread);
};
const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const spreads = [1.0, 1.1, 1.2, 1.9, 2.3, 1.3, 1.0, 1.1, 1.2, 1.4, 2.1, 1.6];
const pct = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(Math.round(v * 10) / 10)}%`;

const meta = { title: "Organisms/RidgelineChart", component: RidgelineChart } satisfies Meta<typeof RidgelineChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: daily returns by month, the rough months in the accent. */
export const Months: Story = {
  args: {
    title: "April and October were the rough months.",
    label: "Daily returns, month by month, in percent",
    domain: [-6, 6],
    format: pct,
    series: months.map((name, k) => ({ id: name, name, values: sample(21, spreads[k], k + 3), highlight: spreads[k] >= 2 })),
  },
};

export const Thousands: Story = { args: { title: "Ten thousand simulated paths", label: "Simulated returns by year", format: pct, series: ["2027", "2028", "2029"].map((name, k) => ({ id: name, name, values: sample(10000, 2 + k, k + 1) })) } };
