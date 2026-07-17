import React from "react";

export type CardSurface = "elevated" | "panel" | "contrast" | "bare";

export interface CardProps {
  children: React.ReactNode;
  /** Element/component to render as (e.g. a router Link). Defaults to "a" when href is set, else "div". */
  as?: React.ElementType;
  /** Renders the card as a link. */
  href?: string;
  /**
   * "elevated" default surface · "panel" recessed body · "contrast" opposite
   * tone (white-on-dark / ink-on-light) · "bare" transparent with hover border.
   * @default "elevated"
   */
  surface?: CardSurface;
  /** Brighten border on hover. @default true */
  hoverable?: boolean;
  /** Lift 2px on hover (panel does this automatically). @default false */
  lift?: boolean;
  /** CSS padding shorthand. @default "1.5rem" */
  padding?: string;
  /** Corner radius token/value. @default "var(--radius-lg)" */
  radius?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Theme-aware surface container with the brand's hairline-border hover.
 *
 * @startingPoint section="Core" subtitle="Theme-aware surface card — elevated / panel / contrast" viewport="700x260"
 */
export function Card(props: CardProps): React.ReactElement;
