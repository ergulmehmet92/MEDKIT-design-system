# mk-chart (chart frame)

**Purpose:** The shared outside, reading and marks of every chart, so each chart inherits the same annotations, crosshair, keyboard access and table.
**Atomic level:** Molecule. Charts are organisms built from it.
**Status:** Ready for the chart components. Approved on Data board 1, 2026-11-06.

## Anatomy

| Part | Element | Notes |
|---|---|---|
| `ChartFigure` | `figure` | Named by its title. Holds the head, the legend bar, one slot for the plot or the table, and the caption |
| title | `h2` to `h4` | States the point in editorial density, names the chart in analytical |
| switch | `Button`, quiet | "View as table" and "View as chart". The label changes, so there's no `aria-pressed` |
| `ChartPlot` | `div` | `role="group"` with a label and key instructions when readable, `role="img"` when static |
| drawing | `svg` | `aria-hidden`. Assistive technology gets the live readout and the table instead |
| tooltip | `div` | `aria-hidden`, frosted glass, values first |
| readout | `p` | `aria-live="polite"`, says the point the keyboard lands on |
| `ChartTable` | `table` in a focusable region | Caption, column headers and row headers. Scrolls inside the plot's height, header pinned |
| `Legend` | `ul` | Text labels, with keys that mirror each mark |

SVG parts: `GridY`, `AxisX`, `PlotLayer`, `RangeBand`, `Bracket`, `MarkerLine`, `EventRail`, `EndLabel` and `Note`.

## API

| Export | Takes | Notes |
|---|---|---|
| `ChartFigure` | `title`, `titleAs`, `eyebrow`, `description`, `legend`, `table` (required), `caption`, `toggleLabels`, `defaultView` | Native `figure` props pass through |
| `ChartPlot` | `label` (required), `instructions`, `plotRef`, `reading`, `crosshair`, `empty`, SVG children | `crosshair` carries x, dots and the tooltip |
| `ChartTable` | `caption`, `columns`, `rows` | First column is the row header |
| `Legend` | `items` of `{ label, key, colour }` | Keys: line, context, forecast, area, range, past, next |
| `useElementSize` | initial size | Returns a ref setter, the size and the node |
| `useCrosshair` | `min`, `max`, `start`, `indexAt`, `describe`, `stride` | Returns `index`, `announcement`, `handlers` |
| `useReveal` | node | 0 to 1, once, when a quarter is on screen. 1 at once with reduced motion |
| `useGlide` | target numbers, node | Eases a domain to new values. Jumps with reduced motion |
| `useLabelAdvance` | node | Width of one label character, for placing labels before they render |
| layout helpers | | `thinLabels`, `placeRail`, `spreadLabels`, `placeNote`, `nearestIndex`, `signed` |

## States

| State | Behaviour |
|---|---|
| Static | No `reading`: `role="img"`, no focus stop |
| Reading | Pointer snaps to the nearest index. Arrow keys move one step, Shift moves a stride, Home and End jump, Escape clears |
| Table | The table replaces the plot in the same slot |
| Empty | A message in a bordered area of the plot's height |
| Revealing | Data draws left to right once. Labels fade in over the last half |
| Gliding | A new range eases over the change duration |

## Tokens and theming

**Semantic tokens:** `--mk-color-dataviz-*` for series (chart components only, enforced by a test), `--mk-size-chart` for plot height by density, `--mk-dataviz-tint` for large fills, `--mk-motion-duration-chart-reveal` and `--mk-motion-duration-chart-change`, plus the kit's text, border, surface and focus roles.

**Component tokens:** `--mk-chart-stroke` (2px), `--mk-chart-stroke-context` (1.5px), `--mk-chart-ring` (2px), `--mk-chart-band-inner` (22%), `--mk-chart-band-outer` (10%), `--mk-chart-wash` (20%).

## Rules from Data board 1

- The story wears a colour slot. Context, such as a benchmark, wears muted ink.
- Text never wears a series colour. Values are strong ink and names are muted ink.
- Dotted means forecast. Nothing else is dotted or dashed, and a test enforces it.
- Gridlines are solid hairlines. A reference value, such as 100 or zero, gets the stronger line.
- Labels that can sit over data carry a surface-coloured halo.
- One y-axis. Different measures become two charts or get indexed.

## Accessibility

Keyboard reading follows a single tab stop with arrow keys, like a slider. The readout is polite, so it never interrupts. Every value a tooltip shows is also in the table. In forced-colors mode lines turn to CanvasText, context to GrayText, and the tooltip to Canvas with a border.

## Responsive behaviour

The plot fills its container's width at the token height. Tick labels thin evenly, event labels drop to the tooltip when there's no room, and the tooltip flips sides at the edge.

## Lineage

**Contains:** Button. **Used in:** every chart from Task 24 on.
