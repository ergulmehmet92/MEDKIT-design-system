Dark-styled native dropdown for sorting/filtering controls.

```jsx
<Select
  ariaLabel="Sort articles"
  value={sort}
  onChange={(e) => setSort(e.target.value)}
  options={[{ value: "latest", label: "Latest to oldest" }, { value: "reading-time", label: "Reading time" }]}
/>
```

Accepts plain strings or `{value,label}` options. Border brightens on hover/focus.
