Underline tab navigation. Use it to switch content streams (Videos / Writing / Design) or sections within a page.

```jsx
<Tabs
  defaultValue="videos"
  onChange={setTab}
  items={[
    { id: "videos", label: "Videos", count: 24 },
    { id: "writing", label: "Writing", count: 12 },
    { id: "design", label: "Design", count: 8 },
  ]}
/>
```

Controlled (`value`) or uncontrolled (`defaultValue`). Active rule animates with the signature ease.
