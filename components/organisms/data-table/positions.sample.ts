// Sample data in the shape of Predictor's, for stories and tests only. Not shipped: package.json leaves *.sample.ts out.

export type Position = { ticker: string; theme: string; weight: number; target: number; range: [number, number]; today: number; year: number };

export const positions: Position[] = [
  ["NVDA", "AI compute", 9.8, 8, 6, 9, 1.8, 61], ["TSM", "AI compute", 7.1, 7, 5, 9, 0.9, 38], ["VST", "Power", 5.6, 5, 4, 7, 2.4, 72],
  ["CEG", "Power", 5.2, 5, 4, 7, 1.1, 55], ["ETN", "Grid", 4.4, 4, 3, 6, -0.4, 24], ["ASML", "Chips", 3.9, 4, 3, 6, -1.6, -12],
  ["MSFT", "Cloud", 3.6, 4, 3, 6, 0.3, 14], ["GEV", "Grid", 3.1, 3, 2, 5, 1.9, 48], ["CCJ", "Nuclear", 2.4, 3, 2, 5, -2.2, -18],
  ["AVGO", "AI compute", 2.3, 3, 2, 5, 1.2, 44], ["NEE", "Power", 2.1, 3, 2, 5, 0, 9], ["PWR", "Grid", 1.9, 2, 1, 3, 0.7, 29],
  ["MU", "Chips", 1.6, 2, 1, 3, -1.1, -9], ["SMR", "Nuclear", 1.4, 2, 1, 3, 3.6, 81], ["LRCX", "Chips", 1.2, 2, 1.5, 3, -0.9, -6],
  ["EQIX", "Cloud", 1.1, 2, 1, 3, -0.2, 3],
].map(([ticker, theme, weight, target, lo, hi, today, year]) => ({
  ticker: String(ticker),
  theme: String(theme),
  weight: Number(weight),
  target: Number(target),
  range: [Number(lo), Number(hi)] as [number, number],
  today: Number(today),
  year: Number(year),
}));

export type Close = { date: Date; close: number; change: number; volume: number };

/** A thousand trading days of closes, newest first. Seeded, so it never changes. */
export function closes(count = 1000): Close[] {
  let s = 20261106;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const out: Close[] = [];
  let price = 186.4;
  let day = Date.UTC(2026, 10, 6);
  for (let k = 0; k < count; k++) {
    const change = Math.round((rand() - 0.49) * 420) / 100;
    out.push({ date: new Date(day), close: Math.round(price * 100) / 100, change, volume: Math.round(140 + rand() * 260) });
    price = price / (1 + change / 100);
    do day -= 864e5;
    while ([0, 6].includes(new Date(day).getUTCDay()));
  }
  return out;
}
