# mk-gauge

**Purpose:** A reading on a banded scale, with the band it puts you in and why. Built for Predictor's cycle gauge.
**Atomic level:** Molecule.
**Status:** Ready. Matches `Data3`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | required | Names the meter. Visually hidden; the Panel title says it on screen |
| `value`, `min` | `number` | required | The needle |
| `bands` | `{ to, name, label? }[]` | required | In order from `min`. A value on a boundary belongs to the band above |
| `state` | `number` | the band holding the value | Set it when something else decides: a tripwire, an override |
| `reason` | `ReactNode` | none | Why `state` differs from the reading. Shown, and read as part of the meter when it is a string |
| `format` | `(v) => string` | two decimals | |
| `reading` | `ReactNode` | "Reading 2.93 of 4" | |
| `valueText` | `string` | built from the bands | |
| `children` | | none | The why, usually `GaugeSection`s of TrackBars |

`GaugeSection` takes `title`, `aside` and `titleAs` (h4 by default), and draws a hairline above its content.

## Anatomy and colour

A half dial, bands separated by 2px gaps. Every band is a grey track except the current one, in honey (`dataviz.accent`). The needle and hub are the lead colour. Band numbers and names sit outside the dial, the current one in the text colour. Under the dial: the state number, its words, and the reading line. Then the why.

The gauge never decides. A call to action belongs under the why, not on the dial.

## Accessibility

The dial and verdict are one `meter`, with `aria-valuetext` saying the band, the reading and the band's range: "Late, overdue, band 3 of 4. Reading 2.93, between 2.50 and 3.25, on a scale of 1.00 to 4.00." When `state` overrides the reading it says both, and the reason. The why's TrackBars are meters of their own, under real headings.

In forced colours the bands are GrayText, the current band Highlight, and the needle CanvasText.

## Lineage

**Contains:** nothing; TrackBars come in as children. **Used in:** Predictor's cycle gauge, in a Panel.
