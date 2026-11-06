import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Treemap } from "./Treemap";

afterEach(cleanup);

const groups = [
  { id: "ai", name: "AI compute", highlight: true, children: [{ id: "nvda", name: "NVDA", value: 9.8 }, { id: "tsm", name: "TSM", value: 7.1 }] },
  { id: "power", name: "Power", children: [{ id: "vst", name: "VST", value: 5.6 }, { id: "ceg", name: "CEG", value: 5.2 }] },
  { id: "grid", name: "Grid", children: [{ id: "etn", name: "ETN", value: 4.4 }, { id: "zero", name: "Zero", value: 0 }] },
];
const chart = <Treemap title="Holdings" label="Holdings by theme" groups={groups} />;

describe("Treemap", () => {
  it("draws a tile per item, skipping zero, tinted by its group with the subject in the accent", () => {
    const { container } = render(chart);
    const tiles = [...container.querySelectorAll<SVGGElement>(".mk-treemap-tile")];

    expect(tiles).toHaveLength(5);
    expect(tiles.filter((t) => t.style.color === "var(--mk-color-dataviz-accent)")).toHaveLength(2);
    expect(tiles.filter((t) => t.style.color.startsWith("var(--mk-color-dataviz-neutral"))).toHaveLength(3);
  });

  it("separates tiles with a 2px gap and sizes them by value", () => {
    const { container } = render(chart);
    const area = (name: string) => {
      const tile = [...container.querySelectorAll(".mk-treemap-tile")].find((t) => t.querySelector("text")?.textContent === name);
      const rect = tile?.querySelector("rect");
      return Number(rect?.getAttribute("width")) * Number(rect?.getAttribute("height"));
    };

    expect(area("NVDA")).toBeGreaterThan(area("TSM"));
  });

  it("reads every tile by keyboard, with its group and share", () => {
    render(chart);
    const plot = screen.getByRole("group", { name: "Holdings by theme" });

    act(() => plot.focus());
    expect(screen.getByText("NVDA, in AI compute. 9.8, 30.5% of everything.")).toBeTruthy();
    fireEvent.keyDown(plot, { key: "End" });
    expect(screen.getByText(/^ETN, in Grid\./)).toBeTruthy();
  });

  it("lists every item in the table, and passes axe", async () => {
    const { container } = render(chart);
    fireEvent.click(screen.getByRole("button", { name: "View as table" }));

    expect(screen.getAllByRole("rowheader").map((r) => r.textContent)).toEqual(["NVDA", "TSM", "VST", "CEG", "ETN"]);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
