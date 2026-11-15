import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { signed } from "../../molecules/chart-frame/layout";
import { decimalsOf, describeSort, firstDirection, kindOf, sortRows, type SortDirection, type SortValue, type ValueKind } from "./sort";
import "./data-table.css";

export type DataTableColumn<Row> = {
  id: string;
  header: string;
  /** Numbers sit right in tabular figures. */
  numeric?: boolean;
  /** Signed values wear green or red, with the sign and an arrow. Zero stays plain. */
  direction?: boolean;
  /** Secondary text, such as a category, in the muted colour. */
  muted?: boolean;
  /** Defaults to true. */
  sortable?: boolean;
  /** What the column sorts by and, by default, shows. Defaults to `row[id]`. */
  value?: (row: Row) => SortValue;
  /** Text for a numeric value. Defaults to the data's own decimals; direction columns add the sign. */
  format?: (value: number) => string;
  /** Anything else in the cell, such as a TrackBar. Sorting still uses `value`. */
  cell?: (row: Row) => ReactNode;
};

export type DataTableSort = { column: string; direction: SortDirection };

export type DataTableProps<Row> = {
  /** Says what the table holds. It is the table's caption and names its scroll area. */
  label: string;
  /** Show the caption above the table. Hidden by default, because a Panel title usually says it. */
  showCaption?: boolean;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row, index: number) => string;
  /** The column that names each row. Defaults to the first. */
  rowHeader?: string;
  defaultSort?: DataTableSort;
  /** Controlled sorting. Pass with `onSortChange`. */
  sort?: DataTableSort;
  onSortChange?: (sort: DataTableSort) => void;
  loading?: boolean;
  /** Placeholder rows while loading. */
  loadingRows?: number;
  /** What an empty table says, under its header. */
  empty?: ReactNode;
  /** How many rows show before the table scrolls under its pinned header. */
  maxRows?: number;
  className?: string;
};

/** Full numbers, grouped, with a real minus: a table is where people read exact values. */
const plain = (v: number, digits: number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v).replace("-", "\u2212");

const ARROW_UP = "M5 1l4 7H1z";
const ARROW_DOWN = "M5 9L1 2h8z";
const arrow = (d: string) => (
  <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
    <path d={d} fill="currentColor" />
  </svg>
);

/**
 * A real table for dashboards. Headers sort and say so, the header row stays pinned while the body
 * scrolls, numbers sit right in tabular figures, and narrow containers scroll it sideways with the
 * first column pinned.
 */
export function DataTable<Row>({
  label,
  showCaption = false,
  columns,
  rows,
  rowKey,
  rowHeader,
  defaultSort,
  sort: controlled,
  onSortChange,
  loading = false,
  loadingRows = 6,
  empty = "Nothing here yet.",
  maxRows = 12,
  className,
}: DataTableProps<Row>) {
  const captionId = `${useId()}-caption`;
  const [uncontrolled, setUncontrolled] = useState<DataTableSort | undefined>(defaultSort);
  const sort = controlled ?? uncontrolled;
  const [announcement, setAnnouncement] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ wide: false, end: true });
  const headerId = rowHeader ?? columns[0]?.id;

  const valueOf = useMemo(() => {
    const map = new Map<string, (row: Row) => SortValue>();
    for (const c of columns) map.set(c.id, c.value ?? ((row: Row) => (row as Record<string, SortValue>)[c.id]));
    return map;
  }, [columns]);

  const meta = useMemo(() => {
    const map = new Map<string, { kind: ValueKind; decimals: number }>();
    for (const c of columns) {
      const values = rows.map((r) => valueOf.get(c.id)!(r));
      map.set(c.id, { kind: kindOf(values), decimals: decimalsOf(values) });
    }
    return map;
  }, [columns, rows, valueOf]);

  const sorted = useMemo(() => {
    if (!sort || !valueOf.has(sort.column)) return rows;
    return sortRows(rows, valueOf.get(sort.column)!, sort.direction);
  }, [rows, sort, valueOf]);

  // Pin the first column only when the table is wider than its container, and fade the edge while there is more.
  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    const measure = () => {
      const wide = node.scrollWidth > node.clientWidth + 1;
      const end = node.scrollLeft + node.clientWidth >= node.scrollWidth - 2;
      setOverflow((o) => (o.wide === wide && o.end === end ? o : { wide, end }));
    };
    measure();
    node.addEventListener("scroll", measure, { passive: true });
    // Watch the table too: rows arriving after loading widen it without resizing the scroll area.
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    observer?.observe(node);
    const table = node.querySelector("table");
    if (table) observer?.observe(table);
    return () => {
      node.removeEventListener("scroll", measure);
      observer?.disconnect();
    };
  }, []);

  const interactive = !loading && rows.length > 0;

  const onSort = (column: DataTableColumn<Row>) => {
    const kind = meta.get(column.id)!.kind;
    const direction: SortDirection =
      sort?.column === column.id ? (sort.direction === "descending" ? "ascending" : "descending") : firstDirection(kind);
    const next = { column: column.id, direction };
    if (!controlled) setUncontrolled(next);
    onSortChange?.(next);
    setAnnouncement(describeSort(column.header, kind, direction));
  };

  const text = (column: DataTableColumn<Row>, row: Row): ReactNode => {
    if (column.cell) return column.cell(row);
    const v = valueOf.get(column.id)!(row);
    if (v === null || v === undefined) return "";
    if (typeof v === "number") {
      const digits = meta.get(column.id)!.decimals;
      const shown = column.format ? column.format(v) : column.direction ? signed(v, digits) : plain(v, digits);
      if (!column.direction || v === 0) return shown;
      return (
        <span className="mk-data-table-dir" data-dir={v > 0 ? "up" : "down"}>
          {arrow(v > 0 ? ARROW_UP : ARROW_DOWN)}
          {shown}
        </span>
      );
    }
    if (v instanceof Date) return v.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    return String(v);
  };

  const classes = className ? `mk-data-table ${className}` : "mk-data-table";

  return (
    <div className={classes} style={{ ["--mk-data-table-rows" as string]: maxRows }}>
      <div
        ref={scroller}
        className="mk-data-table-scroll"
        tabIndex={0}
        role="region"
        aria-labelledby={captionId}
        aria-busy={loading || undefined}
        data-overflow={overflow.wide ? "" : undefined}
        data-end={overflow.end ? "" : undefined}
      >
        <table>
          <caption id={captionId} data-hidden={showCaption ? undefined : ""}>
            {label}
          </caption>
          <thead>
            <tr>
              {columns.map((column) => {
                const active = interactive && sort?.column === column.id;
                const canSort = interactive && column.sortable !== false;
                return (
                  <th key={column.id} scope="col" data-numeric={column.numeric ? "" : undefined} aria-sort={active ? sort!.direction : undefined}>
                    {canSort ? (
                      <button type="button" onClick={() => onSort(column)}>
                        {column.header}
                        {arrow(ARROW_DOWN)}
                      </button>
                    ) : (
                      <span>{column.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: loadingRows }, (_, i) => (
                  <tr key={i} className="mk-data-table-skeleton" aria-hidden="true">
                    {columns.map((column, k) => (
                      <td key={column.id} data-numeric={column.numeric ? "" : undefined}>
                        <span style={{ inlineSize: `${40 + ((i * 7 + k * 13) % 5) * 12}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              : sorted.length === 0
                ? (
                    <tr className="mk-data-table-empty">
                      <td colSpan={columns.length}>{empty}</td>
                    </tr>
                  )
                : sorted.map((row, i) => (
                    <tr key={rowKey(row, i)}>
                      {columns.map((column) => {
                        const props = {
                          "data-numeric": column.numeric ? "" : undefined,
                          "data-muted": column.muted ? "" : undefined,
                        };
                        return column.id === headerId ? (
                          <th key={column.id} scope="row" {...props}>
                            {text(column, row)}
                          </th>
                        ) : (
                          <td key={column.id} {...props}>
                            {text(column, row)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
      <p className="mk-data-table-live" role={loading ? "status" : undefined} aria-live="polite">
        {loading ? `Loading ${label}.` : announcement}
      </p>
    </div>
  );
}
