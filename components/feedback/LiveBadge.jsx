import React, { useState } from "react";

/**
 * LiveBadge — the "in motion" indicator from the Processes band: a mono,
 * tabular elapsed readout next to a pulsing green dot and "live" label.
 * Pass an `elapsed` string (e.g. "03mo 12d 06h") or any children.
 */
export function LiveBadge({ elapsed = "00mo 00d 00h", label = "live", style = {}, ...rest }) {
  return (
    <div
      style={{ display: "inline-flex", alignItems: "center", gap: "1rem", ...style }}
      {...rest}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "1.25rem",
          fontVariantNumeric: "tabular-nums",
          color: "var(--color-fg-subtle)",
        }}
      >
        {elapsed}
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
        <span style={{ position: "relative", display: "flex", width: 8, height: 8 }}>
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "var(--signal-live)",
              opacity: 0.75,
              animation: "me-ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
          <span
            style={{
              position: "relative",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--signal-live)",
            }}
          />
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider)",
            color: "var(--signal-live)",
          }}
        >
          {label}
        </span>
      </span>
      <style>{`@keyframes me-ping{75%,100%{transform:scale(2);opacity:0}}`}</style>
    </div>
  );
}
