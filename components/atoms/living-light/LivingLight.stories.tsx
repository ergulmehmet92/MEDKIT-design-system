import type { Meta, StoryObj } from "@storybook/react-vite";
import { LivingLight } from "./LivingLight";

const meta = {
  title: "Atoms/LivingLight",
  component: LivingLight,
  argTypes: { form: { control: "inline-radio", options: ["ridge", "dune"] } },
  decorators: [
    (Story) => (
      <div style={{ position: "relative", isolation: "isolate", minHeight: "32rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LivingLight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ridge: Story = {};

export const Dune: Story = { args: { form: "dune" } };

export const CalmBehindText: Story = { args: { calm: 0.95 } };

export const PinnedForest: Story = { args: { theme: "forest" } };

export const PinnedPaper: Story = { args: { theme: "paper" } };
