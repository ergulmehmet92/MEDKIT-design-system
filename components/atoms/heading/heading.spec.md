# mk-heading

**Purpose:** A heading whose look is chosen separately from its place in the outline.
**Atomic level:** Atom, because it can't be broken down further.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `h1` to `h6`, from `level` | `data-size` sets the look |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `level` | `1` to `6` | `2` | Choose by the outline, never by looks |
| `size` | `"display" \| "heading" \| "subheading" \| "title"` | `"title"` | Display and heading are fluid, and the same in both densities |
| native props | | | Passed to the heading |

**Children:** the heading text.

## States

| State | Look and behaviour |
|---|---|
| default | Text colour, regular weight, tight tracking |
| hover, focus, active, disabled, loading, error, empty | n/a: not interactive |
| overflow | Balanced wrapping. Long words break instead of overflowing |

## Variants

Four sizes. Poster type is a separate organism (PosterHeadline), because it cuts through to the light.

## Tokens and theming

**Tokens consumed:** `--mk-font-size-display`, `--mk-font-size-heading`, `--mk-font-size-subheading`, `--mk-font-size-title`, `--mk-tracking-display`, `--mk-tracking-title`, `--mk-line-height-tight`, `--mk-line-height-snug`, `--mk-font-family-body`, `--mk-font-weight-body`

Title and subheading shrink in analytical density. Display and heading don't.

## Events

None.

## Accessibility

A native heading at the level given, so the outline is whatever the page needs. Text colour reaches 4.5:1 on every surface.

## Responsive behaviour

Display and heading sizes are fluid between their minimum and maximum, within 2.5 times, so zoom keeps working. `text-wrap: balance` is Baseline Newly Available, and browsers without it wrap normally.

## Content constraints

Headlines stay short. Balancing stops after about six lines.

## "What if" variations

Every size, a 120-character headline, a single long word, and a level 1 heading at title size are covered by stories.

## Lineage

**Contains:** nothing. **Used in:** none yet.
