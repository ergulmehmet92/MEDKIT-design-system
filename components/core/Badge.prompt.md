Small status / category marker that carries meaning through a domain accent. Use it (not Chip) for categories and statuses.

```jsx
<Badge tone="editorial">Design Systems</Badge>
<Badge tone="content" variant="solid">New</Badge>
<Badge tone="live" variant="dot">Recording</Badge>
```

Tones: `neutral` · `editorial` (rust) · `content` (amber) · `craft` (steel) · `live` (green) · `accent`. Variants: `soft` (default) · `solid` · `dot`. The `dot` variant animates when `tone="live"`.
