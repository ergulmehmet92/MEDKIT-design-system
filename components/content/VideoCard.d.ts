import React from "react";

export interface VideoCardProps {
  title: string;
  /** Channel / series name. */
  channel?: string;
  /** Meta line, e.g. "24K views · 2 weeks ago". */
  meta?: string;
  /** Duration overlay, e.g. "12:04". */
  duration?: string;
  /** Image URL or any CSS background (gradient fallback). */
  thumb?: string;
  /** Optional top-left ribbon, e.g. "New". */
  badge?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Video thumbnail card for content / YouTube surfaces — duration badge, hover
 * play affordance, title + meta. Theme-aware.
 *
 * @startingPoint section="Content" subtitle="Video thumbnail card — duration, hover play, meta" viewport="380x320"
 */
export function VideoCard(props: VideoCardProps): React.ReactElement;
