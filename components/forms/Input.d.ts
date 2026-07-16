import React from "react";

export interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  /** Native input type (ignored when multiline). @default "text" */
  type?: string;
  /** Render a textarea instead of a single-line input. @default false */
  multiline?: boolean;
  /** Textarea rows. @default 4 */
  rows?: number;
  disabled?: boolean;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

/** Hairline-bordered text field / textarea. Theme-aware; border brightens on focus. */
export function Input(props: InputProps): React.ReactElement;
