import type { Meta, StoryObj } from "@storybook/react-vite";
import { LivingLight } from "../../atoms/living-light";
import { Panel } from "../../organisms/panel";
import { TrackBar } from "./TrackBar";

const pct = (v: number) => `${v}%`;
const meta = {
  title: "Molecules/TrackBar",
  component: TrackBar,
  decorators: [
    (Story, { globals }) => (
      <div style={{ position: "relative", isolation: "isolate", padding: "var(--mk-inset-lg)", maxInlineSize: 480 }}>
        <LivingLight theme={globals.theme === "paper" ? "paper" : "forest"} />
        <Panel>
          <Story />
        </Panel>
      </div>
    ),
  ],
} satisfies Meta<typeof TrackBar>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 3: inside its allowed range, the target a tick. */
export const InRange: Story = { args: { label: "CEG", value: 5.2, max: 10, target: 5, range: [4, 7], format: pct, note: "Target 5%" } };

/** Out of range: red, with the amount, as on the bullet chart. */
export const OutOfRange: Story = { args: { label: "NVDA", value: 9.8, max: 10, target: 8, range: [6, 9], format: pct, note: "Allowed 6 to 9%" } };

/** Progress to a target, in honey because it is the one thing that matters here. */
export const Progress: Story = {
  args: { label: "Dip ladder, NVDA", value: 2, max: 5, tone: "accent", readout: "2 of 5 rungs", valueText: "2 of 5 rungs filled. Next rung at $164.", note: "Next rung at $164, 6% below today." },
};

/** Toward a trigger: a limit tick that turns the bar red once reached. */
export const Limit: Story = { args: { label: "High-yield spread above 4.50%", value: 3.2, max: 4.5, limit: 4.5, format: (v) => `${v.toFixed(2)}%`, note: "Clear" } };

export const LimitReached: Story = { args: { label: "Sahm rule at 0.50", value: 0.52, max: 0.6, limit: 0.5, note: "Lit: forces state 4" } };

/** Compact, for a table cell: the label hidden, a short readout. */
export const Compact: Story = { args: { label: "LRCX against its range", value: 1.2, max: 10, target: 2, range: [1.5, 3], size: "compact" } };
