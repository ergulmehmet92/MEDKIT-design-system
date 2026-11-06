# mk-sankey-chart

**Purpose:** Where something came from and where it went.
**Atomic level:** Organism, built on the chart frame with its own layered layout.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | |
| `nodes` | `{ id, name, highlight? }[]` | required | |
| `links` | `{ source, target, value }[]` | required | Flows must not loop |
| `format` | `(v) => string` | the data's own decimals | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Layout

`layout.ts` places each node in the column of its longest path from a source, sizes it by the larger of its flow in and out, and uses one scale across columns so widths compare. Flows leave and arrive in the order of the nodes at their other end. d3-sankey isn't used: its dependency ranges clash with the kit's pinned d3 releases.

## Colour

Flows wear the tint of where they land. The subject destination wears the accent, other final destinations warm greys, and every upstream node grey, with its flows quieter.

## Accessibility

Arrow keys read each flow, with its value and its share of the source. Reading strengthens the flow and dims the rest. The table lists every flow.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's money flow, and the YouTube studio's traffic sources.
