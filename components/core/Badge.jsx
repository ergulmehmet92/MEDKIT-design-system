import React, { useState } from "react";

/**
 * Badge — small status / category marker. Unlike the neutral Chip, a Badge
 * carries meaning through a domain accent or the live-status hue.
 *
 * tone: "neutral" | "editorial" | "content" | "craft" | "live" | "accent"
 * variant: "soft" (tinted fill, default) | "solid" | "dot" (leading dot only)
 */
export function Badge({
  children,
  tone = "neutral",
  variant = "soft",
  style = {},
  ...rest
}) {
  const toneColor = {
    neutral: "var(--color-fg-muted)",
    editorial: "var(--signal-editorial)",
    content: "var(--signal-content)",
    craft: "var(--signal-craft)",
    live: "var(--signal-live)",
    accent: "var(--accent)",
  }[tone];

  const isLive = tone === "live";

  const variants = {
    soft: {
      color: tone === "neutral" ? "var(--color-fg-muted)" : toneColor,
      backgroundColor:
        tone === "neutral" ? "var(--color-bg-elevated)" : "color-mix(in srgb, " + toneColor + " 16%, transparent)",
      border:
        tone === "neutral"
          ? "1px solid var(--color-border)"
          : "1px solid color-mix(in srgb, " + toneColor + " 30%, transparent)",
    },
    solid: {
      color: tone === "neutral" ? "var(--on-contrast)" : "#0a0a0a",
      backgroundColor: tone === "neutral" ? "var(--surface-contrast)" : toneColor,
      border: "1px solid transparent",
    },
    dot: {
      color: "var(--color-fg-muted)",
      backgroundColor: "transparent",
      border: "1px solid transparent",
      padding: "0.2rem 0",
    },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        borderRadius: "var(--radius-pill)",
        padding: variant === "dot" ? "0.2rem 0" : "0.25rem 0.6rem",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-2xs)",
        fontWeight: "var(--weight-medium)",
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-wider)",
        lineHeight: 1.3,
        whiteSpace: "nowrap",
        transition: "var(--transition-color)",
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {variant === "dot" && (
        <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
          {isLive && (
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: toneColor,
                opacity: 0.7,
                animation: "me-badge-ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
              }}
            />
          )}
          <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: toneColor }} />
        </span>
      )}
      {children}
      {variant === "dot" && (
        <style>{`@keyframes me-badge-ping{75%,100%{transform:scale(2.2);opacity:0}}`}</style>
      )}
    </span>
  );
}
