import React from "react";

export interface LiveBadgeProps {
  /** Monospace elapsed readout, e.g. "03mo 12d 06h". */
  elapsed?: string;
  /** Status word. @default "live" */
  label?: string;
  style?: React.CSSProperties;
}

/**
 * "In motion" indicator: tabular mono elapsed time beside a pulsing green dot.
 * Used on currently-running work in the Processes band.
 */
export function LiveBadge(props: LiveBadgeProps): React.ReactElement;
