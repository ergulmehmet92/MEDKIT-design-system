import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { TrackBar } from "../track-bar";
import { cycleBands } from "./cycle.sample";
import { Gauge, GaugeSection, bandOf } from "./Gauge";

afterEach(cleanup);

describe("bandOf", () => {
  it("puts a value on a boundary in the band above, as Predictor does", () => {
    expect(bandOf(1.74, 1, cycleBands)).toBe(1);
    expect(bandOf(1.75, 1, cycleBands)).toBe(2);
    expect(bandOf(2.93, 1, cycleBands)).toBe(3);
    expect(bandOf(4, 1, cycleBands)).toBe(4);
  });
});

describe("Gauge", () => {
  it("is a meter with the reading, its band and the range in words", () => {
    render(<Gauge label="Cycle state" value={2.93} min={1} bands={cycleBands} />);
    const meter = screen.getByRole("meter", { name: "Cycle state" });

    expect(meter.getAttribute("aria-valuenow")).toBe("2.93");
    expect(meter.getAttribute("aria-valuemax")).toBe("4");
    expect(meter.getAttribute("aria-valuetext")).toBe("Late, overdue, band 3 of 4. Reading 2.93, between 2.50 and 3.25, on a scale of 1.00 to 4.00.");
  });

  it("marks the current band in honey and shows the verdict", () => {
    const { container } = render(<Gauge label="Cycle state" value={2.93} min={1} bands={cycleBands} reading="Reading 2.93 of 4 · as of Fri 6 Nov" />);

    expect([...container.querySelectorAll(".mk-gauge-band")].map((b) => b.hasAttribute("data-current"))).toEqual([false, false, true, false]);
    expect(container.querySelector(".mk-gauge-state")?.textContent).toBe("3");
    expect(container.querySelector(".mk-gauge-name")?.textContent).toBe("Late, overdue");
    expect(container.querySelector(".mk-gauge-reading")?.textContent).toBe("Reading 2.93 of 4 · as of Fri 6 Nov");
  });

  it("says why when something other than the reading sets the state", () => {
    const { container } = render(<Gauge label="Cycle state" value={2.4} min={1} bands={cycleBands} state={4} reason="Forced to 4: high-yield spread is above 4.50%." />);

    expect(container.querySelector(".mk-gauge-state")?.textContent).toBe("4");
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("Crisis, band 4 of 4. The reading is 2.40, in Mid. Forced to 4: high-yield spread is above 4.50%.");
  });

  it("carries its why as sections of meters, and passes axe", async () => {
    const { container } = render(
      <Gauge label="Cycle state" value={2.93} min={1} bands={cycleBands}>
        <GaugeSection title="Why: three clocks" aside="lateness, weighted">
          <TrackBar label="Valuation" value={88} max={100} readout="88% late" />
        </GaugeSection>
      </Gauge>,
    );

    expect(screen.getByRole("heading", { level: 4, name: "Why: three clocks" })).toBeTruthy();
    expect(screen.getAllByRole("meter")).toHaveLength(2);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
