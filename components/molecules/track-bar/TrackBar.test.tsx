import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { TrackBar, trackStatus } from "./TrackBar";

afterEach(cleanup);

describe("trackStatus", () => {
  it("says where a value sits against its range or limit, and by how much", () => {
    expect(trackStatus(9.8, [6, 9]).status).toBe("over");
    expect(trackStatus(9.8, [6, 9]).by).toBeCloseTo(0.8);
    expect(trackStatus(1.2, [1.5, 3]).status).toBe("under");
    expect(trackStatus(5.2, [4, 7]).status).toBeNull();
    expect(trackStatus(9, [6, 9]).status).toBeNull();
    expect(trackStatus(6, [6, 9]).status).toBeNull();
    expect(trackStatus(0.52, undefined, 0.5).status).toBe("reached");
  });
});

describe("TrackBar", () => {
  it("is a meter with its reading, target and range in words", () => {
    render(<TrackBar label="CEG" value={5.2} max={10} target={5} range={[4, 7]} format={(v) => `${v}%`} />);
    const meter = screen.getByRole("meter", { name: "CEG" });

    expect(meter.getAttribute("aria-valuenow")).toBe("5.2");
    expect(meter.getAttribute("aria-valuetext")).toBe("5.2%, target 5%, allowed 4% to 7%. In range.");
    expect(meter.querySelector(".mk-track-bar-range")).toBeTruthy();
    expect(meter.querySelectorAll(".mk-track-bar-tick")).toHaveLength(1);
  });

  it("turns red out of range, and says by how much in words and on screen", () => {
    const { container } = render(<TrackBar label="NVDA" value={9.8} max={10} target={8} range={[6, 9]} />);

    expect(container.querySelector(".mk-track-bar")?.getAttribute("data-status")).toBe("over");
    expect(container.querySelector(".mk-track-bar-readout")?.textContent).toBe("over by 0.8");
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toMatch(/Over by 0\.8\.$/);
  });

  it("fits on one line in a table cell, with its label hidden and a short readout", () => {
    const { container } = render(<TrackBar label="LRCX against its range" value={1.2} max={10} target={2} range={[1.5, 3]} size="compact" />);

    expect(container.querySelector(".mk-track-bar-label")?.hasAttribute("data-hidden")).toBe(true);
    expect(container.querySelector(".mk-track-bar-readout")?.textContent).toBe("under 0.3");
    expect(screen.getByRole("meter", { name: "LRCX against its range" })).toBeTruthy();
  });

  it("shows progress toward a target, and a limit that turns it red once reached", () => {
    const { rerender, container } = render(<TrackBar label="Dip ladder" value={2} max={5} tone="accent" readout="2 of 5 rungs" />);
    expect(container.querySelector(".mk-track-bar")?.getAttribute("data-tone")).toBe("accent");
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("2 of 5.");
    expect((container.querySelector(".mk-track-bar-fill") as HTMLElement).style.inlineSize).toBe("40%");

    rerender(<TrackBar label="Sahm rule" value={0.52} max={0.6} limit={0.5} />);
    expect(container.querySelector(".mk-track-bar")?.getAttribute("data-status")).toBe("reached");
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("0.52, limit 0.50. Limit reached.");
  });

  it("clamps the fill to the track", () => {
    const { container } = render(<TrackBar label="Over" value={14} max={10} />);
    expect((container.querySelector(".mk-track-bar-fill") as HTMLElement).style.inlineSize).toBe("100%");
  });

  it("passes axe", async () => {
    const { container } = render(<TrackBar label="CEG" value={5.2} max={10} target={5} range={[4, 7]} note="Allowed 4 to 7%" />);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
