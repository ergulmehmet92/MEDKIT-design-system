import React from "react";

/**
 * Panel — labeled dashboard surface for data-dense views. An elevated card
 * with an uppercase eyebrow label and an optional right-aligned aside for
 * context ("as of …", counts). The body is free-form; pair with StatTile,
 * TrackBar and StatusPill. Theme-aware: reads semantic tokens only.
 */
export function Panel({ label, aside, children, style = {}, ...rest }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-elevated)",
        color: "var(--color-fg)",
        padding: "var(--space-6)",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "var(--space-2)",
          marginBottom: "var(--space-5)",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-2xs)",
            fontWeight: "var(--weight-regular)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-widest)",
            color: "var(--color-fg-subtle)",
          }}
        >
          {label}
        </h3>
        {aside != null && (
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-2xs)",
              color: "var(--color-fg-subtle)",
            }}
          >
            {aside}
          </span>
        )}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
