# mk-rule

**Purpose:** A hairline between blocks of content.
**Atomic level:** Atom, because it can't be broken down further.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `hr` | Hidden from assistive technology unless labelled |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `strength` | `"default" \| "strong"` | `"default"` | Strong is for structure, such as a table head |
| `aria-label` | `string` | none | Makes it a real separator |
| native props | | | Passed to the `hr` |

## States

None: not interactive.

## Variants

Default (decorative, exempt from contrast) and strong (3:1 or more on every surface).

## Tokens and theming

**Tokens consumed:** `--mk-color-border-default`, `--mk-color-border-strong`, `--mk-border-width-default`

## Events

None.

## Accessibility

Most rules are decoration, so they're hidden. A labelled rule becomes a separator that screen readers announce. Drawn as a border, so forced-colors mode keeps it, as `CanvasText`.

## Responsive behaviour

Fills its container's width.

## Content constraints

None.

## "What if" variations

Default, strong and labelled are covered by stories.

## Lineage

**Contains:** nothing. **Used in:** none yet.
