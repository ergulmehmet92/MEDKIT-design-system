# mk-beeswarm

**Purpose:** Every value as a dot, one row per group.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | |
| `groups` | `BeeswarmGroup[]` | required | `{ id, name, values, highlight? }` |
| `reference` | `number` | zero, when values cross it | The stronger line |
| `showMedian` | `boolean` | true | A tick and label per group |
| `format` | `(v) => string` | two decimals | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Behaviour

`swarm` places each dot as close to its row's middle as it can without touching another. When a row runs out of room, dots shrink from 4.5px (3.5px analytical) to 1.5px; past that they overlap at 35% opacity, so thousands of values read as density. The subject group wears the accent and the rest grey; with no highlight, every group wears the lead.

## Accessibility

Arrow keys read each group with its count, median and range. The table lists the same.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's prediction ledger.
