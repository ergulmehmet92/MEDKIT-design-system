import React, { useState } from "react";

/**
 * PostCard — blog / writing surface. A reading-first card: category badge,
 * title, excerpt, and a meta footer (date · reading time). Theme-aware, so it
 * works on both the dark index and a paper-toned blog. `cover` is optional;
 * with one it renders a media-topped card, without it a typographic card.
 */
export function PostCard({
  title,
  excerpt,
  category,
  date,
  readingTime,
  cover,
  tone = "editorial",
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const isUrl = typeof cover === "string" && /\.(png|jpe?g|webp|gif|svg)|^https?:|^\//.test(cover);

  const accent = {
    editorial: "var(--signal-editorial)",
    content: "var(--signal-content)",
    craft: "var(--signal-craft)",
    neutral: "var(--color-fg-muted)",
  }[tone];

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "var(--radius-lg)",
        border: hover ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
        background: "var(--color-bg-elevated)",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "var(--shadow-card-hover)" : "none",
        transition: "var(--transition-hover)",
        ...style,
      }}
      {...rest}
    >
      {cover && (
        <div style={{ position: "relative", aspectRatio: "16 / 9", background: isUrl ? "var(--color-bg-panel)" : cover }}>
          {isUrl && (
            <img
              src={cover}
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
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", padding: "1.4rem" }}>
        {category && (
          <span
            style={{
              fontSize: "var(--text-2xs)",
              fontWeight: "var(--weight-medium)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wider)",
              color: accent,
            }}
          >
            {category}
          </span>
        )}
        <h3
          style={{
            margin: 0,
            fontSize: "var(--text-2xl)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: 1.25,
            letterSpacing: "var(--tracking-snug)",
            color: "var(--color-fg)",
          }}
        >
          {title}
        </h3>
        {excerpt && (
          <p style={{ margin: 0, fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)", color: "var(--color-fg-muted)" }}>
            {excerpt}
          </p>
        )}
        {(date || readingTime) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginTop: "0.2rem",
              fontSize: "var(--text-xs)",
              color: "var(--color-fg-subtle)",
            }}
          >
            {date && <span>{date}</span>}
            {date && readingTime && <span>·</span>}
            {readingTime && <span>{readingTime}</span>}
          </div>
        )}
      </div>
    </article>
  );
}
