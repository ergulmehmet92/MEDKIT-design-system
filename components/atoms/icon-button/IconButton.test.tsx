import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";

afterEach(cleanup);

const icon = <svg aria-hidden="true" width="16" height="16" />;

describe("IconButton", () => {
  it("takes its accessible name from the required label", () => {
    render(<IconButton label="Open menu">{icon}</IconButton>);

    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
  });

  it("shows the label as a tooltip for pointer users", () => {
    render(<IconButton label="Open menu">{icon}</IconButton>);

    expect(screen.getByRole("button").getAttribute("title")).toBe("Open menu");
  });

  it("uses the quiet button style, so its boundary stays visible", () => {
    render(<IconButton label="Open menu">{icon}</IconButton>);

    expect(screen.getByRole("button").getAttribute("data-variant")).toBe("quiet");
  });

  it("works from the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton label="Open menu" onClick={onClick}>
        {icon}
      </IconButton>,
    );

    await user.tab();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<IconButton label="Open menu">{icon}</IconButton>);

    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });

  it("outranks Button's padding however the stylesheets are ordered", () => {
    const css = readFileSync("components/atoms/icon-button/icon-button.css", "utf8");

    expect(css).toContain(".mk-button.mk-icon-button");
  });

  it("is a square at the control size, matching Button in both densities", () => {
    const css = readFileSync("components/atoms/icon-button/icon-button.css", "utf8");

    expect(css).toContain("inline-size: var(--mk-size-control)");
    expect(css).toContain("block-size: var(--mk-size-control)");
  });
});
