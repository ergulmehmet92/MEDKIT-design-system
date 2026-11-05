import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

const css = () => readFileSync("dist/tokens/tokens.css", "utf8");
const faces = () => css().match(/@font-face \{[^}]*\}/g) ?? [];

describe("packaged fonts", () => {
  it("declare both Heros weights and Share Tech Mono", () => {
    const declared = faces().map((face) => [
      face.match(/font-family: "([^"]+)"/)?.[1],
      face.match(/font-weight: (\d+)/)?.[1],
    ].join(" "));

    expect(declared.sort()).toEqual([
      "Share Tech Mono 400",
      "TeX Gyre Heros 400",
      "TeX Gyre Heros 700",
    ]);
  });

  it("point at files that exist, relative to the generated stylesheet", () => {
    for (const face of faces()) {
      const url = face.match(/url\("([^"]+)"\)/)?.[1];
      expect(url, face).toBeTruthy();
      expect(existsSync(join(dirname("dist/tokens/tokens.css"), url)), url).toBe(true);
    }
  });

  it("keep text visible while fonts load", () => {
    for (const face of faces()) {
      expect(face).toContain("font-display: swap;");
    }
  });

  it("keep the layer order as the stylesheet's first statement", () => {
    const firstStatement = css().replace(/\/\*[\s\S]*?\*\//g, "").trim().split("\n")[0];

    expect(firstStatement).toBe("@layer reset, tokens, base, components, utilities;");
  });

  it("ship in the package, with their licences", () => {
    const { files } = JSON.parse(readFileSync("package.json", "utf8"));

    expect(files).toContain("fonts");
    expect(existsSync("fonts/GUST-FONT-LICENSE.txt")).toBe(true);
    expect(existsSync("fonts/Share-Tech-Mono-OFL.txt")).toBe(true);
    expect(existsSync("fonts/README.md")).toBe(true);
  });
});
