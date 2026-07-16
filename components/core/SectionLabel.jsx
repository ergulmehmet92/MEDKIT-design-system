import React from "react";

/**
 * SectionLabel — the small uppercase eyebrow that titles every page band
 * ("Recent work", "Thoughts", "Processes"), optionally with a right-aligned
 * meta note ("02 projects"). The brand's primary structural typographic mark.
 */
export function SectionLabel({ children, meta = null, accent = false, style = {}, ...rest }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: meta ? "space-between" : "flex-start",
        gap: "1rem",
        width: "100%",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          fontWeight: accent ? "var(--weight-medium)" : "var(--weight-regular)",
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-widest)",
          color: accent ? "var(--text-accent)" : "var(--color-fg-muted)",
        }}
      >
        {children}
      </span>
      {meta && (
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)",
            color: "var(--color-fg-subtle)",
          }}
        >
          {meta}
        </span>
      )}
    </div>
  );
}
