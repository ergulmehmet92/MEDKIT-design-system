# mk-chip

**Purpose:** A small label, filter toggle or removable filter.
**Atomic level:** Atom.
**Status:** Ready. Matches `Controls`.

## Kinds

The props choose the kind:

| Kind | Props | Element |
|---|---|---|
| Static | `children` only | `span` |
| Toggle | `pressed`, `onPressedChange` | `button` with `aria-pressed` |
| Removable | `onRemove`, optional `removeLabel` | `span` with a 24px close `button`, named "Remove" and the label |

## Look

A small Lens stadium, three quarters of the control height: 36px in editorial density and 24px in analytical, which is the WCAG 2.2 minimum target. Pressed chips take the Eclipse body and its glow, plus a tick, so the state never rests on colour. In forced colours chips get a CanvasText border, and pressed chips take Highlight.

## Accessibility

Group toggles under a label, as in `role="group" aria-label="Themes"`. A removable chip's close button has its own name, so "Remove Nuclear" is announced rather than "button".

## Lineage

**Contains:** nothing. **Used in:** Predictor's theme filters, the studio's search filters.
