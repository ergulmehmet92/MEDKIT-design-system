import React from "react";

/**
 * TrackBar — the system's horizontal meter. A recessive track one step off
 * the card surface with a data fill in chart ink (de-emphasis grey by
 * default; pass rust for the one story mark). An optional target tick marks
 * a goal value. Square at the baseline, 4px-rounded data end.
 */
export function TrackBar({
  value,
  max,
  fill = "var(--ink-300)",
  targetValue = null,
  height = 10,
  title,
  style = {},
  ...rest
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const targetPct =
    targetValue != null && max > 0 ? Math.min(100, (targetValue / max) * 100) : null;

  return (
    <div
      title={title}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: 4,
        height,
        backgroundColor: "var(--color-bg-hover)",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: `${pct}%`,
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
          backgroundColor: fill,
        }}
      />
      {targetPct != null && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 2,
            left: `${targetPct}%`,
            backgroundColor: "var(--color-fg)",
          }}
        />
      )}
    </div>
  );
}
