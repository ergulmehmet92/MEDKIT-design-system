import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "Atoms/Eyebrow",
  component: Eyebrow,
  args: { children: "01 Product design" },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBrackets: Story = { args: { children: "[01] Product design" } };

export const AsHeading: Story = { args: { as: "h2", children: "Experiments" } };

export const SingleWord: Story = { args: { children: "Thesis" } };

export const LongLabelWraps: Story = {
  args: { children: "Accessibility audit, design system checker, consistency analyses and prototyping medium" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "16rem" }}>
        <Story />
      </div>
    ),
  ],
};
