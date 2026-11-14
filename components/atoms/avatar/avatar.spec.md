# mk-avatar

**Purpose:** A person, as a picture or initials.
**Atomic level:** Atom.
**Status:** Ready. Matches `Controls`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | none | The text alternative, and the source of the initials |
| `src` | `string` | none | |
| `size` | `"sm" \| "md" \| "lg"` | md | 32, 48 and 72px |
| `decorative` | `boolean` | false | When the name is written beside it, so it isn't read twice |

## Behaviour

A circle with a hairline rim. It shows the image; initials in the label face when there is no image or it fails to load; or a quiet silhouette, named "No picture", when there is no name either. Initials take the first letters of the first and last words.

## Accessibility

An image avatar is an `img` with the name as its `alt`. Initials and the silhouette are `role="img"` with the name as their label, so screen readers hear the name, not the letters. Decorative avatars are hidden. In forced colours the rim is a CanvasText border.

## Lineage

**Contains:** nothing. **Used in:** the studio's header, comment threads.
