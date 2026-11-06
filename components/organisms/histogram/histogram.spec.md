# mk-histogram

**Purpose:** How values spread.
**Atomic level:** Organism, built on the chart frame and d3-array's binning.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | |
| `values` | `number[]` | required | |
| `binWidth` | `number` | about 20 bins | |
| `domain` | `[lo, hi]` | 1st to 99th percentile | Values past it fold into the edge bins |
| `tail` | `{ below?, above? }` | none | Bins past these wear down or up, with a count |
| `showMean`, `showSpread` | `boolean` | true | Mean line in the accent; one standard deviation as a wash |
| `format` | `(v) => string` | two decimals | Axis and readout |
| `unit` | `[singular, plural]` | value, values | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Behaviour

One series, so one colour: warm grey. Outliers join the edge bins, which read "or less" and "or more". Thousands of values bin in one pass. A single value still draws one bin. Bins are rounded at the top, square at the baseline, with a 2px gap.

## Accessibility

Arrow keys read each bin, starting at the one holding the mean. The table lists every bin.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's risk view.
