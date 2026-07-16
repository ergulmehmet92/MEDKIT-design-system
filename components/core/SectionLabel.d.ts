import React from "react";

export interface SectionLabelProps {
  children: React.ReactNode;
  /** Optional right-aligned meta note, e.g. "02 projects". */
  meta?: React.ReactNode;
  /** Render in the rust editorial accent instead of muted grey. @default false */
  accent?: boolean;
  style?: React.CSSProperties;
}

/**
 * Uppercase wide-tracked eyebrow that titles a page band, with optional
 * right-aligned meta.
 */
export function SectionLabel(props: SectionLabelProps): React.ReactElement;
