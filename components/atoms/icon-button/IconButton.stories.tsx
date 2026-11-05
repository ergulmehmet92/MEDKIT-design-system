import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "./IconButton";

const icon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M1 8h14" />
    <path d="M8 1v14" />
  </svg>
);

const meta = {
  title: "Atoms/IconButton",
  component: IconButton,
  args: { label: "Add", children: icon },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
