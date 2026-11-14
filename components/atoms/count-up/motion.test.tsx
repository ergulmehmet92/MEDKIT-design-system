import { act, cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DrawLine } from "../draw-line";
import { Reveal } from "../reveal";
import { Typewriter } from "../typewriter";
import { CountUp } from "./CountUp";

// A stand-in IntersectionObserver whose entries the test fires by hand.
let observers: { cb: IntersectionObserverCallback; el?: Element }[] = [];
class FakeObserver {
  cb: IntersectionObserverCallback;
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
    observers.push(this);
  }
  observe(el: Element) {
    (this as { el?: Element }).el = el;
  }
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}
const showAll = () =>
  act(() => observers.forEach((o) => o.cb([{ isIntersecting: true, target: o.el } as IntersectionObserverEntry], o as unknown as IntersectionObserver)));
const reduceMotion = (reduce: boolean) =>
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: reduce && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));

beforeEach(() => {
  observers = [];
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("without motion", () => {
  it("shows the final number and text at once, read once by screen readers", () => {
    const { container } = render(
      <>
        <CountUp value={122.9} />
        <Typewriter text="Not the artifact." />
      </>,
    );
    expect(container.querySelector(".mk-count-up [aria-hidden]")?.textContent).toBe("122.9");
    expect(container.querySelector(".mk-count-up-final")?.textContent).toBe("122.9");
    expect(container.querySelector(".mk-typewriter [aria-hidden]")?.textContent).toBe("Not the artifact.");
    expect(container.querySelector(".mk-typewriter-caret")).toBeNull();
  });

  it("leaves line art drawn when it can't tell what is on screen, or motion is reduced", () => {
    reduceMotion(true);
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    const { container } = render(
      <DrawLine viewBox="0 0 10 10">
        <path d="M0 0 L10 10" />
      </DrawLine>,
    );
    expect(container.querySelector("svg")?.hasAttribute("data-armed")).toBe(false);
  });
});

describe("with motion", () => {
  beforeEach(() => {
    reduceMotion(false);
    vi.stubGlobal("IntersectionObserver", FakeObserver);
  });

  it("CountUp starts from zero and counts to the value once seen, keeping the final value for screen readers", async () => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "performance"] });
    const { container } = render(<CountUp value={122.9} />);
    const visible = () => container.querySelector(".mk-count-up [aria-hidden]")?.textContent;

    expect(visible()).toBe("0.0");
    showAll();
    await act(async () => vi.advanceTimersByTime(2000));
    expect(visible()).toBe("122.9");
    expect(screen.getByText("122.9", { selector: ".mk-count-up-final" })).toBeTruthy();
  });

  it("Typewriter types once seen, with a caret that is marked done afterwards", async () => {
    vi.useFakeTimers();
    const { container } = render(<Typewriter text="Not the artifact." speed={10} />);
    const root = container.querySelector(".mk-typewriter")!;

    expect(root.querySelector("[aria-hidden]")?.textContent).toBe("");
    expect(root.hasAttribute("data-done")).toBe(false);
    showAll();
    await act(async () => vi.advanceTimersByTime(17 * 10 + 1300));
    expect(root.querySelector("[aria-hidden]")?.textContent).toBe("Not the artifact.");
    expect(root.hasAttribute("data-done")).toBe(true);
    expect(root.querySelector(".mk-typewriter-full")?.textContent).toBe("Not the artifact.");
  });

  it("DrawLine arms its shapes, and draws them once seen", () => {
    const { container } = render(
      <DrawLine viewBox="0 0 10 10" title="A rising line">
        <path d="M0 10 L10 0" />
        <line x1="0" y1="9" x2="10" y2="9" />
      </DrawLine>,
    );
    const svg = container.querySelector("svg")!;

    expect(screen.getByRole("img", { name: "A rising line" })).toBe(svg);
    expect([...svg.querySelectorAll("path, line")].map((s) => s.getAttribute("pathLength"))).toEqual(["1", "1"]);
    expect(svg.hasAttribute("data-armed")).toBe(true);
    showAll();
    expect(svg.hasAttribute("data-drawn")).toBe(true);
  });
});

describe("Reveal", () => {
  it("reveals by scroll only where supported and wanted, and passes axe", async () => {
    const css = readFileSync("components/atoms/reveal/reveal.css", "utf8");
    expect(css).toMatch(/@supports \(animation-timeline: view\(\)\)\s*\{\s*@media \(prefers-reduced-motion: no-preference\)/);

    const { container } = render(
      <Reveal as="section" order={2}>
        <p>Panel</p>
      </Reveal>,
    );
    const el = container.querySelector("section.mk-reveal") as HTMLElement;
    expect(el.style.getPropertyValue("--mk-reveal-order")).toBe("2");
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
