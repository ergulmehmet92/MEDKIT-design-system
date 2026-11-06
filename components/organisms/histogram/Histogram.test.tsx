import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Histogram } from "./Histogram";

afterEach(cleanup);

// Deterministic, roughly bell-shaped sample.
const sample = (n: number, seed = 3) => {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => (r() + r() + r() + r() - 2) * 2);
};
const pct = (v: number) => `${v < 0 ? "−" : ""}${Math.abs(Math.round(v * 10) / 10)}%`;

describe("Histogram", () => {
  it("draws bins in a warm grey, with the bad tail in red and the mean in the accent", () => {
    const values = [...sample(250), -4.6, -4.2];
    const { container } = render(<Histogram title="Days" label="Daily returns" values={values} domain={[-5, 5]} binWidth={0.5} tail={{ below: -4 }} unit={["day", "days"]} format={pct} />);
    const fills = [...container.querySelectorAll<SVGPathElement>(".mk-histogram-bin")].map((p) => p.style.fill);

    expect(fills.filter((f) => f === "var(--mk-color-dataviz-down)").length).toBeGreaterThan(0);
    expect(fills.filter((f) => f === "var(--mk-color-dataviz-neutral-2)").length).toBeGreaterThan(5);
    expect(container.querySelector(".mk-histogram-mean line")).toBeTruthy();
    expect(screen.getByText("2 days below −4%")).toBeTruthy();
  });

  it("folds outliers into the edge bins, which say so", () => {
    render(<Histogram title="T" label="Values" values={[...sample(200), 400, -300]} />);
    fireEvent.click(screen.getByRole("button", { name: "View as table" }));
    const ranges = screen.getAllByRole("rowheader").map((r) => r.textContent);

    expect(ranges[0]).toMatch(/or less$/);
    expect(ranges.at(-1)).toMatch(/or more$/);
  });

  it("copes with a single value and with thousands", () => {
    const { container } = render(<Histogram title="One" label="One" values={[3]} />);
    expect(container.querySelectorAll(".mk-histogram-bin").length).toBeGreaterThan(0);
    cleanup();

    const t0 = performance.now();
    const { container: big } = render(<Histogram title="Many" label="Many" values={sample(20000)} />);
    expect(performance.now() - t0).toBeLessThan(1500);
    expect(big.querySelectorAll(".mk-histogram-bin").length).toBeGreaterThan(10);
  });

  it("reads each bin by keyboard, starting at the mean", () => {
    render(<Histogram title="Days" label="Daily returns" values={[0.1, 0.2, 0.3, 1.2]} binWidth={0.5} domain={[0, 1.5]} unit={["day", "days"]} />);
    const plot = screen.getByRole("group", { name: "Daily returns" });

    act(() => plot.focus());
    expect(screen.getByText("0 to 0.5. 3 days.")).toBeTruthy();
  });

  it("passes axe", async () => {
    const { container } = render(<Histogram title="Days" label="Daily returns" values={sample(100)} />);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
