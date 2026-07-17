Horizontal meter for readings against a scale — allocation vs target, health 0–1, lateness.

```jsx
<TrackBar value={83.9} max={100} targetValue={40} title="Cash: 83.9% vs target 40%" />
<TrackBar value={0.35} max={1} height={8} />
```

Chart-ink rules: the fill is de-emphasis grey (`--ink-300`) by default; use `fill="var(--rust-500)"` for at most ONE bar per view — the story mark. Status hues never fill bars. Label every bar in text beside it (color is never the only channel); pass `title` so the exact reading is hoverable.
