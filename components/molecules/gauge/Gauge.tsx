import { useId, type ReactNode } from "react";
import "./gauge.css";

export type GaugeBand = {
  /** Where the band ends. Bands run from `min` in order. */
  to: number;
  /** Short, for the dial: "Late". */
  name: string;
  /** Longer, for the verdict: "Late, overdue". Defaults to `name`. */
  label?: string;
};

export type GaugeProps = {
  /** Names the meter: "Cycle state". */
  label: string;
  /** The reading, where the needle points. */
  value: number;
  min: number;
  bands: GaugeBand[];
  /**
   * The band that applies, from 1. Defaults to the band holding the reading. Set it when something
   * else decides, such as a tripwire forcing state 4 or an override.
   */
  state?: number;
  /** Why `state` differs from the reading, said under the verdict. */
  reason?: ReactNode;
  format?: (value: number) => string;
  /** The line under the verdict. Defaults to "Reading 2.93 of 4". */
  reading?: ReactNode;
  /** The reading in words. Built from the bands by default. */
  valueText?: string;
  /** The why: what produced the reading, usually GaugeSections of TrackBars. */
  children?: ReactNode;
  className?: string;
};

const CX = 170;
const CY = 170;
const R = 140;

/** Which band, from 1, holds a value. A value on a boundary belongs to the band above. */
export function bandOf(value: number, min: number, bands: GaugeBand[]): number {
  if (value < min) return 1;
  const i = bands.findIndex((b) => value < b.to);
  return i < 0 ? bands.length : i + 1;
}

/**
 * A half dial in bands. The current band is honey and the needle is the reading. Under it, the
 * verdict in words, then the why. The gauge shows; the person decides.
 */
export function Gauge({ label, value, min, bands, state, reason, format, reading, valueText, children, className }: GaugeProps) {
  const id = useId();
  const max = bands[bands.length - 1].to;
  const fmt = format ?? ((v: number) => v.toFixed(2));
  const current = Math.min(Math.max(state ?? bandOf(value, min, bands), 1), bands.length);
  const band = bands[current - 1];
  const verdict = band.label ?? band.name;
  const from = current === 1 ? min : bands[current - 2].to;

  const angle = (v: number) => Math.PI * (1 - (Math.min(Math.max(v, min), max) - min) / (max - min));
  const point = (a: number, r = R) => [CX + r * Math.cos(a), CY - r * Math.sin(a)].map((n) => Number(n.toFixed(2)));
  const gap = 2 / R;

  const reasonText = typeof reason === "string" ? ` ${reason}` : "";
  const words =
    valueText ??
    (state !== undefined && state !== bandOf(value, min, bands)
      ? `${verdict}, band ${current} of ${bands.length}. The reading is ${fmt(value)}, in ${bands[bandOf(value, min, bands) - 1].name}.${reasonText}`
      : `${verdict}, band ${current} of ${bands.length}. Reading ${fmt(value)}, between ${fmt(from)} and ${fmt(band.to)}, on a scale of ${fmt(min)} to ${fmt(max)}.`);

  const [nx, ny] = point(angle(value), R - 30);
  const classes = ["mk-gauge", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <div className="mk-gauge-meter" role="meter" aria-labelledby={`${id}-label`} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={words}>
        <span className="mk-gauge-label" id={`${id}-label`}>
          {label}
        </span>
        <svg className="mk-gauge-dial" viewBox="-80 -22 500 222" aria-hidden="true" focusable="false">
          {bands.map((b, k) => {
            const start = k === 0 ? min : bands[k - 1].to;
            const [x0, y0] = point(angle(start) - (k ? gap : 0));
            const [x1, y1] = point(angle(b.to) + (k < bands.length - 1 ? gap : 0));
            return <path key={b.name} className="mk-gauge-band" data-current={k + 1 === current ? "" : undefined} d={`M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}`} />;
          })}
          {bands.map((b, k) => {
            const start = k === 0 ? min : bands[k - 1].to;
            const a = angle((start + b.to) / 2);
            const [x, y] = point(a, R + 26);
            const c = Math.cos(a);
            return (
              <text key={b.name} x={x} y={y + 5} textAnchor={c < -0.35 ? "end" : c > 0.35 ? "start" : "middle"} data-current={k + 1 === current ? "" : undefined}>
                {`${k + 1} ${b.name}`}
              </text>
            );
          })}
          {[min, max].map((v) => {
            const [x, y] = point(angle(v));
            return (
              <text key={v} x={x} y={y + 24} textAnchor="middle">
                {fmt(v)}
              </text>
            );
          })}
          <line className="mk-gauge-needle" x1={CX} y1={CY} x2={nx} y2={ny} />
          <circle className="mk-gauge-hub" cx={CX} cy={CY} r={7} />
          <circle className="mk-gauge-hub-ring" cx={CX} cy={CY} r={2.5} />
        </svg>
        <div className="mk-gauge-verdict" aria-hidden="true">
          <span className="mk-gauge-state">{current}</span>
          <span className="mk-gauge-words">
            <span className="mk-gauge-name">{verdict}</span>
            <span className="mk-gauge-reading">{reading ?? `Reading ${fmt(value)} of ${fmt(max)}`}</span>
            {reason ? <span className="mk-gauge-reason">{reason}</span> : null}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}

export type GaugeSectionProps = {
  title: ReactNode;
  /** A note on the right of the title, such as what the bars measure. */
  aside?: ReactNode;
  titleAs?: "h3" | "h4" | "h5";
  children: ReactNode;
};

/** One part of the why, under a hairline: the clocks, the tripwires, the call. */
export function GaugeSection({ title, aside, titleAs: Title = "h4", children }: GaugeSectionProps) {
  return (
    <section className="mk-gauge-section">
      <div className="mk-gauge-section-head">
        <Title className="mk-gauge-section-title">{title}</Title>
        {aside ? <span className="mk-gauge-section-aside">{aside}</span> : null}
      </div>
      {children}
    </section>
  );
}
