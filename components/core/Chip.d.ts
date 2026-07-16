import React from "react";

export interface ChipProps {
  children: React.ReactNode;
  /** Held-lit state (e.g. selected filter). @default false */
  active?: boolean;
  /** When set, the chip becomes interactive (pointer cursor). */
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Flat capsule tag for skills, tech stacks, categories, and dates. Charcoal
 * fill with a faint white border that brightens on hover.
 */
export function Chip(props: ChipProps): React.ReactElement;
