import React from "react";

export type DataTableCellType = "text" | "numeric" | "delta";

export interface DataTableColumn<Row = Record<string, unknown>> {
  key: string;
  header: React.ReactNode;
  /**
   * "numeric" — mono tabular, right-aligned. "delta" — signed number tinted
   * live (gain) / danger (loss). "text" — Inter, left. @default "text"
   */
  type?: DataTableCellType;
  align?: "left" | "right" | "center";
  width?: string;
  /** Custom cell renderer; falls back to String(row[key]). */
  render?: (row: Row) => React.ReactNode;
  /** Sort accessor — presence makes the header click-to-sort. */
  sortBy?: (row: Row) => number | string;
  /** Formatter for numeric/delta cells. */
  format?: (v: number) => string;
}

export interface DataTableProps<Row = Record<string, unknown>> {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Visually hidden caption for assistive tech. */
  caption?: string;
  /** Summary cells (one per column) above a top rule. */
  footer?: React.ReactNode[];
  /** Min table width in px before horizontal scroll. @default 640 */
  minWidth?: number;
  defaultSort?: { key: string; dir: "asc" | "desc" };
  /** Tighter rows for dense financial grids. @default false */
  dense?: boolean;
  style?: React.CSSProperties;
}

/**
 * Finance-grade data table: uppercase hairline header, 60%-hairline rows,
 * mono tabular numerics, delta tinting, click-to-sort, summary footer.
 */
export function DataTable<Row = Record<string, unknown>>(
  props: DataTableProps<Row>,
): React.ReactElement;
