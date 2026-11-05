# mk-header

**Purpose:** Gives every page its brand, primary navigation and site-wide controls.
**Atomic level:** Organism, because it's a distinct section made of different parts.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `header` | Banner landmark, and the size container |
| brand | `div` | Holds the site's name, usually a link home |
| navigation | `nav` with `ul` | Only renders when there are links |
| actions | `div` | Controls such as ThemeSwitch |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `brand` | `ReactNode` | required | Usually a link home |
| `actions` | `ReactNode` | none | |
| `navigationLabel` | `string` | `"Primary"` | Names the landmark |
| `children` | `ReactNode` | none | Links. Plain anchors and framework links both work |
| native props | | | Passed to the root |

## States

| State | Look and behaviour |
|---|---|
| default | Links in the default text colour |
| hover | Underlined |
| focus-visible | 2px outline with `--mk-color-border-focus` |
| active, disabled, loading, error | n/a |
| empty | No links means no navigation landmark |
| overflow | Links and brand wrap. Nothing gets hidden |

## Variants

None. Layout follows the available width.

## Tokens and theming

**Tokens consumed:** `--mk-gutter`, `--mk-inset-md`, `--mk-gap-sm`, `--mk-gap-lg`, `--mk-color-border-focus`, `--mk-border-width-focus`, plus lead and label type roles. Text colour is inherited from the themed surface.

## Events

None of its own.

## Accessibility

Banner and labelled navigation landmarks. A list announces how many links there are. Source order matches visual order, so tab order follows what you see. Links are at least 44px tall.

## Responsive behaviour

| Container width | Layout |
|---|---|
| Under 64rem | Parts wrap in order, with tighter link gaps |
| 64rem and up | One row, with wider link gaps |

## Content constraints

Five links and the switch fit on one row from a 768px viewport. More wrap, as the many-links story shows.

## "What if" variations

Narrow, medium, no actions, brand only, many links and a long brand are covered by stories.

## Open question

On phones, five links plus the switch take several rows. `site-shell` should decide whether that stays or becomes a menu.

## Lineage

**Contains:** whatever it's given, usually ThemeSwitch. **Used in:** none yet.
