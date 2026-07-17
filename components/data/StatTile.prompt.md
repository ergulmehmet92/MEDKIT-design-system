One KPI per tile: small uppercase label, a large light-weight Inter numeral, a quiet sub-line. Optional status dot for state.

```jsx
<StatTile label="Active predictions" value={5} sub="0 resolved — Brier pending" />
<StatTile label="Integrity — red flags" value={0} sub="10 invariants held" tone="live" />
```

Rules: numerals are Inter light — never serif, never bold-black display. The dot (`tone`) marks *state* (live / warn / danger), never a data series. Lay tiles in an even grid (2 / 3 / 6 columns) with `gap: var(--space-4)`; keep every tile the same height.
