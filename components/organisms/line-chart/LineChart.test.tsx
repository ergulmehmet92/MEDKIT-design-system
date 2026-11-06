import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { LineChart } from "./LineChart";
import { predictorYear, tradingDays } from "./predictor.sample";

afterEach(cleanup);

const year = predictorYear();
const days = tradingDays("2026-01-02", "2026-03-31");

function Hero() {
  return (
    <LineChart
      title="The portfolio sits below its peak"
      label="Portfolio and S&P 500, indexed to 100"
      x={year.days}
      series={[
        { id: "port", name: "Portfolio", values: year.port },
        { id: "bench", name: "S&P 500", values: year.bench, context: true },
      ]}
      forecast={year.forecast}
      today={year.today}
      reference={{ value: 100, label: "100 START" }}
      ranges={[{ id: "dd", from: year.peak, to: year.today, label: "Drawdown" }]}
      measures={[{ series: "port", from: year.peak, to: year.today, fromLabel: "Peak" }]}
      events={year.events}
    />
  );
}

describe("LineChart", () => {
  it("names every series in the legend, with the benchmark in ink", () => {
    const { container } = render(<Hero />);

    const legend = container.querySelector(".mk-chart-legend")!;
    expect(within(legend as HTMLElement).getByText("Portfolio")).toBeTruthy();
    expect(within(legend as HTMLElement).getByText("S&P 500")).toBeTruthy();
    expect(container.querySelectorAll('.mk-chart-line[data-context]')).toHaveLength(1);
    expect(container.querySelectorAll(".mk-chart-line[data-forecast]")).toHaveLength(1);
  });

  it("measures the drawdown, and labels the series where they end", () => {
    const { container } = render(<Hero />);

    expect(container.querySelector(".mk-chart-bracket text")?.textContent).toBe("−8.2%");
    expect([...container.querySelectorAll(".mk-chart-end text")].map((t) => t.textContent?.split(" ")[0])).toEqual(["Portfolio", "S&P"]);
  });

  it("reads today first by keyboard, then the forecast with its range", () => {
    render(<Hero />);
    const plot = screen.getByRole("group", { name: "Portfolio and S&P 500, indexed to 100" });

    act(() => plot.focus());
    expect(screen.getByText(/^Fri 6 Nov 2026\. Portfolio 1\d\d\.\d, S&P 500 1\d\d\.\d\.$/)).toBeTruthy();

    fireEvent.keyDown(plot, { key: "End" });
    expect(screen.getByText(/forecast median [\d.]+, 80% range [\d.]+ to [\d.]+/)).toBeTruthy();
  });

  it("carries a table of month ends, today and the forecast", () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole("button", { name: "View as table" }));

    const headers = screen.getAllByRole("rowheader").map((th) => th.textContent);
    expect(headers[0]).toBe("Nov 2025");
    expect(headers).toContain("Nov 2026, today");
    expect(headers.filter((h) => h?.endsWith("forecast"))).toHaveLength(3);
  });

  it("gives eight series a slot each, and folds the rest into Other", () => {
    const series = Array.from({ length: 11 }, (_, k) => ({ id: `s${k}`, name: `Theme ${k + 1}`, values: days.map((_, i) => 100 + k + i / 10) }));
    const { container } = render(<LineChart title="Themes" label="Themes" x={days} series={series} />);

    expect(container.querySelectorAll(".mk-chart-line[data-other]")).toHaveLength(3);
    expect(screen.getByText("Other, 3 series")).toBeTruthy();
    expect([...container.querySelectorAll(".mk-chart-legend path")].length).toBeGreaterThanOrEqual(8);
  });

  it("breaks the line at gaps and puts a dot on a lone point", () => {
    const values = days.map((_, i) => (i === 10 || i === 12 ? null : i));
    const { container } = render(<LineChart title="Gaps" label="Gaps" x={days} series={[{ id: "a", name: "A", values }]} />);

    const d = container.querySelector(".mk-chart-line")!.getAttribute("d")!;
    expect(d.match(/M/g)!.length).toBe(3);
    expect(container.querySelectorAll(".mk-chart-svg circle.mk-chart-dot").length).toBeGreaterThanOrEqual(1);
  });

  it("draws a zero line when values cross zero", () => {
    const { container } = render(<LineChart title="Excess" label="Excess" x={days} series={[{ id: "a", name: "A", values: days.map((_, i) => i - 20) }]} />);

    expect(container.querySelector(".mk-chart-grid [data-reference]")).toBeTruthy();
  });

  it("copes with one point, a log scale and no data", () => {
    render(<LineChart title="One" label="One" x={[days[0]]} series={[{ id: "a", name: "A", values: [42] }]} />);
    render(<LineChart title="Log" label="Log" x={[2018, 2022, 2026]} yScale="log" series={[{ id: "a", name: "A", values: [1e8, 5e11, 1e13] }]} />);
    render(<LineChart title="None" label="None" x={days} series={[{ id: "a", name: "A", values: days.map(() => null) }]} />);

    expect(screen.getByText("No data to show yet.")).toBeTruthy();
    expect(screen.getAllByText(/^(100M|1T|10T|1B|10B|100B)$/i).length).toBeGreaterThan(0);
  });

  it("passes axe", async () => {
    const { container } = render(<Hero />);

    expect((await axe.run(container)).violations).toEqual([]);
  });
});
