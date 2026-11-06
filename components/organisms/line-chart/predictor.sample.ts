// Sample data in the shape of Predictor's, for stories and tests only. Seeded, so it never changes.
// Not shipped: package.json leaves *.sample.ts out.

export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

export function tradingDays(from: string, to: string): Date[] {
  const out: Date[] = [];
  for (let d = new Date(`${from}T12:00:00Z`); d <= new Date(`${to}T12:00:00Z`); d = new Date(d.getTime() + 864e5)) {
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) out.push(d);
  }
  return out;
}

const indexOf = (days: Date[], iso: string) => {
  const t = new Date(`${iso}T12:00:00Z`).getTime();
  let best = 0;
  days.forEach((d, i) => {
    if (Math.abs(d.getTime() - t) < Math.abs(days[best].getTime() - t)) best = i;
  });
  return best;
};

/** A portfolio and the S&P 500 over a year, indexed to 100, with a 12-week forecast after today. */
export function predictorYear() {
  const actual = tradingDays("2025-11-06", "2026-11-06");
  const days = [...actual, ...tradingDays("2026-11-09", "2027-01-29")];
  const today = actual.length - 1;
  const rand = seeded(20261106);
  const story: [string, number, number][] = [
    ["2025-11-06", 100, 100], ["2025-12-15", 104, 102], ["2026-01-27", 112, 104.5], ["2026-02-20", 118, 105.5],
    ["2026-03-17", 116, 104], ["2026-04-22", 107.5, 100.5], ["2026-06-10", 119, 105], ["2026-07-30", 127, 109],
    ["2026-09-15", 134, 112], ["2026-10-08", 126, 109.5], ["2026-11-06", 123, 108.1],
  ];
  const points = story.map(([iso, p, b]) => ({ i: indexOf(actual, iso), p, b }));
  const at = (i: number, k: "p" | "b") => {
    for (let s = 0; s < points.length - 1; s++) {
      const [a, z] = [points[s], points[s + 1]];
      if (i >= a.i && i <= z.i) return a[k] + ((z[k] - a[k]) * (i - a.i)) / (z.i - a.i || 1);
    }
    return points[points.length - 1][k];
  };
  let np = 0;
  let nb = 0;
  const port: number[] = [];
  const bench: number[] = [];
  actual.forEach((_, i) => {
    const shock = rand() - 0.5;
    np = 0.88 * np + (0.7 * shock + 0.7 * (rand() - 0.5)) * 0.021;
    nb = 0.88 * nb + shock * 0.0145;
    port.push(i === 0 ? 100 : at(i, "p") * (1 + np));
    bench.push(i === 0 ? 100 : at(i, "b") * (1 + nb));
  });
  const peak = port.indexOf(Math.max(...port));
  const fix = port[peak] * 0.918 - port[today];
  for (let k = 1; k <= 25; k++) port[today - 25 + k] += (fix * k) / 25;
  const last = port[today];
  const median: number[] = [];
  const inner: [number, number][] = [];
  const outer: [number, number][] = [];
  for (let t = 0; t < days.length - today; t++) {
    const m = last * (1 + 0.00042 * t);
    const sd = last * 0.0128 * Math.sqrt(t);
    median.push(m);
    inner.push([m - 0.674 * sd, m + 0.674 * sd]);
    outer.push([m - 1.2816 * sd, m + 1.2816 * sd]);
  }
  const pad = (values: number[]) => [...values, ...Array(days.length - values.length).fill(null)] as (number | null)[];
  const events = [
    ["e1", "2026-01-28", "Rate decision"], ["e2", "2026-03-18", "Rate decision"], ["e3", "2026-05-20", "NVDA earnings"],
    ["e4", "2026-07-29", "Rate decision"], ["e5", "2026-08-26", "NVDA earnings"], ["e6", "2026-09-16", "Rate decision"],
    ["e7", "2026-11-18", "NVDA earnings"], ["e8", "2026-12-09", "Rate decision"], ["e9", "2026-12-10", "Inflation print"], ["e10", "2027-01-27", "Rate decision"],
  ].map(([id, iso, label]) => {
    const i = indexOf(days, iso);
    const after = Math.min(i + 5, today);
    const detail = i <= today ? `Portfolio ${(port[after] / port[i] - 1) * 100 < 0 ? "−" : "+"}${Math.abs((port[after] / port[i] - 1) * 100).toFixed(1)}% over the next five days` : undefined;
    return { id, at: i, label, detail };
  });
  const march = events[1].at;
  let dip = march;
  for (let i = march; i < Math.min(today, march + 35); i++) if (port[i] < port[dip]) dip = i;
  return {
    days,
    today,
    peak,
    dip,
    march,
    port: pad(port),
    bench: pad(bench),
    forecast: { series: "port", start: today, median, inner, outer },
    events,
  };
}
