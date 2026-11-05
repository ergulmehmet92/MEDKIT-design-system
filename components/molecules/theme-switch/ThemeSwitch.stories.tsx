import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeSwitch } from "./ThemeSwitch";

const meta = {
  title: "Molecules/ThemeSwitch",
  component: ThemeSwitch,
  // The switch themes the whole page, so this story doesn't pin a theme around it.
  parameters: { pinTheme: false },
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
