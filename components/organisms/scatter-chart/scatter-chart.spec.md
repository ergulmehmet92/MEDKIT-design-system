# mk-scatter-chart

**Purpose:** Two measures against each other, one dot per item, sized by a third when given.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready. Matches `Data2B`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label`, `xLabel`, `yLabel` | | required | |
| `points` | `ScatterPoint[]` | required | `{ id, name, x, y, size?, group? }` |
| `groups` | `ScatterGroup[]` | none | `{ id, name, highlight? }` |
| `sizeLabel` | `string` | none | Turns dots into bubbles sized by area |
| `references` | `{ x?, y? }` | zero, when values cross it | `{ value, label? }` lines |
| `named` | `string[]` | the highest, the lowest and the largest | Points named on the chart |
| `formatX`, `formatY`, `formatSize` | `(v) => string` | one decimal | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText`, `keys` | | | Passed to the frame |

## Colour

Three colours at most, because any two dots can sit side by side: the highlighted group in the accent, the next group in the lead, and every other group in grey, named "Other" in the key. With no groups, every dot wears the lead.

## Behaviour

Bubbles are sized by area (a square-root scale), drawn largest first so small ones sit on top, with a 2px surface ring. Names sit beside their dot, flipping left at the edge. The pointer reads the nearest dot within 36px of its edge, so nobody has to land on a pixel.

## Accessibility

Arrow keys read every point in order of x, with group, both measures and size. The table lists every point.

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's risk view, and the YouTube studio.
