import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

export type Size = { width: number; height: number };

/** Tracks an element's content size. Starts from `initial`, which also stands in where there's no ResizeObserver. */
export function useElementSize<T extends HTMLElement>(initial: Size = { width: 0, height: 0 }) {
  const [node, setNode] = useState<T | null>(null);
  const [size, setSize] = useState<Size>(initial);
  useEffect(() => {
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((old) => (Math.abs(old.width - width) < 0.5 && Math.abs(old.height - height) < 0.5 ? old : { width, height }));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return [setNode, size, node] as const;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reads a duration token, such as --mk-motion-duration-chart-reveal, in milliseconds. */
export function durationOf(node: Element | null, token: string, fallback: number): number {
  if (!node || typeof getComputedStyle !== "function") return fallback;
  const raw = getComputedStyle(node).getPropertyValue(token).trim();
  const ms = raw.endsWith("ms") ? parseFloat(raw) : raw.endsWith("s") ? parseFloat(raw) * 1000 : NaN;
  return Number.isFinite(ms) ? ms : fallback;
}

const outExpo = (t: number) => (t >= 1 ? 1 : t <= 0 ? 0 : 1 - Math.pow(2, -10 * t));

/**
 * Goes from 0 to 1 once, the first time the element is a quarter on screen. With reduced motion,
 * or without IntersectionObserver, it starts at 1.
 */
export function useReveal(node: Element | null): number {
  const [progress, setProgress] = useState(() => (prefersReducedMotion() || typeof IntersectionObserver === "undefined" ? 1 : 0));
  const started = useRef(progress === 1);
  useEffect(() => {
    if (!node || started.current) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();
        const duration = durationOf(node, "--mk-motion-duration-chart-reveal", 1400);
        const start = performance.now();
        const step = (now: number) => {
          const k = outExpo((now - start) / duration);
          setProgress(k);
          if (k < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [node]);
  return progress;
}

/**
 * Eases a set of numbers, such as a scale's domain, to new targets. Jumps with reduced motion.
 * Keep `target` stable between renders, for example with useMemo, so it only glides on real change.
 */
export function useGlide<T extends Record<string, number>>(target: T, node: Element | null): T {
  const [value, setValue] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    const keys = Object.keys(target) as (keyof T)[];
    if (keys.every((k) => from[k] === target[k])) return;
    if (prefersReducedMotion()) {
      current.current = target;
      setValue(target);
      return;
    }
    const duration = durationOf(node, "--mk-motion-duration-chart-change", 600);
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const k = outExpo((now - start) / duration);
      const next = { ...target };
      for (const key of keys) next[key] = (from[key] + (target[key] - from[key]) * k) as T[keyof T];
      current.current = next;
      setValue(next);
      if (k < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, node]);
  return value;
}

export type CrosshairOptions = {
  /** First and last index the reader can land on. */
  min: number;
  max: number;
  /** Where keyboard reading starts, such as today. Defaults to `max`. */
  start?: number;
  /** Index nearest a pointer position, in pixels from the plot's left edge. */
  indexAt: (x: number) => number;
  /** What a screen reader hears at an index. */
  describe: (index: number) => string;
  /** How far Shift with an arrow moves. Defaults to 5, a trading week. */
  stride?: number;
};

/**
 * Shared reading for every chart: the pointer snaps to the nearest index, and the keyboard moves
 * one step, a stride with Shift, or to either end with Home and End. Escape clears it.
 */
export function useCrosshair({ min, max, start, indexAt, describe, stride = 5 }: CrosshairOptions) {
  const [index, setIndex] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const focused = useRef(false);
  const clamp = useCallback((i: number) => Math.max(min, Math.min(max, i)), [min, max]);

  useEffect(() => {
    setIndex((i) => (i == null ? i : clamp(i)));
  }, [clamp]);

  const land = useCallback(
    (i: number | null, announce: boolean) => {
      setIndex(i);
      if (announce) setAnnouncement(i == null ? "" : describe(i));
    },
    [describe],
  );

  const handlers = {
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const box = event.currentTarget.getBoundingClientRect();
      land(clamp(indexAt(event.clientX - box.left)), false);
    },
    onPointerLeave: () => {
      if (!focused.current) land(null, false);
    },
    onFocus: () => {
      focused.current = true;
      land(clamp(index ?? start ?? max), true);
    },
    onBlur: () => {
      focused.current = false;
      land(null, false);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      const from = index ?? start ?? max;
      const step = event.shiftKey ? stride : 1;
      const moves: Record<string, number> = { ArrowRight: from + step, ArrowLeft: from - step, Home: min, End: max };
      if (event.key === "Escape") {
        land(null, false);
        return;
      }
      if (!(event.key in moves)) return;
      event.preventDefault();
      land(clamp(moves[event.key]), true);
    },
  };

  return { index, announcement, handlers, setIndex };
}

/**
 * Width of one character of chart label text. Labels use the monospaced label face, so a label's
 * width is its length times this. Measured on a probe styled like a label, once the fonts are in.
 */
export function useLabelAdvance(probe: Element | null): number {
  const [advance, setAdvance] = useState(9);
  useEffect(() => {
    if (!probe || typeof getComputedStyle !== "function") return;
    const measure = () => {
      const style = getComputedStyle(probe);
      const size = parseFloat(style.fontSize) || 15;
      const tracking = parseFloat(style.letterSpacing) || 0;
      let width = size * 0.6;
      try {
        const context = /jsdom/.test(navigator.userAgent) ? null : document.createElement("canvas").getContext("2d");
        if (context) {
          context.font = `${size}px ${style.fontFamily || "monospace"}`;
          width = context.measureText("0000000000").width / 10 || width;
        }
      } catch {
        // jsdom has no canvas text, so the estimate stands.
      }
      setAdvance(width + tracking);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [probe]);
  return advance;
}

/** The density a chart sits in, from the nearest data-density. Editorial unless told otherwise. */
export function useDensity(node: Element | null): "editorial" | "analytical" {
  const [density, setDensity] = useState<"editorial" | "analytical">("editorial");
  useEffect(() => {
    const value = node?.closest("[data-density]")?.getAttribute("data-density");
    setDensity(value === "analytical" ? "analytical" : "editorial");
  }, [node]);
  return density;
}

export type Domain = { i0: number; i1: number; y0: number; y1: number };

/**
 * Everything a chart over an indexed x needs before it draws: the plot's size, its density, the
 * reveal, label width, and a domain that glides when the window or data changes.
 */
export function useChartViewport(target: Domain, initial: Size = { width: 960, height: 520 }) {
  const [plotRef, size, node] = useElementSize<HTMLDivElement>(initial);
  const density = useDensity(node);
  const reveal = useReveal(node);
  const advance = useLabelAdvance(node);
  const view = useGlide(target, node);
  return { plotRef, size, node, density, reveal, advance, view };
}
