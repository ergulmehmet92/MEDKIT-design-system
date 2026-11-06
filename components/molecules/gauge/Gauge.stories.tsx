import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { LivingLight } from "../../atoms/living-light";
import { Panel } from "../../organisms/panel";
import { TrackBar } from "../track-bar";
import { clocks, cycleBands, tripwires } from "./cycle.sample";
import { Gauge, GaugeSection } from "./Gauge";

const meta = {
  title: "Molecules/Gauge",
  component: Gauge,
  decorators: [
    (Story, { globals }) => (
      <div style={{ position: "relative", isolation: "isolate", padding: "var(--mk-inset-lg)", maxInlineSize: 480 }}>
        <LivingLight theme={globals.theme === "paper" ? "paper" : "forest"} />
        <Story />
      </div>
    ),
  ],
  args: { label: "Cycle state", min: 1, bands: cycleBands, value: 2.93 },
} satisfies Meta<typeof Gauge>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 3: Predictor's cycle gauge with its why: the three clocks, the tripwires, then the call. */
export const CycleGauge: Story = {
  render: (args) => (
    <Panel kind="Cycle gauge" title="Late in the cycle, and overdue." footer={<><span>Valuation 30%, policy 40%, economy 30%</span><span>Sample data</span></>}>
      <Gauge {...args} reading="Reading 2.93 of 4 · as of Fri 6 Nov">
        <GaugeSection title="Why: three clocks" aside="lateness, weighted">
          {clocks.map((c) => (
            <TrackBar
              key={c.name}
              label={c.name}
              value={c.lateness}
              max={100}
              readout={<>{c.lateness}% late <em>× {c.weight.toFixed(2)}</em></>}
              valueText={`${c.lateness}% late, weight ${c.weight}.`}
              note={c.note}
            />
          ))}
        </GaugeSection>
        <GaugeSection title="Tripwires" aside="any one lit forces state 4">
          {tripwires.map((t) => (
            <TrackBar key={t.name} label={t.name} value={t.value} max={t.limit} limit={t.limit} format={t.format} note="Clear" />
          ))}
        </GaugeSection>
        <GaugeSection title="Your call">
          <p style={{ margin: 0, color: "var(--mk-color-text-muted)" }}>The gauge reads the dials; you make the call. An override needs a reason and lapses after 90 days.</p>
          <div style={{ display: "flex", gap: "var(--mk-gap-sm)", flexWrap: "wrap" }}>
            <Button>Confirm state 3</Button>
            <Button variant="quiet">Override</Button>
          </div>
        </GaugeSection>
      </Gauge>
    </Panel>
  ),
};

export const Early: Story = { args: { value: 1.42 }, render: (args) => <Panel><Gauge {...args} /></Panel> };

/** A lit tripwire forces state 4 whatever the reading, and the gauge says so. */
export const ForcedByTripwire: Story = {
  args: { value: 2.4, state: 4, reason: "Forced to 4: high-yield spread is above 4.50%." },
  render: (args) => <Panel><Gauge {...args} /></Panel>,
};

/** Your override against the gauge's reading, with when it lapses. */
export const Override: Story = {
  args: { value: 2.93, state: 2, reason: "You set 2 against the gauge's 3. Lapses 4 Feb 2027." },
  render: (args) => <Panel><Gauge {...args} /></Panel>,
};
