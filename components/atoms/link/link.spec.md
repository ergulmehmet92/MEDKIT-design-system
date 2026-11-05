# mk-link and mk-arrow-link

**Purpose:** Link is a link inside running text. ArrowLink is a link that stands on its own, like "Read the story".
**Atomic level:** Atoms, because neither can be broken down further.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| Link root | `a` | Underlined |
| ArrowLink root | `a` | Label and arrow in a row |
| ArrowLink label | `span.mk-arrow-link-label` | The accessible name |
| ArrowLink arrow | `svg` | `aria-hidden`, so it isn't read out |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| native anchor props | | | `href` is required in practice |

**Children:** the link text. Routers can render their own anchor with the same class names.

## States

| State | Look and behaviour |
|---|---|
| default | Link: hairline underline in the strong border colour. ArrowLink: text colour, no underline |
| hover | Link: the underline thickens and turns the accent colour. ArrowLink: text turns the accent colour, the arrow leans in and a hairline draws under the label |
| focus-visible | Accent outline, offset 3px |
| visited | The same as default on purpose. The portfolio's links are few, and revisiting them is expected |
| disabled, loading, error, empty | n/a |
| overflow | Link wraps with its text. ArrowLink's label wraps, and the arrow stays on the last line |

## Variants

Link and ArrowLink.

## Tokens and theming

**Tokens consumed:** `--mk-color-border-strong`, `--mk-color-text-accent`, `--mk-color-text-default`, `--mk-color-border-focus`, `--mk-border-width-default`, `--mk-border-width-focus`, `--mk-font-size-standalone`, `--mk-size-control`, `--mk-gap-sm`, `--mk-line-height-snug`, motion tokens

ArrowLink uses the lead size in editorial density and the body size in analytical density, through `--mk-font-size-standalone`.

## Events

Native.

## Accessibility

Native links. Inline links keep their underline, so they never rely on colour alone. ArrowLink is at least the control height, so it's as easy to hit as a button. Motion stops for reduced motion. In forced colours the ArrowLink label gets an underline, and colours map to `LinkText`.

## Responsive behaviour

No breakpoints.

## Content constraints

ArrowLink labels say where they go ("Read the story"), never "Click here".

## "What if" variations

Inline in a paragraph, a long ArrowLink label that wraps, and an external link are covered by stories.

## Lineage

**Contains:** nothing. **Used in:** none yet. The `/v2` page's story link moves to ArrowLink in Task 21.
