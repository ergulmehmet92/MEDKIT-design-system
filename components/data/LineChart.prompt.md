The Chart.js line type, transformed to chart ink — token-native SVG with hover readouts.

```jsx
<LineChart
  labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
  showArea
  format={(v) => `${v}%`}
  series={[
    { label: "Task completion", data: [81, 77, 76, 80, 84, 88] },
    { label: "Platform avg", data: [67, 67, 67, 67, 67, 67], dashed: true },
  ]}
/>
```

Rules: series step down the ink ramp (`--ink-200/400/500`); `emphasis` marks at most ONE story series in rust; `dashed` is for comparison baselines, drawn thin. Hover shows a mono readout for every series — the plot is never the only channel.
