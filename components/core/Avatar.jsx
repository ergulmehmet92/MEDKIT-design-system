import React from "react";

/**
 * Avatar — circular identity mark. Renders an image when `src` is given, else
 * monogram initials on a neutral surface. Theme-aware.
 */
export function Avatar({ src, name = "", size = 40, ring = false, style = {}, ...rest }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      title={name || undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "var(--color-bg-hover)",
        color: "var(--color-fg-muted)",
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--weight-semibold)",
        fontSize: Math.round(size * 0.36),
        letterSpacing: "0.02em",
        border: ring ? "2px solid var(--color-bg)" : "1px solid var(--color-border)",
        boxShadow: ring ? "0 0 0 1px var(--color-border)" : "none",
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials || "?"
      )}
    </span>
  );
}
