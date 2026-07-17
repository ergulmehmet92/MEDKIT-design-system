import React from "react";

const INK = "var(--ink-300)";
const EMPHASIS = "var(--rust-500)";

function niceMax(values) {
  const m = Math.max(0, ...values);
  if (m === 0) return 1;
  const step = Math.pow(10, Math.floor(Math.log10(m)));
  return Math.ceil((m * 1.05) / step) * step;
}

/**
 * BarChart — the Chart.js bar type, transformed to MEDKIT chart ink. Data
 * draws in de-emphasis ink; `emphasis` marks at most one story bar in rust;
 * targets render as fg ticks. Horizontal rows (label + mono readout + track)
 * by default, classic columns with `horizontal={false}`. Labels carry
 * identity on every bar — color is never the only channel.
 *
 * data: Array<{ label, value, target?, emphasis?, valueLabel?, note? }>
 */
export function BarChart({
  data = [],
  max,
  horizontal = true,
  height = 180,
  format = (v) => String(v),
  barSize = 10,
  style = {},
  ...rest
}) {
  const scaleMax = max ?? niceMax(data.flatMap((d) => [d.value, d.target ?? 0]));

  if (horizontal) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", ...style }} {...rest}>
        {data.map((d) => {
          const pct = Math.min(100, (d.value / scaleMax) * 100);
          const targetPct = d.target != null ? Math.min(100, (d.target / scaleMax) * 100) : null;
          return (
            <div key={d.label}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0 0.75rem", marginBottom: "0.375rem" }}>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-fg)" }}>
                  {d.label}
                  {d.note != null && (
                    <span style={{ marginLeft: "0.5rem", fontSize: "var(--text-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--color-fg-subtle)" }}>
                      {d.note}
                    </span>
                  )}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontVariantNumeric: "tabular-nums", color: "var(--color-fg-muted)" }}>
                  {d.valueLabel ?? format(d.value)}
                </span>
              </div>
              <div
                title={`${d.label}: ${format(d.value)}${d.target != null ? ` vs target ${format(d.target)}` : ""}`}
                style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: 4, height: barSize, backgroundColor: "var(--color-bg-hover)" }}
              >
                <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${pct}%`, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: d.emphasis ? EMPHASIS : INK }} />
                {targetPct != null && (
                  <div style={{ position: "absolute", top: 0, bottom: 0, width: 2, left: `${targetPct}%`, backgroundColor: "var(--color-fg)" }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(0.5rem, 2vw, 1.25rem)", height: height + 44, ...style }} {...rest}>
      {data.map((d) => {
        const h = Math.max(2, (d.value / scaleMax) * height);
        const targetY = d.target != null ? Math.max(0, (d.target / scaleMax) * height) : null;
        return (
          <div key={d.label} title={`${d.label}: ${format(d.value)}`} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", fontVariantNumeric: "tabular-nums", color: "var(--color-fg-muted)" }}>
              {format(d.value)}
            </span>
            <div style={{ position: "relative", width: "100%", height }}>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: d.emphasis ? EMPHASIS : INK }} />
              {targetY != null && (
                <div style={{ position: "absolute", bottom: targetY, left: "-15%", right: "-15%", height: 2, backgroundColor: "var(--color-fg)" }} />
              )}
            </div>
            <span style={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--text-2xs)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-fg-subtle)" }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
