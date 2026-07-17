import React from "react";

export type StatusPillTone = "ok" | "warn" | "near" | "danger" | "idle";

export interface StatusPillProps {
  /** Machine state → dot hue: ok (live green) · warn/near (amber) · danger (rust) · idle (grey). @default "idle" */
  tone?: StatusPillTone;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Quiet state marker for data rows — hairline pill, muted text, one status
 * dot. Badge is for editorial categories; StatusPill is for machine states.
 */
export function StatusPill(props: StatusPillProps): React.ReactElement;
