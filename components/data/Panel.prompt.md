Labeled surface for dashboard content: an elevated card with a small uppercase eyebrow and an optional right-aligned aside for provenance or counts.

```jsx
<Panel label="Allocation vs targets" aside="state-3 targets · tick = target">
  …TrackBars, rows, tables…
</Panel>
```

The body is free-form. Keep the aside quiet (subtle grey, 2xs) — it carries context, never a call to action. On dense grids, Panels sit edge to edge with `gap: var(--space-4)`; never nest a bordered box directly inside a Panel — use hairline row dividers (`border-bottom: 1px solid var(--color-border)` at 60% via color-mix, last row borderless) instead.
