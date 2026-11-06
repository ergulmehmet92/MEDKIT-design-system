import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Sparkline } from "./Sparkline";

afterEach(cleanup);

describe("Sparkline", () => {
  it("describes its range and latest value in words", () => {
    render(<Sparkline label="Portfolio, last 3 months" values={[110.2, 118, 104.5, 122.9]} />);

    expect(screen.getByRole("img", { name: "Portfolio, last 3 months: from 110.2 to 122.9, low 104.5, high 122.9" })).toBeTruthy();
  });

  it("marks now in the accent, and the trend in muted ink unless it's the story", () => {
    const { container, rerender } = render(<Sparkline label="Trend" values={[1, 2, 3]} />);

    expect(container.querySelector(".mk-sparkline")?.getAttribute("data-tone")).toBe("context");
    expect(container.querySelector(".mk-sparkline-now")).toBeTruthy();
    rerender(<Sparkline label="Trend" values={[1, 2, 3]} tone="story" />);
    expect(container.querySelector(".mk-sparkline")?.getAttribute("data-tone")).toBe("story");
  });

  it("breaks at gaps, dots lone points, and ends on the last real value", () => {
    const { container } = render(<Sparkline label="Gaps" values={[1, 2, null, 4, null, 6, 7, null]} />);

    expect(container.querySelector(".mk-sparkline-line")!.getAttribute("d")!.match(/M/g)).toHaveLength(3);
    expect(container.querySelectorAll(".mk-sparkline-point")).toHaveLength(1);
    expect(screen.getByRole("img").getAttribute("aria-label")).toMatch(/to 7\.0/);
  });

  it("draws a zero line when values cross zero", () => {
    const { container } = render(<Sparkline label="Excess" values={[-2, 1, -1, 3]} />);

    expect(container.querySelector(".mk-sparkline-reference")).toBeTruthy();
  });

  it("copes with one value, huge values and no data", () => {
    render(<Sparkline label="One" values={[42]} />);
    render(<Sparkline label="Huge" values={[1e3, 1e9]} />);
    render(<Sparkline label="None" values={[null, null]} />);

    expect(screen.getByRole("img", { name: "One: 42.0" })).toBeTruthy();
    expect(screen.getByRole("img", { name: /from 1,000\.0 to 1B/ })).toBeTruthy();
    expect(screen.getByRole("img", { name: "None: no data yet" })).toBeTruthy();
  });

  it("passes axe", async () => {
    const { container } = render(<Sparkline label="Trend" values={[1, 3, 2]} />);

    expect((await axe.run(container)).violations).toEqual([]);
  });
});
