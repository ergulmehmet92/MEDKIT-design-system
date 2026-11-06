# mk-sparkline

**Purpose:** A word-sized trend for stat tiles and table cells, with no axes.
**Atomic level:** Molecule. The plan listed it among organisms, but it's one small graphic with no frame, so it sits with the molecules.
**Status:** Ready. Matches the tiles on Data board 1.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `values` | `(number \| null)[]` | required | Null is a gap |
| `label` | `string` | required | The accessible name adds the range, low, high and latest value |
| `width`, `height` | `number` | 120, 28 | |
| `area` | `boolean` | false | A soft wash under the line |
| `reference` | `number` | zero, when values cross it | A hairline |
| `tone` | `"context" \| "story"` | context | Context is muted ink. Story is slot 1 |
| `format` | `(v) => string` | one decimal | For the accessible name |
| native SVG props | | | Passed to the root |

## Behaviour

The latest real value gets a dot in the accent, ringed in the surface colour. Gaps break the line, and a lone point gets a small dot. An empty sparkline draws a hairline and says "no data yet".

## Accessibility

`role="img"`, named in words, so a screen reader hears the trend without a table. Forced-colors mode uses CanvasText.

## Lineage

**Contains:** nothing. **Used in:** stat tiles, DataTable cells.
