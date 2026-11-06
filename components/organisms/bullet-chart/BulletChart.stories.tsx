import type { Meta, StoryObj } from "@storybook/react-vite";
import { BulletChart } from "./BulletChart";

const meta = { title: "Organisms/BulletChart", component: BulletChart } satisfies Meta<typeof BulletChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: NVDA has left its allowed range, so it turns red and says over. */
export const Positions: Story = {
  args: {
    title: "NVDA is over its allowed range.",
    label: "Each position's weight against its target and allowed range, in percent",
    format: (v) => `${v}%`,
    max: 12,
    items: [
      { id: "nvda", name: "NVDA", value: 9.8, target: 8, range: [6, 9] },
      { id: "tsm", name: "TSM", value: 7.1, target: 7, range: [5, 9] },
      { id: "vst", name: "VST", value: 5.6, target: 5, range: [3, 7] },
      { id: "ceg", name: "CEG", value: 5.2, target: 6, range: [4, 8] },
      { id: "etn", name: "ETN", value: 2.4, target: 5, range: [3, 7] },
    ],
  },
};

/** Without ranges or targets, it's a plain bar list. */
export const ValuesOnly: Story = {
  args: { title: "Cash by account", label: "Cash by account, in thousands", items: [{ id: "a", name: "Main", value: 42 }, { id: "b", name: "Savings", value: 18 }, { id: "c", name: "Trading", value: 0 }] },
};
