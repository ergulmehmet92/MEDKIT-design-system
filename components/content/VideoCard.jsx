import React, { useState } from "react";

/**
 * VideoCard — content/YouTube surface. A 16:9 thumbnail with a duration badge
 * and a play affordance that appears on hover, above a title and meta line.
 * `thumb` accepts an image URL or any CSS background (gradient fallback).
 * Theme-aware.
 */
export function VideoCard({
  title,
  channel,
  meta,
  duration,
  thumb,
  badge,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const isUrl = typeof thumb === "string" && /\.(png|jpe?g|webp|gif|svg)|^https?:|^\//.test(thumb);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: onClick ? "pointer" : "default", display: "flex", flexDirection: "column", gap: "0.85rem", ...style }}
      {...rest}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          background: isUrl ? "var(--color-bg-elevated)" : thumb || "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
        }}
      >
        {isUrl && (
          <img
            src={thumb}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hover ? "scale(1.03)" : "none",
              transition: "transform 0.7s var(--ease-out-expo)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0) 45%)",
          }}
        />
        {badge && (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              borderRadius: "var(--radius-pill)",
              padding: "0.2rem 0.55rem",
              fontSize: "var(--text-2xs)",
              fontWeight: "var(--weight-medium)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wide)",
              color: "#0a0a0a",
              background: "var(--signal-content)",
            }}
          >
            {badge}
          </span>
        )}
        {/* play affordance */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hover ? 1 : 0,
            transition: "opacity var(--duration-fast) var(--ease-out-expo)",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(10,10,10,0.55)",
              border: "1px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(8px)",
              transform: hover ? "scale(1)" : "scale(0.85)",
              transition: "transform var(--duration-medium) var(--ease-out-expo)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
        {duration && (
          <span
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              borderRadius: "var(--radius-xs)",
              padding: "0.15rem 0.4rem",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-2xs)",
              fontVariantNumeric: "tabular-nums",
              color: "#fff",
              background: "rgba(10,10,10,0.8)",
            }}
          >
            {duration}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: 1.3,
            letterSpacing: "var(--tracking-snug)",
            color: hover ? "var(--color-fg)" : "var(--color-fg)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </h3>
        {channel && (
          <span style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>{channel}</span>
        )}
        {meta && (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-fg-subtle)" }}>{meta}</span>
        )}
      </div>
    </div>
  );
}
