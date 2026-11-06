# mk-bar-chart

**Purpose:** Comparison by length: grouped, stacked or diverging bars, upright or sideways.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | `label` names the plot and captions the table |
| `categories` | `string[]` | required | |
| `series` | `BarSeries[]` | required | `{ id, name, values, context?, highlight?, slot? }`. Null draws nothing |
| `layout` | `"grouped" \| "stacked" \| "diverging"` | `grouped` | Diverging colours one series by its sign |
| `orientation` | `"vertical" \| "horizontal"` | vertical, or horizontal when diverging | |
| `sort` | `"none" \| "descending"` | none, or descending when diverging | Keep time order unsorted |
| `values` | `"all" \| "ends" \| "none"` | all, or ends when stacked | Ends labels the largest and the last |
| `format` | `(v) => string` | the data's own decimals, up to two | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Colour

Direction B. Grouped: the one story series in the lead, comparisons (`context`) in grey, a `highlight` in the accent; three or more stories take categorical slots. Stacked: up to four parts in warm greys, strongest first, with a `highlight` in the accent; five or more take slots. Diverging: up above zero and down below, and every value carries its sign.

## Marks

Bars are 24px at most, with a 4px rounded end at the data and a square end at the baseline, and start at zero. Stacked segments are separated by 2px of surface, and only the outermost segment on each side of zero is rounded. Stacks pile positives up and negatives down, so a negative total reads. A zero or missing value draws nothing.

## Labels

Category names wrap to two lines under upright bars and end in an ellipsis when they still don't fit; sideways bars get a name column up to 38% of the width. Value labels sit just past each bar's end, in ink. The tooltip and table always have the full name and every value.

## Accessibility

Arrow keys read one category at a time, Right and Down forward, Left and Up back. The readout lists every series, and the total for stacks. Reading lifts the category and dims the rest.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's dashboards.
