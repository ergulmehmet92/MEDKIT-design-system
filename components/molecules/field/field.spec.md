# mk-field

**Purpose:** Ties a label, a hint and an error to one control.
**Atomic level:** Molecule.
**Status:** Ready. Matches `Controls`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `ReactNode` | required | A real `label`, above the control |
| `hint` | `ReactNode` | none | Stays under the control |
| `error` | `ReactNode` | none | An error the app found. Shown at once |
| `invalidMessage` | `string` | the browser's message | Shown when the browser's own checks fail, once the field has been used |
| `optional` | `boolean` | false | Says "optional" beside the label |
| `required` | `boolean` | false | Passed to the control |
| `children` | | required | One Input, Textarea or Select |

## Behaviour

The control reads its id, `aria-describedby` and `aria-invalid` from the Field through context, so it needs no wiring.

Errors follow `:user-invalid`: nothing shows until someone has typed in or changed the field and left it, or a submit fails. Then the error and `aria-invalid="true"` appear together, and both clear as soon as typing fixes the value. Until then `aria-invalid` is `"false"`, not missing, so Firefox and Safari don't announce an empty required field as invalid on arrival. The error id joins `aria-describedby` only while the error shows. After a failed submit, the browser moves focus to the first invalid control, which reads its error.

## Anatomy and colour

The error is a sentence in the text colour, after the hexagon from the Failed lamp. Only the hexagon and the control's rim take `color.status.failed`, so the error never rests on colour. In forced colours the hexagon is CanvasText and the control's border thickens to 3px.

## Lineage

**Contains:** Input, Textarea or Select. **Used in:** Predictor's forms, the studio's search.
