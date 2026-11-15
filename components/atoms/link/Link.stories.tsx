import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLink } from "./ArrowLink";
import { Link } from "./Link";

const meta = {
  title: "Atoms/Link",
  component: Link,
  args: { href: "#", children: "annotation story" },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InRunningText: Story = {
  render: (args) => (
    <p style={{ maxWidth: "34em" }}>
      Product design, built in code. Read the <Link {...args} />, or the <Link href="#">build log</Link> behind it.
    </p>
  ),
};

export const External: Story = {
  render: () => (
    <p>
      The code is on{" "}
      <Link href="https://github.com/ergulmehmet92" target="_blank" rel="noreferrer">
        GitHub
      </Link>
      .
    </p>
  ),
};

export const Arrow: Story = { render: () => <ArrowLink href="#">Read the story</ArrowLink> };

export const ArrowLongLabelWraps: Story = {
  render: () => (
    <div style={{ maxWidth: "14rem" }}>
      <ArrowLink href="#">Read how the design system reached three products in one release</ArrowLink>
    </div>
  ),
};
