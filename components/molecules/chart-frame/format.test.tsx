import { describe, expect, it } from "vitest";
import { calendarTicks, decimalsFor, formatDay, formatValue, monthEnds, numberTicks, tickFormatter } from "./format";

const days = (from: string, count: number, step = 1) => Array.from({ length: count }, (_, i) => new Date(new Date(`${from}T12:00:00Z`).getTime() + i * step * 864e5));

describe("formatValue", () => {
  it("writes numbers in full under ten thousand and compact above, with a true minus", () => {
    expect(formatValue(1284.25)).toBe("1,284.3");
    expect(formatValue(12900, 0)).toBe("12.9K");
    expect(formatValue(4_200_000)).toBe("4.2M");
    expect(formatValue(-8.2)).toBe("−8.2");
  });
});

describe("tickFormatter", () => {
  it("uses only the decimals the step needs, in one style per axis", () => {
    expect(tickFormatter([0, 0.5, 1])(0.5)).toBe("0.5");
    expect(tickFormatter([100, 110, 120])(110)).toBe("110");
    expect(tickFormatter([0, 20000, 40000])(20000)).toBe("20K");
    expect(decimalsFor(0.25)).toBe(1);
  });
});

describe("calendarTicks", () => {
  it("marks months over a year, with the year on January", () => {
    const ticks = calendarTicks(days("2025-11-06", 365), 0, 364);
    expect(ticks.map((t) => t.label).slice(0, 4)).toEqual(["Nov", "Dec", "Jan 26", "Feb"]);
  });

  it("marks years over a long span, and days over a short one", () => {
    expect(calendarTicks(days("2018-01-01", 2900), 0, 2899).map((t) => t.label)).toContain("2020");
    expect(calendarTicks(days("2026-03-01", 10), 0, 9)[1].label).toBe("2 Mar");
  });

  it("returns nothing for an empty range, and copes with one point", () => {
    expect(calendarTicks([], 0, 0)).toEqual([]);
    expect(calendarTicks(days("2026-03-01", 1), 0, 0)).toHaveLength(1);
  });
});

describe("numberTicks and monthEnds", () => {
  it("spaces number ticks evenly", () => {
    expect(numberTicks([2019, 2020, 2021, 2022, 2023, 2024], 0, 5, 3).map((t) => t.label)).toEqual(["2019", "2021", "2023"]);
  });

  it("finds each month's last point", () => {
    const run = days("2026-01-29", 6);
    expect(monthEnds(run, 0, 5)).toEqual([2, 5]);
    expect(formatDay(run[0])).toBe("Thu 29 Jan 2026");
  });
});
