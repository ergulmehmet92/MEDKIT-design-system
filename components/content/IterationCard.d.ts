import React from "react";
import { VersionStatus } from "./VersionBadge";

export interface IterationCardProps {
  /** Short label for this exploration, e.g. "Compact toolbar". */
  label: string;
  /** Version tag, e.g. "v3". */
  version: string;
  /** Lifecycle status dot. @default null */
  status?: VersionStatus | null;
  /** Optional one-line rationale. */
  note?: string;
  /** Artwork — image URL or CSS background. */
  art?: string;
  /** Media aspect ratio. @default "4 / 3" */
  ratio?: string;
  /** Highlight as the active/chosen iteration (craft-accent border). @default false */
  current?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  style?: React.CSSProperties;
}

/**
 * A frame in a design-iteration gallery — artwork, version tag, label, note.
 *
 * @startingPoint section="Content" subtitle="Design iteration frame — version, status, rationale" viewport="380x360"
 */
export function IterationCard(props: IterationCardProps): React.ReactElement;
