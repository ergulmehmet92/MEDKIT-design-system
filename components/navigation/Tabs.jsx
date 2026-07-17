import React, { useRef, useState } from "react";

/**
 * Tabs — the brand's underline navigation. A row of wide-tracked labels with
 * a single moving rule beneath the active one. Used to switch content streams
 * (Videos / Writing / Design) on the studio surface. Controlled or uncontrolled.
 *
 * Full tablist semantics: roving tabindex, ArrowLeft/Right + Home/End move
 * focus and selection, `aria-controls` wiring via `idPrefix` (give each panel
 * `id="{idPrefix}-panel-{id}"` and `aria-labelledby="{idPrefix}-tab-{id}"`).
 *
 * items: Array<{ id, label, count?, hint? }>
 */
export function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  idPrefix,
  "aria-label": ariaLabel,
  style = {},
  ...rest
}) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? internal;
  const refs = useRef({});

  const select = (id, focus = false) => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
    if (focus && refs.current[id]) refs.current[id].focus();
  };

  const onKeyDown = (e, index) => {
    const last = items.length - 1;
    let next = null;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next == null) return;
    e.preventDefault();
    select(items[next].id, true);
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      style={{
        display: "flex",
        gap: "1.75rem",
        borderBottom: "1px solid var(--color-border)",
        ...style,
      }}
      {...rest}
    >
      {items.map((it, i) => {
        const on = it.id === active;
        return (
          <Tab
            key={it.id}
            item={it}
            active={on}
            idPrefix={idPrefix}
            tabRef={(el) => {
              refs.current[it.id] = el;
            }}
            onSelect={() => select(it.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          />
        );
      })}
    </div>
  );
}

function Tab({ item, active, idPrefix, tabRef, onSelect, onKeyDown }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      ref={tabRef}
      role="tab"
      id={idPrefix ? `${idPrefix}-tab-${item.id}` : undefined}
      aria-controls={idPrefix ? `${idPrefix}-panel-${item.id}` : undefined}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
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
        flexDirection: item.hint != null ? "column" : "row",
        alignItems: item.hint != null ? "flex-start" : "center",
        gap: item.hint != null ? 0 : "0.5rem",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-sm)",
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-wider)",
        color: active ? "var(--color-fg)" : hover ? "var(--color-fg)" : "var(--color-fg-muted)",
        transition: "var(--transition-color)",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
        {item.label}
        {item.count != null && (
          <span style={{ fontSize: "var(--text-2xs)", color: "var(--color-fg-subtle)", fontVariantNumeric: "tabular-nums" }}>
            {item.count}
          </span>
        )}
      </span>
      {item.hint != null && (
        <span
          style={{
            display: "block",
            marginTop: "0.15rem",
            fontSize: "var(--text-2xs)",
            fontWeight: "var(--weight-regular)",
            textTransform: "none",
            letterSpacing: "var(--tracking-normal)",
            color: "var(--color-fg-muted)",
          }}
        >
          {item.hint}
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
