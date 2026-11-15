import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading";

const meta = {
  title: "Atoms/Heading",
  component: Heading,
  args: { level: 2, size: "title", children: "Case studies" },
  argTypes: {
    level: { control: "select", options: [1, 2, 3, 4, 5, 6] },
    size: { control: "inline-radio", options: ["display", "heading", "subheading", "title"] },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Title: Story = {};

export const Subheading: Story = { args: { size: "subheading", children: "What is the optimal experience?" } };

export const SectionHeading: Story = { args: { size: "heading", children: "Case studies" } };

export const Display: Story = {
  args: { level: 1, size: "display", children: "The designer's job is no longer the artifact." },
};

export const PageTitleAtTitleSize: Story = {
  args: { level: 1, size: "title", children: "Where are we in the cycle?" },
};

export const LongHeadlineBalances: Story = {
  args: {
    size: "heading",
    children: "Spotting operational bottlenecks across 4,000 customer deployments and solving them fast with AI",
  },
};

export const LongWordBreaks: Story = {
  args: { size: "heading", children: "Donaudampfschifffahrtsgesellschaftskapitän" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "20rem" }}>
        <Story />
      </div>
    ),
  ],
};
