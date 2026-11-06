# mk-data-table

**Purpose:** A real table for dashboards: sortable, pinned header, numbers you can compare down a column.
**Atomic level:** Organism.
**Status:** Ready. Matches `Data3`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | required | The caption, and the name of the scroll area |
| `showCaption` | `boolean` | false | A Panel title usually says it already |
| `columns` | `DataTableColumn[]` | required | See below |
| `rows`, `rowKey` | | required | |
| `rowHeader` | column id | the first column | That column's cells are `th scope="row"` |
| `defaultSort` | `{ column, direction }` | none | Uncontrolled |
| `sort`, `onSortChange` | | none | Controlled |
| `loading`, `loadingRows` | `boolean`, `number` | false, 6 | |
| `empty` | `ReactNode` | "Nothing here yet." | |
| `maxRows` | `number` | 12 | Rows shown before the body scrolls under the header |

### Columns

| Field | Notes |
|---|---|
| `id`, `header` | `header` is plain text: it names the sort button and the announcement |
| `numeric` | Right-aligned, tabular figures |
| `direction` | Signed values in green or red, with the sign and an arrow. Zero stays plain |
| `muted` | Secondary text, such as a category |
| `sortable` | Defaults to true |
| `value` | What the column sorts by and shows. Defaults to `row[id]`. Numbers, dates, text or null |
| `format` | Text for a number. Defaults to the data's own decimals, grouped, with a real minus. Direction columns add the sign |
| `cell` | Any content, such as a TrackBar; sorting still uses `value` |

## Behaviour

The first click on a numeric or date header sorts highest or newest first; on text, A to Z. The second click reverses it. Missing values stay last either way, and ties keep their order. Tables show full numbers, never compact ones.

The header row is sticky inside the table's own scroll area, never the page. When the table is wider than its container, as at 320px, it scrolls sideways, the first column pins, and the right edge fades while there is more to see.

Loading keeps the header and shows placeholder rows that shimmer, still for reduced motion; headers don't sort until there is data. An empty table keeps its header and says what it will hold.

Rows are 36px in analytical density and 48px in editorial.

## Accessibility

A real `table` with a `caption`, column headers and row headers. Only the sorted column carries `aria-sort`, and a polite live region says the new order in words that fit the values: "Sorted by Today, highest first." The scroll area is a named region that takes focus, so it scrolls from the keyboard. Direction never rests on colour: every signed value has its sign and an arrow, and in forced colours the text turns CanvasText.

## Lineage

**Contains:** nothing from the kit, unless a column's `cell` renders a TrackBar. **Used in:** Panel, Predictor's positions and closed calls.
