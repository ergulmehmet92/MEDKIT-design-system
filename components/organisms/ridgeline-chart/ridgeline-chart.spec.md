# mk-ridgeline-chart

**Purpose:** How a spread changes across groups.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | |
| `series` | `RidgelineSeries[]` | required | `{ id, name, values, highlight? }` |
| `domain` | `[lo, hi]` | 1st to 99th percentile, rounded | |
| `overlap` | `number` | 1.8 | How far each ridge rises into the row above |
| `format` | `(v) => string` | two decimals | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Behaviour

Each ridge is a Gaussian kernel density (`density`) with Silverman's bandwidth, drawn as an opaque tint so it covers the ridge behind. Quiet ridges are warm grey with a grey edge; the subject ridges wear the accent. One shared height scale keeps ridges comparable. A single value draws a narrow peak; thousands evaluate at 81 points.

## Accessibility

Arrow keys read each ridge with its count, median, typical spread and range. The table lists the same.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's risk view.
