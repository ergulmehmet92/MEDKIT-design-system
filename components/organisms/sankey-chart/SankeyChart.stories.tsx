import type { Meta, StoryObj } from "@storybook/react-vite";
import { SankeyChart } from "./SankeyChart";

const meta = { title: "Organisms/SankeyChart", component: SankeyChart } satisfies Meta<typeof SankeyChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: where this year's money came from, and where it went. */
export const Money: Story = {
  args: {
    title: "A third of this year's money went to AI compute.",
    label: "Where this year's money came from and went, in percent",
    format: (v) => `${v}%`,
    nodes: [
      { id: "income", name: "Income" },
      { id: "sales", name: "Sold positions" },
      { id: "dividends", name: "Dividends" },
      { id: "portfolio", name: "Portfolio" },
      { id: "ai", name: "AI compute", highlight: true },
      { id: "power", name: "Power" },
      { id: "cash", name: "Cash" },
      { id: "grid", name: "Grid" },
      { id: "nuclear", name: "Nuclear" },
    ],
    links: [
      { source: "income", target: "portfolio", value: 60 },
      { source: "sales", target: "portfolio", value: 28 },
      { source: "dividends", target: "portfolio", value: 12 },
      { source: "portfolio", target: "ai", value: 34 },
      { source: "portfolio", target: "power", value: 22 },
      { source: "portfolio", target: "cash", value: 20 },
      { source: "portfolio", target: "grid", value: 14 },
      { source: "portfolio", target: "nuclear", value: 10 },
    ],
  },
};

/** The YouTube studio: where viewers came from, straight to what they watched. */
export const TwoColumns: Story = {
  args: {
    title: "Search sends the most viewers to tutorials.",
    label: "Views by source and format, in thousands",
    nodes: [
      { id: "search", name: "Search" },
      { id: "browse", name: "Browse" },
      { id: "external", name: "External" },
      { id: "tutorials", name: "Tutorials", highlight: true },
      { id: "talks", name: "Talks" },
      { id: "shorts", name: "Shorts" },
    ],
    links: [
      { source: "search", target: "tutorials", value: 42 },
      { source: "search", target: "talks", value: 8 },
      { source: "browse", target: "shorts", value: 31 },
      { source: "browse", target: "talks", value: 12 },
      { source: "external", target: "talks", value: 9 },
      { source: "external", target: "tutorials", value: 6 },
    ],
  },
};

export const Empty: Story = { args: { title: "No flows yet", label: "Flows", nodes: [], links: [] } };
