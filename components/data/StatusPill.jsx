import React from "react";

const TONE_DOT = {
  ok: "var(--signal-live)",
  warn: "var(--signal-warn)",
  near: "var(--signal-warn)", // alias — approaching a warn threshold
  danger: "var(--signal-danger)",
  idle: "var(--ink-400)",
};

/**
 * StatusPill — a quiet state marker for data rows: hairline pill, muted
 * text, and a small dot carrying the status hue (the dot is the only
 * colored element — text stays monochrome so rows scan calmly). Use for
 * ok / warn / danger / idle machine states; use Badge for editorial
 * categories and domain accents.
 */
export function StatusPill({ tone = "idle", children, style = {}, ...rest }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        borderRadius: "var(--radius-pill)",
        border: "1px solid var(--color-border)",
        padding: "0.25rem 0.625rem",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-2xs)",
        letterSpacing: "var(--tracking-wide)",
        color: "var(--color-fg-muted)",
        ...style,
      }}
      {...rest}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: TONE_DOT[tone] || TONE_DOT.idle,
        }}
      />
      {children}
    </span>
  );
}
