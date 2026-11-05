import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

afterEach(cleanup);

const css = () => readFileSync("components/atoms/button/button.css", "utf8");

describe("Button", () => {
  it("renders a native button with its label", () => {
    render(<Button>Get in touch</Button>);

    expect(screen.getByRole("button", { name: "Get in touch" })).toBeTruthy();
  });

  it("defaults to type button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("can still submit a form when asked", () => {
    render(<Button type="submit">Send</Button>);

    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  it("passes native props through to the button", () => {
    render(
      <Button disabled aria-describedby="hint">
        Save
      </Button>,
    );

    const button = screen.getByRole<HTMLButtonElement>("button");
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-describedby")).toBe("hint");
  });

  it("exposes its variant for styling, defaulting to primary", () => {
    const { rerender } = render(<Button>Save</Button>);
    expect(screen.getByRole("button").getAttribute("data-variant")).toBe("primary");

    rerender(<Button variant="quiet">Save</Button>);
    expect(screen.getByRole("button").getAttribute("data-variant")).toBe("quiet");
  });

  it("activates with a click, Enter and Space", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole("button"));
    await user.tab();
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("ignores activation when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    await user.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Save</Button>);

    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });
});

describe("Button styles", () => {
  it("read colour from semantic tokens and hold no raw colours", () => {
    expect(css()).toContain("--mk-color-action-background-primary-default");
    expect(css()).toContain("--mk-color-action-background-primary-lit");
    expect(css()).toContain("--mk-color-action-background-primary-far");
    expect(css()).toContain("--mk-color-material-specular");
    expect(css()).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|rgb\(/i);
  });

  it("keep hover from overmatching a disabled button", () => {
    expect(css()).toMatch(/:hover:not\(:disabled\)/);
  });

  it("use the brand's type, not the browser's default for buttons", () => {
    expect(css()).toContain("font-family: var(--mk-font-family-body)");
  });

  it("clear the 44px target, as a stadium", () => {
    expect(css()).toContain("min-block-size: 3rem");
    expect(css()).toContain("border-radius: var(--mk-radius-control)");
  });

  it("show a focus ring, using an outline so forced-colors mode keeps it", () => {
    expect(css()).toMatch(/:focus-visible \{[^}]*outline: var\(--mk-border-width-focus\) solid var\(--mk-color-border-focus\)/);
  });

  it("read the light from the source, with a usable default when there is none", () => {
    expect(css()).toContain("var(--mk-light-angle, 0deg)");
    expect(css()).toContain("var(--mk-light-near, 0.4)");
  });

  it("make the quiet variant glass, falling back to blur without a lens", () => {
    expect(css()).toContain("backdrop-filter: var(--mk-lens, blur(3px)) brightness(var(--mk-glass-brightness))");
  });

  it("stay readable without backdrop filters, or when less transparency is requested", () => {
    expect(css()).toMatch(/@supports not \(\(backdrop-filter: blur\(1px\)\) or \(-webkit-backdrop-filter: blur\(1px\)\)\)/);
    expect(css()).toContain("prefers-contrast: more");
    expect(css()).toContain("prefers-reduced-transparency: reduce");
  });

  it("drop the material and keep a real boundary in forced-colors mode", () => {
    const block = css().match(/@media \(forced-colors: active\) \{[\s\S]*$/)?.[0] ?? "";

    expect(block).toContain("border-color: var(--mk-color-border-strong)");
    expect(block).toMatch(/\[data-variant="quiet"\] \{[^}]*\bbackdrop-filter: none/);
    expect(block).toMatch(/\[data-variant="quiet"\] \{[^}]*box-shadow: none/);
    expect(block).toContain("display: none");
  });

  it("keep the hover sheen faint enough for the label to stay readable over bright light", () => {
    expect(css()).toContain("color-mix(in srgb, var(--_specular) 14%, transparent),\n          transparent 70%");
  });

  it("stop transitions for visitors who prefer reduced motion", () => {
    expect(css()).toMatch(/prefers-reduced-motion: reduce\) \{[\s\S]*transition: none/);
  });
});
