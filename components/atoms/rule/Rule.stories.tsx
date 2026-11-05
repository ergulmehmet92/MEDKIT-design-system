import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rule } from "./Rule";

const meta = {
  title: "Atoms/Rule",
  component: Rule,
} satisfies Meta<typeof Rule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Strong: Story = { args: { strength: "strong" } };

export const Labelled: Story = { args: { "aria-label": "Positions" } };
