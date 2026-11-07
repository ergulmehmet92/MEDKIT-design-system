# mk-status-lamp

**Purpose:** The flat, geometric status graphic from the Lamps board.
**Atomic level:** Atom.
**Status:** Ready. Matches `Lamps`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `status` | `"live" \| "stale" \| "failed"` | required | |
| `size` | `"inline" \| "large"` | inline | Inline is 0.7em, beside text. Large is the 44px control-bank lamp |
| `still` | `boolean` | false | The reduced-motion version, on demand |

## Shapes and motion

- **Live:** a solid circle with two radar rings, half a cycle apart, every 2.4s.
- **Stale:** a 30% tinted circle scanned from south-west to north-east every 2.4s, with a pulsing ring and a flat 16% disc behind.
- **Failed:** a hexagon blinking once a second, never faster, inside a flat hexagon halo at 20%.

Colours come from `color.status.*`: neon on Forest, deeper on Paper. A margin of 35% of the lamp keeps the halo off neighbouring text.

## Accessibility

Decoration only, always `aria-hidden`. Use StatusPill, which puts a word beside it. Reduced motion, or `still`, shows the still versions: rings at rest part-way out, the scan centred, Failed lit. In forced colours the lamp keeps its shape in CanvasText and Stale becomes an outlined circle.

## Lineage

**Contains:** nothing. **Used in:** StatusPill.
