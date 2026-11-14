# mk-input and the well

**Purpose:** A one-line text field.
**Atomic level:** Atom.
**Status:** Ready. Matches `Controls`.

## API

Every native `input` prop, plus `icon`: a small leading icon, hidden from assistive technology because the label names the field. Inside a Field it takes its id, description and invalid state from the Field; alone it needs an `aria-label`.

## The well

`.mk-well` is shared by Input, Textarea and Select: Lens glass pressed into the surface, with shade along the top edge and the light's rim along the bottom, brightening when the pointer light comes near. One-line wells are stadiums. Hover lifts the rim; focus is the 2px ring the buttons use; disabled is half strength. Invalid, by `:user-invalid` or `aria-invalid="true"`, draws a 1.5px Failed rim.

Wells are `--mk-size-control` tall: 48px in editorial density, which clears the 44px target, and 32px in analytical. Without backdrop-filter the well turns solid. In forced colours it takes a 1px CanvasText border, 3px when invalid, and GrayText when disabled.

## Lineage

**Contains:** nothing. **Used in:** Field, Predictor's forms, the studio's search.
