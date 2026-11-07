import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusLamp } from "../../atoms/status-lamp";
import { StatusPill } from "./StatusPill";

const meta = { title: "Molecules/StatusPill", component: StatusPill, args: { status: "live" } } satisfies Meta<typeof StatusPill>;
export default meta;
type Story = StoryObj<typeof meta>;

const bank = (still: boolean) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--mk-gap-lg)", maxInlineSize: 560, padding: "var(--mk-inset-lg) 0" }}>
    {(["live", "stale", "failed"] as const).map((s) => (
      <div key={s} style={{ display: "grid", justifyItems: "center", gap: "var(--mk-gap-lg)" }}>
        <StatusLamp status={s} size="large" still={still} />
        <span style={{ fontFamily: "var(--mk-font-family-label)", letterSpacing: "var(--mk-tracking-label)", textTransform: "uppercase" }}>{s}</span>
      </div>
    ))}
  </div>
);

/** The Lamps board: the control bank, then readings with a sentence beside each lamp. */
export const Board: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--mk-gap-xl)" }}>
      {bank(false)}
      <div style={{ display: "grid", gap: "var(--mk-gap-md)", fontSize: "var(--mk-font-size-lead)" }}>
        <StatusPill status="live">Daily snapshot is live</StatusPill>
        <StatusPill status="stale">Daily snapshot is stale</StatusPill>
        <StatusPill status="failed">Daily snapshot failed</StatusPill>
      </div>
    </div>
  ),
};

/** What reduced motion shows: the rings at rest, the scan centred, Failed lit. */
export const Still: Story = { render: () => bank(true) };

/** A sentence beats a bare word. */
export const InASentence: Story = { args: { status: "stale", children: "Prices are 3 hours old" } };
