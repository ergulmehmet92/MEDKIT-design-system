import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlopeChart } from "./SlopeChart";

const meta = { title: "Organisms/SlopeChart", component: SlopeChart } satisfies Meta<typeof SlopeChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: Nuclear in the accent, every other theme in grey. */
export const Highlighted: Story = {
  args: {
    title: "Nuclear doubled its share since January.",
    label: "Weight by theme, January against now, in percent",
    fromLabel: "Jan 2026",
    toLabel: "Now",
    format: (v) => `${v}%`,
    items: [
      { id: "ai", name: "AI compute", from: 21, to: 22 },
      { id: "power", name: "Power", from: 9, to: 13 },
      { id: "grid", name: "Grid", from: 6, to: 10 },
      { id: "chips", name: "Chip equipment", from: 7, to: 7 },
      { id: "cloud", name: "Cloud", from: 6, to: 6 },
      { id: "nuclear", name: "Nuclear", from: 3, to: 6, highlight: true },
    ],
  },
};

/** No highlight: every line wears the lead. */
export const Plain: Story = {
  args: {
    title: "Hit rate by call type",
    label: "Hit rate by call type, last quarter against this one",
    fromLabel: "Q3",
    toLabel: "Q4",
    format: (v) => `${v}%`,
    items: [
      { id: "gauge", name: "Gauge calls", from: 61, to: 64 },
      { id: "override", name: "Overrides", from: 55, to: 48 },
    ],
  },
};

export const MissingEnd: Story = {
  args: { ...Plain.args!, title: "A new call type", items: [...Plain.args!.items!, { id: "new", name: "New rule", from: null, to: 52 }] },
};
