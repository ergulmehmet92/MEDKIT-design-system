import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { LivingLight } from "../../atoms/living-light";
import { BulletChart } from "../bullet-chart";
import { Panel } from "./Panel";

const meta = {
  title: "Organisms/Panel",
  component: Panel,
  decorators: [
    (Story, { globals }) => (
      <div style={{ position: "relative", isolation: "isolate", padding: "var(--mk-inset-lg)", maxInlineSize: 720 }}>
        <LivingLight theme={globals.theme === "paper" ? "paper" : "forest"} />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Panel>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 3: kind and title, quiet actions on the right, the content, then its sources. */
export const WithActions: Story = {
  args: {
    kind: "Allocation",
    title: "Every sleeve sits inside state 3's range.",
    actions: (
      <>
        <Button variant="quiet">Columns</Button>
        <Button variant="quiet">Export</Button>
      </>
    ),
    footer: (
      <>
        <span>Ranges come from the state's allocation table</span>
        <span>Sample data</span>
      </>
    ),
    children: <p style={{ margin: 0 }}>Core index funds 41%, themes 23%, cash 36%.</p>,
  },
};

/** A chart brings its own title, key and table switch, so the panel is just the glass. */
export const WithChart: Story = {
  args: {
    footer: "Sample data",
    children: (
      <BulletChart
        title="NVDA is over its allowed range."
        label="Each position's weight against its target and allowed range, in percent"
        format={(v) => `${v}%`}
        max={12}
        items={[
          { id: "nvda", name: "NVDA", value: 9.8, target: 8, range: [6, 9] },
          { id: "tsm", name: "TSM", value: 7.1, target: 7, range: [5, 9] },
          { id: "etn", name: "ETN", value: 2.4, target: 5, range: [3, 7] },
        ]}
      />
    ),
  },
};
