# mk-card

**Purpose:** One glass surface with slots, shared by every card.
**Atomic level:** Molecule.
**Status:** Ready. Matches `Cards`, option A.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title`, `href` | | required | The title is the card's only link |
| `titleAs` | `"h2" \| "h3" \| "h4"` | h3 | |
| `media` | `ReactNode` | none | Usually `CardMedia` |
| `meta` | `ReactNode` | none | Short items in the label face, joined by middle dots |
| `summary` | `ReactNode` | none | Clamped at three lines |
| `children` | | none | Extra body content; never interactive |
| `foot` | `ReactNode` | none | Static chips and badges; never interactive |

`CardMedia` takes `src`, `alt` (empty by default), `ratio` (`16:9`, `9:16` or `4:3`) and `duration` ("18:42"). `CardDate` writes a date as a `time` element: "2 Nov 2026".

## Behaviour

Glass with `radius.panel`, like Panel; the picture is inset by 8px so its corners follow the card. The whole card is one link: the title's link stretches over the card, so it is one tab stop with one name, and the card shows the focus ring. Hover lifts it 3px, still for reduced motion.

Pictures keep their ratio. A missing picture keeps the frame with a quiet placeholder, and the duration stays. Durations are `time` elements with ISO 8601 values, read as "Duration 18:42". Titles and summaries clamp at three lines on screen; the full text stays in the link for screen readers. The meta shows above the title but follows it in the source, so the heading is read first.

## Lineage

**Contains:** nothing. **Used in:** MediaCard, PostCard, CaseCard, EntryCard.
