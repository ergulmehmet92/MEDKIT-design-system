import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { ScatterChart } from "./ScatterChart";

afterEach(cleanup);

const groups = [
  { id: "ai", name: "AI compute", highlight: true },
  { id: "power", name: "Power" },
  { id: "grid", name: "Grid" },
  { id: "cloud", name: "Cloud" },
];
const points = [
  { id: "nvda", name: "NVDA", x: 52, y: 61, size: 9.8, group: "ai" },
  { id: "vst", name: "VST", x: 58, y: 72, size: 5.6, group: "power" },
  { id: "etn", name: "ETN", x: 31, y: 24, size: 4.4, group: "grid" },
  { id: "msft", name: "MSFT", x: 24, y: 14, size: 3.6, group: "cloud" },
  { id: "ccj", name: "CCJ", x: 55, y: -18, size: 2.4, group: "grid" },
];
const chart = <ScatterChart title="Risk" label="Return against risk" points={points} groups={groups} xLabel="Volatility" yLabel="Return" sizeLabel="Weight" />;
const fills = (root: Element) => [...root.querySelectorAll<SVGCircleElement>(".mk-scatter-dot")].map((c) => c.style.fill);

describe("ScatterChart", () => {
  it("uses three colours at most: the subject in the accent, the next in the lead, the rest in grey", () => {
    const { container } = render(chart);

    expect(new Set(fills(container))).toEqual(new Set(["var(--mk-color-dataviz-accent)", "var(--mk-color-dataviz-lead)", "var(--mk-color-dataviz-context)"]));
    expect(screen.getAllByText("Other").length).toBeGreaterThan(0);
  });

  it("sizes bubbles by area and draws the biggest first", () => {
    const { container } = render(chart);
    const radii = [...container.querySelectorAll(".mk-scatter-dot")].map((c) => Number(c.getAttribute("r")));

    expect(radii[0]).toBe(Math.max(...radii));
    expect(radii.at(-1)).toBe(Math.min(...radii));
  });

  it("names the highest, the lowest and the largest, and draws zero when values cross it", () => {
    const { container } = render(chart);

    expect([...container.querySelectorAll(".mk-scatter-name")].map((t) => t.textContent).sort()).toEqual(["CCJ", "NVDA", "VST"]);
    expect(container.querySelector(".mk-chart-grid [data-reference]")).toBeTruthy();
  });

  it("reads every point by keyboard, in order of x", () => {
    render(chart);
    const plot = screen.getByRole("group", { name: "Return against risk" });

    act(() => plot.focus());
    expect(screen.getByText("MSFT, Cloud. Volatility 24.0, Return 14.0, Weight 3.6.")).toBeTruthy();
    fireEvent.keyDown(plot, { key: "End" });
    expect(screen.getByText(/^VST, Power\./)).toBeTruthy();
  });

  it("copes with one point and passes axe", async () => {
    const { container } = render(<ScatterChart title="One" label="One" points={[points[0]]} xLabel="x" yLabel="y" />);
    expect(container.querySelectorAll(".mk-scatter-dot")).toHaveLength(1);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
