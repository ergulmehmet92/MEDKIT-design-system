import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";

afterEach(cleanup);

const tabs = ["Overview", "Positions", "Calls", "Gauge"].map((t) => ({ id: t.toLowerCase(), label: t, panel: <p>{t} panel</p> }));

describe("Tabs", () => {
  it("follows the tabs pattern: one tab stop, a labelled panel", () => {
    render(<Tabs label="Views" tabs={tabs} defaultSelected="positions" />);
    const selected = screen.getByRole("tab", { selected: true });

    expect(screen.getByRole("tablist", { name: "Views" })).toBeTruthy();
    expect(selected.textContent).toBe("Positions");
    expect(screen.getAllByRole("tab").map((t) => t.tabIndex)).toEqual([-1, 0, -1, -1]);
    expect(screen.getByRole("tabpanel", { name: "Positions" }).textContent).toBe("Positions panel");
  });

  it("moves with arrow keys, wrapping, and jumps with Home and End", () => {
    render(<Tabs label="Views" tabs={tabs} />);
    const first = screen.getByRole("tab", { name: "Overview" });

    first.focus();
    fireEvent.keyDown(first, { key: "ArrowLeft" });
    expect(document.activeElement?.textContent).toBe("Gauge");
    expect(screen.getByRole("tab", { selected: true }).textContent).toBe("Gauge");

    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(document.activeElement?.textContent).toBe("Overview");
    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    expect(screen.getByRole("tabpanel").textContent).toBe("Positions panel");
    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(document.activeElement?.textContent).toBe("Gauge");
  });

  it("waits for a click or Enter in manual activation", () => {
    const onSelectedChange = vi.fn();
    render(<Tabs label="Views" tabs={tabs} activation="manual" onSelectedChange={onSelectedChange} />);
    const first = screen.getByRole("tab", { name: "Overview" });

    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(document.activeElement?.textContent).toBe("Positions");
    expect(screen.getByRole("tab", { selected: true }).textContent).toBe("Overview");
    fireEvent.click(document.activeElement!);
    expect(onSelectedChange).toHaveBeenCalledWith("positions");
  });

  it("passes axe", async () => {
    const { container } = render(<Tabs label="Views" tabs={tabs} />);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
