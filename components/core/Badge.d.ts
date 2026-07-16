import React from "react";

export type BadgeTone = "neutral" | "editorial" | "content" | "craft" | "live" | "accent";
export type BadgeVariant = "soft" | "solid" | "dot";

export interface BadgeProps {
  children: React.ReactNode;
  /** Meaning via domain accent or status hue. @default "neutral" */
  tone?: BadgeTone;
  /** "soft" tinted · "solid" filled · "dot" leading dot only. @default "soft" */
  variant?: BadgeVariant;
  style?: React.CSSProperties;
}

/**
 * Status / category marker. Carries meaning through a domain-signal accent
 * (editorial / content / craft) or the live-status hue, unlike the neutral Chip.
 */
export function Badge(props: BadgeProps): React.ReactElement;
