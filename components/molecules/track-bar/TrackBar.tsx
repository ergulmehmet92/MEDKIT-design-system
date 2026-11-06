import { useId, type ReactNode } from "react";
import "./track-bar.css";

export type TrackBarProps = {
  /** Names the bar. Visible unless `size` is compact, where a table header usually says it. */
  label: ReactNode;
  value: number;
  /** The end of the track. */
  max: number;
  min?: number;
  /** A tick for where the value should be. */
  target?: number;
  /** The allowed range, a shade darker. Outside it the bar turns red and says by how much. */
  range?: [number, number];
  /** A trigger: a tick that turns the bar red once the value reaches it. */
  limit?: number;
  /** Honey, when the bar is the one thing that matters. */
  tone?: "lead" | "accent";
  /** Compact sits on one line, for table cells. */
  size?: "default" | "compact";
  format?: (value: number) => string;
  /** Visible text on the right. Defaults to the value, or how far out of range it is. */
  readout?: ReactNode;
  /** A line under the bar, such as the target or a source. */
  note?: ReactNode;
  /** The reading in words for assistive technology. Built from the numbers by default. */
  valueText?: string;
  className?: string;
};

const ARROW = (up: boolean) => (
  <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
    <path d={up ? "M5 1l4 7H1z" : "M5 9L1 2h8z"} fill="currentColor" />
  </svg>
);

const decimals = (v: number) => {
  const text = String(Math.abs(v));
  const dot = text.indexOf(".");
  return dot < 0 || text.includes("e") ? 0 : Math.min(text.length - dot - 1, 2);
};

export type TrackBarStatus = "over" | "under" | "reached" | null;

/** Where a value sits against its range or limit, and by how much it is out. */
export function trackStatus(value: number, range?: [number, number], limit?: number): { status: TrackBarStatus; by: number } {
  if (limit !== undefined && value >= limit) return { status: "reached", by: value - limit };
  if (range && value > range[1]) return { status: "over", by: value - range[1] };
  if (range && value < range[0]) return { status: "under", by: range[0] - value };
  return { status: null, by: 0 };
}

/** A value against a target: a grey track, the allowed range a shade darker, the target a tick, the value in the lead. */
export function TrackBar({
  label,
  value,
  max,
  min = 0,
  target,
  range,
  limit,
  tone = "lead",
  size = "default",
  format,
  readout,
  note,
  valueText,
  className,
}: TrackBarProps) {
  const labelId = `${useId()}-label`;
  const digits = Math.max(decimals(value), decimals(target ?? 0), decimals(range?.[0] ?? 0), decimals(range?.[1] ?? 0));
  const fmt = format ?? ((v: number) => v.toFixed(digits).replace("-", "−"));
  const span = max - min || 1;
  const at = (v: number) => `${(Math.min(Math.max((v - min) / span, 0), 1) * 100).toFixed(2)}%`;
  const { status, by } = trackStatus(value, range, limit);
  const out = status !== null;
  const amount = fmt(Math.round(by * 10 ** Math.max(digits, 1)) / 10 ** Math.max(digits, 1));

  const words =
    valueText ??
    [
      target === undefined && !range && limit === undefined ? `${fmt(value)} of ${fmt(max)}` : fmt(value),
      target !== undefined ? `target ${fmt(target)}` : null,
      range ? `allowed ${fmt(range[0])} to ${fmt(range[1])}` : null,
      limit !== undefined ? `limit ${fmt(limit)}` : null,
    ]
      .filter(Boolean)
      .join(", ") +
      (status === "over" ? `. Over by ${amount}.` : status === "under" ? `. Under by ${amount}.` : status === "reached" ? ". Limit reached." : range ? ". In range." : ".");

  const shown =
    readout ??
    (status === "over" || status === "under" ? (
      <>
        {ARROW(status === "over")}
        {size === "compact" ? `${status} ${amount}` : `${status} by ${amount}`}
      </>
    ) : status === "reached" ? (
      "limit reached"
    ) : size === "compact" && range ? (
      <em>in range</em>
    ) : (
      <>
        {fmt(value)}
        {range && size !== "compact" ? <em>{` of ${fmt(range[0])} to ${fmt(range[1])}`}</em> : null}
        {!range && target === undefined && limit === undefined ? <em>{` of ${fmt(max)}`}</em> : null}
        {!range && limit !== undefined ? <em>{` of ${fmt(limit)}`}</em> : null}
      </>
    ));

  const classes = ["mk-track-bar", className].filter(Boolean).join(" ");

  return (
    <div className={classes} data-size={size} data-tone={tone} data-status={status ?? undefined}>
      {size === "compact" ? (
        <span className="mk-track-bar-label" id={labelId} data-hidden="">
          {label}
        </span>
      ) : (
        <div className="mk-track-bar-head">
          <span className="mk-track-bar-label" id={labelId}>
            {label}
          </span>
          <span className="mk-track-bar-readout" aria-hidden="true">
            {shown}
          </span>
        </div>
      )}
      <div className="mk-track-bar-track" role="meter" aria-labelledby={labelId} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={words}>
        {range ? <span className="mk-track-bar-range" style={{ insetInlineStart: at(range[0]), inlineSize: `calc(${at(range[1])} - ${at(range[0])})` }} /> : null}
        <span className="mk-track-bar-fill" style={{ inlineSize: at(value) }} />
        {target !== undefined ? <span className="mk-track-bar-tick" style={{ insetInlineStart: at(target) }} /> : null}
        {limit !== undefined ? <span className="mk-track-bar-tick" data-limit="" style={{ insetInlineStart: at(limit) }} /> : null}
      </div>
      {size === "compact" ? (
        <span className="mk-track-bar-readout" aria-hidden="true">
          {shown}
        </span>
      ) : null}
      {note && size !== "compact" ? <p className="mk-track-bar-note">{note}</p> : null}
    </div>
  );
}
