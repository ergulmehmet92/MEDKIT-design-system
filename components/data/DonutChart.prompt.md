The Chart.js doughnut type, transformed to chart ink — a share-of-whole ring with a center readout and an identity-carrying legend.

```jsx
<DonutChart
  centerValue={14}
  centerLabel="open"
  data={[
    { label: "strong", value: 6 },
    { label: "mixed", value: 2 },
    { label: "downtrend", value: 4 },
    { label: "unpriced", value: 2 },
  ]}
/>
```

Rules: segments step down the ink ramp in DATA ORDER — order your data ordinally (best → worst, largest → smallest) so value encodes meaning. `emphasis` marks at most ONE story segment in rust. Keep the legend on; the ring alone is never the only channel.
