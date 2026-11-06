import type { Meta, StoryObj } from "@storybook/react-vite";
import { WaterfallChart } from "./WaterfallChart";

const meta = { title: "Organisms/WaterfallChart", component: WaterfallChart } satisfies Meta<typeof WaterfallChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: how this month's return built up, in percentage points. */
export const Month: Story = {
  args: {
    title: "Chips cost almost two points of a good month.",
    label: "How this month's return built up, in percentage points",
    steps: [
      { id: "ai", name: "AI compute", value: 2.1 },
      { id: "power", name: "Power", value: 1.6 },
      { id: "nuclear", name: "Nuclear", value: 0.9 },
      { id: "grid", name: "Grid", value: 0.4 },
      { id: "cloud", name: "Cloud", value: 0.2 },
      { id: "chips", name: "Chip equipment", value: -1.9 },
      { id: "cash", name: "Cash drag", value: -0.3 },
      { id: "fees", name: "Fees", value: -0.1 },
    ],
  },
};

/** From last month's value to this month's, ending below where it started. */
export const FromAStart: Story = {
  args: {
    title: "November closed below October.",
    label: "Portfolio value from October to November, in thousands",
    start: { name: "October", value: 118.4 },
    totalLabel: "November",
    steps: [
      { id: "gains", name: "Gains", value: 3.2 },
      { id: "losses", name: "Losses", value: -6.1 },
      { id: "deposits", name: "Deposits", value: 1.5 },
    ],
  },
};

/** A month that lost money overall: the total stands below zero. */
export const NegativeTotal: Story = {
  args: { title: "A losing month", label: "Contribution to return, in percentage points", steps: [{ id: "a", name: "AI", value: -2.4 }, { id: "b", name: "Power", value: 0.9 }, { id: "c", name: "Chips", value: -1.1 }] },
};
