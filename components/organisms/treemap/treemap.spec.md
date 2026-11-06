# mk-treemap

**Purpose:** Nested part to whole: groups hold their items, sized by value.
**Atomic level:** Organism, built on the chart frame and d3-hierarchy's squarified layout.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | |
| `groups` | `TreemapGroup[]` | required | `{ id, name, highlight?, children: { id, name, value }[] }` |
| `format` | `(v) => string` | the data's own decimals | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Behaviour

Tiles are tints of their group's colour (`--mk-dataviz-tint`) with a 3px full-colour edge, separated by 2px of surface. The subject group wears the accent; the rest take warm greys, largest group strongest. Group names sit in a header strip when the group is big enough. A tile shows its name, then its share, only when they fit. Zero items are left out.

## Accessibility

Arrow keys read every tile, group by group, with its value and share. Reading outlines the tile and dims the rest. The table lists every item with its group.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's holdings view.
