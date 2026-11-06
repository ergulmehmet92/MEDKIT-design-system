import type { Meta, StoryObj } from "@storybook/react-vite";
import { DonutChart } from "./DonutChart";

const meta = { title: "Organisms/DonutChart", component: DonutChart } satisfies Meta<typeof DonutChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: the invested share in the centre, AI compute in the accent. */
export const Holdings: Story = {
  args: {
    title: "Almost two thirds is invested.",
    label: "Where the money sits today, in percent",
    centre: { value: "64%", label: "invested" },
    parts: [
      { id: "ai", name: "AI compute", value: 22, highlight: true },
      { id: "power", name: "Power", value: 13 },
      { id: "grid", name: "Grid", value: 10 },
      { id: "other", name: "Other themes", value: 19 },
      { id: "cash", name: "Cash", value: 36 },
    ],
  },
};

/** Eight parts fold to five, with a sliver that says it's under 1%. */
export const ManyParts: Story = {
  args: {
    title: "Watch time by format",
    label: "Watch time by format, in hours",
    parts: [
      { id: "talks", name: "Talks", value: 410, highlight: true },
      { id: "tutorials", name: "Tutorials", value: 380 },
      { id: "teardowns", name: "Teardowns", value: 220 },
      { id: "live", name: "Livestreams", value: 120 },
      { id: "shorts", name: "Shorts", value: 60 },
      { id: "qa", name: "Q&A", value: 40 },
      { id: "trailers", name: "Trailers", value: 12 },
      { id: "clips", name: "Clips", value: 3 },
    ],
  },
};

export const Empty: Story = { args: { title: "Nothing invested yet", label: "Holdings", parts: [] } };
