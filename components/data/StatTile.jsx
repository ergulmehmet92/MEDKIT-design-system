import React from "react";

const TONE_DOT = {
  live: "var(--signal-live)",
  warn: "var(--signal-warn)",
  danger: "var(--signal-danger)",
};

/**
 * StatTile — a single KPI: uppercase label, large light-weight number, quiet
 * sub-line. An optional status dot (live / warn / danger) sits beside the
 * value — status hues mark state only, never data series. Numerals stay in
 * Inter; mono is reserved for tabular readouts inside running text.
 */
export function StatTile({ label, value, sub, tone = "neutral", style = {}, ...rest }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-elevated)",
        padding: "var(--space-5)",
        ...style,
      }}
      {...rest}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-2xs)",
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-wider)",
          color: "var(--color-fg-subtle)",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "var(--space-2) 0 0",
          display: "flex",
          alignItems: "baseline",
          gap: "var(--space-2)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-4xl)",
          fontWeight: "var(--weight-light)",
          color: "var(--color-fg)",
        }}
      >
        {value}
        {tone !== "neutral" && (
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              flexShrink: 0,
              transform: "translateY(-2px)",
              borderRadius: "50%",
              backgroundColor: TONE_DOT[tone],
            }}
          />
        )}
      </p>
      {sub != null && (
        <p
          style={{
            margin: "var(--space-1) 0 0",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-xs)",
            color: "var(--color-fg-muted)",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
