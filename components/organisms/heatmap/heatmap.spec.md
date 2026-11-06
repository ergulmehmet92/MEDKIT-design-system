# mk-heatmap

**Purpose:** Values as colour on a grid: a matrix (`Heatmap`) or a year of days (`CalendarHeatmap`).
**Atomic level:** Organisms, built on the chart frame.
**Status:** Ready. Matches `Data2B`.

## Heatmap API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label`, `rows`, `columns`, `values` | | required | Null leaves a cell empty |
| `scale` | `"sequential" \| "diverging"` | sequential | |
| `centre` | `number` | 0 | The value that means nothing; it takes the neutral middle step |
| `palette` | `"polarity" \| "direction" \| "accent"` | polarity | Blue and amber; red and green for gains and losses; grey and honey for strength, such as correlation |
| `domain` | `[lo, hi]` | the data's range | Fix it for known scales, such as [-1, 1] |
| `triangle` | `"full" \| "lower"` | full | Lower for symmetric grids; column names sit above the diagonal |
| `format` | `(v) => string` | the data's own decimals | |

## CalendarHeatmap API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label`, `days` | | required | `{ date, value }`. Weeks start on Monday |
| `scale`, `centre`, `palette` | | sequential, 0, direction | |
| `unit` | `[singular, plural]` | none | For the readout |
| `format` | `(v) => string` | whole numbers | |

## Behaviour

Seven classes at most, so neighbours stay distinguishable. Sequential steps come from the amber scale; diverging scales stretch to the furthest value either side of `centre`. Zero and missing days in a sequential calendar are hairline grey. Every value is written in its cell when it fits, in ink with a surface halo so it reads on any step, and always in the tooltip, readout and table, so it never rests on colour. The key names the ends and, when diverging, the centre.

## Accessibility

Arrow keys read every cell row by row, Shift moving a whole row or week. The calendar starts at the latest day. The matrix table repeats the grid; the calendar table totals each month with its busiest day.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's correlation and return grids, and the portfolio's build log.
