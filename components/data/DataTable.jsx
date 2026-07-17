import React, { useMemo, useState } from "react";

const numericCell = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-xs)",
  fontVariantNumeric: "tabular-nums",
};

function defaultAlign(type) {
  return type === "text" || type == null ? "left" : "right";
}

/**
 * DataTable — the system's data table, built for finance-heavy readouts:
 * uppercase hairline header, 60%-hairline row rules, mono tabular numerics
 * right-aligned, signed delta cells tinted live/danger (state, never series),
 * optional click-to-sort and a summary footer row. Scrolls horizontally
 * inside its own wrapper below `minWidth`.
 *
 * columns: Array<{ key, header, type?: "text"|"numeric"|"delta", align?,
 *   width?, render?(row), sortBy?(row), format?(v) }>
 */
export function DataTable({
  columns = [],
  rows = [],
  rowKey,
  caption,
  footer,
  minWidth = 640,
  defaultSort = null,
  dense = false,
  style = {},
  ...rest
}) {
  const [sort, setSort] = useState(defaultSort);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col || !col.sortBy) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = col.sortBy(a);
      const bv = col.sortBy(b);
      if (av === bv) return 0;
      return (av < bv ? -1 : 1) * dir;
    });
  }, [rows, columns, sort]);

  const cellPad = dense ? "0.5rem 0" : "0.875rem 0";

  const renderCell = (col, row) => {
    if (col.render) return col.render(row);
    const raw = row[col.key];
    if (raw == null) return <span style={{ color: "var(--color-fg-subtle)" }}>—</span>;
    if (col.type === "delta" && typeof raw === "number") {
      const fmt = col.format ?? ((v) => String(v));
      const tint = raw > 0 ? "var(--signal-live)" : raw < 0 ? "var(--signal-danger)" : "var(--color-fg-muted)";
      return (
        <span style={{ color: tint }}>
          {raw > 0 ? "+" : ""}
          {fmt(raw)}
        </span>
      );
    }
    if (col.type === "numeric" && typeof raw === "number" && col.format) return col.format(raw);
    return String(raw);
  };

  return (
    <div style={{ overflowX: "auto", ...style }} {...rest}>
      <table style={{ width: "100%", minWidth, borderCollapse: "collapse", textAlign: "left", fontSize: "var(--text-sm)" }}>
        {caption && (
          <caption style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>
            {caption}
          </caption>
        )}
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            {columns.map((col) => {
              const align = col.align ?? defaultAlign(col.type);
              const sortable = !!col.sortBy;
              const active = sort && sort.key === col.key;
              const headerContent = (
                <>
                  {col.header}
                  {sortable && (
                    <span aria-hidden style={{ marginLeft: 6, color: active ? "var(--color-fg)" : "var(--color-fg-subtle)" }}>
                      {active ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}
                    </span>
                  )}
                </>
              );
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                  style={{
                    width: col.width,
                    padding: "0 1rem 0.75rem 0",
                    textAlign: align,
                    fontWeight: "var(--weight-regular)",
                    fontSize: "var(--text-2xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--color-fg-subtle)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSort((prev) =>
                          prev && prev.key === col.key
                            ? { key: col.key, dir: prev.dir === "asc" ? "desc" : "asc" }
                            : { key: col.key, dir: "desc" }
                        )
                      }
                      style={{
                        appearance: "none",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        font: "inherit",
                        letterSpacing: "inherit",
                        textTransform: "inherit",
                        color: "inherit",
                      }}
                    >
                      {headerContent}
                    </button>
                  ) : (
                    headerContent
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={rowKey(row)} style={{ borderBottom: "1px solid color-mix(in srgb, var(--color-border) 60%, transparent)" }}>
              {columns.map((col) => {
                const type = col.type ?? "text";
                const align = col.align ?? defaultAlign(type);
                return (
                  <td
                    key={col.key}
                    style={{
                      padding: cellPad,
                      paddingRight: "1rem",
                      textAlign: align,
                      verticalAlign: "top",
                      color: type === "text" ? "var(--color-fg)" : "var(--color-fg-muted)",
                      ...(type !== "text" ? numericCell : null),
                    }}
                  >
                    {renderCell(col, row)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        {footer && (
          <tfoot>
            <tr style={{ borderTop: "1px solid var(--color-border)" }}>
              {columns.map((col, i) => {
                const type = col.type ?? "text";
                const align = col.align ?? defaultAlign(type);
                return (
                  <td
                    key={col.key}
                    style={{
                      padding: cellPad,
                      paddingRight: "1rem",
                      textAlign: align,
                      color: "var(--color-fg)",
                      fontWeight: "var(--weight-medium)",
                      ...(type !== "text" ? numericCell : null),
                    }}
                  >
                    {footer[i] ?? null}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
