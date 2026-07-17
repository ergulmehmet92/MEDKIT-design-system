import React from "react";

/* Ordinal chart ink — value carries the order, never hue. */
const RAMP = ["var(--ink-200)", "var(--ink-400)", "var(--ink-500)", "var(--ink-600)", "var(--ink-700)"];
const EMPHASIS = "var(--rust-500)";

/**
 * DonutChart — the Chart.js doughnut type, transformed to MEDKIT chart ink:
 * segments step down the ink ramp in data order, `emphasis` marks at most one
 * story segment in rust, hairline gaps keep the ring quiet. The legend
 * carries identity for every segment — color is never the only channel.
 *
 * data: Array<{ label, value, emphasis? }>
 */
export function DonutChart({
  data = [],
  size = 168,
  thickness = 16,
  centerValue,
  centerLabel,
  legend = true,
  format = (v) => String(v),
  style = {},
  ...rest
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const gap = data.length > 1 ? Math.min(3, c * 0.008) : 0;

  const fractions = data.map((d) => d.value / total);
  const segments = data.map((d, i) => {
    const frac = fractions[i];
    const before = fractions.slice(0, i).reduce((a, b) => a + b, 0);
    const arc = Math.max(0, frac * c - gap);
    return {
      ...d,
      color: d.emphasis ? EMPHASIS : RAMP[Math.min(i, RAMP.length - 1)],
      dasharray: `${arc} ${c - arc}`,
      dashoffset: -(before * c),
      pct: frac * 100,
    };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", ...style }} {...rest}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={data.map((d) => `${d.label}: ${format(d.value)}`).join(", ")}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-bg-hover)" strokeWidth={thickness} />
          {segments.map((s) => (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
            >
              <title>{`${s.label}: ${format(s.value)} (${s.pct.toFixed(0)}%)`}</title>
            </circle>
          ))}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", pointerEvents: "none" }}>
          <span style={{ fontSize: size >= 150 ? "var(--text-3xl)" : "var(--text-xl)", fontWeight: "var(--weight-light)", color: "var(--color-fg)" }}>
            {centerValue ?? format(total)}
          </span>
          {centerLabel != null && (
            <span style={{ marginTop: 2, fontSize: "var(--text-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--color-fg-subtle)" }}>
              {centerLabel}
            </span>
          )}
        </div>
      </div>
      {legend && (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 140, flex: 1 }}>
          {segments.map((s) => (
            <li key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "var(--text-sm)" }}>
              <span aria-hidden style={{ width: 10, height: 10, borderRadius: 3, flexShrink: 0, backgroundColor: s.color }} />
              <span style={{ color: "var(--color-fg-muted)" }}>{s.label}</span>
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontVariantNumeric: "tabular-nums", color: "var(--color-fg-muted)" }}>
                {format(s.value)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
