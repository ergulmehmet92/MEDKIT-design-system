import React from "react";

export type ButtonVariant = "primary" | "glass" | "secondary" | "ghost" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: React.ReactNode;
  /**
   * Visual weight. "primary" solid contrast pill · "glass" charcoal lift ·
   * "secondary" outline · "ghost" text-only · "accent" filled with the active
   * domain accent. @default "primary"
   */
  variant?: ButtonVariant;
  /** @default "md" */
  size?: ButtonSize;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Stretch to fill the container width. @default false */
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
}

/**
 * Theme-aware action button. Reads semantic tokens, so it renders correctly on
 * both ink (dark) and paper (light) surfaces with no extra props.
 *
 * @startingPoint section="Core" subtitle="Theme-aware pill button — primary / glass / accent / ghost" viewport="700x180"
 */
export function Button(props: ButtonProps): React.ReactElement;
