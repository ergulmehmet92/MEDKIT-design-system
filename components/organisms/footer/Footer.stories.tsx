import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../atoms/badge";
import { PullQuote } from "../../molecules/pull-quote";
import { Footer } from "./Footer";

const meta = {
  title: "Organisms/Footer",
  component: Footer,
  args: {
    name: "Mehmet Ergul",
    thesis: "Designer and builder. Not the artifact: the system that produces it.",
    groups: [
      { title: "Work", links: [{ label: "Case studies", href: "#" }, { label: "Build log", href: "#" }, { label: "MED·Kit", href: "#" }] },
      { title: "Writing", links: [{ label: "Posts", href: "#" }, { label: "Talks", href: "#" }] },
      { title: "Elsewhere", links: [{ label: "YouTube", href: "#" }, { label: "GitHub", href: "#" }, { label: "LinkedIn", href: "#" }] },
    ],
    smallPrint: [
      "© 2026 Mehmet Ergul",
      <>
        Built with MED·Kit <Badge tone="version">v2.0.0</Badge>
      </>,
      <a href="#top">Back to top</a>,
    ],
  },
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board: the name beside three link lists from 48rem; stacked below that. */
export const Wide: Story = {};

export const Narrow: Story = { decorators: [(Story) => <div style={{ inlineSize: 375 }}><Story /></div>] };

/** PullQuote in its three sizes, set in type alone. */
export const Quotes: StoryObj<typeof PullQuote> = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))", gap: "var(--mk-gap-xl)" }}>
      <PullQuote attribution="Predictor" source="design principle">The gauge shows. The person decides.</PullQuote>
      <PullQuote attribution="Mehmet Ergul">Not the artifact.</PullQuote>
      <PullQuote attribution="Build log" source="6 Nov 2026">
        {"A design system earns its keep when the second and third products need it more than the first did: when the dashboard, the site and the video studio all reach for the same token, and nobody has to ask which green."}
      </PullQuote>
    </div>
  ),
};
