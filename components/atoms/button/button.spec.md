# mk-button

**Purpose:** Triggers an action on the current page.
**Atomic level:** Atom, because it can't be broken down further.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `button` | Use a link instead when it navigates somewhere |

## API

| Prop | Type | Default | Reflected | Notes |
|---|---|---|---|---|
| `variant` | `"primary" \| "quiet"` | `"primary"` | `data-variant` | |
| `type` | native | `"button"` | yes | Set `"submit"` inside forms |
| native props | | | yes | Passed to the root |

**Children:** the label.

## States

| State | Look and behaviour |
|---|---|
| default | Primary is a solid fill. Quiet has a border and no fill |
| hover | Primary changes fill. Quiet strengthens its border |
| focus-visible | 2px outline with `--mk-color-border-focus`, offset by 2px |
| active | Primary uses its pressed fill |
| disabled | Native `disabled`, at 50% opacity. Exempt from contrast minimums |
| loading, error, empty | n/a: not needed yet, so not built |
| overflow | The label wraps, and the button grows |

## Variants

| Variant | Trigger | When to use |
|---|---|---|
| primary | `variant` | The main action in a section |
| quiet | `variant` | Secondary actions |

## Tokens and theming

**Tokens consumed:** `--mk-color-action-background-primary-*`, `--mk-color-action-foreground-primary-default`, `--mk-color-text-default`, `--mk-color-border-strong`, `--mk-color-border-focus`, plus type, inset, gap, radius, border-width and motion roles.

| Property | Fallback | Controls |
|---|---|---|
| `--mk-button-bg` | primary fill | Fill at rest |
| `--mk-button-bg-hover` | primary hover fill | Fill on hover |
| `--mk-button-bg-active` | primary pressed fill | Fill while pressed |
| `--mk-button-fg` | primary label | Label colour |
| `--mk-button-border` | `transparent` | Border colour |

## Events

Native `click`.

## Accessibility

Native button, so Enter and Space work and focus is built in. The accessible name comes from the label. Minimum height is 44px. Colour transitions stop for reduced motion. In forced-colors mode, the border keeps the boundary visible and the focus outline stays.

## Responsive behaviour

Sizes to its content and wraps within its container. No breakpoints.

## Content constraints

Start with a verb, and keep it short.

## "What if" variations

One word, a long label that wraps, and both variants disabled are covered by stories.

## Lineage

**Contains:** nothing. **Used in:** none yet.
