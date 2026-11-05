# mk-eyebrow

**Purpose:** Labels a section or piece of content in small uppercase type.
**Atomic level:** Atom, because it can't be broken down further.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `p` by default | Set `as` when the label is a real heading or sits inline |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `as` | `"p" \| "span" \| "h2" \| "h3" \| "h4"` | `"p"` | Choose by meaning, not looks |
| native props | | | Passed to the root |

**Children:** the label text.

## States

| State | Look and behaviour |
|---|---|
| default | Muted text colour |
| hover, focus, active, disabled, loading, error, empty | n/a: not interactive and has no data states |
| overflow | Wraps. Never truncates, so nothing gets hidden |

## Variants

None. Override colour with `--mk-eyebrow-color` where needed.

## Tokens and theming

**Tokens consumed:** `--mk-color-text-muted`, `--mk-font-family-label`, `--mk-font-size-label`, `--mk-font-weight-label`, `--mk-tracking-label`, `--mk-line-height-body`

| Property | Fallback | Controls |
|---|---|---|
| `--mk-eyebrow-color` | `var(--mk-color-text-muted)` | Text colour |

## Events

None.

## Accessibility

Native element. Uppercase comes from CSS, so screen readers get the source text. Text reaches 4.5:1 on every surface, checked by `npm run contrast`. Forced colours map the text to `CanvasText`.

## Responsive behaviour

Wraps with its container. No breakpoints.

## Content constraints

Keep it to a few words. Numbers like `01` only belong when the order means something.

## "What if" variations

One word, long text that wraps, and use as a heading are covered by stories.

## Lineage

**Contains:** nothing. **Used in:** none yet.
