import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = () => readFileSync("dist/tokens/tokens.css", "utf8");
const json = (path) => JSON.parse(readFileSync(path, "utf8"));

function tokensIn(node, path = []) {
  return Object.entries(node).flatMap(([key, value]) => {
    if (key.startsWith("$") || !value || typeof value !== "object") return [];
    if ("$value" in value) return [{ path: [...path, key], value: value.$value }];
    return tokensIn(value, [...path, key]);
  });
}

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

describe("primitive colours", () => {
  it("match the palette approved in the brand spec", () => {
    const hexes = Object.fromEntries(
      tokensIn(json("tokens/primitives.json").color)
        .filter((token) => token.value.alpha === undefined)
        .map((token) => [token.path.join("."), token.value.hex]),
    );

    expect(hexes).toEqual({
      forest: "#0f1b14",
      hunter: "#2e4a38",
      sage: "#8fa17c",
      sand: "#cdb88f",
      honey: "#e0a93f",
      "honey-deep": "#7a520e",
      beige: "#e9e0cf",
      "off-white": "#f5f0e6",
      "grey-300": "#a9a294",
      "grey-600": "#5f594e",
      "signal-green": "#3dff6e",
      "signal-green-deep": "#008f34",
      "signal-orange": "#ff9424",
      "signal-orange-deep": "#d05a00",
      "signal-red": "#ff3a2e",
      "signal-red-deep": "#e3241b",
    });
  });
});

describe("status roles", () => {
  it("use neon on Forest and the deeper colours on Paper", () => {
    const forest = json("tokens/semantic.json").color.status;
    const paper = json("tokens/semantic.paper.json").color.status;

    expect(forest.live.$value).toBe("{color.signal-green}");
    expect(forest.stale.$value).toBe("{color.signal-orange}");
    expect(forest.failed.$value).toBe("{color.signal-red}");
    expect(paper.live.$value).toBe("{color.signal-green-deep}");
    expect(paper.stale.$value).toBe("{color.signal-orange-deep}");
    expect(paper.failed.$value).toBe("{color.signal-red-deep}");
  });

  it("stay graphics-only, so nothing presents them as a text colour", () => {
    const { status } = json("tokens/semantic.json").color;

    for (const role of Object.values(status).filter((value) => value.$value)) {
      expect(role.$description).toMatch(/never as text/i);
    }
  });
});

describe("semantic colour roles", () => {
  const roles = () => [
    ...tokensIn(json("tokens/semantic.json").color),
    ...tokensIn(json("tokens/semantic.paper.json").color),
  ];

  it("hold aliases only, never raw values", () => {
    for (const role of roles()) {
      expect(role.value, role.path.join(".")).toMatch(/^\{[^{}]+\}$/);
    }
  });

  it("never name a hue or a theme", () => {
    for (const role of roles()) {
      expect(role.path.join("."), role.path.join(".")).not.toMatch(
        /forest|hunter|sage|sand|honey|beige|white|grey|paper|dark|light/,
      );
    }
  });
});

describe("themes", () => {
  it("land on Forest by default", () => {
    expect(css()).toMatch(/:root \{\s+color-scheme: dark;/);
  });

  it("ignore the device's colour preference", () => {
    expect(css()).not.toContain("prefers-color-scheme");
  });

  it("let any subtree pin either theme", () => {
    expect(css()).toMatch(/\[data-theme="paper"\] \{\s+color-scheme: light;/);
    expect(css()).toMatch(/\[data-theme="forest"\] \{\s+color-scheme: dark;/);
  });

  it("resolve a role per theme with light-dark, Paper first", () => {
    expect(css()).toContain(
      "--mk-color-surface-default: light-dark(var(--mk-color-off-white), var(--mk-color-forest));",
    );
  });

  it("repeat Paper's values for browsers without light-dark", () => {
    const fallback = css().match(/@supports not \(color: light-dark\(#fff, #000\)\) \{[\s\S]*?\n  \}/)?.[0] ?? "";

    expect(fallback).toMatch(/\[data-theme="paper"\] \{[^}]*--mk-color-surface-default: var\(--mk-color-off-white\);/);
    expect(fallback).toMatch(/\[data-theme="forest"\] \{[^}]*--mk-color-surface-default: var\(--mk-color-forest\);/);
  });

  it("paint each themed subtree, re-specifying the colours it inherits", () => {
    const base = css().match(/@layer base \{[\s\S]*\n\}/)?.[0] ?? "";

    expect(base).toContain(":where(:root, [data-theme])");
    expect(base).toContain("background-color: var(--mk-color-surface-default);");
    expect(base).toContain("color: var(--mk-color-text-default);");
  });
});
