import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "../badge";
import { Avatar, initials } from "./Avatar";

afterEach(cleanup);

describe("Avatar", () => {
  it("takes initials from the first and last words", () => {
    expect(initials("Mehmet Ergul")).toBe("ME");
    expect(initials("ada")).toBe("A");
    expect(initials("Jean Luc de Picard")).toBe("JP");
    expect(initials("  ")).toBe("");
  });

  it("shows the image, named by the person", () => {
    render(<Avatar name="Mehmet Ergul" src="me.png" />);
    expect(screen.getByRole("img", { name: "Mehmet Ergul" }).tagName).toBe("IMG");
  });

  it("falls back to initials when the image fails, and to a silhouette with no name", () => {
    const { rerender, container } = render(<Avatar name="Mehmet Ergul" src="missing.png" />);
    fireEvent.error(container.querySelector("img")!);
    expect(screen.getByRole("img", { name: "Mehmet Ergul" }).textContent).toBe("ME");

    rerender(<Avatar />);
    expect(screen.getByRole("img", { name: "No picture" }).getAttribute("data-kind")).toBe("missing");
  });

  it("hides itself when the name is written beside it", () => {
    const { container } = render(
      <p>
        <Avatar name="Mehmet Ergul" decorative /> Mehmet Ergul
      </p>,
    );
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector(".mk-avatar")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("passes axe in every state", async () => {
    const { container } = render(
      <div>
        <Avatar name="Mehmet Ergul" src="me.png" />
        <Avatar name="Mehmet Ergul" size="sm" />
        <Avatar size="lg" />
      </div>,
    );
    expect((await axe.run(container)).violations).toEqual([]);
  });
});

describe("Badge", () => {
  it("labels with a tone, and passes axe", async () => {
    const { container } = render(
      <p>
        <Badge>Draft</Badge> <Badge tone="accent">New</Badge> <Badge tone="version">v2.0.0</Badge>
      </p>,
    );
    expect([...container.querySelectorAll(".mk-badge")].map((b) => b.getAttribute("data-tone"))).toEqual(["neutral", "accent", "version"]);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
