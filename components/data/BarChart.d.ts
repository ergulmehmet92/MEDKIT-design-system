import React from "react";

export interface BarChartDatum {
  label: string;
  value: number;
  /** Optional goal — rendered as a fg tick. */
  target?: number | null;
  /** Marks THIS bar as the one story mark (rust). At most one per chart. */
  emphasis?: boolean;
  /** Right-aligned readout beside the label (horizontal only). */
  valueLabel?: React.ReactNode;
  /** Small uppercase note after the label (horizontal only). */
  note?: React.ReactNode;
}

export interface BarChartProps {
  data: BarChartDatum[];
  /** Scale maximum; defaults to a padded nice max. */
  max?: number;
  /** Label+readout rows (default) or classic columns. @default true */
  horizontal?: boolean;
  /** Column-mode plot height in px. @default 180 */
  height?: number;
  format?: (v: number) => string;
  /** Bar thickness in px (horizontal). @default 10 */
  barSize?: number;
  style?: React.CSSProperties;
}

/**
 * The Chart.js bar type in MED·Kit chart ink — de-emphasis ink bars, one rust
 * story bar, fg target ticks.
 */
export function BarChart(props: BarChartProps): React.ReactElement;
