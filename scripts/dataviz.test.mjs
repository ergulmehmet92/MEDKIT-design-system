import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { hexColours } from "./contrast.mjs";
import { everyPair, lightnessChroma, neighbours, THRESHOLDS, worstPairs } from "./dataviz.mjs";
import { resolveTokens } from "./resolve-tokens.mjs";

const SCHEMES = ["forest", "paper"];
const STEPS = ["100", "200", "300", "400", "500", "600", "700"];
const palette = async (scheme) => {
  const colours = hexColours(await resolveTokens({ scheme }));
  return {
    category: Array.from({ length: 8 }, (_, k) => colours[`color.dataviz.category.${k + 1}`]),
    sequential: STEPS.map((s) => colours[`color.dataviz.sequential.${s}`]),
    alt: STEPS.map((s) => colours[`color.dataviz.sequential-alt.${s}`]),
    diverging: ["below-3", "below-2", "below-1", "mid", "above-1", "above-2", "above-3"].map((s) => colours[`color.dataviz.diverging.${s}`]),
  };
};

describe.each(SCHEMES)("categorical palette on %s", (scheme) => {
  it("has eight slots, each inside the lightness band and above the chroma floor", async () => {
    const { category } = await palette(scheme);
    const [low, high] = THRESHOLDS.band[scheme];

    expect(category.every(Boolean)).toBe(true);
    for (const hex of category) {
      const { lightness, chroma } = lightnessChroma(hex);
      expect(lightness, hex).toBeGreaterThanOrEqual(low);
      expect(lightness, hex).toBeLessThanOrEqual(high);
      expect(chroma, hex).toBeGreaterThanOrEqual(THRESHOLDS.chroma);
    }
  });

  it("keeps neighbouring slots apart for colour-blind and full-colour readers", async () => {
    const { category } = await palette(scheme);
    const worst = worstPairs(category, neighbours(8));

    expect(worst.deficient).toBeGreaterThanOrEqual(THRESHOLDS.deficient);
    expect(worst.normal).toBeGreaterThanOrEqual(THRESHOLDS.normal);
  });

  it("keeps every pair of the first three slots apart, for scatter plots and small multiples", async () => {
    const { category } = await palette(scheme);
    const worst = worstPairs(category.slice(0, 3), everyPair(3));

    expect(worst.deficient).toBeGreaterThanOrEqual(THRESHOLDS.deficient);
    expect(worst.normal).toBeGreaterThanOrEqual(THRESHOLDS.normal);
  });
});

describe.each(SCHEMES)("scales on %s", (scheme) => {
  // More always sits further from the surface: darker on Paper, lighter on Forest.
  const away = (values) => {
    const l = values.map((hex) => lightnessChroma(hex).lightness);
    return scheme === "paper" ? l.every((v, i) => i === 0 || v < l[i - 1]) : l.every((v, i) => i === 0 || v > l[i - 1]);
  };

  it("moves magnitude scales steadily away from the surface", async () => {
    const { sequential, alt } = await palette(scheme);

    expect(away(sequential)).toBe(true);
    expect(away(alt)).toBe(true);
  });

  it("gives the diverging scale a near-grey midpoint, with each arm moving away from it", async () => {
    const { diverging } = await palette(scheme);
    const mid = lightnessChroma(diverging[3]);
    const contrastWithMid = (hex) => Math.abs(lightnessChroma(hex).lightness - mid.lightness);

    expect(mid.chroma).toBeLessThan(0.02);
    expect(contrastWithMid(diverging[0])).toBeGreaterThan(contrastWithMid(diverging[2]));
    expect(contrastWithMid(diverging[6])).toBeGreaterThan(contrastWithMid(diverging[4]));
  });
});

describe("who reads data-viz tokens", () => {
  // Chart components live in folders named for charts. Nothing else may use chart colours, so the
  // brand palette stays the brand palette.
  const CHART_FOLDER = /\/(chart-frame|[a-z-]+-chart|sparkline)\//;
  const files = (dir) =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? files(path) : /\.(css|tsx?)$/.test(name) ? [path] : [];
    });

  it("is limited to chart components", () => {
    const readers = ["components/atoms", "components/molecules", "components/organisms"]
      .flatMap(files)
      .filter((path) => /--mk-(color-)?dataviz/.test(readFileSync(path, "utf8")));
    const outsiders = readers.filter((path) => !CHART_FOLDER.test(`/${path}`));

    expect(outsiders).toEqual([]);
  });
});
