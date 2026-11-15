import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { LivingLight } from "../../atoms/living-light";
import { Field } from "../../molecules/field";
import { Select } from "../select";
import { Chip } from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Atoms/Chip",
  component: Chip,
  subcomponents: { Select },
  decorators: [
    (Story, { globals }) => (
      <div style={{ position: "relative", isolation: "isolate", padding: "var(--mk-inset-lg)", maxInlineSize: 560, display: "grid", gap: "var(--mk-gap-lg)" }}>
        <LivingLight theme={globals.theme === "paper" ? "paper" : "forest"} />
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj;

const row = { display: "flex", flexWrap: "wrap", gap: "var(--mk-gap-sm)" } as const;

/** Board: static chips label, toggles filter, removable chips clear a filter. */
export const AllKinds: Story = {
  render: () => {
    const [on, setOn] = useState<Record<string, boolean>>({ "AI compute": true, Power: true, Grid: false, Chips: false });
    const [left, setLeft] = useState(["Nuclear", "Cloud", "2026"]);
    return (
      <>
        <div style={row}>
          <Chip>Sample data</Chip>
          <Chip>12 positions</Chip>
        </div>
        <div style={row} role="group" aria-label="Themes">
          {Object.keys(on).map((k) => (
            <Chip key={k} pressed={on[k]} onPressedChange={(p) => setOn({ ...on, [k]: p })}>
              {k}
            </Chip>
          ))}
        </div>
        <div style={row}>
          {left.map((k) => (
            <Chip key={k} onRemove={() => setLeft(left.filter((x) => x !== k))}>
              {k}
            </Chip>
          ))}
        </div>
      </>
    );
  },
};

/** Select is the browser's own list in our well, with our chevron. */
export const SelectInAField: Story = {
  render: () => (
    <Field label="Call" hint="What you did with the position">
      <Select defaultValue="Trim">
        {["Buy", "Add", "Trim", "Sell"].map((o) => (
          <option key={o}>{o}</option>
        ))}
      </Select>
    </Field>
  ),
};
