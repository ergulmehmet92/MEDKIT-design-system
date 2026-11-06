// Formats and ticks shared by every chart, so numbers and dates read the same everywhere.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MINUS = "−";

const withMinus = (text: string) => text.replace(/^-/, MINUS);

/** Decimals that tell neighbouring ticks apart at this step. */
export function decimalsFor(step: number): number {
  if (!Number.isFinite(step) || step <= 0) return 0;
  return Math.max(0, Math.min(6, -Math.floor(Math.log10(step) + 1e-9)));
}

/**
 * A number for a chart: full under ten thousand, compact above (12.9K, 4.2M), and always a true
 * minus sign. `digits` sets decimals below ten thousand.
 */
export function formatValue(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "";
  if (Math.abs(value) >= 10000) {
    return withMinus(new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value));
  }
  return withMinus(new Intl.NumberFormat("en", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value));
}

/** Tick labels for one axis: one style per axis, with only the decimals the step needs. */
export function tickFormatter(ticks: number[]): (value: number) => string {
  const step = ticks.length > 1 ? Math.abs(ticks[1] - ticks[0]) : 1;
  const compact = ticks.some((t) => Math.abs(t) >= 10000);
  const digits = decimalsFor(step);
  return (value) =>
    compact
      ? withMinus(new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value))
      : withMinus(new Intl.NumberFormat("en", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value));
}

/** "Thu 12 Mar 2026", for tooltips and the readout. */
export function formatDay(date: Date): string {
  return `${DAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** "Mar 2026", for table rows. */
export function formatMonth(date: Date): string {
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export type Tick = { index: number; label: string };

/**
 * Calendar ticks over a run of dates, at the first point of each period. The period grows with the
 * span: days, weeks, months, then years. AxisX thins them further if they crowd.
 */
export function calendarTicks(dates: Date[], from: number, to: number): Tick[] {
  const start = Math.max(0, Math.ceil(from));
  const end = Math.min(dates.length - 1, Math.floor(to));
  if (end < start) return [];
  const span = (dates[end].getTime() - dates[start].getTime()) / 864e5;
  const key =
    span > 365 * 3
      ? (d: Date) => d.getUTCFullYear()
      : span > 60
        ? (d: Date) => d.getUTCFullYear() * 12 + d.getUTCMonth()
        : span > 20
          ? (d: Date) => Math.floor((d.getTime() / 864e5 + 3) / 7)
          : (d: Date) => Math.floor(d.getTime() / 864e5);
  const label =
    span > 365 * 3
      ? (d: Date) => String(d.getUTCFullYear())
      : span > 60
        ? (d: Date) => (d.getUTCMonth() === 0 ? `${MONTHS[0]} ${String(d.getUTCFullYear()).slice(2)}` : MONTHS[d.getUTCMonth()])
        : (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
  const ticks: Tick[] = [];
  for (let i = start; i <= end; i++) {
    if (i === 0 || key(dates[i]) !== key(dates[i - 1])) ticks.push({ index: i, label: label(dates[i]) });
  }
  return ticks.filter((t) => t.index > start || t.index === 0);
}

/** Ticks over plain numbers on the x axis, such as years, at evenly spaced points. */
export function numberTicks(values: number[], from: number, to: number, count: number): Tick[] {
  const start = Math.max(0, Math.ceil(from));
  const end = Math.min(values.length - 1, Math.floor(to));
  if (end < start) return [];
  const every = Math.max(1, Math.ceil((end - start + 1) / count));
  const out: Tick[] = [];
  for (let i = start; i <= end; i += every) out.push({ index: i, label: String(values[i]) });
  return out;
}

/** Last index of each calendar month inside the range, plus the range's end. Used for default tables. */
export function monthEnds(dates: Date[], from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = Math.max(0, from); i <= Math.min(dates.length - 1, to); i++) {
    const next = dates[i + 1];
    if (i === to || !next || next.getUTCMonth() !== dates[i].getUTCMonth()) out.push(i);
  }
  return out;
}
