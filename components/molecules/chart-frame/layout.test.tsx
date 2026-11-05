import { describe, expect, it } from "vitest";
import { nearestIndex, placeNote, placeRail, signed, spreadLabels, thinLabels } from "./layout";

describe("thinLabels", () => {
  it("keeps every label when they fit", () => {
    expect(thinLabels([0, 100, 200], [40, 40, 40], 12)).toEqual([true, true, true]);
  });

  it("keeps every other label when neighbours would touch, and never leaves gaps uneven", () => {
    expect(thinLabels([0, 40, 80, 120, 160], [40, 40, 40, 40, 40], 12)).toEqual([true, false, true, false, true]);
  });

  it("handles one label and none", () => {
    expect(thinLabels([10], [500], 12)).toEqual([true]);
    expect(thinLabels([], [], 12)).toEqual([]);
  });
});

describe("placeRail", () => {
  const options = { rows: 2, mark: 5, gap: 12, limit: 1000 };

  it("puts labels beside their marks when there's room", () => {
    expect(placeRail([{ x: 0, width: 80 }, { x: 300, width: 80 }], options)).toEqual([0, 0]);
  });

  it("lifts a label to the next row when it would run into the next mark", () => {
    expect(placeRail([{ x: 0, width: 80 }, { x: 60, width: 80 }], options)).toEqual([1, 0]);
  });

  it("drops a label when no row has room, leaving it to the tooltip", () => {
    const rows = placeRail([{ x: 0, width: 80 }, { x: 20, width: 80 }, { x: 40, width: 80 }], { ...options, rows: 1 });
    expect(rows.filter((r) => r === -1).length).toBeGreaterThan(0);
  });

  it("never lets a label run past the plot", () => {
    expect(placeRail([{ x: 950, width: 80 }], options)).toEqual([-1]);
  });
});

describe("spreadLabels", () => {
  it("leaves labels that are already apart where they are", () => {
    expect(spreadLabels([10, 50, 90], 15, 0, 100)).toEqual([10, 50, 90]);
  });

  it("pushes colliding labels apart by at least the gap, keeping their order", () => {
    const ys = spreadLabels([50, 52, 54], 15, 0, 200);
    expect(ys[1] - ys[0]).toBeGreaterThanOrEqual(14.99);
    expect(ys[2] - ys[1]).toBeGreaterThanOrEqual(14.99);
  });

  it("keeps labels inside the plot", () => {
    const ys = spreadLabels([0, 1, 2], 15, 0, 100);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(100);
  });
});

describe("placeNote", () => {
  const bounds = { x: 0, y: 0, width: 400, height: 300 };

  it("takes the side with the fewest data points under it", () => {
    const points = Array.from({ length: 20 }, (_, i) => ({ x: 220 + i, y: 220 }));
    const spot = placeNote({ x: 200, y: 150 }, { width: 100, height: 60 }, points, bounds)!;
    expect(spot.y).toBeLessThan(150);
  });

  it("drops out when no side fits, rather than spilling over the plot", () => {
    expect(placeNote({ x: 50, y: 50 }, { width: 300, height: 260 }, [], { x: 0, y: 0, width: 100, height: 100 })).toBeNull();
  });

  it("never leaves the plot when another side fits", () => {
    const spot = placeNote({ x: 380, y: 20 }, { width: 100, height: 60 }, [], bounds)!;
    expect(spot.x).toBeGreaterThanOrEqual(0);
    expect(spot.x + 100).toBeLessThanOrEqual(400);
    expect(spot.y).toBeGreaterThanOrEqual(0);
  });
});

describe("nearestIndex and signed", () => {
  it("finds the closest position", () => {
    expect(nearestIndex([0, 10, 20], 14)).toBe(1);
    expect(nearestIndex([0, 10, 20], 16)).toBe(2);
  });

  it("writes a true minus sign, and no sign on zero", () => {
    expect(signed(-8.24)).toBe("−8.2");
    expect(signed(3)).toBe("+3.0");
    expect(signed(-0.01)).toBe("0.0");
  });
});
