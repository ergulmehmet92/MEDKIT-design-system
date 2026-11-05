import { readFileSync } from "node:fs";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeSwitch } from "./ThemeSwitch";
import { THEME_STORAGE_KEY, themeScript } from "./theme";

const root = () => document.documentElement;

beforeEach(() => {
  localStorage.clear();
  delete root().dataset.theme;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ThemeSwitch", () => {
  it("starts on Forest for a first-time visitor", () => {
    render(<ThemeSwitch />);

    expect(screen.getByRole("button").textContent).toBe("Forest");
  });

  it("names the current theme and what pressing it does", () => {
    render(<ThemeSwitch />);

    expect(screen.getByRole("button", { name: "Forest theme. Switch to Paper" })).toBeTruthy();
  });

  it("switches the whole page to Paper and remembers the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    await user.click(screen.getByRole("button"));

    expect(root().dataset.theme).toBe("paper");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("paper");
    expect(screen.getByRole("button").textContent).toBe("Paper");
  });

  it("switches back to Forest", async () => {
    const user = userEvent.setup();
    root().dataset.theme = "paper";
    render(<ThemeSwitch />);

    await user.click(screen.getByRole("button"));

    expect(root().dataset.theme).toBe("forest");
    expect(screen.getByRole("button").textContent).toBe("Forest");
  });

  it("works from the keyboard", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    await user.tab();
    await user.keyboard("{Enter}");

    expect(root().dataset.theme).toBe("paper");
  });

  it("still switches when the browser blocks storage", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<ThemeSwitch />);

    await user.click(screen.getByRole("button"));

    expect(root().dataset.theme).toBe("paper");
  });

  it("follows a change made in another tab", () => {
    render(<ThemeSwitch />);

    fireEvent(window, new StorageEvent("storage", { key: THEME_STORAGE_KEY, newValue: "paper" }));

    expect(root().dataset.theme).toBe("paper");
    expect(screen.getByRole("button").textContent).toBe("Paper");
  });

  it("renders Forest on the server, whatever the browser holds", () => {
    root().dataset.theme = "paper";

    expect(renderToString(<ThemeSwitch />)).toContain("Forest");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ThemeSwitch />);

    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });

  it("styles only from semantic tokens", () => {
    const css = readFileSync("components/molecules/theme-switch/theme-switch.css", "utf8");

    expect(css).toContain("--mk-font-family-label");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(/i);
  });
});

describe("themeScript", () => {
  const run = () => new Function(themeScript)();

  it("applies a saved Paper choice", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "paper");

    run();

    expect(root().dataset.theme).toBe("paper");
  });

  it("leaves first-time visitors on the default", () => {
    run();

    expect(root().dataset.theme).toBeUndefined();
  });

  it("ignores values it doesn't recognise", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "neon");

    run();

    expect(root().dataset.theme).toBeUndefined();
  });

  it("doesn't throw when the browser blocks storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(run).not.toThrow();
  });

  it("never reads the device's colour preference", () => {
    expect(themeScript).not.toContain("prefers-color-scheme");
  });
});
