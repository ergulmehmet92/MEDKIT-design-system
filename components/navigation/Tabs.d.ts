import React from "react";

export interface TabItem {
  id: string;
  label: string;
  /** Optional count shown after the label. */
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  /** Controlled active id. */
  value?: string;
  /** Uncontrolled initial id. */
  defaultValue?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

/**
 * Underline tab navigation with a moving active rule. Switches content streams.
 *
 * @startingPoint section="Navigation" subtitle="Underline tabs with moving active rule" viewport="700x120"
 */
export function Tabs(props: TabsProps): React.ReactElement;
