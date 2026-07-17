Finance-grade table: uppercase hairline header, quiet row rules, mono tabular numerics right-aligned, signed deltas tinted live/danger, click-to-sort, summary footer.

```jsx
<DataTable
  caption="Positions"
  rows={positions}
  rowKey={(p) => p.ticker}
  defaultSort={{ key: "weight", dir: "desc" }}
  footer={["Total", null, "100.0%", "+2.4%"]}
  columns={[
    { key: "ticker", header: "Ticker", sortBy: (p) => p.ticker,
      render: (p) => <span style={{ fontFamily: "var(--font-mono)" }}>{p.ticker}</span> },
    { key: "name", header: "Instrument" },
    { key: "weight", header: "Weight", type: "numeric", format: (v) => `${v.toFixed(1)}%`, sortBy: (p) => p.weight },
    { key: "change", header: "Δ 1d", type: "delta", format: (v) => `${v.toFixed(1)}%`, sortBy: (p) => p.change },
  ]}
/>
```

Rules: numerics are mono + `tabular-nums`, right-aligned. `delta` tint is STATE (gain live-green / loss danger-rust) — never a series color. Identifiers (tickers, ISINs) render mono. Give every table a `caption`; use `dense` inside narrow panels; the wrapper scrolls horizontally below `minWidth` — the page never does.
