import type { Meta, StoryObj } from "@storybook/react-vite";
import { seeded, tradingDays } from "../line-chart/predictor.sample";
import { AreaChart } from "./AreaChart";

const days = tradingDays("2025-11-06", "2026-11-06");
const monthly = (points: number[]) => days.map((_, i) => {
  const f = (i / (days.length - 1)) * (points.length - 1);
  const a = Math.floor(f);
  const b = Math.min(a + 1, points.length - 1);
  return points[a] + (points[b] - points[a]) * (f - a);
});
const themes = [
  { id: "ai", name: "AI compute", values: monthly([18, 19, 21, 22, 22, 21, 22, 23, 24, 24, 23, 22, 22]) },
  { id: "power", name: "Power", values: monthly([8, 8, 9, 9, 10, 11, 11, 12, 12, 12, 13, 13, 13]) },
  { id: "grid", name: "Grid", values: monthly([6, 6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10]) },
  { id: "chips", name: "Chip equipment", values: monthly([7, 7, 7, 6, 6, 5, 6, 6, 6, 7, 7, 7, 7]) },
  { id: "cloud", name: "Cloud", values: monthly([6, 6, 6, 6, 5, 5, 5, 5, 6, 6, 6, 6, 6]) },
  { id: "nuclear", name: "Nuclear", values: monthly([3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 6]) },
];

const meta = {
  title: "Organisms/AreaChart",
  component: AreaChart,
  args: { title: "Exposure by theme", label: "Exposure by theme, as a share of the portfolio", x: days, series: themes, format: (v: number) => `${Math.round(v)}%`, totalLabel: "Invested" },
} satisfies Meta<typeof AreaChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The dashboard panel from Data board 1. */
export const Stacked: Story = {};

/** Each theme's share of what's invested, so the total always reads 100%. */
export const Percent: Story = { args: { layout: "percent", title: "Share of the invested portfolio" } };

const rand = seeded(5);
const weeks = tradingDays("2025-01-06", "2026-10-30").filter((_, i) => i % 5 === 0);
const genres = ["Talks", "Tutorials", "Teardowns", "Livestreams", "Shorts", "Q&A"];
/** A streamgraph for the YouTube studio: watch time by format, where the shape matters more than the axis. */
export const Stream: Story = {
  args: {
    layout: "stream",
    title: "Watch time by format",
    label: "Watch time by format, by week, in hours",
    x: weeks,
    format: (v: number) => `${Math.round(v)} h`,
    totalLabel: "All formats",
    series: genres.map((name, k) => ({ id: name, name, values: weeks.map((_, i) => Math.max(0, 40 + 30 * Math.sin(i / (6 + k) + k) + rand() * 12)) })),
  },
};

/** Gains above zero and losses below, stacked from the zero line. */
export const Negative: Story = {
  args: {
    title: "Contribution to return by theme",
    label: "Contribution to monthly return by theme, in percentage points",
    format: (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(1)}`,
    totalLabel: "Net",
    series: themes.slice(0, 4).map((t, k) => ({ ...t, values: days.map((_, i) => Math.sin(i / 20 + k) * (k + 1)) })),
  },
};

/** Eleven layers: seven keep their slots and the rest fold into Other. */
export const ElevenLayers: Story = {
  args: {
    title: "Holdings by sector",
    series: Array.from({ length: 11 }, (_, k) => ({ id: `s${k}`, name: `Sector ${k + 1}`, values: days.map((_, i) => 3 + ((k * 7 + i / 30) % 5)) })),
  },
};

export const SinglePoint: Story = { args: { x: [days[0]], series: themes.map((t) => ({ ...t, values: [t.values[0]] })) } };

export const Empty: Story = { args: { series: themes.map((t) => ({ ...t, values: t.values.map(() => null) })) } };
