import React from "react";

export interface PanelProps {
  /** Uppercase eyebrow naming the panel ("Cycle state"). */
  label: React.ReactNode;
  /** Right-aligned context ("as of 2026-07-12", "3 of 4 lit"). */
  aside?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Labeled dashboard surface for data-dense views — elevated card, eyebrow
 * label, optional aside. Pair with StatTile / TrackBar / StatusPill.
 */
export function Panel(props: PanelProps): React.ReactElement;
