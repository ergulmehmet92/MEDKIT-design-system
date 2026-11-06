import type { Meta, StoryObj } from "@storybook/react-vite";
import { seeded, tradingDays } from "../line-chart/predictor.sample";
import { CandlestickChart } from "./CandlestickChart";
import type { Candle } from "./CandlestickChart";

/** A seeded price walk with daily open, high, low, close and volume. */
function walk(days: Date[], start = 120, seed = 3): Candle[] {
  const rand = seeded(seed);
  let close = start;
  return days.map((x) => {
    const open = close * (1 + (rand() - 0.5) * 0.012);
    close = open * (1 + (rand() - 0.48) * 0.04);
    const high = Math.max(open, close) * (1 + rand() * 0.015);
    const low = Math.min(open, close) * (1 - rand() * 0.015);
    return { x, open, high, low, close, volume: Math.round(2e7 + rand() * 4e7) };
  });
}

const quarter = walk(tradingDays("2026-08-03", "2026-11-06"));
const today = quarter.length - 1;

const meta = {
  title: "Organisms/CandlestickChart",
  component: CandlestickChart,
  args: {
    title: "NVDA over the last quarter",
    label: "NVDA daily open, high, low and close, with volume",
    data: quarter,
    today,
    events: [{ id: "earnings", at: 17, label: "Earnings", detail: "Beat on revenue" }],
    caption: "Sample data, not real prices.",
  },
} satisfies Meta<typeof CandlestickChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Quarter: Story = {};

/** Twenty days: wide candles, capped at 14px. */
export const Month: Story = { args: { data: quarter.slice(-20), today: 19, events: [] } };

/** A year of days thins candles to bars. */
export const Year: Story = { args: { data: walk(tradingDays("2025-11-06", "2026-11-06")), today: undefined, events: [] } };

/** Five years of days falls back to a closing line. */
export const FiveYears: Story = { args: { data: walk(tradingDays("2021-11-08", "2026-11-06"), 40, 9), today: undefined, events: [], volume: false } };

/** Halted days leave gaps. */
export const Gaps: Story = { args: { data: quarter.map((c, i) => (i % 13 === 4 ? { ...c, open: null, high: null, low: null, close: null, volume: null } : c)) } };

export const SingleDay: Story = { args: { data: quarter.slice(-1), today: 0, events: [] } };

export const Empty: Story = { args: { data: quarter.map((c) => ({ ...c, open: null, high: null, low: null, close: null })), events: [] } };
