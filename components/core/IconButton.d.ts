import React from "react";

export type IconButtonVariant = "ghost" | "outline" | "solid";

export interface IconButtonProps {
  /** Inline SVG glyph (stroke 2, currentColor). */
  children: React.ReactNode;
  /** Accessible label (aria-label + title). Required for icon-only controls. */
  label: string;
  /** @default "ghost" */
  variant?: IconButtonVariant;
  /** Pixel box. @default 40 */
  size?: number;
  /** Circular instead of rounded-square. @default false */
  round?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

/** Single-glyph affordance (play, share, menu, close). Theme-aware. */
export function IconButton(props: IconButtonProps): React.ReactElement;
