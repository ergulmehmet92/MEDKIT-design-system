"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./step-relay.css";

export type RelayStep = { title: ReactNode; description?: ReactNode };

export type StepRelayProps = {
  steps: RelayStep[];
  /**
   * Horizontal passes a honey baton along the steps, as on the landing page. Vertical runs a tick
   * ruler beside them whose marker rides the page's scroll and snaps to a nearby pointer.
   */
  orientation?: "horizontal" | "vertical";
  className?: string;
};

const TICK = 7; // px between ticks
const REACH = 42; // px over which ticks extend around the marker
const MAGNET = 72; // px from the ruler within which the pointer takes the marker

/** The marker's resting place: 40% down the viewport, as on the board. */
const restLine = () => window.innerHeight * 0.4;

function useVerticalRuler(enabled: boolean) {
  const list = useRef<HTMLOListElement>(null);
  const ruler = useRef<HTMLSpanElement>(null);
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = list.current;
    const track = ruler.current;
    const mark = marker.current;
    if (!enabled || !root || !track || !mark) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let ticks: HTMLElement[] = [];
    let y = 0;
    let pointer: number | null = null;
    let raf = 0;
    let visible = true;

    const build = () => {
      const count = Math.max(1, Math.floor(root.offsetHeight / TICK));
      if (count === ticks.length) return;
      track.replaceChildren(...Array.from({ length: count }, (_, i) => {
        const t = document.createElement("i");
        t.style.insetBlockStart = `${i * TICK}px`;
        return t;
      }));
      ticks = [...track.children] as HTMLElement[];
    };

    const goal = () => {
      const box = root.getBoundingClientRect();
      const target = pointer ?? restLine() - box.top;
      return Math.min(Math.max(target, 0), box.height);
    };

    const paint = () => {
      mark.style.transform = `translateY(${y.toFixed(1)}px)`;
      for (let i = 0; i < ticks.length; i++) {
        const d = (i * TICK - y) / REACH;
        ticks[i].style.inlineSize = `${(5 + 15 * Math.exp(-d * d)).toFixed(1)}px`;
      }
      for (const li of root.children as HTMLCollectionOf<HTMLElement>) {
        li.toggleAttribute("data-current", y >= li.offsetTop && y < li.offsetTop + li.offsetHeight);
      }
    };

    const frame = () => {
      raf = 0;
      const target = goal();
      const ease = pointer === null ? 0.12 : 0.3;
      y = reduce ? target : y + (target - y) * ease;
      paint();
      if (Math.abs(target - y) > 0.5 && visible) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      const box = root.getBoundingClientRect();
      const near = Math.abs(e.clientX - track.getBoundingClientRect().left) < MAGNET && e.clientY >= box.top && e.clientY <= box.bottom;
      const next = near ? e.clientY - box.top : null;
      if (next !== pointer) {
        pointer = next;
        wake();
      } else if (near) wake();
    };
    const onLeave = () => {
      pointer = null;
      wake();
    };

    build();
    y = goal();
    paint();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    document.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    const resize = typeof ResizeObserver === "function" ? new ResizeObserver(() => (build(), wake())) : null;
    resize?.observe(root);
    const seen =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver((entries) => {
            visible = entries[entries.length - 1].isIntersecting;
            wake();
          })
        : null;
    seen?.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      resize?.disconnect();
      seen?.disconnect();
    };
  }, [enabled]);

  return { list, ruler, marker };
}

/** The steps of a method, numbered, from the landing page's "Back to the core". */
export function StepRelay({ steps, orientation = "horizontal", className }: StepRelayProps) {
  const vertical = orientation === "vertical";
  const { list, ruler, marker } = useVerticalRuler(vertical);
  const classes = ["mk-step-relay", className].filter(Boolean).join(" ");

  return (
    <div className={classes} data-orientation={orientation} style={{ "--mk-relay-steps": steps.length } as CSSProperties}>
      {vertical ? (
        <>
          <span ref={ruler} className="mk-step-relay-ruler" aria-hidden="true" />
          <span ref={marker} className="mk-step-relay-marker" aria-hidden="true" />
        </>
      ) : null}
      <ol ref={list} className="mk-step-relay-list">
        {steps.map((step, i) => (
          <li key={i} className="mk-step-relay-step">
            {vertical ? null : (
              <span className="mk-step-relay-rule" aria-hidden="true">
                <span className="mk-step-relay-baton" style={{ "--mk-relay-step": i } as CSSProperties} />
              </span>
            )}
            <span className="mk-step-relay-number" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mk-step-relay-title">{step.title}</span>
            {step.description ? <span className="mk-step-relay-description">{step.description}</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
