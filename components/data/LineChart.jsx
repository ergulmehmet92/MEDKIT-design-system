import React, { useState } from "react";

const RAMP = ["var(--ink-200)", "var(--ink-400)", "var(--ink-500)"];
const EMPHASIS = "var(--rust-500)";
const W = 480;
const PAD = { top: 14, right: 12, bottom: 24, left: 12 };

/**
 * LineChart — the Chart.js line type, transformed to MED·Kit chart ink and
 * rendered as token-native SVG. Series step down the ink ramp; `emphasis`
 * marks at most one story series in rust; `dashed` is for comparison lines
 * (averages, benchmarks). Hovering a column shows a mono readout for every
 * series at that point.
 *
 * labels: string[] · series: Array<{ label, data: number[], emphasis?, dashed? }>
 */
export function LineChart({
  labels = [],
  series = [],
  height = 180,
  showArea = false,
  format = (v) => String(v),
  legend = true,
  style = {},
  ...rest
}) {
  const [hovered, setHovered] = useState(null);
  const H = height;
  const n = Math.max(...series.map((s) => s.data.length), labels.length);

  const all = series.flatMap((s) => s.data);
  const rawMin = Math.min(...all);
  const rawMax = Math.max(...all);
  const pad = (rawMax - rawMin || 1) * 0.15;
  const min = rawMin - pad;
  const max = rawMax + pad;

  const x = (i) => PAD.left + (n > 1 ? (i / (n - 1)) * (W - PAD.left - PAD.right) : 0);
  const y = (v) => PAD.top + (1 - (v - min) / (max - min)) * (H - PAD.top - PAD.bottom);
  const points = (data) => data.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  const colored = series.map((s, i) => ({
    ...s,
    color: s.emphasis ? EMPHASIS : RAMP[Math.min(i, RAMP.length - 1)],
  }));

  const labelStep = Math.max(1, Math.ceil(n / 12));

  return (
    <div style={{ ...style }} {...rest}>
      {legend && series.length > 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "0.625rem" }}>
          {colored.map((s) => (
            <span key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>
              <span aria-hidden style={{ width: 16, height: 0, borderTop: `2px ${s.dashed ? "dashed" : "solid"} ${s.color}` }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%" }} preserveAspectRatio="xMinYMid meet" role="img" aria-label={colored.map((s) => s.label).join(", ")}>
        {labels.map((label, i) =>
          i % labelStep === 0 ? (
            <text key={i} x={x(i)} y={H - 8} fontSize={10} fill="var(--ink-400)" textAnchor="middle" fontFamily="var(--font-sans)" letterSpacing="0.05em">
              {label}
            </text>
          ) : null
        )}
        {showArea && colored[0] && (
          <polygon
            points={`${x(0)},${y(min + pad)} ${points(colored[0].data)} ${x(colored[0].data.length - 1)},${y(min + pad)}`}
            fill={colored[0].color}
            opacity={0.08}
          />
        )}
        {colored.map((s) => (
          <polyline
            key={s.label}
            points={points(s.data)}
            fill="none"
            stroke={s.color}
            strokeWidth={s.dashed ? 1 : 2}
            strokeDasharray={s.dashed ? "4 5" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {Array.from({ length: n }, (_, i) => {
          const bandLeft = i === 0 ? PAD.left : (x(i - 1) + x(i)) / 2;
          const bandRight = i === n - 1 ? W - PAD.right : (x(i) + x(i + 1)) / 2;
          return (
            <rect
              key={i}
              x={bandLeft}
              y={0}
              width={bandRight - bandLeft}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
        {hovered != null && (
          <g pointerEvents="none">
            <line x1={x(hovered)} y1={PAD.top} x2={x(hovered)} y2={H - PAD.bottom} stroke="var(--ink-600)" strokeWidth={1} strokeDasharray="3 3" />
            {colored.map(
              (s) =>
                s.data[hovered] != null && (
                  <circle key={s.label} cx={x(hovered)} cy={y(s.data[hovered])} r={3.5} fill={s.color} />
                )
            )}
          </g>
        )}
        {hovered == null &&
          colored
            .filter((s) => !s.dashed)
            .map((s) => <circle key={s.label} cx={x(s.data.length - 1)} cy={y(s.data[s.data.length - 1])} r={3} fill={s.color} />)}
      </svg>
      <p aria-live="polite" style={{ margin: "0.375rem 0 0", minHeight: "1rem", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontVariantNumeric: "tabular-nums", color: "var(--color-fg-muted)" }}>
        {hovered != null
          ? `${labels[hovered] ?? ""} · ${colored
              .filter((s) => s.data[hovered] != null)
              .map((s) => `${s.label} ${format(s.data[hovered])}`)
              .join(" · ")}`
          : " "}
      </p>
    </div>
  );
}
