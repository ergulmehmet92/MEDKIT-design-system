import React, { useState } from "react";
import { VersionBadge } from "./VersionBadge.jsx";

/**
 * IterationCard — a single frame in a design-iteration / creative-exploration
 * gallery. Shows the artwork (image URL or CSS background), a version tag with
 * lifecycle status, a label, and an optional rationale note. The craft domain
 * accent marks the active iteration stream. Theme-aware.
 */
export function IterationCard({
  label,
  version,
  status = null,
  note,
  art,
  ratio = "4 / 3",
  current = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const isUrl = typeof art === "string" && /\.(png|jpe?g|webp|gif|svg)|^https?:|^\//.test(art);

  return (
    <figure
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        margin: 0,
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--color-bg-elevated)",
        border: current
          ? "1px solid var(--signal-craft)"
          : hover
          ? "1px solid var(--color-border-hover)"
          : "1px solid var(--color-border)",
        boxShadow: current ? "0 0 0 1px color-mix(in srgb, var(--signal-craft) 35%, transparent)" : "none",
        transition: "var(--transition-hover)",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: ratio,
          background: isUrl ? "var(--color-bg-panel)" : art || "var(--color-bg-panel)",
          borderBottom: "1px solid var(--color-border)",
          overflow: "hidden",
        }}
      >
        {isUrl && (
          <img
            src={art}
            alt={label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hover ? "scale(1.02)" : "none",
              transition: "transform 0.7s var(--ease-out-expo)",
            }}
          />
        )}
        <span style={{ position: "absolute", top: 10, left: 10 }}>
          <VersionBadge version={version} status={status} />
        </span>
      </div>
      <figcaption style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "1rem 1.1rem" }}>
        <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-fg)" }}>
          {label}
        </span>
        {note && (
          <span style={{ fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)", color: "var(--color-fg-subtle)" }}>
            {note}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
