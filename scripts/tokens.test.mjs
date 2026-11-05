import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = () => readFileSync("dist/tokens/tokens.css", "utf8");

describe("generated tokens.css", () => {
  it("declares the cascade layer order before any rules", () => {
    const firstStatement = css().replace(/\/\*[\s\S]*?\*\//g, "").trim().split("\n")[0];

    expect(firstStatement).toBe("@layer reset, tokens, base, components, utilities;");
  });

  it("puts every token inside the tokens layer", () => {
    expect(css()).toContain("@layer tokens {");
  });

  it("writes primitives as OKLCH values", () => {
    expect(css()).toMatch(/--mk-color-forest: oklch\(/);
  });

  it("writes semantic roles as aliases of primitives, so the cascade picks the value", () => {
    expect(css()).toMatch(/--mk-color-action-background-primary-default: var\(--mk-color-/);
  });
});
