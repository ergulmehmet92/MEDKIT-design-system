import React from "react";

/**
 * PullQuote — an editorial excerpt lifted from running text: a 3px rust rule
 * on the left, large light-weight quote, quiet optional source line. Reads
 * the active --accent, so it follows the domain stream (rust in editorial).
 */
export function PullQuote({ children, source, style = {}, ...rest }) {
  return (
    <figure
      style={{
        margin: 0,
        padding: "0.25rem 0 0.25rem var(--space-5)",
        borderLeft: "var(--border-accent) solid var(--accent)",
        ...style,
      }}
      {...rest}
    >
      <blockquote
        style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-xl)",
          fontWeight: "var(--weight-light)",
          lineHeight: "var(--leading-relaxed)",
          color: "var(--color-fg)",
        }}
      >
        {children}
      </blockquote>
      {source != null && (
        <figcaption
          style={{
            marginTop: "var(--space-2)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-xs)",
            color: "var(--color-fg-subtle)",
          }}
        >
          {source}
        </figcaption>
      )}
    </figure>
  );
}
