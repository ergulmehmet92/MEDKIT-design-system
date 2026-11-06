import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { tradingDays } from "../line-chart/predictor.sample";
import { AreaChart } from "./AreaChart";

afterEach(cleanup);

const days = tradingDays("2026-01-02", "2026-06-30");
const layers = [
  { id: "a", name: "AI compute", values: days.map(() => 22) },
  { id: "b", name: "Power", values: days.map(() => 13) },
  { id: "c", name: "Grid", values: days.map((_, i) => (i === 5 ? null : 10)) },
];

describe("AreaChart", () => {
  it("stacks layers as tints with a full-colour edge, and names each where it ends", () => {
    const { container } = render(<AreaChart title="Exposure" label="Exposure by theme" x={days} series={layers} />);

    expect(container.querySelectorAll(".mk-area-edge")).toHaveLength(3);
    const fill = (container.querySelector(".mk-area-layer path") as SVGPathElement).style.fill;
    expect(fill).toContain("--mk-dataviz-tint");
    expect([...container.querySelectorAll(".mk-area-labels text")].map((t) => t.textContent)).toEqual(["22 AI compute", "13 Power", "10 Grid"]);
  });

  it("reads every layer and the total by keyboard, top layer first", () => {
    render(<AreaChart title="Exposure" label="Exposure by theme" x={days} series={layers} totalLabel="Invested" />);
    const plot = screen.getByRole("group", { name: "Exposure by theme" });

    act(() => plot.focus());
    expect(screen.getByText(/Grid 10, Power 13, AI compute 22\. Invested 45\.$/)).toBeTruthy();
  });

  it("counts a missing value as zero", () => {
    render(<AreaChart title="Exposure" label="Exposure by theme" x={days} series={layers} />);
    const plot = screen.getByRole("group");

    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "Home" });
    for (let k = 0; k < 5; k++) fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(screen.getByText(/Grid 0, Power 13, AI compute 22/)).toBeTruthy();
  });

  it("shows shares in percent layout, with no total", () => {
    render(<AreaChart title="Shares" label="Shares" x={days} series={layers.slice(0, 2)} layout="percent" />);
    const plot = screen.getByRole("group");

    act(() => plot.focus());
    expect(screen.getByText(/Power 37%, AI compute 63%\.$/)).toBeTruthy();
  });

  it("folds layers past the eighth slot into Other", () => {
    const many = Array.from({ length: 11 }, (_, k) => ({ id: `s${k}`, name: `Sector ${k + 1}`, values: days.map(() => k + 1) }));
    const { container } = render(<AreaChart title="Sectors" label="Sectors" x={days} series={many} />);

    expect(container.querySelectorAll(".mk-area-edge")).toHaveLength(8);
    expect(screen.getAllByText("Other, 4 series").length).toBeGreaterThan(0);
  });

  it("stacks losses below zero, with a zero line", () => {
    const signed = [
      { id: "up", name: "Up", values: days.map(() => 2) },
      { id: "down", name: "Down", values: days.map(() => -3) },
    ];
    const { container } = render(<AreaChart title="Net" label="Net" x={days} series={signed} />);

    expect(container.querySelector(".mk-chart-grid [data-reference]")).toBeTruthy();
  });

  it("draws streams without a value axis", () => {
    const { container } = render(<AreaChart title="Stream" label="Stream" x={days} series={layers} layout="stream" />);

    expect(container.querySelector(".mk-chart-grid")).toBeNull();
    expect(container.querySelectorAll(".mk-area-edge")).toHaveLength(3);
  });

  it("copes with one point and with no data", () => {
    const { container } = render(<AreaChart title="One" label="One" x={[days[0]]} series={layers.map((l) => ({ ...l, values: [5] }))} />);
    render(<AreaChart title="None" label="None" x={days} series={layers.map((l) => ({ ...l, values: days.map(() => null) }))} />);

    expect(container.querySelectorAll("rect.mk-area-layer")).toHaveLength(3);
    expect(screen.getByText("No data to show yet.")).toBeTruthy();
  });

  it("passes axe", async () => {
    const { container } = render(<AreaChart title="Exposure" label="Exposure by theme" x={days} series={layers} />);

    expect((await axe.run(container)).violations).toEqual([]);
  });
});
