import { readFileSync } from "node:fs";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridRails } from "./GridRails";

afterEach(cleanup);
const css = () => readFileSync("components/atoms/grid-rails/grid-rails.css", "utf8");

describe("GridRails", () => {
  it("is hidden from assistive technology", () => {
    const { container } = render(<GridRails />);

    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("draws rails at both margins and the middle", () => {
    const { container } = render(<GridRails />);

    expect(container.querySelectorAll("[data-rail]")).toHaveLength(3);
  });

  it("passes native props to the root", () => {
    const { container } = render(<GridRails className="extra" id="rails" />);

    expect(container.firstElementChild?.className).toBe("mk-grid-rails extra");
    expect(container.firstElementChild?.id).toBe("rails");
  });

  it("runs full height at the page margins, ignoring the pointer", () => {
    expect(css()).toContain("inset: 0");
    expect(css()).toContain("pointer-events: none");
    expect(css()).toContain("var(--mk-gutter)");
  });

  it("drops the middle rail at narrow widths", () => {
    expect(css()).toMatch(/\[data-rail="middle"\] \{[^}]*display: none/);
    expect(css()).toMatch(/@container \(min-width: 48rem\) \{\s*\.mk-grid-rails \[data-rail="middle"\] \{[^}]*display: block/);
  });
});
