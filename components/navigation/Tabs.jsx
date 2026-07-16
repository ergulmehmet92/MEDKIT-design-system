import React, { useState } from "react";

/**
 * Tabs — the brand's underline navigation. A row of wide-tracked labels with
 * a single moving rule beneath the active one. Used to switch content streams
 * (Videos / Writing / Design) on the studio surface. Controlled or uncontrolled.
 *
 * items: Array<{ id, label, count? }>
 */
export function Tabs({ items = [], value, defaultValue, onChange, style = {}, ...rest }) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? internal;

  const select = (id) => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };

  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        gap: "1.75rem",
        borderBottom: "1px solid var(--color-border)",
        ...style,
      }}
      {...rest}
    >
      {items.map((it) => {
        const on = it.id === active;
        return <Tab key={it.id} item={it} active={on} onSelect={() => select(it.id)} />;
      })}
    </div>
  );
}

function Tab({ item, active, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        appearance: "none",
        background: "none",
        border: "none",
        cursor: "pointer",
        position: "relative",
        padding: "0 0 0.9rem",
        marginBottom: -1,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-sm)",
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-wider)",
        color: active ? "var(--color-fg)" : hover ? "var(--color-fg)" : "var(--color-fg-muted)",
        transition: "var(--transition-color)",
      }}
    >
      {item.label}
      {item.count != null && (
        <span style={{ fontSize: "var(--text-2xs)", color: "var(--color-fg-subtle)", fontVariantNumeric: "tabular-nums" }}>
          {item.count}
        </span>
      )}
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -1,
          height: 2,
          background: "var(--color-fg)",
          transform: active ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform var(--duration-medium) var(--ease-out-expo)",
        }}
      />
    </button>
  );
}
