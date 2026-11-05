# mk-icon-button

**Purpose:** Triggers an action using only an icon.
**Atomic level:** Atom, because it does one job and adds only a shape and a required label to Button.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `button`, through Button | Quiet variant, 44px square |
| icon | `svg` from the consumer | Must set `aria-hidden="true"` and use `currentColor` |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | required | Sets the accessible name and tooltip |
| native props | | | Passed to Button, apart from `variant` |

**Children:** the icon.

## States

From Button's quiet variant. Loading, error, empty and overflow are n/a.

## Variants

None.

## Tokens and theming

No tokens of its own. Colour, border and focus come from Button.

## Events

Native `click`.

## Accessibility

The label is required, so the button always has a name. The tooltip helps pointer users, but touch and keyboard users rely on the icon being clear, so only use widely understood icons. Target size is 44px.

## Responsive behaviour

Fixed size.

## Content constraints

Keep labels short, and start with a verb.

## "What if" variations

Disabled is covered by a story.

## Lineage

**Contains:** Button. **Used in:** ThemeSwitch, HeaderMenu.
