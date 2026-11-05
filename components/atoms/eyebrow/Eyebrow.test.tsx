import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Eyebrow } from "./Eyebrow";

afterEach(cleanup);

describe("Eyebrow", () => {
  it("renders a paragraph by default", () => {
    render(<Eyebrow>Product design</Eyebrow>);

    expect(screen.getByText("Product design").tagName).toBe("P");
  });

  it("can render as a heading when it titles a section", () => {
    render(<Eyebrow as="h2">Product design</Eyebrow>);

    expect(screen.getByRole("heading", { level: 2, name: "Product design" })).toBeTruthy();
  });

  it("passes native props through", () => {
    render(<Eyebrow id="section-label">Thesis</Eyebrow>);

    expect(screen.getByText("Thesis").id).toBe("section-label");
  });

  it("keeps a consumer's class alongside its own", () => {
    render(<Eyebrow className="extra">Thesis</Eyebrow>);

    expect(screen.getByText("Thesis").className).toBe("mk-eyebrow extra");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Eyebrow>Thesis</Eyebrow>);

    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });

  it("styles only from semantic tokens", () => {
    const css = readFileSync("components/atoms/eyebrow/eyebrow.css", "utf8");

    expect(css).toContain("--mk-font-family-label");
    expect(css).toContain("--mk-color-text-muted");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|--mk-font-family-mono/i);
  });
});
