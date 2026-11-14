import type { Meta, StoryObj } from "@storybook/react-vite";
import { LivingLight } from "../../atoms/living-light";
import { Tabs } from "./Tabs";

const tabs = ["Overview", "Positions", "Calls", "Gauge", "Reports", "Settings"].map((t) => ({
  id: t.toLowerCase(),
  label: t,
  panel: <p style={{ margin: 0 }}>{t}: sample content.</p>,
}));

const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  decorators: [
    (Story, { globals }) => (
      <div style={{ position: "relative", isolation: "isolate", padding: "var(--mk-inset-lg)", maxInlineSize: 640 }}>
        <LivingLight theme={globals.theme === "paper" ? "paper" : "forest"} />
        <Story />
      </div>
    ),
  ],
  args: { label: "Views", tabs: tabs.slice(0, 4) },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board: the selected tab is a Lens body and an underline. Arrow keys, Home and End move between tabs. */
export const Default: Story = {};

/** Too many tabs for the width: the list scrolls sideways and fades at the edge, with the selected tab in view. */
export const Overflow: Story = {
  args: { tabs, defaultSelected: "reports" },
  decorators: [(Story) => <div style={{ inlineSize: 280 }}><Story /></div>],
};

/** For panels that are slow to show: arrows move focus, Enter or Space selects. */
export const Manual: Story = { args: { activation: "manual" } };
