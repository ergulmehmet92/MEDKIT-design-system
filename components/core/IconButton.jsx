import React, { useState } from "react";

/**
 * IconButton — square/round affordance for a single glyph (play, share, menu,
 * close). Pass an inline SVG (stroke 2, currentColor) as children. Theme-aware.
 *
 * variant: "ghost" (default) | "outline" | "solid"
 */
export function IconButton({
  children,
  label,
  variant = "ghost",
  size = 40,
  round = false,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const lit = hover && !disabled;

  const variants = {
    ghost: {
      color: lit ? "var(--color-fg)" : "var(--color-fg-muted)",
      backgroundColor: lit ? "var(--color-bg-hover)" : "transparent",
      border: "1px solid transparent",
    },
    outline: {
      color: lit ? "var(--color-fg)" : "var(--color-fg-muted)",
      backgroundColor: "transparent",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
    },
    solid: {
      color: "var(--on-contrast)",
      backgroundColor: "var(--surface-contrast)",
      border: "1px solid transparent",
      opacity: lit ? 0.92 : 1,
    },
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        appearance: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: round ? "50%" : "var(--radius-sm)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "var(--transition-hover)",
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
