import { readFileSync } from "node:fs";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeSwitch } from "../../molecules/theme-switch";
import { Header } from "./Header";

afterEach(cleanup);

const example = (
  <Header brand={<a href="/">Mehmet Ergul</a>} actions={<ThemeSwitch />}>
    <a href="#work">Work</a>
    <a href="#systems">Systems</a>
    <a href="#experiments">Experiments</a>
  </Header>
);

describe("Header", () => {
  it("is the page's banner landmark", () => {
    render(example);

    expect(screen.getByRole("banner")).toBeTruthy();
  });

  it("labels its navigation landmark", () => {
    render(example);

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeTruthy();
  });

  it("accepts a different navigation label", () => {
    render(
      <Header brand={<a href="/">Home</a>} navigationLabel="Main menu">
        <a href="#work">Work</a>
      </Header>,
    );

    expect(screen.getByRole("navigation", { name: "Main menu" })).toBeTruthy();
  });

  it("lists each navigation item, so screen readers announce the count", () => {
    render(example);

    const navigation = screen.getByRole("navigation", { name: "Primary" });
    expect(within(navigation).getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders no empty navigation when there are no links", () => {
    render(<Header brand={<a href="/">Home</a>} />);

    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("keeps a logical tab order: brand, links, then actions", async () => {
    const user = userEvent.setup();
    render(example);

    const order: (string | null)[] = [];
    for (let step = 0; step < 5; step += 1) {
      await user.tab();
      order.push(document.activeElement?.textContent ?? null);
    }

    expect(order).toEqual(["Mehmet Ergul", "Work", "Systems", "Experiments", "Forest"]);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(example);

    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });
});

describe("Header styles", () => {
  const css = () => readFileSync("components/organisms/header/header.css", "utf8");

  it("adapt to the space they get, using container queries", () => {
    expect(css()).toContain("container-type: inline-size");
    expect(css()).toMatch(/@container \(min-width: [\d.]+rem\)/);
  });

  it("read semantic tokens only", () => {
    expect(css()).toContain("--mk-font-family-label");
    expect(css()).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|--mk-color-forest|--mk-space-\d/i);
  });

  it("keep link targets at least 44px tall", () => {
    expect(css()).toContain("min-block-size: 2.75rem");
  });

  it("show a focus ring on links", () => {
    expect(css()).toMatch(/:focus-visible \{[^}]*outline: var\(--mk-border-width-focus\) solid var\(--mk-color-border-focus\)/);
  });
});
