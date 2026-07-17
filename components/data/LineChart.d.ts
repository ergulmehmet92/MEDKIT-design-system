import React from "react";

export interface LineSeries {
  label: string;
  data: number[];
  /** Marks THIS series as the one story mark (rust). At most one per chart. */
  emphasis?: boolean;
  /** Dashed comparison line (an average, a benchmark). */
  dashed?: boolean;
}

export interface LineChartProps {
  /** X-axis labels, one per data point. */
  labels: string[];
  series: LineSeries[];
  /** Plot height in px. @default 180 */
  height?: number;
  /** Soft area fill under the FIRST series. @default false */
  showArea?: boolean;
  format?: (v: number) => string;
  /** Series legend above the plot (auto-hidden for one series). @default true */
  legend?: boolean;
  style?: React.CSSProperties;
}

/**
 * The Chart.js line type in MEDKIT chart ink — ink-ramp series, one rust
 * story series, dashed comparisons, hover column readout.
 */
export function LineChart(props: LineChartProps): React.ReactElement;
