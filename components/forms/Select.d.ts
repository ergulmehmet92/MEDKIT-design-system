import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Strings or {value,label} pairs. */
  options: Array<string | SelectOption>;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

/**
 * Hairline-bordered native select styled to the dark UI, with a custom chevron.
 */
export function Select(props: SelectProps): React.ReactElement;
