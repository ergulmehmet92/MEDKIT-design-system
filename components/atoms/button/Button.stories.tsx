import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "../icon-button";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { children: "Get in touch" },
  argTypes: { variant: { control: "inline-radio", options: ["primary", "quiet"] } },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Quiet: Story = { args: { variant: "quiet" } };

export const Disabled: Story = { args: { disabled: true } };

export const QuietDisabled: Story = { args: { variant: "quiet", disabled: true } };

export const OneWord: Story = { args: { children: "Send" } };

export const LongLabelWraps: Story = {
  args: { children: "Talk about a role, start a project, or invite me to speak at your conference" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "16rem" }}>
        <Story />
      </div>
    ),
  ],
};

// Refraction needs something to bend, so this puts lines and a hard light edge behind the buttons.
export const OverLight: Story = {
  render: () => (
    <div
      data-backdrop
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--mk-gap-md)",
        padding: "var(--mk-inset-lg)",
        background:
          "repeating-linear-gradient(90deg, var(--mk-color-border-strong) 0 1px, transparent 1px 3rem), linear-gradient(170deg, var(--mk-color-surface-default) 45%, var(--mk-color-material-glow) 45.5%, var(--mk-color-material-specular))",
      }}
    >
      <Button>Get in touch</Button>
      <Button variant="quiet">See the work</Button>
      <IconButton label="Open menu">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M1 4.5h14" />
          <path d="M1 11.5h14" />
        </svg>
      </IconButton>
    </div>
  ),
};
