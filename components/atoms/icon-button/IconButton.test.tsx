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

  it("is a 48px square, clearing the 44px target", () => {
    const css = readFileSync("components/atoms/icon-button/icon-button.css", "utf8");

    expect(css).toContain("inline-size: 3rem");
    expect(css).toContain("block-size: 3rem");
  });
});
