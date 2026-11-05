import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path) => readFileSync(path, "utf8");
const css = () => read("dist/tokens/tokens.css");
const resolver = () => JSON.parse(read("tokens/tokens.resolver.json"));
const block = (selector) => {
  const start = css().indexOf(`  ${selector} {\n    --`);
  return start < 0 ? "" : css().slice(start, css().indexOf("\n  }", start));
};
const declared = (text) => Object.fromEntries([...text.matchAll(/--(mk-[\w-]+): ([^;]+);/g)].map((m) => [m[1], m[2]]));

describe("density modifier", () => {
  it("lands on editorial, with analytical as the alternative", () => {
    const density = resolver().modifiers.density;

    expect(density.default).toBe("editorial");
    expect(Object.keys(density.contexts)).toEqual(["editorial", "analytical"]);
    expect(resolver().resolutionOrder).toContainEqual({ $ref: "#/modifiers/density" });
  });

  it("lets any subtree pin a density, and an editorial subtree resets inside an analytical one", () => {
    const analytical = declared(block('[data-density="analytical"]'));
    const editorial = declared(block('[data-density="editorial"]'));

    expect(Object.keys(analytical).length).toBeGreaterThan(5);
    expect(Object.keys(editorial).sort()).toEqual(Object.keys(analytical).sort());
  });

  it("shrinks text, controls, rows and gaps to the approved board's values", () => {
    const analytical = declared(block('[data-density="analytical"]'));
    const editorial = declared(block('[data-density="editorial"]'));
    const rem = (alias, scale) => {
      const step = alias.match(/var\(--mk-(?:font-size|space|size)-([\w-]+)\)/)[1];
      return css().match(new RegExp(`--mk-${scale}-${step}: ([\\d.]+)rem;`))[1] * 16;
    };

    expect(rem(analytical["mk-font-size-body"], "font-size")).toBe(14);
    expect(rem(analytical["mk-font-size-label"], "font-size")).toBe(12);
    expect(rem(analytical["mk-font-size-title"], "font-size")).toBe(20);
    expect(rem(analytical["mk-size-control"], "space")).toBe(32);
    expect(rem(editorial["mk-size-control"], "space")).toBe(48);
    expect(rem(analytical["mk-size-row"], "space")).toBe(32);
    expect(rem(editorial["mk-size-row"], "space")).toBe(56);
    expect(rem(analytical["mk-gap-md"], "space")).toBe(8);
  });

  it("never changes a colour, so contrast holds in both densities", () => {
    expect(block('[data-density="analytical"]')).not.toContain("--mk-color-");
  });

  it("keeps display and poster sizes the same in both densities", () => {
    const analytical = block('[data-density="analytical"]');

    expect(analytical).not.toContain("--mk-font-size-display");
    expect(analytical).not.toContain("--mk-font-size-heading");
  });

  it("re-applies body text on each density subtree, because sizes resolve where they're declared", () => {
    const base = css().match(/@layer base \{[\s\S]*\n\}/)?.[0] ?? "";

    expect(base).toMatch(/:where\(\[data-density\]\) \{\s+font-size: var\(--mk-font-size-body\);\s+line-height: var\(--mk-line-height-body\);/);
  });

  it("tightens the page gutter and metric size in analytical density", () => {
    const fluid = css().match(/\[data-density="analytical"\] \{\s+--mk-font-size-feature[^}]+\}/)?.[0] ?? "";

    expect(fluid).toContain("--mk-gutter: var(--mk-space-6);");
    expect(fluid).toContain("--mk-page-inset: calc(var(--mk-gutter) + 1rem);");
  });
});

describe("components follow density", () => {
  it("sizes buttons and icon buttons from the control size", () => {
    expect(read("components/atoms/button/button.css")).toContain("min-block-size: var(--mk-size-control);");
    const icon = read("components/atoms/icon-button/icon-button.css");
    expect(icon).toContain("inline-size: var(--mk-size-control);");
    expect(icon).toContain("block-size: var(--mk-size-control);");
  });

  it("scales the Eclipse glow with the control, so a small button doesn't drown in light", () => {
    const button = read("components/atoms/button/button.css");

    expect(button).not.toMatch(/filter: blur\([\d.]+rem\)/);
    expect(button).toMatch(/filter: blur\(calc\(var\(--mk-size-control\) \* [\d.]+\)\)/);
  });

  it("lets metric rows fit more columns in analytical density", () => {
    expect(read("components/organisms/metric-row/metric-row.css")).toContain("var(--mk-size-column)");
  });
});
