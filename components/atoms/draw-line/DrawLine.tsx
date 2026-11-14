"use client";

import { useEffect, useId, useRef, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import "./draw-line.css";

export type DrawLineProps = Omit<ComponentPropsWithoutRef<"svg">, "title"> & {
  /** Names the drawing for screen readers. Without it the drawing is decoration and hidden. */
  title?: string;
};

const SHAPES = "path, line, polyline, polygon, circle, ellipse, rect";

/**
 * Line art that draws on along its length when it comes into view, over motion.duration.reveal.
 * Each shape follows the one before by the stagger. Without JavaScript, an IntersectionObserver or
 * motion, the lines are simply drawn. It is the base for motion vectors, once they are placed.
 */
export function DrawLine({ title, children, className, style, ...rest }: DrawLineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const titleId = `${useId()}-title`;

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduce || typeof IntersectionObserver !== "function") return;
    svg.querySelectorAll<SVGGeometryElement>(SHAPES).forEach((shape, i) => {
      shape.setAttribute("pathLength", "1");
      shape.style.setProperty("--mk-draw-order", String(i));
    });
    svg.setAttribute("data-armed", "");
    const seen = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          svg.setAttribute("data-drawn", "");
          seen.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    seen.observe(svg);
    return () => seen.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className={className ? `mk-draw-line ${className}` : "mk-draw-line"}
      style={style as CSSProperties}
      {...(title ? { role: "img", "aria-labelledby": titleId } : { "aria-hidden": true, focusable: false })}
      {...rest}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {children}
    </svg>
  );
}
