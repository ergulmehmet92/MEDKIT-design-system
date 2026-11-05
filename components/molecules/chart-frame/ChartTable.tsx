import type { ReactNode } from "react";
import "./chart-frame.css";

export type ChartTableColumn = { label: string; numeric?: boolean };
export type ChartTableRow = { header: ReactNode; cells: ReactNode[] };

export type ChartTableProps = {
  /** Says what the table holds. Also names its scroll area. */
  caption: string;
  /** The first column is the row header, such as the date. */
  columns: ChartTableColumn[];
  rows: ChartTableRow[];
};

/**
 * The table every chart carries. It scrolls inside the plot's height with its header pinned, and its
 * scroll area takes keyboard focus so it can be scrolled without a pointer.
 */
export function ChartTable({ caption, columns, rows }: ChartTableProps) {
  return (
    <div className="mk-chart-table" tabIndex={0} role="region" aria-label={caption}>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.label} scope="col" data-numeric={column.numeric ? "" : undefined}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <th scope="row">{row.header}</th>
              {row.cells.map((cell, k) => (
                <td key={k} data-numeric={columns[k + 1]?.numeric ? "" : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
