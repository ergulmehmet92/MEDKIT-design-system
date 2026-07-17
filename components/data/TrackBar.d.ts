import React from "react";

export interface TrackBarProps {
  /** Current value. */
  value: number;
  /** Scale maximum (fill = value / max). */
  max: number;
  /** Fill color. Chart ink grey by default; rust for the one story mark. @default "var(--ink-300)" */
  fill?: string;
  /** Optional goal — rendered as a 2px tick on the track. */
  targetValue?: number | null;
  /** Track height in px. @default 10 */
  height?: number;
  /** Tooltip / accessible summary of the reading. */
  title?: string;
  style?: React.CSSProperties;
}

/**
 * Horizontal meter: recessive track, chart-ink fill, optional target tick.
 */
export function TrackBar(props: TrackBarProps): React.ReactElement;
