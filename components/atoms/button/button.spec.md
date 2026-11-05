# mk-button

**Purpose:** Triggers an action on the current page.
**Atomic level:** Atom, because it can't be broken down further.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `button` | Use a link instead when it navigates somewhere |
| `::before`, `::after` | pseudo-elements | The material: rim, bloom, body or sheen |

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
| default | Primary is an opaque stadium with light spilling past its edge. Quiet is clear glass that bends what's behind it at the rim |
| hover | Primary's bloom spreads. Quiet's sheen brightens |
| focus-visible | 2px outline with `--mk-color-border-focus`, offset by 3px |
| active | Shrinks to 97%. Primary's bloom tightens, and quiet's sheen dims |
| disabled | Native `disabled`, at 50% opacity. Exempt from contrast minimums |
| loading, error, empty | n/a: not needed yet, so not built |
| overflow | The label wraps, and the button grows |

## Variants

| Variant | Trigger | When to use |
|---|---|---|
| primary | `variant` | The main action in a section. Eclipse material |
| quiet | `variant` | Secondary actions. Lens material |

## Light

Mount `<LightSource />` once, near the root of the page. It makes the pointer the light source for every Button, by setting these on each one:

| Property | Default without LightSource | Controls |
|---|---|---|
| `--mk-light-angle` | `0deg` | Which way the rim faces |
| `--mk-light-x`, `--mk-light-y` | `50%`, `0%` | Where the sheen sits |
| `--mk-light-near` | `0.4` | How strongly the button is lit |
| `--mk-lens` | `blur(3px)` | The refraction filter, on quiet buttons in Chromium |

It runs only while the light is moving, so an idle page does no work. With reduced motion, the light moves straight to the pointer rather than easing there.

**Browsers:** only Chromium accepts SVG filters in `backdrop-filter`, so refraction and its colour fringing are Chromium-only. Other browsers get blurred glass. Without any backdrop filter, the glass turns 88% opaque.

## Tokens and theming

**Tokens consumed:** `--mk-color-action-background-primary-*`, `--mk-color-action-foreground-primary-default`, `--mk-color-material-*`, `--mk-glass-brightness`, `--mk-color-surface-default`, `--mk-color-text-default`, `--mk-color-border-strong`, `--mk-color-border-focus`, plus type, inset, gap, radius, border-width and motion roles.

| Property | Fallback | Controls |
|---|---|---|
| `--mk-button-bg` | the variant's body or glass tint | Body colour, or the colour tinting the glass |
| `--mk-button-fg` | the variant's label colour | Label colour |

## Events

Native `click`.

## Accessibility

Native button, so Enter and Space work and focus is built in. The accessible name comes from the label. Minimum height is 48px. Transitions stop for reduced motion.

The label is at least 4.5:1 at rest and on hover, over the darkest and brightest colours in the light: measured in the browser, because glass has no fixed background. Glass turns solid for `prefers-contrast: more` and `prefers-reduced-transparency`. In forced-colors mode, the material is removed, the border shows the boundary, and the focus outline stays.

Quiet's edge is a highlight that follows the light, so it doesn't hold a constant 3:1 boundary. The label or icon identifies the control.

## Responsive behaviour

Sizes to its content and wraps within its container. No breakpoints.

## Content constraints

Start with a verb, and keep it short.

## "What if" variations

One word, a long label that wraps, both variants disabled, and both variants over lines and a hard light edge are covered by stories.

## Lineage

**Contains:** nothing. **Used in:** none yet.
