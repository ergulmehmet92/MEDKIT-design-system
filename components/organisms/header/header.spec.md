# mk-header

**Purpose:** Gives every page its brand, primary navigation and site-wide controls.
**Atomic level:** Organism, because it's a distinct section made of different parts.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `header` | Banner landmark, and the size container |
| brand | `div` | Holds the site's name, usually a link home |
| navigation | `nav` with `ul` | Inline links, from 40rem up |
| actions | `div` | Controls such as ThemeSwitch |
| menu trigger | IconButton | Below 40rem. Opens the menu |
| menu | modal `dialog` | Full-screen list of the same links, with a close button first |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `brand` | `ReactNode` | required | Usually a link home |
| `actions` | `ReactNode` | none | |
| `navigationLabel` | `string` | `"Primary"` | Names the landmarks |
| `children` | `ReactNode` | none | Links. Plain anchors and framework links both work |
| native props | | | Passed to the root |

## States

| State | Look and behaviour |
|---|---|
| default | Links in the default text colour |
| hover | Underlined |
| focus-visible | 2px outline with `--mk-color-border-focus` |
| active, disabled, loading, error | n/a |
| menu open | Covers the screen. Closes from its button, Esc, the back gesture, or choosing a link |
| empty | No links means no navigation and no menu trigger |
| overflow | Inline links wrap, and the menu scrolls within itself |

## Variants

None. Layout follows the available width.

## Tokens and theming

**Tokens consumed:** `--mk-gutter`, `--mk-inset-md`, `--mk-gap-*`, `--mk-color-surface-default`, `--mk-color-text-default`, `--mk-color-border-default`, `--mk-color-border-focus`, `--mk-border-width-*`, plus type roles.

## Events

None of its own.

## Accessibility

Banner and labelled navigation landmarks, with lists that announce how many links there are. The menu is a native modal dialog, so the browser handles focus containment, Esc and returning focus to the trigger. The trigger announces that it opens a dialog, and whether it's open. Links are at least 44px tall.

## Responsive behaviour

| Container width | Layout |
|---|---|
| Under 40rem | Brand, actions and menu trigger on one row |
| 40rem to 64rem | One row with inline links and tighter gaps |
| 64rem and up | One row with wider gaps |

## Content constraints

Five links and an icon action fit on one row at a 40rem container. More wrap, as the many-links story shows.

## "What if" variations

Narrow, medium, no actions, brand only, many links and a long brand are covered by stories.

## Known limit

The menu needs JavaScript to open. Without it, or before hydration, the button does nothing on narrow screens.

## Lineage

**Contains:** HeaderMenu, IconButton, and whatever it's given, usually ThemeSwitch. **Used in:** none yet.
