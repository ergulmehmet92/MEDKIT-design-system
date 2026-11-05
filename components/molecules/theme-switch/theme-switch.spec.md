# mk-theme-switch

**Purpose:** Lets a visitor switch the page between Forest and Paper.
**Atomic level:** Molecule, because it combines a Button, an icon and label with one job.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `button`, through Button | Quiet variant |
| icon | `svg` | Decorative, hidden from assistive technology |
| label | text | Names the current theme |

## API

Takes native button props, apart from `children` and `variant`. `onClick` runs after the theme changes.

The kit also exports `themeScript`, `useTheme`, `getTheme`, `setTheme` and `subscribeToTheme`.

## Setup

Inline `themeScript` in the document head before first paint, and add `suppressHydrationWarning` to `<html>`, because the script sets `data-theme` before React hydrates.

## States

| State | Look and behaviour |
|---|---|
| default, hover, focus-visible, active, disabled | From Button's quiet variant |
| loading, error, empty | n/a |
| overflow | n/a: the label is one word |

## Variants

None.

## Tokens and theming

**Tokens consumed:** `--mk-font-family-label`, `--mk-font-size-label`, `--mk-font-weight-label`, `--mk-tracking-label`, plus Button's.

## Events

Native `click`. `subscribeToTheme` reports changes from this tab and others.

## Accessibility

Native button with keyboard support. The accessible name starts with the visible label, and says what happens: "Forest theme. Switch to Paper". The icon is hidden. Target size is 44px.

## Behaviour decisions

- **Default:** Forest for every first-time visitor. This deliberately differs from web guidance to follow the device's preference, because the Forest landing is the brand.
- **Two states:** Forest and Paper, with no "system" option, for the same reason.
- **Persistence:** saved in `localStorage` as `mk-theme`. If storage is blocked, the theme still applies for that visit.
- **Other tabs:** stay in sync through the `storage` event.

## Responsive behaviour

Keeps its size. No breakpoints.

## Content constraints

None. The labels are fixed.

## "What if" variations

Storage blocked, a change from another tab, an unrecognised saved value and server rendering are covered by tests.

## Lineage

**Contains:** Button. **Used in:** Header.
