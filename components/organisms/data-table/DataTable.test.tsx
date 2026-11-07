import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { signed } from "../../molecules/chart-frame/layout";
import { DataTable, type DataTableColumn } from "./DataTable";
import { closes, positions, type Close, type Position } from "./positions.sample";
import { decimalsOf, sortRows } from "./sort";

afterEach(cleanup);

const columns: DataTableColumn<Position>[] = [
  { id: "ticker", header: "Ticker" },
  { id: "theme", header: "Theme", muted: true },
  { id: "weight", header: "Weight", numeric: true, format: (v) => `${v.toFixed(1)}%` },
  { id: "today", header: "Today", numeric: true, direction: true, format: (v) => `${signed(v, 1)}%` },
];
const table = (props: Partial<Parameters<typeof DataTable<Position>>[0]> = {}) => (
  <DataTable label="Positions" columns={columns} rows={positions.slice(0, 5)} rowKey={(r) => r.ticker} defaultSort={{ column: "weight", direction: "descending" }} {...props} />
);
const firstColumn = () => screen.getAllByRole("rowheader").map((c) => c.textContent);

describe("sortRows", () => {
  it("keeps missing values last in either direction, and ties in their order", () => {
    const rows = [{ v: 2 }, { v: null }, { v: 5 }, { v: 2 }];
    expect(sortRows(rows, (r) => r.v, "descending").map((r) => r.v)).toEqual([5, 2, 2, null]);
    expect(sortRows(rows, (r) => r.v, "ascending").map((r) => r.v)).toEqual([2, 2, 5, null]);
  });

  it("sorts text naturally and dates by time", () => {
    expect(sortRows([{ v: "a10" }, { v: "a9" }], (r) => r.v, "ascending").map((r) => r.v)).toEqual(["a9", "a10"]);
    const d = [new Date(2026, 1, 1), new Date(2025, 1, 1)];
    expect(sortRows(d, (r) => r, "ascending")[0]).toBe(d[1]);
  });

  it("finds the data's own decimals, at most two", () => {
    expect(decimalsOf([1, 2.5, 3.25])).toBe(2);
    expect(decimalsOf([0.1 + 0.2])).toBe(2);
    expect(decimalsOf([4, 5])).toBe(0);
  });
});

describe("DataTable", () => {
  it("is a real table with a caption, row headers, and numbers on the right", () => {
    const { container } = render(table());

    expect(screen.getByRole("table", { name: "Positions" })).toBeTruthy();
    expect(firstColumn()).toEqual(["NVDA", "TSM", "VST", "CEG", "ETN"]);
    expect(container.querySelectorAll("td[data-numeric]").length).toBe(10);
    expect(container.querySelector("caption")?.hasAttribute("data-hidden")).toBe(true);
  });

  it("colours signed values with their sign and an arrow, and leaves zero plain", () => {
    render(table({ rows: [positions[0], positions[4], positions[10]] }));
    const cells = screen.getAllByRole("row").slice(1).map((r) => within(r).getAllByRole("cell")[2]);

    expect(cells.map((c) => c.textContent)).toEqual(["+1.8%", "−0.4%", "0.0%"]);
    expect(cells.map((c) => c.querySelector("[data-dir]")?.getAttribute("data-dir") ?? null)).toEqual(["up", "down", null]);
  });

  it("sorts numbers highest first, then lowest, and says so", () => {
    render(table());
    const today = screen.getByRole("button", { name: "Today" });

    fireEvent.click(today);
    expect(firstColumn()[0]).toBe("VST");
    expect(today.closest("th")?.getAttribute("aria-sort")).toBe("descending");
    expect(screen.getByText("Sorted by Today, highest first.")).toBeTruthy();

    fireEvent.click(today);
    expect(firstColumn()[0]).toBe("ETN");
    expect(today.closest("th")?.getAttribute("aria-sort")).toBe("ascending");
    expect(screen.getByRole("button", { name: "Weight" }).closest("th")?.hasAttribute("aria-sort")).toBe(false);
  });

  it("sorts text A to Z first", () => {
    render(table());
    fireEvent.click(screen.getByRole("button", { name: "Ticker" }));

    expect(firstColumn()).toEqual(["CEG", "ETN", "NVDA", "TSM", "VST"]);
    expect(screen.getByText("Sorted by Ticker, A to Z.")).toBeTruthy();
  });

  it("hands sorting to the caller when controlled", () => {
    const onSortChange = vi.fn();
    render(table({ sort: { column: "weight", direction: "descending" }, onSortChange }));
    fireEvent.click(screen.getByRole("button", { name: "Weight" }));

    expect(onSortChange).toHaveBeenCalledWith({ column: "weight", direction: "ascending" });
    expect(firstColumn()[0]).toBe("NVDA");
  });

  it("keeps its header while loading, without sorting, and says it is loading", () => {
    const { container } = render(table({ loading: true, loadingRows: 4 }));

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    expect(container.querySelectorAll(".mk-data-table-skeleton")).toHaveLength(4);
    expect(screen.getByRole("region").getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("status").textContent).toBe("Loading Positions.");
  });

  it("says what an empty table will hold, under its header", () => {
    render(table({ rows: [], empty: "No positions yet." }));
    const cell = screen.getByRole("cell");

    expect(cell.textContent).toBe("No positions yet.");
    expect(cell.getAttribute("colspan")).toBe("4");
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders and sorts a thousand rows", () => {
    const rows = closes(1000);
    const closeColumns: DataTableColumn<Close>[] = [
      { id: "date", header: "Date" },
      { id: "close", header: "Close", numeric: true },
      { id: "change", header: "Change", numeric: true, direction: true },
    ];
    const { container } = render(<DataTable label="Daily closes" columns={closeColumns} rows={rows} rowKey={(r) => r.date.toISOString()} />);
    const body = () => [...container.querySelectorAll("tbody tr")];
    const header = (name: string) => [...container.querySelectorAll("thead button")].find((b) => b.textContent === name)!;

    expect(body()).toHaveLength(1000);
    fireEvent.click(header("Date"));
    expect(body()[0].querySelector("th")?.textContent).toBe("6 Nov 2026");
    fireEvent.click(header("Close"));
    const values = body().slice(0, 3).map((r) => Number(r.querySelector("td")!.textContent!.replace(/,/g, "")));
    expect(values).toEqual([...values].sort((a, b) => b - a));
  }, 15000);

  it("names its scroll area, takes focus to scroll, and passes axe", async () => {
    const { container } = render(table());
    const region = screen.getByRole("region", { name: "Positions" });

    expect(region.tabIndex).toBe(0);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
