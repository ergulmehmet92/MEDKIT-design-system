import React from "react";

export interface SectionLabelProps {
  /** Element to render as — use "h2"/"h3" when the label titles a section. @default "div" */
  as?: React.ElementType;
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
