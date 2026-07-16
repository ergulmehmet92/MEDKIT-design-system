import React, { useState } from "react";

/**
 * Input — hairline-bordered text field, theme-aware. Renders a single-line
 * input by default, or a textarea when `multiline`. Border brightens on
 * hover/focus to match the brand's quiet interaction language.
 */
export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  rows = 4,
  disabled = false,
  ariaLabel,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const lit = (focus || hover) && !disabled;

  const shared = {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-sm)",
    lineHeight: 1.5,
    color: "var(--color-fg)",
    backgroundColor: "var(--color-bg-elevated)",
    border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    padding: "0.65rem 0.85rem",
    outline: "none",
    opacity: disabled ? 0.5 : 1,
    transition: "var(--transition-border)",
    resize: multiline ? "vertical" : "none",
    ...style,
  };

  const handlers = {
    value,
    onChange,
    placeholder,
    disabled,
    "aria-label": ariaLabel,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    ...rest,
  };

  return multiline ? (
    <textarea rows={rows} style={shared} {...handlers} />
  ) : (
    <input type={type} style={shared} {...handlers} />
  );
}
