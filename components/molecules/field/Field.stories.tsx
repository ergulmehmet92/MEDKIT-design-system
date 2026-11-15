import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { Input } from "../../atoms/input";
import { LivingLight } from "../../atoms/living-light";
import { Textarea } from "../../atoms/textarea";
import { Field } from "./Field";

const search = (
  <svg viewBox="0 0 16 16">
    <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const meta = {
  title: "Molecules/Field",
  component: Field,
  subcomponents: { Input, Textarea },
  decorators: [
    (Story, { globals }) => (
      <div style={{ position: "relative", isolation: "isolate", padding: "var(--mk-inset-lg)", maxInlineSize: 560, display: "grid", gap: "var(--mk-gap-lg)" }}>
        <LivingLight theme={globals.theme === "paper" ? "paper" : "forest"} />
        <Story />
      </div>
    ),
  ],
  args: { label: "Weight", children: <Input inputMode="decimal" placeholder="6.0" /> },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithHint: Story = { args: { hint: "Between 0 and 10%" } };

/** An error the app has found: the Failed hexagon, a sentence on how to fix it, and a red rim. */
export const WithError: Story = { args: { hint: "Allowed 6 to 9% in state 3", error: "Enter a weight between 0 and 10%.", children: <Input inputMode="decimal" defaultValue="14" /> } };

/** The browser's own check, shown only after the field is used. Type, clear it, then leave it. */
export const Required: Story = { args: { label: "Ticker", invalidMessage: "Enter a ticker.", children: <Input required icon={search} placeholder="Search tickers" /> } };

export const Optional: Story = { args: { label: "Lapses", optional: true, children: <Input type="date" /> } };

export const Disabled: Story = { args: { hint: "Locked while the gauge recalculates.", children: <Input defaultValue="6.5" disabled /> } };

export const LongText: Story = { args: { label: "Reason", hint: "Kept with the call, and shown again when it closes.", children: <Textarea defaultValue="Trimming back into range after the October run. Gauge reads late, overdue." /> } };

/** Board: Predictor's form. Submit it empty to see every error at once. */
export const Form: Story = {
  render: () => (
    <form style={{ display: "grid", gap: "var(--mk-gap-md)" }} onSubmit={(e) => e.preventDefault()}>
      <Field label="Ticker" invalidMessage="Enter a ticker.">
        <Input required icon={search} />
      </Field>
      <Field label="New weight" hint="Allowed 6 to 9% in state 3" invalidMessage="Enter a weight between 0 and 10%.">
        <Input required type="number" min={0} max={10} step={0.1} />
      </Field>
      <Field label="Reason" hint="Kept with the call." invalidMessage="Say why, in a sentence or more.">
        <Textarea required minLength={12} />
      </Field>
      <div style={{ display: "flex", gap: "var(--mk-gap-sm)", justifyContent: "end" }}>
        <Button variant="quiet" type="reset">
          Cancel
        </Button>
        <Button type="submit">Record call</Button>
      </div>
    </form>
  ),
};
