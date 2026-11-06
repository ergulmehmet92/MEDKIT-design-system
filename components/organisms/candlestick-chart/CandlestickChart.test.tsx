import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { tradingDays } from "../line-chart/predictor.sample";
import { CandlestickChart } from "./CandlestickChart";
import type { Candle } from "./CandlestickChart";

afterEach(cleanup);

const days = tradingDays("2026-10-01", "2026-10-30");
const data: Candle[] = days.map((x, i) => {
  const open = 100 + i;
  const close = i % 3 === 0 ? open - 2 : open + 2;
  return { x, open, close, high: Math.max(open, close) + 1, low: Math.min(open, close) - 1, volume: 1_000_000 + i * 10_000 };
});

describe("CandlestickChart", () => {
  it("draws rising days hollow and falling days filled", () => {
    const { container } = render(<CandlestickChart title="Prices" label="Daily prices" data={data} />);

    const directions = [...container.querySelectorAll(".mk-candle")].map((g) => g.getAttribute("data-direction"));
    expect(directions.filter((d) => d === "fall")).toHaveLength(Math.ceil(days.length / 3));
    expect(directions.filter((d) => d === "rise").length).toBeGreaterThan(0);
  });

  it("reads the day's prices and its move by keyboard", () => {
    render(<CandlestickChart title="Prices" label="Daily prices" data={data} />);
    const plot = screen.getByRole("group", { name: "Daily prices" });

    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "Home" });
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(screen.getByText(/^Fri 2 Oct 2026\. Open 101\.0, high 104\.0, low 100\.0, close 103\.0, up 5\.1% on the day, volume 1M\.$/)).toBeTruthy();
  });

  it("puts volume in its own panel, not on the price axis", () => {
    const { container } = render(<CandlestickChart title="Prices" label="Daily prices" data={data} />);

    expect(container.querySelectorAll(".mk-candle-volume rect")).toHaveLength(days.length);
    expect(container.querySelector(".mk-candle-volume-axis text")?.textContent).toMatch(/^Volume/);
  });

  it("leaves gaps on days without trading, and says so", () => {
    const gapped = data.map((c, i) => (i === 4 ? { ...c, open: null, high: null, low: null, close: null } : c));
    const { container } = render(<CandlestickChart title="Prices" label="Daily prices" data={gapped} />);
    const plot = screen.getByRole("group");

    expect(container.querySelectorAll(".mk-candle")).toHaveLength(days.length - 1);
    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "Home" });
    for (let k = 0; k < 4; k++) fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(screen.getByText(/No trading\.$/)).toBeTruthy();
  });

  it("thins to bars, then to a closing line, as days crowd", () => {
    const long = tradingDays("2021-01-04", "2026-10-30").map((x, i) => ({ x, open: 100 + i, close: 101 + i, high: 102 + i, low: 99 + i }));
    const { container } = render(<CandlestickChart title="Prices" label="Daily prices" data={long} />);

    expect(container.querySelector(".mk-candle")).toBeNull();
    expect(container.querySelector(".mk-chart-line")).toBeTruthy();
  });

  it("rolls long spans up into months in the table", () => {
    const year = tradingDays("2025-11-03", "2026-10-30").map((x, i) => ({ x, open: 100 + i, close: 101 + i, high: 102 + i, low: 99 + i }));
    render(<CandlestickChart title="Prices" label="Daily prices" data={year} />);
    fireEvent.click(screen.getByRole("button", { name: "View as table" }));

    const headers = screen.getAllByRole("rowheader").map((th) => th.textContent);
    expect(headers[0]).toBe("Nov 2025");
    expect(headers).toHaveLength(12);
  });

  it("copes with one day and no data, and passes axe", async () => {
    const { container } = render(<CandlestickChart title="One" label="One day" data={data.slice(0, 1)} />);
    render(<CandlestickChart title="None" label="None" data={data.map((c) => ({ ...c, close: null }))} />);

    expect(container.querySelectorAll(".mk-candle")).toHaveLength(1);
    expect(screen.getByText("No trading data to show yet.")).toBeTruthy();
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
