import React from "react";

export type StatTileTone = "neutral" | "live" | "warn" | "danger";

export interface StatTileProps {
  /** Uppercase KPI label ("Active predictions"). */
  label: React.ReactNode;
  /** The number itself — large, Inter light. */
  value: React.ReactNode;
  /** Quiet context line under the value. */
  sub?: React.ReactNode;
  /** Status dot beside the value. Status only, never data. @default "neutral" */
  tone?: StatTileTone;
  style?: React.CSSProperties;
}

/**
 * Single KPI tile: label / large light numeral / sub-line, with an optional
 * live·warn·danger status dot.
 */
export function StatTile(props: StatTileProps): React.ReactElement;
