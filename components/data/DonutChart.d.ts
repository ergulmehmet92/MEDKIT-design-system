import React from "react";

export interface DonutSegment {
  label: string;
  value: number;
  /** Marks THIS segment as the one story mark (rust). At most one per chart. */
  emphasis?: boolean;
}

export interface DonutChartProps {
  data: DonutSegment[];
  /** Diameter in px. @default 168 */
  size?: number;
  /** Ring thickness in px. @default 16 */
  thickness?: number;
  /** Large center readout (defaults to the total). */
  centerValue?: React.ReactNode;
  /** Small uppercase line under the center readout. */
  centerLabel?: React.ReactNode;
  /** Dot + label + mono value legend beside the ring. @default true */
  legend?: boolean;
  format?: (v: number) => string;
  style?: React.CSSProperties;
}

/**
 * The Chart.js doughnut type in MED·Kit chart ink — ordinal ink-ramp segments,
 * one rust story segment, hairline gaps, center readout.
 */
export function DonutChart(props: DonutChartProps): React.ReactElement;
