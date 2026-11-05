import type { Meta, StoryObj } from "@storybook/react-vite";
import { GridRails } from "./GridRails";

const meta = {
  title: "Atoms/GridRails",
  component: GridRails,
  decorators: [
    (Story) => (
      <div style={{ position: "relative", isolation: "isolate", minHeight: "24rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GridRails>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
export const Narrow: StoryObj<typeof meta> = {
  decorators: [
    (Story) => (
      <div style={{ position: "relative", isolation: "isolate", maxWidth: "20rem", minHeight: "24rem" }}>
        <Story />
      </div>
    ),
  ],
};
