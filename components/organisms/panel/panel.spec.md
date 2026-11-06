# mk-panel

**Purpose:** A glass card over the living light that holds one chart, table or gauge.
**Atomic level:** Organism, because it frames whole sections of a dashboard.
**Status:** Ready. Matches `Data3`.

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `section` | A region named by the title, when there is one |
| kind | `p` | Optional. The label face, uppercase: what kind of thing this is |
| title | `h3` by default | Optional. States the point, like a chart title |
| actions | `div` | Optional. Quiet buttons on the right of the head |
| body | `div` | Any chart, table, gauge or text |
| footer | `div` | Optional. Sources and as-of times, under a hairline |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `ReactNode` | none | Leave it out when the content has its own title, as every chart does |
| `kind` | `ReactNode` | none | |
| `titleAs` | `"h2" \| "h3" \| "h4"` | `h3` | Match the page's outline |
| `actions`, `footer` | `ReactNode` | none | |
| native props | | | Passed to the `section` |

## Tokens and theming

Glass: the surface at 58% over a 22px blur, a hairline of `color.material.specular` and a soft `color.material.shade` shadow. Corners take `radius.panel` (18px), approved on Data board 3. Padding and gaps follow density, so analytical panels are tighter.

## States

Static. Without backdrop-filter, or when the reader asks for less transparency, the panel turns solid. In forced colours it keeps a CanvasText border and drops the shadow.

## Accessibility

A titled panel is a landmark region named by its heading, so a dashboard can be skimmed by region. Panels without a title are plain sections, so they don't add unnamed landmarks.

## Content constraints

One job per panel. Put sources and the as-of time in the footer, not the title.

## Lineage

**Contains:** whatever it is given, usually a chart, DataTable, Gauge or TrackBars. **Used in:** Predictor's dashboard, and the portfolio's case-study figures.
