import React from "react";

export type VersionStatus = "current" | "explored" | "archived";

export interface VersionBadgeProps {
  /** Version label, e.g. "v3" or "v2.1". */
  version: string;
  /** Lifecycle dot. @default null */
  status?: VersionStatus | null;
  style?: React.CSSProperties;
}

/** Monospace version tag with optional lifecycle status dot, for design iterations. */
export function VersionBadge(props: VersionBadgeProps): React.ReactElement;
