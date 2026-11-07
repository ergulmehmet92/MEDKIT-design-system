# mk-status-pill

**Purpose:** A status lamp with the words it stands for.
**Atomic level:** Molecule.
**Status:** Ready. Matches the readings on `Lamps`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `status` | `"live" \| "stale" \| "failed"` | required | |
| `children` | `ReactNode` | Live, Stale or Failed | A sentence reads better: "Daily snapshot is stale" |
| `live` | `boolean` | false | Adds `role="status"`, for a status that changes while someone is on the page |
| `still` | `boolean` | false | Passed to the lamp |

## Behaviour

The words always show; the lamp never carries the meaning alone. No chrome around it: the board's readings are a lamp and text in the text colour. A Badge is never a stand-in for it.

## Accessibility

The lamp is hidden, so assistive technology reads only the words. With `live`, changes are announced politely.

## Lineage

**Contains:** StatusLamp. **Used in:** Predictor's data freshness, the YouTube studio's render queue.
