The Chart.js bar type, transformed to chart ink. Horizontal rows by default (label · mono readout · recessive track), classic columns with `horizontal={false}`.

```jsx
<BarChart
  format={(v) => `${v.toFixed(1)}%`}
  data={[
    { label: "Cash / Deposits", value: 83.9, target: 40, emphasis: true },
    { label: "Gold", value: 3.8, target: 12, note: "starter placed" },
    { label: "Crypto", value: 0.9 },
  ]}
/>
```

Rules: bars draw in `--ink-300`; `emphasis` marks at most ONE story bar in rust; `target` renders as a 2px fg tick; status hues never fill bars. Every bar keeps a text label + readout — color is never the only channel.
