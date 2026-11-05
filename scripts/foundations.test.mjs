import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const primitives = () => JSON.parse(readFileSync("tokens/primitives.json", "utf8"));
const semantic = () => JSON.parse(readFileSync("tokens/semantic.json", "utf8"));
const css = () => readFileSync("dist/tokens/tokens.css", "utf8");
const steps = (group) => Object.keys(group).filter((key) => !key.startsWith("$"));

function tokensIn(node, path = []) {
  return Object.entries(node).flatMap(([key, value]) => {
    if (key.startsWith("$") || !value || typeof value !== "object") return [];
    if ("$value" in value) return [{ path: [...path, key].join("."), value: value.$value }];
    return tokensIn(value, [...path, key]);
  });
}

describe("foundation scales", () => {
  // Two densities share one scale, so the limit is 11 steps in total, and each density's
  // roles still come from 8 steps at most (approved with the Density board on 2026-11-05).
  it("keep the type scale to 11 steps across both densities, against 41 sizes in v1", () => {
    const count = steps(primitives().font.size).length;

    expect(count).toBeGreaterThanOrEqual(6);
    expect(count).toBeLessThanOrEqual(11);
  });

  it("keep spacing to 8 to 12 steps on a 4px grid, against 114 values in v1", () => {
    const scale = primitives().space;
    const names = steps(scale);

    expect(names.length).toBeGreaterThanOrEqual(8);
    expect(names.length).toBeLessThanOrEqual(12);
    for (const name of names) {
      expect((scale[name].$value.value * 16) % 4, name).toBe(0);
    }
  });

  it("stay square by default, with stadium controls and circles", () => {
    expect(steps(primitives().radius)).toEqual(["none", "full"]);
    expect(semantic().radius.default.$value).toBe("{radius.none}");
    expect(semantic().radius.control.$value).toBe("{radius.full}");
    expect(semantic().radius.circle.$value).toBe("{radius.full}");
  });

  it("let Lens dim the light behind it on Forest only", () => {
    const paper = JSON.parse(readFileSync("tokens/semantic.paper.json", "utf8"));

    expect(semantic().glass.brightness.$value).toBe("{brightness.dim}");
    expect(paper.glass.brightness.$value).toBe("{brightness.full}");
  });

  it("only offer the weights the two typefaces ship", () => {
    const weights = Object.values(primitives().font.weight).map((token) => token.$value).filter(Boolean);

    expect(weights.sort()).toEqual([400, 700]);
  });
});

describe("labels", () => {
  it("use Share Tech Mono at the size approved on the canvas", () => {
    expect(primitives().font.family.mono.$value[0]).toBe("Share Tech Mono");
    expect(primitives().font.size["100"].$value).toEqual({ value: 0.9375, unit: "rem" });
    expect(css()).toContain("--mk-tracking-label: 0.06em;");
  });
});

describe("motion", () => {
  it("carries Dawn's timing from the approved canvas", () => {
    const motion = semantic().motion;
    const milliseconds = (alias) => primitives().time[alias.$value.match(/^\{time\.(\d+)\}$/)[1]].$value;

    expect(milliseconds(motion.duration["theme-light"])).toEqual({ value: 1800, unit: "ms" });
    expect(milliseconds(motion.duration["theme-text"])).toEqual({ value: 1400, unit: "ms" });
    expect(milliseconds(motion.delay["theme-text"])).toEqual({ value: 200, unit: "ms" });
  });

  it("moves text and surfaces with the theme, unless a visitor prefers reduced motion", () => {
    const base = css().match(/@layer base \{[\s\S]*\n\}/)?.[0] ?? "";

    expect(base).toContain("var(--mk-motion-duration-theme-text)");
    expect(base).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*transition: none;/);
  });
});

describe("fluid display type", () => {
  const rem = (name) => primitives().font.size[name].$value.value;

  it.each(["display", "heading"])("keeps %s within 2.5 times its minimum, so zooming still works", (role) => {
    const match = css().match(new RegExp(`--mk-font-size-${role}: clamp\\(var\\(--mk-font-size-(\\d+)\\), [^,]+, var\\(--mk-font-size-(\\d+)\\)\\);`));

    expect(match, role).not.toBeNull();
    expect(rem(match[2]) / rem(match[1])).toBeLessThanOrEqual(2.5);
  });

  it("mixes rem into the fluid part, so browser zoom keeps working at every width", () => {
    expect(css()).toMatch(/--mk-font-size-display: clamp\([^,]+, [\d.]+rem \+ [\d.]+vw, /);
  });
});

describe("semantic foundations", () => {
  it("hold aliases only, never raw values", () => {
    const { color, ...rest } = semantic();
    delete rest.$schema;
    delete rest.$description;

    for (const token of tokensIn(rest)) {
      expect(token.value, token.path).toMatch(/^\{[^{}]+\}$/);
    }
    expect(color).toBeDefined();
  });

  it("remove the browser's default page margin, so themed sections reach the edge", () => {
    const base = css().match(/@layer base \{[\s\S]*\n\}/)?.[0] ?? "";

    expect(base).toMatch(/:where\(body\) \{\s+margin: 0;/);
  });

  it("set the page's type from tokens", () => {
    const base = css().match(/@layer base \{[\s\S]*\n\}/)?.[0] ?? "";

    expect(base).toContain("font-family: var(--mk-font-family-body);");
    expect(base).toContain("line-height: var(--mk-line-height-body);");
  });
});

describe("poster type", () => {
  // The 2.5 times rule keeps zoom working for reading sizes. Poster type starts at 4rem, so it's
  // never small enough to need zooming, and a tighter range wouldn't fit a 320px screen.
  it("stays at 4rem or more, growing towards the Poster board's size on wide screens", () => {
    const match = css().match(/--mk-font-size-poster: clamp\(([\d.]+)rem, [\d.]+rem \+ [\d.]+vw, ([\d.]+)rem\);/);

    expect(match).not.toBeNull();
    expect(Number(match[1])).toBeGreaterThanOrEqual(4);
    expect(Number(match[2]) * 16).toBeGreaterThanOrEqual(280);
  });

  it("carries the tracking and leading approved on the Poster board", () => {
    expect(css()).toContain("--mk-tracking-poster: -0.055em;");
    expect(css()).toMatch(/--mk-line-height-poster: var\(--mk-leading-\w+\);/);
    expect(primitives().leading["084"].$value).toBe(0.84);
  });
});

describe("section spacing", () => {
  it("is fluid in editorial density and fixed in analytical density", () => {
    expect(css()).toMatch(/:root \{[\s\S]*--mk-inset-section: clamp\(/);
    expect(css()).toMatch(/\[data-density="analytical"\] \{[^}]*--mk-inset-section: var\(--mk-space-6\);/);
  });
});
