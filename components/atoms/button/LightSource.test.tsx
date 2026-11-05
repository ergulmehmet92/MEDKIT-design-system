import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { lensMap, lightOn } from "./light";
import { LightSource } from "./LightSource";

const box = { left: 100, top: 100, width: 100, height: 40 };

describe("lightOn", () => {
  it("measures the angle clockwise from straight up", () => {
    expect(lightOn({ x: 150, y: 0 }, box, 500).angle).toBeCloseTo(0);
    expect(lightOn({ x: 400, y: 120 }, box, 500).angle).toBeCloseTo(90);
    expect(Math.abs(lightOn({ x: 150, y: 400 }, box, 500).angle)).toBeCloseTo(180);
    expect(lightOn({ x: 0, y: 120 }, box, 500).angle).toBeCloseTo(-90);
  });

  it("places the source relative to the button, in percent", () => {
    const light = lightOn({ x: 150, y: 120 }, box, 500);

    expect(light.x).toBeCloseTo(50);
    expect(light.y).toBeCloseTo(50);
  });

  it("fades with distance and stops at the reach", () => {
    expect(lightOn({ x: 150, y: 120 }, box, 500).near).toBeCloseTo(1);
    expect(lightOn({ x: 150, y: 370 }, box, 500).near).toBeCloseTo(0.5);
    expect(lightOn({ x: 150, y: 5000 }, box, 500).near).toBe(0);
  });
});

describe("lensMap", () => {
  const at = (map: Uint8ClampedArray, width: number, x: number, y: number) => Array.from(map.slice((y * width + x) * 4, (y * width + x) * 4 + 4));

  it("leaves the middle of the glass unbent", () => {
    const map = lensMap(120, 48, 24, 18);

    expect(at(map, 120, 60, 24).slice(0, 2).every((value) => Math.abs(value - 128) <= 1)).toBe(true);
  });

  it("bends inward at the rim, in both directions", () => {
    const map = lensMap(120, 48, 24, 18);

    expect(at(map, 120, 60, 0)[1]).toBeGreaterThan(200);
    expect(at(map, 120, 60, 47)[1]).toBeLessThan(56);
    expect(at(map, 120, 0, 24)[0]).toBeGreaterThan(200);
    expect(at(map, 120, 119, 24)[0]).toBeLessThan(56);
  });

  it("is opaque, so colour isn't premultiplied away", () => {
    const map = lensMap(48, 48, 24, 18);

    expect(at(map, 48, 3, 3)[3]).toBe(255);
  });
});

describe("LightSource", () => {
  const userAgent = vi.spyOn(window.navigator, "userAgent", "get");

  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (run: FrameRequestCallback) => setTimeout(() => run(performance.now()), 0) as unknown as number);
    vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    userAgent.mockReset();
  });

  const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

  it("renders nothing of its own", () => {
    const { container } = render(<LightSource />);

    expect(container.innerHTML).toBe("");
  });

  it("lights every button from the pointer", async () => {
    render(
      <>
        <LightSource />
        <Button>Save</Button>
        <Button variant="quiet">Back</Button>
      </>,
    );

    document.dispatchEvent(new PointerEvent("pointermove", { clientX: 40, clientY: 40 }));
    await settle();

    for (const button of screen.getAllByRole("button")) {
      expect(button.style.getPropertyValue("--mk-light-angle")).toMatch(/deg$/);
      expect(button.style.getPropertyValue("--mk-light-near")).not.toBe("");
    }
  });

  it("lights a button added after it started", async () => {
    const { rerender } = render(<LightSource />);
    rerender(
      <>
        <LightSource />
        <Button>Save</Button>
      </>,
    );

    document.dispatchEvent(new PointerEvent("pointermove", { clientX: 40, clientY: 40 }));
    await settle();

    expect(screen.getByRole("button").style.getPropertyValue("--mk-light-angle")).toMatch(/deg$/);
  });

  it("stops following the pointer and removes its filters when unmounted", async () => {
    const { unmount } = render(
      <>
        <LightSource />
        <Button>Save</Button>
      </>,
    );
    const button = screen.getByRole("button");
    const kept = document.createElement("button");
    kept.className = "mk-button";
    document.body.append(kept);

    unmount();
    document.dispatchEvent(new PointerEvent("pointermove", { clientX: 40, clientY: 40 }));
    await settle();

    expect(kept.style.getPropertyValue("--mk-light-angle")).toBe("");
    expect(button.isConnected).toBe(false);
    expect(document.querySelector("svg[data-mk-lens]")).toBeNull();
    kept.remove();
  });

  it("only builds a lens in Chromium, where backdrop-filter accepts SVG filters", async () => {
    userAgent.mockReturnValue("Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15");
    render(
      <>
        <LightSource />
        <Button variant="quiet">Back</Button>
      </>,
    );
    await settle();

    expect(document.querySelector("svg[data-mk-lens]")).toBeNull();
    expect(screen.getByRole("button").style.getPropertyValue("--mk-lens")).toBe("");
  });
});
