import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { ContactRoutes } from "./ContactRoutes";

afterEach(cleanup);

const routes = [
  { label: "Talk about a role", href: "mailto:a@example.com?subject=Role" },
  { label: "Start a project", href: "mailto:a@example.com?subject=Project" },
  { label: "Invite me to speak", href: "mailto:a@example.com?subject=Speak" },
];

describe("ContactRoutes", () => {
  it("renders each route as a real link, in a list", () => {
    render(<ContactRoutes routes={routes} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Start a project" }).getAttribute("href")).toBe(routes[1].href);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ContactRoutes routes={routes} />);

    expect((await axe.run(container)).violations).toEqual([]);
  });

  it("shows hover and focus, and lets long labels wrap", () => {
    const css = readFileSync("components/organisms/contact-routes/contact-routes.css", "utf8");

    expect(css).toContain("--mk-color-text-accent");
    expect(css).toContain("--mk-color-border-focus");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).toContain("--mk-font-size-feature");
  });
});
