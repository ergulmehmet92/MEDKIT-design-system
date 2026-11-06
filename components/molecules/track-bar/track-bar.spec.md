# mk-track-bar

**Purpose:** A value against a target: progress, a position against its allowed range, or a reading moving toward a trigger.
**Atomic level:** Molecule.
**Status:** Ready. Matches `Data3`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `ReactNode` | required | Names the meter. Hidden in compact size, where a table header says it |
| `value`, `max` | `number` | required | |
| `min` | `number` | 0 | |
| `target` | `number` | none | A tick |
| `range` | `[lo, hi]` | none | The allowed range, a shade darker |
| `limit` | `number` | none | A trigger tick; reaching it turns the bar red |
| `tone` | `"lead" \| "accent"` | lead | Honey only when the bar is the point |
| `size` | `"default" \| "compact"` | default | Compact is one line for a table cell |
| `format` | `(v) => string` | the data's own decimals | |
| `readout` | `ReactNode` | the value, or how far out it is | Visible only; pass `valueText` when it says more than the numbers |
| `note` | `ReactNode` | none | A line under the bar |
| `valueText` | `string` | built from the numbers | |

## Anatomy and colour

A grey track, the allowed range a shade darker, the target a 2px tick ringed in the surface colour, and the fill in the lead colour. Out of range or past a limit, the fill and readout turn red (`dataviz.down`) and the readout says by how much, with an arrow: the bullet chart's rule. The fill is clamped to the track.

## Accessibility

The track is a `meter` named by the label, with `aria-valuetext` in words: "9.8%, target 8%, allowed 6% to 9%. Over by 0.8." The visible readout is hidden from assistive technology so nothing is read twice.

In forced colours the track is outlined in CanvasText, the fill and ticks are CanvasText, the range is GrayText, and the red readout turns CanvasText, so the words carry the state.

## Lineage

**Contains:** nothing. **Used in:** Gauge's why, DataTable cells, Predictor's allocation panel.
