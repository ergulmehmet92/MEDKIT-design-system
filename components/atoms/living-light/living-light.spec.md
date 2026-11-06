# mk-living-light

**Purpose:** Gives a section an always-moving light behind its content.
**Atomic level:** Atom, because it can't be broken down further.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `div` | Holds the CSS fallback, hidden from assistive technology |
| canvas | `canvas` | Added on the client, and shown once it has drawn |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `form` | `"ridge" \| "dune"` | `"ridge"` | The shape of the light |
| `theme` | `"forest" \| "paper"` | The page's theme | Pins a colourway for a nested tone |
| `calm` | `number`, 0 to 1 | `0` | Settles the light towards its base colour low down, and caps its brightness up to about 72% of its height, so text stays readable. The top stays bright |
| `grain` | `number` | `0.02` | Grain amount. The grain sits in 2px cells and reseeds ten times a second on the clock, whatever the speed. Tuned on the Grain board, 2026-11-06 |
| `speed` | `number` | `1.5` | Light speed |
| native props | | | Passed to the root |

Give the parent `position: relative` and `isolation: isolate`. Use at most two on screen.

## States

| State | Look and behaviour |
|---|---|
| default | Moves constantly, at up to 30 frames per second |
| theme change | Dawn: the new theme spreads from the brightest part of the light over 1.8 seconds. A pinned light doesn't change |
| off-screen, hidden tab | Doesn't draw |
| no WebGL, compile failure, lost context | Static CSS gradient in the same colours |
| no JavaScript, server rendering | Static CSS gradient |
| hover, focus, active, disabled, loading, error, empty, overflow | n/a: it isn't interactive and holds no content |

## Variants

The two forms, as a prop.

## Tokens and theming

**Tokens consumed:** `--mk-color-ambient-*`. A shader can't read CSS, so `palette.ts` repeats these values, and a test keeps them in step.

## Events

None.

## Accessibility

Decorative, so hidden from assistive technology. Reduced motion gets one still frame, with theme changes applied at once. Forced-colors mode hides it. Text over the light must reach 4.5:1, or 3:1 at 24px and larger, against samples across the motion cycle. Use `calm` to meet this, never a scrim or shadow.

## Responsive behaviour

Fills its parent, and renders at up to 1.25× pixel density and 1600px on the longest side.

## Content constraints

None. It holds no content.

## "What if" variations

Both forms, calm, and both pinned themes are covered by stories.

## Lineage

**Contains:** nothing. **Used in:** the site's landing page.
