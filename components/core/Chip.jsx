import React, { useState } from "react";

/**
 * Chip — flat capsule tag for skills, tech stacks, and dates. Theme-aware:
 * charcoal fill on ink, soft warm fill on paper, hairline border that brightens
 * on hover. Use Chip for neutral metadata tags; use Badge for status/category.
 */
export function Chip({ children, active = false, onClick, style = {}, ...rest }) {
  const [hover, setHover] = useState(false);
  const lit = hover || active;
  const interactive = typeof onClick === "function";

  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        borderRadius: "var(--radius-pill)",
        padding: "0.4rem 0.85rem",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-xs)",
        lineHeight: 1.2,
        letterSpacing: "var(--tracking-wide)",
        color: lit ? "var(--color-fg)" : "var(--color-fg-muted)",
        border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
        backgroundColor: lit ? "var(--color-bg-hover)" : "var(--color-bg-elevated)",
        cursor: interactive ? "pointer" : "default",
        transition:
          "var(--transition-border), var(--transition-color), background-color var(--duration-fast) var(--ease-out-expo)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
