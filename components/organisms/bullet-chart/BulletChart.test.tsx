import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { BulletChart } from "./BulletChart";

afterEach(cleanup);

const items = [
  { id: "nvda", name: "NVDA", value: 9.8, target: 8, range: [6, 9] as [number, number] },
  { id: "tsm", name: "TSM", value: 7.1, target: 7, range: [5, 9] as [number, number] },
  { id: "etn", name: "ETN", value: 2.4, target: 5, range: [3, 7] as [number, number] },
];
const chart = <BulletChart title="Weights" label="Position weights" items={items} format={(v) => `${v}%`} />;

describe("BulletChart", () => {
  it("draws values in the lead, and turns red and says so outside the range", () => {
    const { container } = render(chart);
    const rows = [...container.querySelectorAll(".mk-bullet-row")];

    expect(rows.map((r) => r.getAttribute("data-status"))).toEqual(["over", null, "under"]);
    expect((rows[0].querySelector(".mk-bullet-bar") as SVGPathElement).style.fill).toBe("var(--mk-color-dataviz-down)");
    expect((rows[1].querySelector(".mk-bullet-bar") as SVGPathElement).style.fill).toBe("var(--mk-color-dataviz-lead)");
    expect(rows[0].querySelector("text.mk-chart-value")?.textContent).toBe("9.8% over");
  });

  it("marks each target with a tick and each range with a band", () => {
    const { container } = render(chart);

    expect(container.querySelectorAll(".mk-bullet-target")).toHaveLength(3);
    expect(container.querySelectorAll(".mk-bullet-range")).toHaveLength(3);
  });

  it("reads each row by keyboard, with how far out it is", () => {
    render(chart);
    const plot = screen.getByRole("group", { name: "Position weights" });

    act(() => plot.focus());
    expect(screen.getByText("NVDA. 9.8%, target 8%, allowed 6% to 9%, over by 0.8%.")).toBeTruthy();
    fireEvent.keyDown(plot, { key: "End" });
    expect(screen.getByText("ETN. 2.4%, target 5%, allowed 3% to 7%, under by 0.6%.")).toBeTruthy();
  });

  it("passes axe", async () => {
    const { container } = render(chart);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
