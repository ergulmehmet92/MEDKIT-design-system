Pill-shaped action. Theme-aware — works on both `ink` and `paper` surfaces. Use `primary` for the main action, `accent` to carry a domain colour, `glass` for the hero/work CTA lift, `secondary`/`ghost` for lower emphasis.

```jsx
<Button variant="primary" iconRight={<span>→</span>}>View case</Button>
<Button variant="accent">Subscribe</Button>
<Button variant="glass">Watch reel</Button>
<Button variant="ghost">View all →</Button>
```

Variants: `primary` · `glass` · `secondary` · `ghost` · `accent`. Sizes: `sm` · `md` · `lg`. Supports `iconLeft` / `iconRight`, `fullWidth`, `disabled`. The `accent` variant inherits `--accent` from the nearest domain scope.
