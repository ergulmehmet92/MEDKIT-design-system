import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { StatusLamp } from "../../atoms/status-lamp";
import { StatusPill } from "./StatusPill";

afterEach(cleanup);

const css = readFileSync("components/atoms/status-lamp/status-lamp.css", "utf8");

describe("StatusLamp", () => {
  it("is decoration only, hidden from assistive technology", () => {
    const { container } = render(<StatusLamp status="failed" size="large" />);
    const lamp = container.querySelector(".mk-status-lamp")!;

    expect(lamp.getAttribute("aria-hidden")).toBe("true");
    expect(lamp.getAttribute("data-status")).toBe("failed");
    expect(lamp.getAttribute("data-size")).toBe("large");
  });

  it("reads its colours from the status tokens", () => {
    for (const s of ["live", "stale", "failed"]) expect(css).toContain(`var(--mk-color-status-${s})`);
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  it("moves on the motion tokens, never blinks faster than once a second, and has still versions", () => {
    expect(css).toContain("var(--mk-motion-duration-lamp-pulse)");
    expect(css).toContain("animation: mk-status-alarm var(--mk-motion-duration-lamp-blink)");
    expect(css).not.toMatch(/animation: mk-status-\w+ [\d.]+s/);
    const blink = JSON.parse(readFileSync("dist/tokens/motion.json", "utf8")).duration["lamp-blink"];
    expect(blink).toBeGreaterThanOrEqual(1000);
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("[data-still]");
  });
});

describe("StatusPill", () => {
  it("always shows a word beside the lamp", () => {
    const { container } = render(<StatusPill status="stale" />);

    expect(container.textContent).toBe("Stale");
    expect(container.querySelector(".mk-status-lamp")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("takes a sentence, and announces changes when asked", () => {
    render(<StatusPill status="failed" live>Daily snapshot failed</StatusPill>);
    expect(screen.getByRole("status").textContent).toBe("Daily snapshot failed");
  });

  it("passes axe", async () => {
    const { container } = render(
      <p>
        <StatusPill status="live">Daily snapshot is live</StatusPill>
      </p>,
    );
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
