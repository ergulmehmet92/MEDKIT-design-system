import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Heading } from "./Heading";

afterEach(cleanup);

const css = () => readFileSync("components/atoms/heading/heading.css", "utf8");

describe("Heading", () => {
  it("renders the level it's given, so the outline stays correct", () => {
    render(<Heading level={3}>Annotation Builder</Heading>);

    expect(screen.getByRole("heading", { level: 3, name: "Annotation Builder" })).toBeTruthy();
  });

  it("keeps the size separate from the level", () => {
    render(
      <Heading level={1} size="title">
        Where are we in the cycle?
      </Heading>,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.getAttribute("data-size")).toBe("title");
  });

  it("defaults to a level 2 heading at title size", () => {
    render(<Heading>Experiments</Heading>);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.getAttribute("data-size")).toBe("title");
  });

  it("passes native props through and keeps a consumer's class", () => {
    render(
      <Heading id="work" className="extra">
        Work
      </Heading>,
    );

    const heading = screen.getByRole("heading");
    expect(heading.id).toBe("work");
    expect(heading.className).toBe("mk-heading extra");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Heading level={2}>Work</Heading>);

    expect((await axe.run(container)).violations).toEqual([]);
  });

  it("styles every size from semantic and fluid tokens, balancing short headlines", () => {
    for (const size of ["display", "heading", "subheading", "title"]) {
      expect(css()).toContain(`[data-size="${size}"]`);
    }
    expect(css()).toContain("var(--mk-font-size-display)");
    expect(css()).toContain("text-wrap: balance");
    expect(css()).toContain("overflow-wrap: break-word");
    expect(css()).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|\d+px/i);
  });
});
