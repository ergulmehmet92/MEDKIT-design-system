import React, { useState } from "react";

/**
 * Card — surface container with the brand's hairline-border hover treatment.
 * Theme-aware: "elevated" and "panel" read semantic tokens and adapt to ink
 * or paper. "contrast" paints the opposite tone (a white diagram card on a
 * dark page, or an ink callout on a light page). Renders as a link when
 * `href` (or a custom `as`, e.g. a router Link) is given.
 */
export function Card({
  children,
  as,
  href,
  surface = "elevated",
  hoverable = true,
  lift = false,
  padding = "1.5rem",
  radius = "var(--radius-lg)",
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const lit = hoverable && hover;

  const surfaces = {
    elevated: {
      backgroundColor: "var(--color-bg-elevated)",
      color: "var(--color-fg)",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
    },
    panel: {
      backgroundColor: "var(--color-bg-panel)",
      color: "var(--color-fg)",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
      boxShadow: lit ? "var(--shadow-card-hover)" : "none",
    },
    contrast: {
      backgroundColor: "var(--surface-contrast)",
      color: "var(--on-contrast)",
      border: "1px solid var(--color-border-glass)",
      boxShadow: "var(--shadow-float)",
    },
    bare: {
      backgroundColor: "transparent",
      color: "var(--color-fg)",
      border: lit ? "1px solid var(--color-border)" : "1px solid transparent",
    },
  };

  const shouldLift = (lift || surface === "panel") && lit;

  const Tag = as || (href ? "a" : "div");

  return (
    <Tag
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: radius,
        padding,
        transform: shouldLift ? "translateY(-2px)" : "none",
        transition:
          "var(--transition-border), transform var(--duration-medium) var(--ease-out-expo), box-shadow var(--duration-medium) var(--ease-out-expo)",
        cursor: onClick || href ? "pointer" : "default",
        display: "block",
        textDecoration: "none",
        ...surfaces[surface],
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
