import React, { useState } from "react";

/**
 * Select — the hairline-bordered dropdown from the Thoughts index ("Sort by").
 * A thin wrapper over a native <select> styled to the dark UI, with a custom
 * chevron. Border brightens on hover/focus.
 */
export function Select({
  value,
  onChange,
  options = [],
  ariaLabel,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-flex", ...style }}>
      <select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          color: "var(--color-fg)",
          backgroundColor: "var(--color-bg-elevated)",
          border: focused
            ? "1px solid var(--color-border-hover)"
            : "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          padding: "0.5rem 2.25rem 0.5rem 0.75rem",
          outline: "none",
          cursor: "pointer",
          transition: "var(--transition-border)",
        }}
        {...rest}
      >
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: "0.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "var(--color-fg-muted)",
          fontSize: "0.7rem",
        }}
      >
        ▾
      </span>
    </div>
  );
}
