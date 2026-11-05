import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "./Button";

afterEach(cleanup);

describe("Button", () => {
  it("renders a native button with its label", () => {
    render(<Button>Get in touch</Button>);

    expect(screen.getByRole("button", { name: "Get in touch" })).toBeTruthy();
  });

  it("defaults to type button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
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

  it("exposes its variant for styling", () => {
    render(<Button variant="quiet">Save</Button>);

    expect(screen.getByRole("button").getAttribute("data-variant")).toBe("quiet");
  });

  it("reads colour from semantic tokens and holds no raw colours", () => {
    const css = readFileSync("components/atoms/button/button.css", "utf8");

    expect(css).toContain("--mk-color-action-background-primary-default");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|rgb\(/i);
  });
});
