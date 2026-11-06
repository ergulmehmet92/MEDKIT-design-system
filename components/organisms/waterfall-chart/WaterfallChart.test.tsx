import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { WaterfallChart } from "./WaterfallChart";

afterEach(cleanup);

const steps = [
  { id: "ai", name: "AI", value: 2.1 },
  { id: "power", name: "Power", value: 1.6 },
  { id: "chips", name: "Chips", value: -1.9 },
];
const chart = <WaterfallChart title="Month" label="How the month built up" steps={steps} />;
const fills = (root: Element) => [...root.querySelectorAll<SVGPathElement>(".mk-waterfall-bar")].map((p) => p.style.fill);

describe("WaterfallChart", () => {
  it("floats each step in green or red and stands the total in the lead", () => {
    const { container } = render(chart);

    expect(fills(container)).toEqual(["var(--mk-color-dataviz-up)", "var(--mk-color-dataviz-up)", "var(--mk-color-dataviz-down)", "var(--mk-color-dataviz-lead)"]);
    expect([...container.querySelectorAll("text.mk-chart-value")].map((t) => t.textContent)).toEqual(["+2.1", "+1.6", "−1.9", "1.8"]);
  });

  it("joins each step to the next with a hairline at its running level", () => {
    const { container } = render(chart);

    expect(container.querySelectorAll(".mk-waterfall-link")).toHaveLength(3);
  });

  it("starts from a given value, and handles a negative total", () => {
    const { container } = render(<WaterfallChart title="T" label="T" start={{ name: "October", value: 2 }} steps={[{ id: "a", name: "Loss", value: -5 }]} totalLabel="November" />);

    expect(fills(container)).toEqual(["var(--mk-color-dataviz-lead)", "var(--mk-color-dataviz-down)", "var(--mk-color-dataviz-lead)"]);
    expect([...container.querySelectorAll("text.mk-chart-value")].at(-1)?.textContent).toBe("−3");
  });

  it("reads each step and its running total by keyboard", () => {
    render(chart);
    const plot = screen.getByRole("group", { name: "How the month built up" });

    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(screen.getByText("Power. +1.6, running total 3.7.")).toBeTruthy();
  });

  it("passes axe", async () => {
    const { container } = render(chart);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
