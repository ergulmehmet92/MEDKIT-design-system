"use client";

import { useLayoutEffect, useRef, useState, type ElementType } from "react";
import { motionAllowed, whenSeen } from "../count-up/motion";
import "../count-up/count-up.css";

export type TypewriterProps = {
  text: string;
  as?: ElementType;
  /** Milliseconds a character. */
  speed?: number;
  className?: string;
};

/**
 * A line typed out when it comes into view, with a honey caret blinking once a second that fades
 * once the line is done. The whole text is in the page from the start, read once by screen readers;
 * without motion, it is simply shown.
 */
export function Typewriter({ text, as: Tag = "span", speed = 45, className }: TypewriterProps) {
  const ref = useRef<HTMLElement>(null);
  const [count, setCount] = useState(text.length);
  // "still" until the script runs; then "typing", then "done", when the caret fades.
  const [phase, setPhase] = useState<"still" | "typing" | "done">("still");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    setCount(0);
    setPhase("typing");
    let timer = 0;
    let rest = 0;
    const stop = whenSeen(el, () => {
      let i = 0;
      timer = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) {
          window.clearInterval(timer);
          rest = window.setTimeout(() => setPhase("done"), 1200);
        }
      }, speed);
    });
    return () => {
      stop();
      window.clearInterval(timer);
      window.clearTimeout(rest);
      setCount(text.length);
      setPhase("still");
    };
  }, [text, speed]);

  return (
    <Tag ref={ref} className={className ? `mk-typewriter ${className}` : "mk-typewriter"} data-done={phase === "typing" ? undefined : ""}>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {phase === "still" ? null : <span className="mk-typewriter-caret" />}
      </span>
      <span className="mk-typewriter-full">{text}</span>
    </Tag>
  );
}
