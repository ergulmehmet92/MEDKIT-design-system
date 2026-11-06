export type SortDirection = "ascending" | "descending";
export type SortValue = number | string | Date | null | undefined;
export type ValueKind = "number" | "date" | "text";

export function kindOf(values: SortValue[]): ValueKind {
  const first = values.find((v) => v !== null && v !== undefined);
  if (first instanceof Date) return "date";
  return typeof first === "number" ? "number" : "text";
}

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

/** Sorts a copy, stable, with missing values last in either direction. */
export function sortRows<Row>(rows: Row[], value: (row: Row) => SortValue, direction: SortDirection): Row[] {
  const sign = direction === "ascending" ? 1 : -1;
  const keyed = rows.map((row, index) => ({ row, index, v: value(row) }));
  keyed.sort((a, b) => {
    const aMissing = a.v === null || a.v === undefined || (typeof a.v === "number" && Number.isNaN(a.v));
    const bMissing = b.v === null || b.v === undefined || (typeof b.v === "number" && Number.isNaN(b.v));
    if (aMissing || bMissing) return aMissing === bMissing ? a.index - b.index : aMissing ? 1 : -1;
    let cmp: number;
    if (a.v instanceof Date && b.v instanceof Date) cmp = a.v.getTime() - b.v.getTime();
    else if (typeof a.v === "number" && typeof b.v === "number") cmp = a.v - b.v;
    else cmp = collator.compare(String(a.v), String(b.v));
    return cmp === 0 ? a.index - b.index : cmp * sign;
  });
  return keyed.map((k) => k.row);
}

/** Numbers and dates sort highest or newest first; text sorts A to Z first. */
export function firstDirection(kind: ValueKind): SortDirection {
  return kind === "text" ? "ascending" : "descending";
}

/** How the sort reads aloud, in words that fit the values. */
export function describeSort(header: string, kind: ValueKind, direction: SortDirection): string {
  const words = {
    number: { descending: "highest first", ascending: "lowest first" },
    date: { descending: "newest first", ascending: "oldest first" },
    text: { ascending: "A to Z", descending: "Z to A" },
  }[kind][direction];
  return `Sorted by ${header}, ${words}.`;
}

/** The most decimals any value shows, up to two, so a column keeps the data's own precision. */
export function decimalsOf(values: SortValue[]): number {
  let most = 0;
  for (const v of values) {
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    const text = String(Math.abs(v));
    const dot = text.indexOf(".");
    if (dot >= 0 && !text.includes("e")) most = Math.max(most, text.length - dot - 1);
  }
  return Math.min(most, 2);
}
