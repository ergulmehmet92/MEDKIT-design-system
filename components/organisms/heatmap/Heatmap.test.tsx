import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { CalendarHeatmap } from "./CalendarHeatmap";
import { Heatmap } from "./Heatmap";
import { heatColour } from "./scale";

afterEach(cleanup);

const names = ["AI", "Power", "Grid"];
const corr = [
  [1, 0.42, 0.38],
  [0.42, 1, 0.77],
  [0.38, 0.77, 1],
];

describe("heatColour", () => {
  it("gives the centre the neutral middle step, whatever the range", () => {
    expect(heatColour(0, "diverging", -0.2, 1, 0).step).toBe(3);
    expect(heatColour(50, "diverging", 0, 60, 50).step).toBe(3);
    expect(heatColour(1, "diverging", -0.2, 1, 0).step).toBe(6);
  });

  it("steps sequential values from lightest to strongest", () => {
    expect(heatColour(0, "sequential", 0, 10).step).toBe(0);
    expect(heatColour(10, "sequential", 0, 10).step).toBe(4);
  });
});

describe("Heatmap", () => {
  it("draws the lower half only, centred on zero, with every value written in its cell", () => {
    const { container } = render(<Heatmap title="Together" label="Correlation" rows={names} columns={names} values={corr} scale="diverging" palette="accent" domain={[-1, 1]} triangle="lower" />);

    expect(container.querySelectorAll(".mk-heatmap .mk-heat-cell")).toHaveLength(6);
    expect([...container.querySelectorAll(".mk-heat-value")].map((t) => t.textContent)).toEqual(["1.00", "0.42", "1.00", "0.38", "0.77", "1.00"]);
    expect(screen.getByText(/centred on 0/)).toBeTruthy();
  });

  it("reads each cell by keyboard", () => {
    render(<Heatmap title="Together" label="Correlation" rows={names} columns={names} values={corr} scale="diverging" triangle="lower" />);
    const plot = screen.getByRole("group", { name: "Correlation" });

    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(screen.getByText("Power, AI. 0.42.")).toBeTruthy();
  });

  it("leaves missing cells hairline grey, and passes axe", async () => {
    const { container } = render(<Heatmap title="T" label="T" rows={["a", "b"]} columns={["x", "y"]} values={[[1, null], [2, 3]]} />);

    expect(container.querySelectorAll(".mk-heatmap .mk-heat-cell[data-empty]")).toHaveLength(1);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});

describe("CalendarHeatmap", () => {
  const days = Array.from({ length: 60 }, (_, k) => ({ date: new Date(Date.UTC(2026, 0, 5) + k * 864e5), value: k % 7 === 6 ? 0 : (k % 5) + 1 }));

  it("lays days out by week, Monday at the top, with empty days in grey", () => {
    const { container } = render(<CalendarHeatmap title="Commits" label="Commits per day" days={days} unit={["commit", "commits"]} />);
    const cells = [...container.querySelectorAll(".mk-heatmap .mk-heat-cell")];

    expect(cells).toHaveLength(60);
    expect(cells[0].getAttribute("y")).toBe(cells[7].getAttribute("y"));
    expect(container.querySelectorAll(".mk-heatmap .mk-heat-cell[data-empty]").length).toBeGreaterThanOrEqual(8);
  });

  it("reads each day by keyboard, from the latest, and sums months in the table", () => {
    render(<CalendarHeatmap title="Commits" label="Commits per day" days={days} unit={["commit", "commits"]} />);
    const plot = screen.getByRole("group", { name: "Commits per day" });

    act(() => plot.focus());
    expect(screen.getByText("Thu 5 Mar 2026. 5 commits.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "View as table" }));
    expect(screen.getAllByRole("rowheader").map((r) => r.textContent)).toEqual(["Jan 2026", "Feb 2026", "Mar 2026"]);
  });
});
