import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Section } from "./Section";

afterEach(cleanup);

const css = () => readFileSync("components/organisms/section/section.css", "utf8");

describe("Section", () => {
  it("renders a section region named by its heading", () => {
    render(
      <Section aria-labelledby="work-title">
        <h2 id="work-title">Case studies</h2>
      </Section>,
    );

    expect(screen.getByRole("region", { name: "Case studies" })).toBeTruthy();
  });

  it("follows the page's tone by default", () => {
    const { container } = render(<Section>Text</Section>);

    const section = container.querySelector("section")!;
    expect(section.getAttribute("data-tone")).toBe("page");
    expect(section.hasAttribute("data-theme")).toBe(false);
  });

  it("flips to the opposite tone with CSS alone, so a saved theme doesn't flash", () => {
    const { container } = render(<Section tone="inverse">Text</Section>);

    expect(container.querySelector("section")!.hasAttribute("data-theme")).toBe(false);
    expect(css()).toMatch(/\[data-tone="inverse"\] \{[^}]*color-scheme: light/);
    expect(css()).toMatch(/:root\[data-theme="paper"\] \.mk-section\[data-tone="inverse"\] \{\s*color-scheme: dark/);
  });

  it("can pin Forest or Paper whatever the page's theme", () => {
    const { container } = render(<Section tone="paper">Text</Section>);

    expect(container.querySelector("section")!.getAttribute("data-theme")).toBe("paper");
  });

  it("can draw the grid rails behind its content", () => {
    const { container } = render(<Section rails>Text</Section>);

    expect(container.querySelector(".mk-grid-rails")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("passes native props through and keeps a consumer's class", () => {
    const { container } = render(
      <Section id="work" className="extra">
        Text
      </Section>,
    );

    const section = container.querySelector("section")!;
    expect(section.id).toBe("work");
    expect(section.className).toBe("mk-section extra");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Section tone="inverse" aria-labelledby="t">
        <h2 id="t">Back to the core</h2>
      </Section>,
    );

    expect((await axe.run(container)).violations).toEqual([]);
  });

  it("spaces itself from density tokens", () => {
    expect(css()).toContain("var(--mk-inset-section)");
    expect(css()).toContain("var(--mk-page-inset)");
    expect(css()).toContain("var(--mk-gap-xl)");
    expect(css()).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(/i);
  });
});
