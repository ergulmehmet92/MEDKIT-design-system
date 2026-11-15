import type { Meta, StoryObj } from "@storybook/react-vite";
import { CountUp } from "../count-up";
import { DrawLine } from "../draw-line";
import { Typewriter } from "../typewriter";
import { Reveal } from "./Reveal";

const meta = { title: "Atoms/Motion", component: Reveal, subcomponents: { DrawLine, CountUp, Typewriter }, args: { children: null } } satisfies Meta<typeof Reveal>;
export default meta;
type Story = StoryObj<typeof meta>;

const card = { padding: "var(--mk-inset-md)", borderRadius: 12, background: "color-mix(in oklab, var(--mk-color-text-default) 7%, transparent)" } as const;

/** Board: scroll down. Each item rises 12px and fades as it enters, a little after the one before. */
export const RevealOnScroll: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--mk-gap-md)", maxInlineSize: 480, paddingBlock: "70vh 30vh" }}>
      {["Panel", "DataTable", "Gauge", "TrackBar", "Card", "PullQuote", "StepRelay", "Footer"].map((name, i) => (
        <Reveal key={name} order={i % 3}>
          <div style={card}>{name}</div>
        </Reveal>
      ))}
    </div>
  ),
};

/** Line art drawing on over 1.4s: a chart line, then a honey rule. */
export const DrawLineOnView: Story = {
  render: () => (
    <DrawLine viewBox="0 0 200 80" style={{ inlineSize: 400 }} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
      <path stroke="var(--mk-color-text-default)" d="M0 70 C20 60 30 64 45 52 S70 30 90 38 S120 20 140 26 S175 8 200 12" />
      <path stroke="var(--mk-color-text-accent)" d="M0 76 L200 76" />
    </DrawLine>
  ),
};

/** Counts to the value in tabular figures; screen readers hear 122.9 once. */
export const CountUpOnView: Story = {
  render: () => (
    <p style={{ margin: 0, fontSize: "var(--mk-font-size-heading)", letterSpacing: "-0.03em" }}>
      <CountUp value={122.9} /> <span style={{ fontSize: "var(--mk-font-size-lead)", color: "var(--mk-color-text-muted)" }}>indexed</span>
    </p>
  ),
};

/** Types at 45ms a character; the caret blinks once a second and fades when done. */
export const TypewriterOnView: Story = {
  render: () => <Typewriter as="p" text="Not the artifact. The system that produces it." />,
  decorators: [(Story) => <div style={{ fontSize: "var(--mk-font-size-subheading)", letterSpacing: "-0.03em", maxInlineSize: 640 }}><Story /></div>],
};
