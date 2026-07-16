import React from "react";

/**
 * VersionBadge — a monospace version tag (v1, v3.2) for design iterations.
 * Optional status dot marks the current / explored / archived state.
 *
 * status: "current" | "explored" | "archived" | null
 */
export function VersionBadge({ version, status = null, style = {}, ...rest }) {
  const statusColor = {
    current: "var(--signal-live)",
    explored: "var(--signal-craft)",
    archived: "var(--color-fg-subtle)",
  }[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        borderRadius: "var(--radius-xs)",
        padding: "0.2rem 0.5rem",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-2xs)",
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "0.04em",
        color: "var(--color-fg)",
        background: "var(--color-bg-hover)",
        border: "1px solid var(--color-border)",
        ...style,
      }}
      {...rest}
    >
      {status && (
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor }} />
      )}
      {version}
    </span>
  );
}
