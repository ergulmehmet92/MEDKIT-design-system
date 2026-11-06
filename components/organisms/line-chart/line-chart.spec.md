# mk-line-chart

**Purpose:** Change over time, or over any ordered x, with the story in colour and context in ink.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready. The hero matches Data board 1.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `ReactNode` | required | States the point in editorial density |
| `label` | `string` | required | Accessible name of the plot, and the table's caption |
| `x` | `(Date \| number)[]` | required | Dates are spaced by index, so weekends leave no gaps |
| `series` | `LineSeries[]` | required | `{ id, name, values, context?, slot? }`. Null is a gap |
| `forecast` | `LineForecast` | none | `{ series, start, median, inner?, outer? }`, from the last actual index |
| `today` | `number` | none | Marker line, and splits events into past and upcoming |
| `reference` | `{ value, label? }` | zero, when values cross it | The stronger gridline |
| `ranges` | `{ id, from, to, label }[]` | none | Quiet washes, such as a drawdown |
| `measures` | `{ series, from, to, label?, fromLabel? }[]` | none | A bracket measuring the change, as a signed percentage by default |
| `notes` | `{ series, at, lines }[]` | none | Editorial only. Drops out when there's no room |
| `events` | `{ id, at, label, detail? }[]` | none | Diamonds on the rail |
| `window` | `[from, to]` | everything | Changing it glides |
| `format` | `(v) => string` | one decimal past the axis | Labels, tooltip and table |
| `yScale` | `"linear" \| "log"` | linear | Log only when every value is above zero |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText` | | | Passed to the frame |

## Behaviour

- Series take slots 1 to 8 in order, or the slot they pin. Past eight, they draw thin in muted ink and the legend names them as "Other, n series". A ninth colour is never made up.
- Up to four series get labels where they end, spread apart with leaders. With five or more, each slot gets a marker shape in the legend and at the line's end, so series can be told apart without colour.
- One story series wears the lead colour, white on Forest and ink on Paper. Two or more take the categorical slots.
- Forecasts wear the accent, whichever series they continue.
- A measure's bracket and arrow wear up or down; its number stays in ink.
- A gap breaks the line, and a lone point gets a dot.
- Narrow plots drop the right margin, the measure bracket, the note and the "Today" label, and move end labels inside.
- The table lists each month's end, today and the forecast months for dates, or up to 40 evenly spaced points for numbers.

## Accessibility

From the frame: arrow keys read each point, and the readout names every series, the forecast and any event at that point. The table holds every value the tooltip shows.

## Lineage

**Contains:** ChartFigure, ChartPlot, ChartTable, Legend and the frame's SVG parts. **Used in:** Predictor dashboards and portfolio stories.
