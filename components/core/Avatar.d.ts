import React from "react";

export interface AvatarProps {
  /** Image URL. Falls back to monogram initials when absent. */
  src?: string;
  /** Full name — drives initials and tooltip. */
  name?: string;
  /** Pixel diameter. @default 40 */
  size?: number;
  /** Draw a ring (for stacked / overlapping avatars). @default false */
  ring?: boolean;
  style?: React.CSSProperties;
}

/** Circular identity mark — image or monogram initials. Theme-aware. */
export function Avatar(props: AvatarProps): React.ReactElement;
