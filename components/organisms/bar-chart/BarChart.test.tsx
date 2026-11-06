import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { BarChart } from "./BarChart";

afterEach(cleanup);

const themes = ["AI compute", "Power", "Grid", "Chip equipment"];
const grouped = (
  <BarChart
    title="Return by theme"
    label="Return by theme"
    categories={themes}
    series={[
      { id: "now", name: "This quarter", values: [8.4, 11.2, 5.1, -4.3] },
      { id: "before", name: "Last quarter", values: [12.1, 6.3, 3.8, 2.2], context: true },
    ]}
  />
);
const fills = (root: Element) => [...root.querySelectorAll<SVGPathElement>(".mk-bar")].map((p) => p.style.fill);

describe("BarChart", () => {
  it("draws the story in the lead and the comparison in grey, from zero", () => {
    const { container } = render(grouped);

    expect(fills(container).filter((f) => f === "var(--mk-color-dataviz-lead)")).toHaveLength(4);
    expect(fills(container).filter((f) => f === "var(--mk-color-dataviz-context)")).toHaveLength(4);
    expect(container.querySelector(".mk-chart-grid [data-reference]")).toBeTruthy();
  });

  it("rounds the data end, squares the baseline, and keeps bars 24px or thinner", () => {
    const { container } = render(grouped);

    for (const p of container.querySelectorAll(".mk-bar")) {
      const d = p.getAttribute("d")!;
      expect(d).toContain("Q");
      const xs = [...d.matchAll(/[MHL]\s?(-?[\d.]+)/g)].map((m) => Number(m[1]));
      expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(24.01);
    }
  });

  it("reads each category by keyboard, with every series", () => {
    render(grouped);
    const plot = screen.getByRole("group", { name: "Return by theme" });

    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(screen.getByText("Power. This quarter 11.2, Last quarter 6.3.")).toBeTruthy();
  });

  it("colours diverging bars by sign, sorted largest first, with signed values", () => {
    const { container } = render(<BarChart title="Moves" label="Moves" layout="diverging" categories={["A", "B", "C"]} series={[{ id: "c", name: "Contribution", values: [-0.4, 1.4, 0.2] }]} />);

    expect(fills(container)).toEqual(["var(--mk-color-dataviz-up)", "var(--mk-color-dataviz-up)", "var(--mk-color-dataviz-down)"]);
    expect([...container.querySelectorAll(".mk-bar-category")].map((t) => t.textContent)).toEqual(["B", "C", "A"]);
    expect([...container.querySelectorAll("text.mk-chart-value")].map((t) => t.textContent)).toEqual(["+1.4", "+0.2", "−0.4"]);
  });

  it("stacks parts in warm greys with the subject in the accent, and totals the ends", () => {
    const { container } = render(
      <BarChart
        title="Trades"
        label="Trades"
        layout="stacked"
        categories={["Jan", "Feb", "Mar"]}
        series={[
          { id: "buy", name: "Buy", values: [9, 12, 8] },
          { id: "trim", name: "Trim", values: [3, 2, 4] },
          { id: "rebalance", name: "Rebalance", values: [0, 4, 0], highlight: true },
        ]}
      />,
    );

    expect(new Set(fills(container))).toEqual(new Set(["var(--mk-color-dataviz-neutral-1)", "var(--mk-color-dataviz-neutral-2)", "var(--mk-color-dataviz-accent)"]));
    expect([...container.querySelectorAll("text.mk-chart-value")].map((t) => t.textContent)).toEqual(["18", "12"]);
  });

  it("stacks negatives below zero, so a negative total reads", () => {
    const { container } = render(
      <BarChart title="Net" label="Net" layout="stacked" values="all" categories={["Jan"]} series={[{ id: "a", name: "A", values: [1] }, { id: "b", name: "B", values: [-3] }]} />,
    );

    expect(container.querySelector("text.mk-chart-value")?.textContent).toBe("−2");
  });

  it("draws no bar for zero, wraps long names, and ends what won't fit in an ellipsis", () => {
    const { container } = render(
      <BarChart title="Spend" label="Spend" categories={["Semiconductor manufacturing equipment makers worldwide", "Grid"]} series={[{ id: "s", name: "Spend", values: [42, 0] }]} />,
    );

    expect(container.querySelectorAll(".mk-bar")).toHaveLength(1);
    const lines = [...container.querySelectorAll(".mk-bar-category")[0].querySelectorAll("tspan")].map((t) => t.textContent);
    expect(lines.length).toBeLessThanOrEqual(2);
  });

  it("shows a message with no data, and passes axe", async () => {
    render(<BarChart title="None" label="None" categories={["A"]} series={[{ id: "a", name: "A", values: [null] }]} />);
    expect(screen.getByText("No data to show yet.")).toBeTruthy();
    cleanup();

    const { container } = render(grouped);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
