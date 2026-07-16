import React, { useState } from "react";

/**
 * Button — the brand's action primitive. Theme-aware: reads semantic tokens
 * so it renders correctly on both ink (dark) and paper (light) surfaces.
 *
 * - "primary": solid contrast-tone pill (ink-on-paper / paper-on-ink). The
 *   highest-emphasis action.
 * - "glass": flat charcoal/paper pill that lifts to a soft glassy state on
 *   hover — the hero/work CTA treatment.
 * - "secondary": hairline-outlined, transparent fill.
 * - "ghost": text-only affordance; hover fades opacity.
 * - "accent": filled with the active domain accent (--accent).
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  onClick,
  type = "button",
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const lit = hover && !disabled;

  const sizes = {
    sm: { padding: "0.5rem 0.95rem", fontSize: "0.8125rem" },
    md: { padding: "0.7rem 1.2rem", fontSize: "0.875rem" },
    lg: { padding: "0.9rem 1.6rem", fontSize: "0.9375rem" },
  };

  const base = {
    appearance: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--weight-semibold)",
    lineHeight: 1.25,
    letterSpacing: "0.02em",
    display: fullWidth ? "flex" : "inline-flex",
    width: fullWidth ? "100%" : "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderRadius: "var(--radius-pill)",
    opacity: disabled ? 0.4 : 1,
    transition: "var(--transition-hover)",
    ...sizes[size],
  };

  const variants = {
    primary: {
      color: "var(--on-contrast)",
      backgroundColor: "var(--surface-contrast)",
      border: "1px solid transparent",
      transform: lit ? "translateY(-1px)" : "none",
      boxShadow: lit ? "var(--shadow-card-hover)" : "none",
      opacity: disabled ? 0.4 : lit ? 0.92 : 1,
    },
    glass: {
      color: "var(--color-fg)",
      backgroundColor: lit ? "var(--color-bg-hover)" : "var(--color-bg-elevated)",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
      boxShadow: lit ? "inset 0 1px 0 var(--color-border-glass), var(--shadow-card-hover)" : "none",
      backdropFilter: lit ? "blur(14px) saturate(160%)" : "none",
    },
    secondary: {
      color: lit ? "var(--color-fg)" : "var(--color-fg-muted)",
      backgroundColor: "transparent",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
    },
    ghost: {
      color: lit ? "var(--color-fg)" : "var(--color-fg-muted)",
      backgroundColor: "transparent",
      border: "1px solid transparent",
      padding: size === "lg" ? "0.6rem 0.6rem" : "0.4rem 0.5rem",
    },
    accent: {
      color: "var(--accent-on)",
      backgroundColor: "var(--accent)",
      border: "1px solid transparent",
      transform: lit ? "translateY(-1px)" : "none",
      boxShadow: lit ? "var(--shadow-card-hover)" : "none",
      filter: lit ? "brightness(1.06)" : "none",
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
