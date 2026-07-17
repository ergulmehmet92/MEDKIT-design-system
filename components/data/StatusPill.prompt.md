State marker for data rows: hairline pill, muted text, one small status dot.

```jsx
<StatusPill tone="ok">ran 2026-07-12</StatusPill>
<StatusPill tone="warn">fired — standing until acted</StatusPill>
<StatusPill tone="idle">unlit</StatusPill>
```

The dot is the only colored element — text stays monochrome so a column of pills scans calmly. Tones map machine states: `ok` live-green · `warn`/`near` amber · `danger` rust · `idle` grey. Editorial categories take Badge, not StatusPill.
