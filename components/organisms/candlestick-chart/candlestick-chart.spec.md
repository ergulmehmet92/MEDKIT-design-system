# mk-candlestick-chart

**Purpose:** A price's daily open, high, low and close, with volume.
**Atomic level:** Organism, built on the chart frame.
**Status:** Ready.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `label` | | required | As LineChart |
| `data` | `Candle[]` | required | `{ x, open, high, low, close, volume? }`. Nulls mark a day without trading |
| `window` | `[from, to]` | everything | Changing it glides |
| `volume` | `boolean` | on when the data has volume | A separate panel under prices |
| `today`, `events`, `reference` | | none | As LineChart |
| `format` | `(v) => string` | one decimal past the axis | |
| `titleAs`, `eyebrow`, `description`, `caption`, `tableCaption`, `emptyText` | | | Passed to the frame |

## Behaviour

- Direction uses the up and down roles from direction B: green when the close is above the open, red when below. It's also told by shape, hollow for rising and filled for falling, so it never rests on colour.
- Candle bodies are 62% of a day's width, capped at 14px. Under 5px a day, candles become open-high-low-close bars. Under 2.5px, they become a closing line in the lead colour.
- Volume sits in its own panel, a fifth of the plot's height, with its maximum named. It never shares the price axis.
- The tooltip lists open, high, low, close and volume, and notes the day's move against the previous close with an arrow and a sign.
- The table lists each day for spans up to 90 days, and rolls longer spans up into months.

## Accessibility

The readout gives every price, the move in words ("up 1.2% on the day") and the volume. A day without trading reads as "No trading".

## Lineage

**Contains:** the chart frame. **Used in:** Predictor's position views.
