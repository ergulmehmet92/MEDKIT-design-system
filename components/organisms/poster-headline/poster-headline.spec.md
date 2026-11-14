# mk-poster-headline

**Purpose:** A poster moment: a few big words cut through to the light.
**Atomic level:** Organism.
**Status:** Ready. Matches `Poster`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | required | A few short words; break lines with `<br />` |
| `as` | `"h1" \| "h2"` | h1 | |
| `byline` | `string[]` | none | Up to three lines in the label face, top left |
| `shape` | `"quarter" \| "none"` | quarter | One flat Bauhaus shape |
| `form` | `"ridge" \| "dune" \| "horizon"` | ridge | The light's form |
| `ratio` | CSS aspect ratio | `4 / 5` | |

## How it works

The Blaze light sits behind a dark sheet in the Forest surface colour. The sheet is multiplied over the light, and its white type multiplies to the light itself, so the words show the light while the sheet stays dark. A honey quarter circle sits in the top corner. Type is bold, sized by `font.size.poster` and capped at 27% of the poster's width, with the poster leading and tracking.

The poster always uses Forest and Blaze, whatever the page's theme. Blaze is built from the palette's sage, sand, highlight and honey, with no colours of its own: Blaze's darkest colour keeps the type at 6.9:1 against the sheet, where Forest's own light would fall to 1.2:1. A test checks the ratio from the tokens.

## Fallbacks

The headline is a real heading, read as normal text. Without WebGL, the light's CSS gradient in the Blaze colours stays behind the sheet, so the cut still works. In forced colours the blend is dropped: the headline is CanvasText on Canvas, and the shape becomes an outline. Reduced motion holds the light still.

## Lineage

**Contains:** LivingLight. **Used in:** the portfolio's thesis and section breaks.
