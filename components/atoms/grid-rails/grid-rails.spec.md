# mk-grid-rails

**Purpose:** Draws the full-height hairlines that a page's grid hangs from.
**Atomic level:** Atom, because it can't be broken down further.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `div` | Hidden from assistive technology, and the size container |
| rails | `span` | Start and end at `--mk-gutter`, and one in the middle |

## API

Native props, passed to the root. Give the parent `position: relative` and `isolation: isolate`.

## States

Decorative, with no interactive states. The middle rail drops out below a 48rem container.

## Variants

None.

## Tokens and theming

**Tokens consumed:** `--mk-gutter`, `--mk-border-width-default`, `--mk-color-border-default`.

## Events

None.

## Accessibility

Hidden from assistive technology, and ignores the pointer. Hidden in forced-colors mode, because it adds nothing there.

## Responsive behaviour

| Container width | Rails |
|---|---|
| Under 48rem | Start and end |
| 48rem and up | Start, middle and end |

## Content constraints

Holds no content. Keep content inside `--mk-page-inset`, so text doesn't touch a rail.

## "What if" variations

Wide and narrow are covered by stories.

## Lineage

**Contains:** nothing. **Used in:** the site's landing page.
