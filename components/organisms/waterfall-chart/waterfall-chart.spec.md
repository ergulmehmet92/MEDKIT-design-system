# mk-waterfall-chart

**Purpose:** How a total builds up from its parts.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | |
| `steps` | `WaterfallStep[]` | required | `{ id, name, value }` |
| `start` | `{ name, value }` | none | Where the walk begins, drawn from zero |
| `totalLabel` | `string` | `Net` | Names the final bar |
| `format` | `(v) => string` | the data's own decimals | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Colour

Direction B. Steps float from where the last ended, green up and red down, with signed values. The start and the total stand from zero in the lead. Hairline connectors run at each running level.

## Behaviour

Names wrap to two lines and end in an ellipsis when they still don't fit. A negative total stands below zero. Arrow keys read each step and its running total.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's monthly review.
