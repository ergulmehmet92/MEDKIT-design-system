import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScatterChart } from "./ScatterChart";

const pct = (v: number) => `${Math.round(v)}%`;
const meta = { title: "Organisms/ScatterChart", component: ScatterChart } satisfies Meta<typeof ScatterChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: risk against return, sized by weight, AI compute in the accent. */
export const RiskAndReturn: Story = {
  args: {
    title: "The riskiest positions paid best, with two exceptions.",
    label: "Return against volatility over a year, sized by weight",
    xLabel: "Volatility",
    yLabel: "Return",
    sizeLabel: "Weight",
    formatX: pct,
    formatY: (v) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(Math.round(v))}%`,
    formatSize: (v) => `${v}%`,
    references: { x: { value: 43, label: "Portfolio risk 43%" } },
    groups: [
      { id: "ai", name: "AI compute", highlight: true },
      { id: "power", name: "Power" },
      { id: "other", name: "Other themes" },
    ],
    points: [
      ["NVDA", 52, 61, 9.8, "ai"], ["TSM", 41, 38, 7.1, "ai"], ["AVGO", 46, 44, 2.3, "ai"], ["VST", 58, 72, 5.6, "power"], ["CEG", 49, 55, 5.2, "power"], ["NEE", 22, 9, 2.1, "power"],
      ["ETN", 31, 24, 4.4, "other"], ["GEV", 44, 48, 3.1, "other"], ["PWR", 35, 29, 1.9, "other"], ["ASML", 38, -12, 3.9, "other"], ["LRCX", 47, -6, 1.2, "other"], ["MSFT", 24, 14, 3.6, "other"],
      ["EQIX", 26, 3, 1.1, "other"], ["SMR", 74, 81, 1.4, "other"], ["CCJ", 55, -18, 2.4, "other"], ["MU", 50, -9, 1.6, "other"],
    ].map(([name, x, y, size, group]) => ({ id: String(name), name: String(name), x: Number(x), y: Number(y), size: Number(size), group: String(group) })),
  },
};

/** Plain dots, no groups: every point in the lead. */
export const Plain: Story = {
  args: {
    title: "Longer videos keep viewers longer",
    label: "Average view duration against video length",
    xLabel: "Video length, minutes",
    yLabel: "Average view, minutes",
    points: Array.from({ length: 40 }, (_, k) => ({ id: `v${k}`, name: `Video ${k + 1}`, x: 3 + ((k * 7) % 37), y: 1.5 + ((k * 7) % 37) * 0.38 + ((k * 13) % 5) - 2 })),
  },
};

export const Empty: Story = { args: { title: "No positions", label: "Positions", xLabel: "Risk", yLabel: "Return", points: [] } };
