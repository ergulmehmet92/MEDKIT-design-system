Flat pill tag for project tags, tech stacks, categories, and dates. Sits in a wrapped flex row with `gap`.

```jsx
<div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
  <Chip>Enterprise</Chip>
  <Chip>Product Design</Chip>
</div>
```

Pass `onClick` to make it interactive, `active` to hold it lit.
