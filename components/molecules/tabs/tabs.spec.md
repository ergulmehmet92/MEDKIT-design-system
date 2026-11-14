# mk-tabs

**Purpose:** Switch between views of the same thing.
**Atomic level:** Molecule.
**Status:** Ready. Matches `Controls`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | required | Names the tab list |
| `tabs` | `{ id, label, panel }[]` | required | |
| `defaultSelected` | `string` | the first tab | Uncontrolled |
| `selected`, `onSelectedChange` | | none | Controlled |
| `activation` | `"automatic" \| "manual"` | automatic | Manual for panels that are slow to show |

## Behaviour

The WAI-ARIA tabs pattern: a `tablist` with one tab stop, Left and Right arrows moving between tabs and wrapping at the ends, reversed in right-to-left text, and Home and End jumping to the first and last tab. In automatic activation the tab is selected as focus arrives; in manual, Enter or Space selects it. The panel is a `tabpanel` named by its tab, and takes focus so its content can be reached next.

Tabs sit in a shallow well. The selected tab is a Lens body, in the text colour, with a 2px underline, so it never rests on colour. When the tabs don't fit, the list scrolls sideways without a scrollbar, the edges with more tabs fade, and the selected tab is scrolled into view within the list, never moving the page.

In forced colours the list and the selected tab take CanvasText borders, and the underline stays.

## Lineage

**Contains:** nothing. **Used in:** Predictor's dashboard views, the studio's video lists.
