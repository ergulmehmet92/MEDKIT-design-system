"use client";

import { useLayoutEffect, useRef, useState, type ElementType } from "react";
import { motionAllowed, outExpo, tokenMs, whenSeen } from "./motion";
import "./count-up.css";

export type CountUpProps = {
  value: number;
  /** Where the count starts. */
  from?: number;
  /** Text for a number. Defaults to the value's own decimals, grouped, with a real minus. */
  format?: (value: number) => string;
  as?: ElementType;
  className?: string;
};

const decimalsOf = (v: number) => {
  const text = String(Math.abs(v));
  const dot = text.indexOf(".");
  return dot < 0 || text.includes("e") ? 0 : Math.min(text.length - dot - 1, 3);
};

/**
 * A number that counts up to its value when it comes into view, over motion.duration.reveal, in
 * tabular figures so its width holds. Screen readers get the final value once, never the frames.
 * Without motion, or before the script runs, the final value is simply shown.
 */
export function CountUp({ value, from = 0, format, as: Tag = "span", className }: CountUpProps) {
  const digits = decimalsOf(value);
  const fmt = format ?? ((v: number) => new Intl.NumberFormat("en", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v).replace("-", "−"));
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(value);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    setShown(from);
    let raf = 0;
    const stop = whenSeen(el, () => {
      const ms = tokenMs(el, "reveal", 1400);
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / ms);
        setShown(from + (value - from) * outExpo(t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    return () => {
      stop();
      cancelAnimationFrame(raf);
      setShown(value);
    };
  }, [value, from]);

  const final = fmt(value);
  return (
    <Tag ref={ref} className={className ? `mk-count-up ${className}` : "mk-count-up"}>
      <span aria-hidden="true">{fmt(shown)}</span>
      <span className="mk-count-up-final">{final}</span>
    </Tag>
  );
}
