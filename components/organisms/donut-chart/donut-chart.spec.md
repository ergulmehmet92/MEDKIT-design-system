# mk-donut-chart

**Purpose:** Part to whole at a glance.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | |
| `parts` | `DonutPart[]` | required | `{ id, name, value, highlight? }`. Zero and negative parts are left out |
| `centre` | `{ value, label }` | none | The figure in the hole |
| `format` | `(v) => string` | the data's own decimals | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Behaviour

Five parts at most. Past that, the smallest fold into "Other, n parts", which the tooltip and table break down; the highlight always keeps its own slice. The subject wears the accent and the rest take warm greys, largest strongest. Every part is named outside the ring, spread so names never collide and joined back by a leader, and a sliver says "<1%" rather than rounding. Slices are separated by a 2px gap and sweep in once.

## Accessibility

Arrow keys read each part with its value and share. Reading lifts the slice outward and dims the rest. The table lists every part, folded ones included.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's allocation panel.
