import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eyebrow } from "../../atoms/eyebrow";
import { Heading } from "../../atoms/heading";
import { Section } from "./Section";

const meta = {
  title: "Organisms/Section",
  component: Section,
  parameters: { layout: "fullscreen" },
  args: { tone: "page", rails: false, "aria-labelledby": "section-title" },
  argTypes: { tone: { control: "inline-radio", options: ["page", "inverse", "forest", "paper"] } },
  render: (args) => (
    <Section {...args}>
      <Eyebrow>[02] Back to the core</Eyebrow>
      <Heading id="section-title" size="heading">
        What is the problem?
      </Heading>
      <p style={{ margin: 0, maxWidth: "34em" }}>Why does it exist? How can I communicate it to a user? What is the optimal experience for this user?</p>
    </Section>
  ),
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {};

export const Inverse: Story = { args: { tone: "inverse" } };

export const WithRails: Story = { args: { rails: true } };

export const PinnedPaper: Story = { args: { tone: "paper" } };

export const PinnedForest: Story = { args: { tone: "forest" } };
