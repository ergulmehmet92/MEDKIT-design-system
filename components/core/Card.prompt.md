Surface container for work, posts, video, and processes. Theme-aware — borders and fills adapt to `ink` / `paper`. Borders brighten on hover; `panel` (or `lift`) raises 2px.

```jsx
<Card surface="elevated" padding="2rem">…</Card>
<Card surface="contrast" radius="var(--radius-xl)">White diagram on a dark page</Card>
```

Surfaces: `elevated` (default) · `panel` (recessed, lifts) · `contrast` (opposite tone) · `bare` (transparent, hover border). Set `hoverable={false}` for static cards; `lift` to raise non-panel cards on hover.
