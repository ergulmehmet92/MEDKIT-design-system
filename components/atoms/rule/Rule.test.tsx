import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Rule } from "./Rule";

afterEach(cleanup);

describe("Rule", () => {
  it("is decorative by default, hidden from assistive technology", () => {
    const { container } = render(<Rule />);

    const rule = container.querySelector("hr");
    expect(rule?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("becomes a real separator when it's given a label", () => {
    render(<Rule aria-label="Positions" />);

    expect(screen.getByRole("separator", { name: "Positions" })).toBeTruthy();
  });

  it("offers a strong weight for structure", () => {
    const { container } = render(<Rule strength="strong" />);

    expect(container.querySelector("hr")?.getAttribute("data-strength")).toBe("strong");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Rule aria-label="Section break" />);

    expect((await axe.run(container)).violations).toEqual([]);
  });

  it("draws with border tokens, and stays visible in forced-colors mode", () => {
    const css = readFileSync("components/atoms/rule/rule.css", "utf8");

    expect(css).toContain("var(--mk-color-border-default)");
    expect(css).toContain("var(--mk-color-border-strong)");
    expect(css).toContain("forced-colors: active");
  });
});
