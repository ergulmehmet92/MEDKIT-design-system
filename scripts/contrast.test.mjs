import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { checkAllThemes, contrastRatio, failingPairs } from "./contrast.mjs";

describe("contrastRatio", () => {
  it("matches the ratio published on the Palette artboard", () => {
    expect(contrastRatio("#f5f0e6", "#0f1b14")).toBeCloseTo(15.57, 2);
  });
});

describe("failingPairs", () => {
  const pairs = [{ foreground: "text", background: "surface", minimum: 4.5 }];

  it("flags a pair below its minimum", () => {
    const failures = failingPairs({ text: "#777777", surface: "#888888" }, pairs);

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatchObject({ foreground: "text", background: "surface", minimum: 4.5 });
  });

  it("accepts a pair at or above its minimum", () => {
    expect(failingPairs({ text: "#000000", surface: "#ffffff" }, pairs)).toEqual([]);
  });

  it("treats a role it can't find as a failure, so a renamed role can't pass silently", () => {
    expect(failingPairs({ surface: "#ffffff" }, pairs)).toHaveLength(1);
  });
});

describe("the real tokens", () => {
  it("pass in Forest and Paper, at standard and more contrast", async () => {
    const results = await checkAllThemes();

    expect(results.map((result) => result.theme).sort()).toEqual([
      "forest/more",
      "forest/standard",
      "paper/more",
      "paper/standard",
    ]);
    expect(results.flatMap((result) => result.failures)).toEqual([]);
  });
});

describe("status lamps", () => {
  it("are held to the 3:1 graphics minimum on every surface", async () => {
    const { PAIRS } = await import("./contrast.mjs");
    const statusPairs = PAIRS.filter((pair) => pair.foreground.startsWith("color.status."));

    expect(statusPairs).toHaveLength(6);
    expect(statusPairs.every((pair) => pair.minimum === 3)).toBe(true);
  });
});

describe("generated accessibility modes", () => {
  const css = () => readFileSync("dist/tokens/tokens.css", "utf8");

  it("promotes weak roles when a visitor asks for more contrast", () => {
    const block = css().match(/@media \(prefers-contrast: more\) \{[\s\S]*?\n  \}/)?.[0] ?? "";

    expect(block).toContain("--mk-color-text-muted: var(--mk-color-text-default);");
    expect(block).toContain("--mk-color-border-default: var(--mk-color-border-strong);");
  });

  it("maps roles to system colours in forced-colors mode", () => {
    const block = css().match(/@media \(forced-colors: active\) \{[\s\S]*?\n  \}/)?.[0] ?? "";

    expect(block).toContain("--mk-color-surface-default: Canvas;");
    expect(block).toContain("--mk-color-text-default: CanvasText;");
    expect(block).toContain("--mk-color-border-focus: Highlight;");
    expect(block).toContain("--mk-color-action-background-primary-default: ButtonFace;");
    expect(block).toContain("--mk-color-action-foreground-primary-default: ButtonText;");
  });
});
