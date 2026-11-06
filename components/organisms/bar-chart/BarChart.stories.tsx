import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./BarChart";

const themes = ["AI compute", "Power", "Grid", "Chip equipment", "Cloud", "Nuclear"];
const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

const meta = { title: "Organisms/BarChart", component: BarChart } satisfies Meta<typeof BarChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: this quarter in the lead against last quarter in grey. */
export const Grouped: Story = {
  args: {
    title: "Nuclear led this quarter, and chips turned negative.",
    label: "Return by theme, this quarter against last, in percent",
    categories: themes,
    series: [
      { id: "now", name: "This quarter", values: [8.4, 11.2, 5.1, -4.3, 1.2, 14.6] },
      { id: "before", name: "Last quarter", values: [12.1, 6.3, 3.8, 2.2, 4.0, 9.1], context: true },
    ],
    format: (v) => `${v.toFixed(1)}%`,
  },
};

/** Warm greys for the parts, honey on the one the title is about, the peak and the latest month labelled. */
export const Stacked: Story = {
  args: {
    title: "Trading peaked in October.",
    label: "Trades per month, by kind",
    categories: months,
    series: [
      { id: "buy", name: "Buy", values: [9, 12, 8, 11, 6, 10, 13, 9, 7, 12, 14, 10] },
      { id: "trim", name: "Trim", values: [3, 2, 4, 6, 5, 3, 2, 4, 3, 5, 6, 4] },
      { id: "rebalance", name: "Rebalance", values: [0, 4, 0, 0, 1, 0, 0, 4, 0, 0, 1, 0], highlight: true },
    ],
    format: (v) => String(Math.round(v)),
  },
};

/** One series coloured by its sign, sorted, every value signed. */
export const Diverging: Story = {
  args: {
    title: "Nuclear and power carried November.",
    label: "Contribution to this month's return by position, in percentage points",
    layout: "diverging",
    categories: ["SMR", "VST", "CEG", "GEV", "NVDA", "ETN", "MSFT", "ASML", "MU", "FSLR", "CCJ"],
    series: [{ id: "c", name: "Contribution", values: [1.4, 1.1, 0.8, 0.6, 0.5, 0.2, -0.1, -0.4, -0.5, -0.6, -0.9] }],
  },
};

/** Gains and losses stacked from zero, so a month with a negative total still reads. */
export const StackedNegative: Story = {
  args: {
    title: "Two months closed down despite gains in power.",
    label: "Contribution to monthly return by theme, in percentage points",
    layout: "stacked",
    categories: months.slice(0, 6),
    series: [
      { id: "ai", name: "AI compute", values: [1.2, -2.4, 0.8, -1.9, 1.5, 0.4] },
      { id: "power", name: "Power", values: [0.6, 0.9, 0.4, 0.3, 0.8, 0.5], highlight: true },
      { id: "chips", name: "Chips", values: [-0.4, -0.8, 0.2, -1.1, 0.3, -0.2] },
    ],
  },
};

/** Long names wrap to two lines, then end in an ellipsis; zero draws no bar. */
export const LongLabelsAndZeros: Story = {
  args: {
    title: "Spend by category",
    label: "Spend by category, in thousands",
    categories: ["Semiconductor manufacturing equipment", "Cloud infrastructure and data centres", "Nuclear", "Grid", "Power generation and storage"],
    series: [{ id: "s", name: "Spend", values: [42, 0, 18, 7, 0] }],
  },
};

/** Sideways bars for many long names. */
export const Horizontal: Story = {
  args: { ...Grouped.args!, orientation: "horizontal", title: "Return by theme, sideways" },
};

export const Empty: Story = { args: { title: "No trades yet", label: "Trades", categories: months, series: [{ id: "a", name: "Trades", values: months.map(() => null) }] } };
