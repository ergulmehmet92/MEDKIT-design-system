// Fails if any semantic pair misses WCAG 2.2 AA in any theme. Run with `npm run contrast`.

import { pathToFileURL } from "node:url";
import { resolver, resolveTokens } from "./resolve-tokens.mjs";

const TEXT = ["color.text.default", "color.text.muted", "color.text.accent"];
const SURFACES = ["color.surface.default", "color.surface.subtle"];
const BOUNDARIES = ["color.border.strong", "color.border.focus"];
const ACTION_FILLS = ["default", "hover", "active"].map((state) => `color.action.background.primary.${state}`);

const pairsOf = (foregrounds, backgrounds, minimum) =>
  foregrounds.flatMap((foreground) => backgrounds.map((background) => ({ foreground, background, minimum })));

export const PAIRS = [
  ...pairsOf(TEXT, SURFACES, 4.5),
  ...pairsOf(["color.action.foreground.primary.default"], ACTION_FILLS, 4.5),
  ...pairsOf(BOUNDARIES, SURFACES, 3),
];

function luminance(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(first, second) {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

export function failingPairs(colours, pairs = PAIRS) {
  return pairs.flatMap((pair) => {
    const foreground = colours[pair.foreground];
    const background = colours[pair.background];
    if (!foreground || !background) return [{ ...pair, ratio: null }];
    const ratio = contrastRatio(foreground, background);
    return ratio < pair.minimum ? [{ ...pair, ratio: Number(ratio.toFixed(2)) }] : [];
  });
}

// Flattens a token tree to { "color.text.default": "#hex" }, following aliases.
function hexColours(tree) {
  const tokens = {};
  const walk = (node, path) => {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$") || !value || typeof value !== "object") continue;
      if ("$value" in value) tokens[[...path, key].join(".")] = value.$value;
      else walk(value, [...path, key]);
    }
  };
  walk(tree, []);

  const hexOf = (value) => {
    const alias = typeof value === "string" && value.match(/^\{([^{}]+)\}$/);
    return alias ? hexOf(tokens[alias[1]]) : value?.hex;
  };
  return Object.fromEntries(Object.keys(tokens).filter((name) => name.startsWith("color.")).map((name) => [name, hexOf(tokens[name])]));
}

export async function checkAllThemes() {
  const results = [];
  for (const scheme of Object.keys(resolver.modifiers.scheme.contexts)) {
    for (const contrast of Object.keys(resolver.modifiers.contrast.contexts)) {
      const colours = hexColours(await resolveTokens({ scheme, contrast }));
      results.push({ theme: `${scheme}/${contrast}`, failures: failingPairs(colours), checked: PAIRS.length });
    }
  }
  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const results = await checkAllThemes();
  for (const { theme, failures, checked } of results) {
    console.log(`${theme}: ${checked - failures.length} of ${checked} pairs pass`);
    for (const { foreground, background, ratio, minimum } of failures) {
      console.log(`  FAIL ${foreground} on ${background}: ${ratio ?? "role not found"} (minimum ${minimum})`);
    }
  }
  process.exit(results.some((result) => result.failures.length) ? 1 : 0);
}
