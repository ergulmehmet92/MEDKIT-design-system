import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { SlopeChart } from "./SlopeChart";

afterEach(cleanup);

const items = [
  { id: "ai", name: "AI compute", from: 21, to: 22 },
  { id: "power", name: "Power", from: 9, to: 13 },
  { id: "nuclear", name: "Nuclear", from: 3, to: 6, highlight: true },
];
const chart = <SlopeChart title="Weights" label="Weight by theme" items={items} fromLabel="Jan 2026" toLabel="Now" format={(v) => `${v}%`} />;

describe("SlopeChart", () => {
  it("puts the highlight in the accent, on top, and the rest in grey", () => {
    const { container } = render(chart);
    const lines = [...container.querySelectorAll<SVGGElement>(".mk-slope-item")];

    expect(lines.at(-1)?.hasAttribute("data-highlight")).toBe(true);
    expect(lines.at(-1)?.style.color).toBe("var(--mk-color-dataviz-accent)");
    expect(lines[0].style.color).toBe("var(--mk-color-dataviz-context)");
  });

  it("names each item at both ends, with its value", () => {
    const { container } = render(chart);
    const names = [...container.querySelectorAll(".mk-slope-name")].map((t) => t.textContent);

    expect(names).toContain("AI compute 21%");
    expect(names).toContain("6% Nuclear");
  });

  it("reads each item by keyboard, from the top, with its change", () => {
    render(chart);
    const plot = screen.getByRole("group", { name: "Weight by theme" });

    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "ArrowDown" });
    expect(screen.getByText("Power. Jan 2026 9%, Now 13%, a change of +4.")).toBeTruthy();
  });

  it("draws a dot without a line when one end is missing, and wears the lead with no highlight", () => {
    const { container } = render(<SlopeChart title="T" label="T" fromLabel="A" toLabel="B" items={[{ id: "a", name: "A", from: 1, to: null }, { id: "b", name: "B", from: 2, to: 3 }]} />);

    expect(container.querySelectorAll(".mk-slope-item line")).toHaveLength(1);
    expect(container.querySelector<SVGGElement>(".mk-slope-item")?.style.color).toBe("var(--mk-color-dataviz-lead)");
  });

  it("passes axe", async () => {
    const { container } = render(chart);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
