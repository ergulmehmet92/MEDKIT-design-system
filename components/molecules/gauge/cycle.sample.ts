// Sample data in the shape of Predictor's cycle gauge, for stories and tests only. Not shipped.
import type { GaugeBand } from "./Gauge";

/** Four equal quarters of a 1 to 4 dial, as Predictor discretises its score. */
export const cycleBands: GaugeBand[] = [
  { to: 1.75, name: "Early", label: "Fresh, early" },
  { to: 2.5, name: "Mid", label: "Mid-cycle" },
  { to: 3.25, name: "Late", label: "Late, overdue" },
  { to: 4, name: "Crisis", label: "Crisis" },
];

export const clocks = [
  { name: "Valuation", lateness: 88, weight: 0.3, note: "Shiller CAPE 40.7. Fair is 17, the 1999 peak was 44." },
  { name: "Policy", lateness: 75, weight: 0.4, note: "Real 10-year yield 2.0%, balance sheet down 4% in six months. Weighted highest." },
  { name: "Economy", lateness: 26, weight: 0.3, note: "Yield curve +0.15 points: a 26% chance of recession within a year." },
];

export const tripwires = [
  { name: "High-yield spread above 4.50%", value: 3.2, limit: 4.5, format: (v: number) => `${v.toFixed(2)}%` },
  { name: "VIX above 35 with breadth under 30%", value: 28, limit: 35, format: (v: number) => v.toFixed(0) },
  { name: "Sahm rule at 0.50", value: 0.18, limit: 0.5, format: (v: number) => v.toFixed(2) },
];
