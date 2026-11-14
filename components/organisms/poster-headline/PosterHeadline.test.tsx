import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { PosterHeadline } from "./PosterHeadline";

afterEach(cleanup);

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const multiply = (a: string, b: string) =>
  "#" + [1, 3, 5].map((i) => Math.round((parseInt(a.slice(i, i + 2), 16) * parseInt(b.slice(i, i + 2), 16)) / 255).toString(16).padStart(2, "0")).join("");
const primitive = (name: string) => JSON.parse(readFileSync("tokens/primitives.json", "utf8")).color[name].$value.hex as string;
const blaze = (role: string) => primitive(JSON.parse(readFileSync("tokens/semantic.json", "utf8")).color.blaze[role].$value.replace(/^\{color\.|\}$/g, ""));

describe("PosterHeadline", () => {
  it("keeps the headline as real text, with the byline and shape beside it", () => {
    const { container } = render(
      <PosterHeadline byline={["Mehmet Ergul", "[Thesis]", "The system that produces it"]}>
        not <br />
        the <br />
        artifact
      </PosterHeadline>,
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent?.replace(/\s+/g, " ").trim()).toBe("not the artifact");
    expect(container.querySelector(".mk-poster-shape")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".mk-living-light")?.getAttribute("data-theme")).toBe("blaze");
  });

  it("drops the shape on request, and passes axe", async () => {
    const { container } = render(<PosterHeadline as="h2" shape="none">Back to the core</PosterHeadline>);
    expect(container.querySelector(".mk-poster-shape")).toBeNull();
    expect((await axe.run(container)).violations).toEqual([]);
  });

  it("keeps cut-through type at 3:1 or better at the Blaze light's darkest point", () => {
    const light = blaze("base");
    const sheet = multiply(primitive("forest"), light);
    const ratio = (Math.max(lum(light), lum(sheet)) + 0.05) / (Math.min(lum(light), lum(sheet)) + 0.05);
    expect(ratio).toBeGreaterThanOrEqual(3);
  });

  it("falls back to plain text in forced colours", () => {
    const css = readFileSync("components/organisms/poster-headline/poster-headline.css", "utf8");
    expect(css).toMatch(/forced-colors: active[\s\S]*mix-blend-mode: normal/);
  });
});
