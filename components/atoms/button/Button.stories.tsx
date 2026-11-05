import type { Meta, StoryObj } from "@storybook/react-vite";
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
