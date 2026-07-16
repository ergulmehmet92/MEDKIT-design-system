Square or round button for a single icon. Always pass `label` for accessibility. Feed an inline SVG (stroke 2, `currentColor`) as children.

```jsx
<IconButton label="Share" variant="outline">{shareSvg}</IconButton>
<IconButton label="Play" variant="solid" round>{playSvg}</IconButton>
```

Variants: `ghost` (default) · `outline` · `solid`.
