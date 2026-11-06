import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarHeatmap } from "./CalendarHeatmap";
import { Heatmap } from "./Heatmap";

const themes = ["AI", "Power", "Grid", "Chips", "Cloud", "Nuclear"];
const corr = [
  [1, 0.42, 0.38, 0.81, 0.64, 0.21],
  [0.42, 1, 0.77, 0.33, 0.18, 0.69],
  [0.38, 0.77, 1, 0.29, 0.22, 0.55],
  [0.81, 0.33, 0.29, 1, 0.58, 0.12],
  [0.64, 0.18, 0.22, 0.58, 1, -0.08],
  [0.21, 0.69, 0.55, 0.12, -0.08, 1],
];

const meta = { title: "Organisms/Heatmap", component: Heatmap } satisfies Meta<typeof Heatmap>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: the lower half of a correlation matrix, honey for moving together, centred on zero. */
export const Correlation: Story = {
  args: {
    title: "Chips and AI compute move together.",
    label: "Correlation of daily returns between themes",
    rows: themes,
    columns: themes,
    values: corr,
    scale: "diverging",
    palette: "accent",
    domain: [-1, 1],
    centre: 0,
    triangle: "lower",
  },
};

/** Gains and losses by theme and month, red below zero and green above. */
export const MonthlyReturns: Story = {
  args: {
    title: "Power stayed green while chips swung.",
    label: "Monthly return by theme, in percent",
    rows: themes,
    columns: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
    values: themes.map((_, i) => [0, 1, 2, 3, 4, 5].map((j) => Math.round((Math.sin(i * 1.7 + j) * 6 + (i === 1 ? 4 : 0)) * 10) / 10)),
    scale: "diverging",
    palette: "direction",
    centre: 0,
    format: (v) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v)}`,
  },
};

let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const year = Array.from({ length: 365 }, (_, k) => {
  const date = new Date(Date.UTC(2025, 10, 7) + k * 864e5);
  const busy = date.getUTCMonth() >= 9 || date.getUTCMonth() <= 1 ? 1.6 : 0.8;
  const weekday = date.getUTCDay() > 0 && date.getUTCDay() < 6 ? 1 : 0.35;
  return { date, value: rand() < 0.25 ? 0 : Math.round(rand() * 5 * busy * weekday) };
});

/** Board 2: a year of build-log commits, in ordered steps of one hue. */
export const Calendar: StoryObj<typeof CalendarHeatmap> = {
  render: () => <CalendarHeatmap title="The build log runs hottest in winter." label="Commits to the portfolio and MED·Kit per day" days={year} unit={["commit", "commits"]} />,
};
