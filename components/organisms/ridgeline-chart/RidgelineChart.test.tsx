import { act, cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { RidgelineChart, density } from "./RidgelineChart";

afterEach(cleanup);

const sample = (n: number, spread: number, seed = 7) => {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => (r() + r() + r() - 1.5) * spread);
};
const series = ["Dec", "Jan", "Feb", "Mar"].map((name, k) => ({ id: name, name, values: sample(21, k === 3 ? 4 : 1.5, k + 3), highlight: k === 3 }));

describe("density", () => {
  it("integrates to about one, and copes with a single value", () => {
    const xs = Array.from({ length: 401 }, (_, k) => -10 + k * 0.05);
    const d = density(sample(200, 2), xs, 20);
    const area = d.reduce((s, v) => s + v * 0.05, 0);

    expect(area).toBeGreaterThan(0.95);
    expect(area).toBeLessThan(1.05);
    expect(density([3], xs, 20).some((v) => v > 0)).toBe(true);
  });
});

describe("RidgelineChart", () => {
  it("draws a ridge per group, the subject in the accent and the rest in warm grey", () => {
    const { container } = render(<RidgelineChart title="Months" label="Daily returns by month" series={series} />);
    const ridges = [...container.querySelectorAll<SVGGElement>(".mk-ridge")];

    expect(ridges).toHaveLength(4);
    expect(ridges.filter((r) => r.style.color === "var(--mk-color-dataviz-accent)")).toHaveLength(1);
    expect(ridges.filter((r) => r.style.color === "var(--mk-color-dataviz-neutral-3)")).toHaveLength(3);
  });

  it("reads each ridge by keyboard, with its spread", () => {
    render(<RidgelineChart title="Months" label="Daily returns by month" series={[{ id: "a", name: "Dec", values: [1, 2, 3] }]} />);
    const plot = screen.getByRole("group", { name: "Daily returns by month" });

    act(() => plot.focus());
    expect(screen.getByText("Dec. 3 values, median 2, typical spread 1, from 1 to 3.")).toBeTruthy();
  });

  it("copes with a single value and thousands, and passes axe", async () => {
    const { container: one } = render(<RidgelineChart title="One" label="One" series={[{ id: "a", name: "A", values: [2] }]} />);
    expect(one.querySelectorAll(".mk-ridge")).toHaveLength(1);
    cleanup();

    const { container } = render(<RidgelineChart title="Many" label="Many" series={[{ id: "a", name: "A", values: sample(5000, 2) }]} />);
    expect(container.querySelector(".mk-ridge-edge")?.getAttribute("d")).toMatch(/^M/);
    cleanup();

    const { container: c } = render(<RidgelineChart title="Months" label="Months" series={series} />);
    expect((await axe.run(c)).violations).toEqual([]);
  });
});
