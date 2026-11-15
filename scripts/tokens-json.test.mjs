import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const json = (p) => JSON.parse(readFileSync(p, "utf8"));
const out = json("dist/tokens/tokens.json");
const primitives = json("tokens/primitives.json");

describe("tokens.json, for code that can't read CSS", () => {
  it("resolves every colour role to hex in both themes", () => {
    for (const theme of ["forest", "paper"]) {
      const colours = out.color[theme];
      expect(Object.keys(colours).length).toBeGreaterThan(50);
      for (const hex of Object.values(colours)) expect(hex).toMatch(/^#[0-9a-f]{6}([0-9a-f]{2})?$/);
    }
  });

  it("matches the palette: Forest text on Forest, and Paper's own surface", () => {
    expect(out.color.forest["surface-default"]).toBe(primitives.color.forest.$value.hex);
    expect(out.color.paper["text-default"]).toBe(primitives.color.forest.$value.hex);
    expect(out.color.paper["surface-default"]).not.toBe(out.color.forest["surface-default"]);
  });

  it("carries the font stacks, sizes in px, and the package version", () => {
    expect(out.font.family.body).toMatch(/^'TeX Gyre Heros'/);
    expect(out.font.family.label).toMatch(/^'Share Tech Mono'/);
    expect(out.font.size.body).toBe(16);
    expect(out.version).toBe(json("package.json").version);
  });
});
