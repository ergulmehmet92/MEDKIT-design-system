import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { ArrowLink } from "./ArrowLink";
import { Link } from "./Link";

afterEach(cleanup);

const css = () => readFileSync("components/atoms/link/link.css", "utf8");

describe("Link", () => {
  it("renders a native link inside running text", () => {
    render(
      <p>
        Read the <Link href="/work/annotation">annotation story</Link>.
      </p>,
    );

    const link = screen.getByRole("link", { name: "annotation story" });
    expect(link.getAttribute("href")).toBe("/work/annotation");
    expect(link.className).toBe("mk-link");
  });

  it("passes native props through", () => {
    render(
      <Link href="https://github.com" target="_blank" rel="noreferrer">
        GitHub
      </Link>,
    );

    expect(screen.getByRole("link").getAttribute("target")).toBe("_blank");
  });

  it("is reachable by keyboard", async () => {
    const user = userEvent.setup();
    render(<Link href="#log">build log</Link>);

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("link"));
  });

  it("keeps an underline, so links never rely on colour alone", () => {
    expect(css()).toMatch(/\.mk-link \{[^}]*text-decoration-line: underline/);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <p>
        See the <Link href="#">build log</Link>.
      </p>,
    );

    expect((await axe.run(container)).violations).toEqual([]);
  });
});

describe("ArrowLink", () => {
  it("names the link by its label only, keeping the arrow out of the accessible name", () => {
    render(<ArrowLink href="/work/annotation">Read the story</ArrowLink>);

    const link = screen.getByRole("link", { name: "Read the story" });
    expect(link.className).toBe("mk-arrow-link");
    expect(link.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("meets the control size, so it's an easy target in both densities", () => {
    expect(css()).toMatch(/\.mk-arrow-link \{[^}]*min-block-size: var\(--mk-size-control\)/);
    expect(css()).toContain("var(--mk-font-size-standalone)");
  });

  it("keeps its motion to the arrow, and stops it for reduced motion", () => {
    expect(css()).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });

  it("styles only from semantic tokens", () => {
    expect(css()).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|--mk-color-(honey|forest|grey)/i);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ArrowLink href="#">Open the ledger</ArrowLink>);

    expect((await axe.run(container)).violations).toEqual([]);
  });
});
