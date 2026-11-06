import { scaleLinear } from "d3-scale";
import { area, line } from "d3-shape";
import type { ComponentPropsWithoutRef } from "react";
import { formatValue } from "../chart-frame";
import "./sparkline.css";

export type SparklineProps = Omit<ComponentPropsWithoutRef<"svg">, "children" | "values" | "width" | "height" | "format"> & {
  values: (number | null)[];
  /** What the line measures, such as "Portfolio, last 3 months". The range and last value are added for assistive technology. */
  label: string;
  width?: number;
  height?: number;
  /** A soft wash under the line. */
  area?: boolean;
  /** A value drawn as a hairline, such as a starting point. Zero gets one when values cross it. */
  reference?: number;
  /** Context draws in muted ink with the latest point in the accent. Story draws in slot 1. */
  tone?: "context" | "story";
  format?: (value: number) => string;
};

const finite = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v);

/**
 * A word-sized trend with no axes, for tiles and table cells. The trend sits in muted ink and the
 * latest point in the accent, so the eye lands on now.
 */
export function Sparkline({ values, label, width = 120, height = 28, area: withArea = false, reference, tone = "context", format = (v) => formatValue(v, 1), className, ...rest }: SparklineProps) {
  const known = values.filter(finite);
  const classes = className ? `mk-sparkline ${className}` : "mk-sparkline";
  if (!known.length) {
    return (
      <svg className={classes} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}: no data yet`} {...rest}>
        <line className="mk-sparkline-empty" x1={2} x2={width - 2} y1={height / 2} y2={height / 2} />
      </svg>
    );
  }
  let lo = Math.min(...known);
  let hi = Math.max(...known);
  if (reference !== undefined) [lo, hi] = [Math.min(lo, reference), Math.max(hi, reference)];
  if (lo === hi) [lo, hi] = [lo - 1, hi + 1];
  const pad = 4;
  const x = scaleLinear()
    .domain([0, Math.max(1, values.length - 1)])
    .range([pad, width - pad]);
  const y = scaleLinear().domain([lo, hi]).range([height - pad, pad]);
  const path = line<number | null>()
    .defined(finite)
    .x((_, i) => x(i))
    .y((v) => y(v as number));
  const wash = area<number | null>()
    .defined(finite)
    .x((_, i) => x(i))
    .y0(height)
    .y1((v) => y(v as number));
  let lastIndex = values.length - 1;
  while (lastIndex > 0 && !finite(values[lastIndex])) lastIndex--;
  const first = known[0];
  const last = values[lastIndex] as number;
  const zero = reference ?? (lo < 0 && hi > 0 ? 0 : undefined);
  const lone = values.map((v, i) => finite(v) && !finite(values[i - 1]) && !finite(values[i + 1]));
  const description = known.length === 1 ? `${label}: ${format(last)}` : `${label}: from ${format(first)} to ${format(last)}, low ${format(Math.min(...known))}, high ${format(Math.max(...known))}`;

  return (
    <svg className={classes} data-tone={tone} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={description} {...rest}>
      {zero !== undefined ? <line className="mk-sparkline-reference" x1={0} x2={width} y1={Math.round(y(zero)) + 0.5} y2={Math.round(y(zero)) + 0.5} /> : null}
      {withArea ? <path className="mk-sparkline-area" d={wash(values) ?? ""} /> : null}
      <path className="mk-sparkline-line" d={path(values) ?? ""} />
      {values.map((v, i) => (lone[i] && i !== lastIndex ? <circle key={i} className="mk-sparkline-point" cx={x(i)} cy={y(v as number)} r={1.75} /> : null))}
      <circle className="mk-sparkline-now" cx={x(lastIndex)} cy={y(last)} r={3} />
    </svg>
  );
}
