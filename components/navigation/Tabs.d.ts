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
  /**
   * Wires full tablist semantics: each tab gets id="{idPrefix}-tab-{id}" and
   * aria-controls="{idPrefix}-panel-{id}" — give panels the matching ids.
   */
  idPrefix?: string;
  /** Accessible name for the tablist. */
  "aria-label"?: string;
  style?: React.CSSProperties;
}

/**
 * Underline tab navigation with a moving active rule and full keyboard
 * tablist semantics (roving tabindex, arrow keys, Home/End).
 *
 * @startingPoint section="Navigation" subtitle="Underline tabs with moving active rule" viewport="700x120"
 */
export function Tabs(props: TabsProps): React.ReactElement;
