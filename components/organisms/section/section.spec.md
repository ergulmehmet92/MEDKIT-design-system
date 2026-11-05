# mk-section

**Purpose:** A band of the page, with its tone, rails and spacing.
**Atomic level:** Organism, because it frames a distinct section of an interface, and contains GridRails.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `section` | Name it with `aria-labelledby`, so it's a region |
| rails | GridRails | Optional, behind the content |

## API

| Prop | Type | Default | Reflected | Notes |
|---|---|---|---|---|
| `tone` | `"page" \| "inverse" \| "forest" \| "paper"` | `"page"` | `data-tone`, and `data-theme` for pinned tones | |
| `rails` | `boolean` | `false` | | Draws the hairline rails |
| native props | | | yes | Passed to the section |

**Children:** the section's content, stacked with the extra-large gap.

## States

None: not interactive.

## Variants

| Tone | Behaviour |
|---|---|
| page | Follows the page's theme |
| inverse | Flips the root element's theme in CSS alone, so a saved theme never flashes here on load. Uses the subtle surface, which is beige on Forest pages |
| forest, paper | Pins that theme with `data-theme`, whatever the page's |

## Tokens and theming

**Tokens consumed:** `--mk-inset-section`, `--mk-page-inset`, `--mk-gap-xl`, `--mk-color-surface-subtle`, `--mk-color-text-default`, motion tokens

Spacing is fluid in editorial density and fixed in analytical density.

## Events

None.

## Accessibility

A native section. With an accessible name it becomes a region landmark. Colours inside follow the tone, so every text pair keeps 4.5:1. The tone change transitions, and stops for reduced motion.

## Responsive behaviour

Padding scales with the viewport in editorial density. Content decides its own columns.

## Content constraints

Inverse flips the page's theme, so don't nest it inside a pinned Forest or Paper subtree. Pin a tone there instead.

## "What if" variations

Each tone, with and without rails, and both densities are covered by stories.

## Lineage

**Contains:** GridRails. **Used in:** the portfolio's `/v2` landing page.
