# ThemeSwitch

**Purpose:** Lets a visitor switch the page between Forest and Paper.
**Atomic level:** Molecule, because it combines an IconButton with theme behaviour to do one job.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `button`, through IconButton | Icon only, with no visible label |
| icon | `svg` | Half-filled circle, hidden from assistive technology |

## API

Takes native button props, apart from `children`, `label` and `variant`. `onClick` runs after the theme changes.

The kit also exports `themeScript`, `useTheme`, `getTheme`, `setTheme` and `subscribeToTheme`.

## Setup

Inline `themeScript` in the document head before first paint, and add `suppressHydrationWarning` to `<html>`, because the script sets `data-theme` before React hydrates.

## States

From IconButton. Loading, error, empty and overflow are n/a.

## Variants

None.

## Tokens and theming

No tokens of its own.

## Events

Native `click`. `subscribeToTheme` reports changes from this tab and others.

## Accessibility

Native button with keyboard support. The accessible name and tooltip say what pressing it does: "Switch to Paper theme". Target size is 48px.

## Behaviour decisions

- **Icon only:** Mehmet removed the visible label.
- **Default:** Forest for every first-time visitor. This deliberately differs from web guidance to follow the device's preference, because the Forest landing is the brand.
- **Two states:** Forest and Paper, with no "system" option, for the same reason.
- **Persistence:** saved in `localStorage` as `mk-theme`. If storage is blocked, the theme still applies for that visit.
- **Other tabs:** stay in sync through the `storage` event.

## Responsive behaviour

Fixed size.

## Content constraints

None. The label is fixed.

## "What if" variations

Storage blocked, a change from another tab, an unrecognised saved value and server rendering are covered by tests.

## Lineage

**Contains:** IconButton. **Used in:** any Header's `actions`.
