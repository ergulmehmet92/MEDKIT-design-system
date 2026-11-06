import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Beeswarm, swarm } from "./Beeswarm";

afterEach(cleanup);

const sample = (n: number, shift = 0, seed = 5) => {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => (r() + r() + r() - 1.5) * 8 + shift);
};
const groups = [
  { id: "gauge", name: "Gauge", values: sample(46, 2) },
  { id: "override", name: "Overrides", values: sample(22, -1, 9), highlight: true },
];

describe("swarm", () => {
  it("keeps every dot apart while there's room", () => {
    const { dots, packed, radius } = swarm(Array.from({ length: 40 }, (_, k) => ({ x: 100 + (k % 30), v: k })), 4.5, 40);

    expect(packed).toBe(true);
    for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) expect(Math.hypot(dots[i].x - dots[j].x, dots[i].dy - dots[j].dy)).toBeGreaterThanOrEqual(radius * 2 + 0.99);
  });

  it("shrinks, then overlaps faintly, when there's too much to separate", () => {
    const { packed, dots } = swarm(Array.from({ length: 3000 }, (_, k) => ({ x: k % 50, v: k })), 4.5, 20);

    expect(packed).toBe(false);
    expect(dots).toHaveLength(3000);
  });
});

describe("Beeswarm", () => {
  it("puts the subject group in the accent and the rest in grey, with medians", () => {
    const { container } = render(<Beeswarm title="Calls" label="Every closed call" groups={groups} />);
    const rows = [...container.querySelectorAll<SVGGElement>(".mk-beeswarm-row")];

    expect(rows.map((r) => r.style.color)).toEqual(["var(--mk-color-dataviz-context)", "var(--mk-color-dataviz-accent)"]);
    expect(container.querySelectorAll(".mk-beeswarm-median")).toHaveLength(2);
    expect(container.querySelector(".mk-beeswarm-reference")).toBeTruthy();
  });

  it("reads each group by keyboard, with its median and range", () => {
    render(<Beeswarm title="Calls" label="Every closed call" groups={[{ id: "a", name: "Gauge", values: [1, 2, 3] }]} />);
    const plot = screen.getByRole("group", { name: "Every closed call" });

    act(() => plot.focus());
    expect(screen.getByText("Gauge. 3 values, median 2, from 1 to 3.")).toBeTruthy();
    fireEvent.keyDown(plot, { key: "Escape" });
  });

  it("copes with a single value and with thousands, and passes axe", async () => {
    const { container: one } = render(<Beeswarm title="One" label="One" groups={[{ id: "a", name: "A", values: [4] }]} />);
    expect(one.querySelectorAll(".mk-beeswarm-dot")).toHaveLength(1);
    cleanup();

    const { container } = render(<Beeswarm title="Many" label="Many" groups={[{ id: "a", name: "A", values: sample(3000) }]} />);
    expect(container.querySelectorAll(".mk-beeswarm-dot")).toHaveLength(3000);
    cleanup();

    const { container: c } = render(<Beeswarm title="Calls" label="Calls" groups={groups} />);
    expect((await axe.run(c)).violations).toEqual([]);
  });
});
