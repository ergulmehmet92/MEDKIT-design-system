import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "../../atoms/button";
import { Panel } from "./Panel";

afterEach(cleanup);

describe("Panel", () => {
  it("is a region named by its title, with its kind, actions and footer", () => {
    render(
      <Panel kind="Positions" title="NVDA is over its range." actions={<Button variant="quiet">Export</Button>} footer="Sample data">
        <p>Body</p>
      </Panel>,
    );
    const region = screen.getByRole("region", { name: "NVDA is over its range." });

    expect(region.querySelector(".mk-panel-kind")?.textContent).toBe("Positions");
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("NVDA is over its range.");
    expect(screen.getByRole("button", { name: "Export" })).toBeTruthy();
    expect(region.querySelector(".mk-panel-foot")?.textContent).toBe("Sample data");
  });

  it("takes the heading level it is given", () => {
    render(<Panel title="Allocation" titleAs="h2">Body</Panel>);
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });

  it("drops its head when the content brings its own title", () => {
    const { container } = render(<Panel>Chart</Panel>);

    expect(container.querySelector(".mk-panel-head")).toBeNull();
    expect(container.querySelector("section")?.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("passes axe", async () => {
    const { container } = render(<Panel kind="Cycle gauge" title="Late in the cycle." footer="Sample data">Body</Panel>);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
