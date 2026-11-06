import { readFileSync } from "node:fs";
import { act, cleanup, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setTheme } from "../../molecules/theme-switch";
import { LivingLight } from "./LivingLight";

const css = () => readFileSync("components/atoms/living-light/living-light.css", "utf8");

function fakeGl() {
  const uniforms: Record<string, unknown> = {};
  const lose = vi.fn();
  const gl = new Proxy(
    {
      getExtension: () => ({ loseContext: lose }),
      getShaderParameter: () => true,
      getProgramParameter: () => true,
      getUniformLocation: (_: unknown, name: string) => name,
      uniform1f: (name: string, value: number) => (uniforms[name] = value),
      uniform3fv: (name: string, value: number[]) => (uniforms[name] = value),
      createShader: () => ({}),
      createProgram: () => ({}),
      createBuffer: () => ({}),
    } as Record<string, unknown>,
    { get: (target, key: string) => target[key] ?? vi.fn() },
  );
  return { gl, lose, uniforms };
}

describe("LivingLight", () => {
  let frames: FrameRequestCallback[] = [];
  let clock = 1000;
  const runFrames = (count = 1) => {
    for (let i = 0; i < count; i++) {
      clock += 40;
      frames.splice(0).forEach((run) => run(clock));
    }
  };

  beforeEach(() => {
    frames = [];
    vi.stubGlobal("requestAnimationFrame", (run: FrameRequestCallback) => frames.push(run));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete document.documentElement.dataset.theme;
  });

  it("renders on the server with the fallback, and no drawing", () => {
    const html = renderToString(<LivingLight />);

    expect(html).toContain("mk-living-light");
    expect(html).not.toContain("data-ready");
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<LivingLight />);

    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("keeps the fallback when WebGL is unavailable", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const { container } = render(<LivingLight />);

    expect(container.querySelector("canvas")?.hasAttribute("data-ready")).toBe(false);
  });

  it("shows the canvas once it has drawn", () => {
    const { gl } = fakeGl();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(gl as never);
    const { container } = render(<LivingLight />);

    runFrames();

    expect(container.querySelector("canvas")?.hasAttribute("data-ready")).toBe(true);
  });

  it("goes back to the fallback if the context is lost", () => {
    const { gl } = fakeGl();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(gl as never);
    const { container } = render(<LivingLight />);
    runFrames();

    container.querySelector("canvas")?.dispatchEvent(new Event("webglcontextlost"));

    expect(container.querySelector("canvas")?.hasAttribute("data-ready")).toBe(false);
  });

  it("releases its context when unmounted, because browsers limit how many can be open", () => {
    const { gl, lose } = fakeGl();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(gl as never);
    const { unmount } = render(<LivingLight />);

    unmount();

    expect(lose).toHaveBeenCalled();
  });

  it("runs Dawn when the page's theme changes, with no extra wiring", () => {
    const { gl, uniforms } = fakeGl();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(gl as never);
    render(<LivingLight />);
    runFrames();
    expect(uniforms.uShift).toBe(1);

    act(() => setTheme("paper"));
    runFrames();

    expect(uniforms.uShift).toBeLessThan(1);
  });

  it("doesn't run Dawn when its theme is pinned", () => {
    const { gl, uniforms } = fakeGl();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(gl as never);
    render(<LivingLight theme="forest" />);
    runFrames();

    act(() => setTheme("paper"));
    runFrames();

    expect(uniforms.uShift).toBe(1);
  });

  it("draws one still frame and stops for reduced motion", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const { gl } = fakeGl();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(gl as never);
    render(<LivingLight />);

    runFrames();

    expect(frames).toHaveLength(0);
  });

  it("uses the grain and speed Mehmet tuned on the Grain board: light, 2px grain over a quicker light", () => {
    const { gl, uniforms } = fakeGl();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(gl as never);
    render(<LivingLight theme="forest" />);
    runFrames();

    expect(uniforms.uGrain).toBeCloseTo(0.02);
    expect(uniforms.uGrainSize).toBeGreaterThanOrEqual(2);
    const shader = readFileSync("components/atoms/living-light/shader.ts", "utf8");
    expect(shader).toContain("floor(gl_FragCoord.xy / uGrainSize)");
  });

  it("reseeds its grain ten times a second, whatever the light's speed", () => {
    const { gl, uniforms } = fakeGl();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(gl as never);
    render(<LivingLight speed={3} />);
    const seeds = new Set<unknown>();
    for (let i = 0; i < 25; i++) {
      runFrames();
      seeds.add(uniforms.uN);
    }

    // 25 frames 40ms apart is one second: about ten different seeds, not thirty.
    expect(seeds.size).toBeGreaterThanOrEqual(9);
    expect(seeds.size).toBeLessThanOrEqual(11);
  });

  it("passes its pinned theme to the fallback, through data-theme", () => {
    const { container } = render(<LivingLight theme="paper" />);

    expect(container.firstElementChild?.getAttribute("data-theme")).toBe("paper");
  });
});

describe("LivingLight styles", () => {
  it("read the fallback from tokens, and hold no raw colours", () => {
    expect(css()).toContain("--mk-color-ambient-base");
    expect(css()).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|rgb\(/i);
  });

  it("fill the parent, behind its content, without catching the pointer", () => {
    expect(css()).toContain("position: absolute");
    expect(css()).toContain("inset: 0");
    expect(css()).toContain("z-index: -1");
    expect(css()).toContain("pointer-events: none");
  });

  it("leave forced-colors mode to system colours", () => {
    expect(css()).toMatch(/forced-colors: active\) \{\s*\.mk-living-light \{\s*display: none/);
  });
});
