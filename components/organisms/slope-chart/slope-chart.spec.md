# mk-slope-chart

**Purpose:** Change between two moments, one line per item, named at both ends.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | |
| `items` | `SlopeItem[]` | required | `{ id, name, from, to, highlight? }`. Null leaves an end out |
| `fromLabel`, `toLabel` | `string` | required | Name the two moments |
| `format` | `(v) => string` | the data's own decimals | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Colour

Direction B. A `highlight` wears the accent, drawn last and thicker; the rest fall back to grey. With no highlight, every line wears the lead.

## Behaviour

Items sort by their end value. Names and values sit outside both ends, spread so they never touch. A missing end draws a dot without a line. Arrow keys read items top to bottom, with the change.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's dashboards.
