import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { DonutChart } from "./DonutChart";

afterEach(cleanup);

const parts = [
  { id: "ai", name: "AI compute", value: 22, highlight: true },
  { id: "power", name: "Power", value: 13 },
  { id: "grid", name: "Grid", value: 10 },
  { id: "cash", name: "Cash", value: 36 },
];
const chart = <DonutChart title="Holdings" label="Where the money sits" parts={parts} centre={{ value: "64%", label: "invested" }} />;
const fills = (root: Element) => [...root.querySelectorAll<SVGPathElement>(".mk-donut-slice")].map((p) => p.style.fill);

describe("DonutChart", () => {
  it("puts the subject in the accent and the rest in warm greys, largest strongest", () => {
    const { container } = render(chart);

    expect(fills(container)).toEqual(["var(--mk-color-dataviz-neutral-1)", "var(--mk-color-dataviz-accent)", "var(--mk-color-dataviz-neutral-2)", "var(--mk-color-dataviz-neutral-3)"]);
  });

  it("folds parts past the fifth into Other, keeping the highlight", () => {
    const many = Array.from({ length: 8 }, (_, k) => ({ id: `p${k}`, name: `Part ${k + 1}`, value: 20 - k * 2, highlight: k === 7 }));
    const { container } = render(<DonutChart title="T" label="T" parts={many} />);

    expect(container.querySelectorAll(".mk-donut-slice")).toHaveLength(5);
    expect(screen.getAllByText(/Other, 4 parts/).length).toBeGreaterThan(0);
    expect(fills(container)).toContain("var(--mk-color-dataviz-accent)");
  });

  it("names every part outside with a leader, tiny ones included", () => {
    const { container } = render(<DonutChart title="T" label="T" parts={[...parts, { id: "tiny", name: "Tiny", value: 0.5 }]} />);

    expect(container.querySelectorAll(".mk-donut-leader")).toHaveLength(5);
    const tiny = [...container.querySelectorAll(".mk-donut-label text")].map((t) => t.textContent).find((t) => t?.includes("Tiny"));
    expect(tiny).toMatch(/<1%/);
  });

  it("reads each part by keyboard, with its share", () => {
    render(chart);
    const plot = screen.getByRole("group", { name: "Where the money sits" });

    act(() => plot.focus());
    expect(screen.getByText("Cash. 36, 44% of the whole.")).toBeTruthy();
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(screen.getByText("AI compute. 22, 27% of the whole.")).toBeTruthy();
  });

  it("shows the centre figure, skips zero parts, and passes axe", async () => {
    const { container } = render(<DonutChart title="T" label="T" parts={[...parts, { id: "zero", name: "Zero", value: 0 }]} centre={{ value: "64%", label: "invested" }} />);

    expect(container.querySelector(".mk-donut-figure")?.textContent).toBe("64%");
    expect(container.querySelectorAll(".mk-donut-slice")).toHaveLength(4);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
