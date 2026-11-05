import { readFileSync } from "node:fs";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { ThemeSwitch } from "../../molecules/theme-switch";
import { Header } from "./Header";

// jsdom doesn't implement modal dialogs. A real browser test covers the focus behaviour.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

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

  it("labels its inline navigation", () => {
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

  it("renders no navigation or menu button when there are no links", () => {
    render(<Header brand={<a href="/">Home</a>} />);

    expect(screen.queryByRole("navigation")).toBeNull();
    expect(screen.queryByRole("button", { name: "Open menu" })).toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(example);

    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });
});

describe("Header menu", () => {
  const openMenu = async () => {
    const user = userEvent.setup();
    render(example);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    return { user, dialog: screen.getByRole("dialog", { name: "Menu" }) };
  };

  it("starts closed", () => {
    render(example);

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("opens to show every link", async () => {
    const { dialog } = await openMenu();

    expect(within(dialog).getAllByRole("link").map((link) => link.textContent)).toEqual(["Work", "Systems", "Experiments"]);
  });

  it("announces that it's open", async () => {
    await openMenu();

    const trigger = document.querySelector('[aria-haspopup="dialog"]');
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
  });

  it("closes from its close button", async () => {
    const { user, dialog } = await openMenu();

    await user.click(within(dialog).getByRole("button", { name: "Close menu" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes when a link is chosen, so the new page isn't hidden behind it", async () => {
    const { user, dialog } = await openMenu();

    await user.click(within(dialog).getByRole("link", { name: "Work" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("has no accessibility violations while open", async () => {
    const { dialog } = await openMenu();

    const { violations } = await axe.run(dialog);
    expect(violations).toEqual([]);
  });
});

describe("Header styles", () => {
  const css = () => readFileSync("components/organisms/header/header.css", "utf8");

  it("swap between the menu and inline links with a container query, so they follow the space available", () => {
    expect(css()).toContain("container-type: inline-size");
    expect(css()).toMatch(/@container \(min-width: 40rem\) \{[\s\S]*\.mk-header-menu-trigger \{\s+display: none;/);
    expect(css()).toMatch(/\.mk-header-navigation \{\s+display: none;/);
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

  it("contain scrolling in the open menu without locking the page, which would shift the layout", () => {
    expect(css()).toMatch(/\.mk-header-menu:modal \{[^}]*overscroll-behavior: contain;/);
    expect(css()).toMatch(/\.mk-header-menu::backdrop \{[^}]*overscroll-behavior: contain;/);
    expect(css()).not.toMatch(/(html|body|:root)[^{]*\{[^}]*overflow: hidden/);
  });

  it("only set the menu's display while it's open, so it stays closed by default", () => {
    expect(css()).toMatch(/\.mk-header-menu\[open\] \{[^}]*display: flex;/);
  });
});
