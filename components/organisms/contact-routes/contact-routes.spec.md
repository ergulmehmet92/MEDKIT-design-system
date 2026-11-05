# mk-contact-routes

**Purpose:** Offers the ways to get in touch, as large links.
**Atomic level:** Organism, because it's a distinct section of repeated parts.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `ul` | |
| route | `li` with `a` | The label, plus a decorative arrow |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `routes` | `{ label: string; href: string }[]` | required | Each `href` must be unique |
| native props | | | Passed to the root |

## States

| State | Look and behaviour |
|---|---|
| default | Default text colour, with a hairline above |
| hover | Accent text colour |
| focus-visible | 2px outline with `--mk-color-border-focus` |
| active, disabled, loading, error | n/a |
| empty | An empty list |
| overflow | Long labels wrap, and the arrow keeps its place |

## Variants

None.

## Tokens and theming

**Tokens consumed:** `--mk-font-size-feature`, `--mk-color-text-accent`, `--mk-color-border-default`, `--mk-color-border-focus`, plus inset, gap, tracking, line-height, border-width and motion roles.

## Events

Native link behaviour.

## Accessibility

Real links in a list, so the count is announced. The arrow is hidden from assistive technology.

## Responsive behaviour

Type scales with the viewport. Layout has no breakpoints.

## Content constraints

Start with a verb, and keep to a few words.

## "What if" variations

Default and long labels at 320px are covered by stories.

## Lineage

**Contains:** nothing. **Used in:** the site's landing page.
