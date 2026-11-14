import type { CSSProperties, ElementType, ReactNode } from "react";
import "./reveal.css";

export type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** The item's place in a group revealed together; each step starts the rise a little later. */
  order?: number;
  className?: string;
};

/**
 * Content that rises 12px and fades in as it scrolls into view, driven by the scroll itself. Where
 * scroll-driven animation isn't supported, or motion is reduced, it is simply there.
 */
export function Reveal({ children, as: Tag = "div", order = 0, className }: RevealProps) {
  return (
    <Tag className={className ? `mk-reveal ${className}` : "mk-reveal"} style={order ? ({ "--mk-reveal-order": order } as CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
