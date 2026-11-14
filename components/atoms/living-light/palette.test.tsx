import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { blend, DAWN_SECONDS, easeShift, hexToRgb, nextShift, PALETTES } from "./palette";

const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const primitive = (alias: string) => json("tokens/primitives.json").color[alias.replace(/^\{color\.|\}$/g, "")].$value.hex;

describe("palettes", () => {
  it.each(["base", "mid", "high", "accent"] as const)("match the %s token in both themes, since a shader can't read CSS", (role) => {
    const forest = json("tokens/semantic.json").color.ambient[role].$value;
    const paper = json("tokens/semantic.paper.json").color.ambient[role].$value;

    expect(PALETTES.forest[role].toLowerCase()).toBe(primitive(forest));
    expect(PALETTES.paper[role].toLowerCase()).toBe(primitive(paper));
    expect(PALETTES.blaze[role].toLowerCase()).toBe(primitive(json("tokens/semantic.json").color.blaze[role].$value));
  });
});

describe("hexToRgb", () => {
  it("converts to the 0 to 1 range a shader expects", () => {
    expect(hexToRgb("#ff0080")).toEqual([1, 0, 128 / 255]);
  });
});

describe("Dawn", () => {
  it("takes 1.8 seconds, matching the motion token", () => {
    expect(DAWN_SECONDS).toBe(1.8);
    expect(nextShift(0, 0.9, false)).toBeCloseTo(0.5);
    expect(nextShift(0.9, 1, false)).toBe(1);
  });

  it("finishes at once for reduced motion", () => {
    expect(nextShift(0, 0.01, true)).toBe(1);
  });

  it("eases in and out without overshooting", () => {
    expect(easeShift(0)).toBe(0);
    expect(easeShift(0.5)).toBeCloseTo(0.5);
    expect(easeShift(1)).toBe(1);
  });

  it("starts a new change cleanly from wherever the last one reached", () => {
    expect(blend([0, 0, 0], [1, 1, 1], 0.25)).toEqual([0.25, 0.25, 0.25]);
  });
});
