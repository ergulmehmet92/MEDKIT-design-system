# mk-bullet-chart

**Purpose:** A measure against its target and allowed range, one row each.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | |
| `items` | `BulletItem[]` | required | `{ id, name, value, target?, range? }` |
| `max` | `number` | the largest value, target or range, rounded up | The scale's end |
| `format` | `(v) => string` | the data's own decimals | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Colour

Direction B. The value is a bar in the lead. Outside its `range` it turns red, and the label and readout say over or under, so it never rests on colour. The target is a tick in ink; the range is a quiet band on a quieter track.

## Behaviour

Rows read top to bottom by keyboard, with value, target, range and how far out. Names that don't fit end in an ellipsis; the table has them in full.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's position limits.
