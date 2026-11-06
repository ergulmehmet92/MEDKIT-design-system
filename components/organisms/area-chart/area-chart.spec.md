# mk-area-chart

**Purpose:** Parts of a whole over time: stacked totals, shares, or a stream's shape.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready. The stacked layout matches Data board 1's dashboard panel.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label`, `x` | | required | As LineChart |
| `series` | `AreaSeries[]` | required | Bottom layer first. `{ id, name, values, slot? }`. Null counts as zero |
| `layout` | `"stacked" \| "percent" \| "stream"` | `stacked` | Stacked handles negatives from the zero line. Stream has no value axis |
| `window` | `[from, to]` | everything | Changing it glides |
| `format` | `(v) => string` | whole numbers | Stacked and stream values |
| `totalLabel` | `string` | `Total` | Names the sum in the tooltip, readout and table |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText` | | | Passed to the frame |

## Behaviour

- Layers are tints of their slot, mixed into the surface by `--mk-dataviz-tint`, with a 1.5px edge in full colour on their outer side. Approved on Data board 1.
- Past eight series, the first seven keep their slots and the rest fold into one "Other" layer in muted ink.
- Each layer is named at the right edge, with its last value, spread apart and joined back by a leader in its colour. Narrow plots leave this to the legend and tooltip.
- One point draws as a 24px stacked column.

## Accessibility

The readout lists every layer from the top down, then the total. The tooltip uses swatch keys, and the table holds every value.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's exposure panel, and the YouTube studio's watch time.
