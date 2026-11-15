# Changelog

MED·Kit follows [semantic versioning](docs/versioning.md). Dates are when a version is tagged.

## 2.1.0 (15 Nov 2026)

### Added

- `tokens.json`, exported as `@ergulmehmet92/medkit/tokens.json`: every colour role resolved to hex in Forest and Paper, the font stacks, and type sizes in pixels, for code that can't read CSS, such as emails and video.

### Fixed

- Every component stylesheet now declares the kit's layer order first. A bundler that emitted a component's CSS before `tokens.css` put the components layer below `base`, so a host's base reset, such as Tailwind's preflight, overrode the kit's sizes and spacing.
- DataTable direction cells and an out-of-range TrackBar readout set their text in ink. The red and green moved to the arrow and the bar: as text they measured 3.6:1 on Paper, under the 4.5:1 that WCAG AA asks of text. The signed number and the readout still say the direction in words.

## 2.0.0 (15 Nov 2026)

A rebuild. MED·Kit becomes one design system for three products, a portfolio, a dashboard and a video studio, with one brand and two densities. Nothing from v1 carries over as code; some names carry over as concepts.

### The brand

- **Colour:** Forest, a dark green, is the default theme, with Paper as its light partner, written once per role with `light-dark()`. Honey is the one accent. Status colours (Live, Stale, Failed) report state and nothing else.
- **Type:** TeX Gyre Heros for reading, Share Tech Mono for labels.
- **Materials:** a living WebGL light behind everything; glass panels and cards; Lens for quiet controls; Eclipse for the one primary action. Posters use the Blaze light, built from the palette.
- **Density:** editorial for reading and analytical for working, set with `data-density` on any element. Density changes size and space, never colour.
- **Motion:** one scale of durations and easings, also exported as `motion.json` for Remotion. Every motion has a reduced-motion end state.

### Tokens

- DTCG 2025.10 sources in `tokens/`, with a resolver for scheme, density and contrast, built by Style Dictionary 5 into `dist/tokens/tokens.css`.
- Components read semantic roles only.
- `dist/medkit.css` bundles the tokens and every component's CSS for pages without React.

### Components

60 components, each with a spec, stories and tests, checked with axe in both themes and both densities.

- **Atoms:** Avatar, Badge, Button and IconButton, Chip, CountUp, DrawLine, Eyebrow, GridRails, Heading, Input, Link, LivingLight, Reveal, Rule, Select, StatusLamp, Textarea, Typewriter.
- **Molecules:** Card, ChartFrame, Field, Gauge, Metric, PullQuote, Sparkline, StatusPill, StepRelay, Tabs, ThemeSwitch, TrackBar.
- **Organisms:** charts (AreaChart, BarChart, Beeswarm, BulletChart, CandlestickChart, DonutChart, Heatmap and CalendarHeatmap, Histogram, LineChart, RidgelineChart, SankeyChart, ScatterChart, SlopeChart, Treemap, WaterfallChart), cards (CaseCard, EntryCard, MediaCard, PostCard), ContactRoutes, DataTable, Footer, Header, MetricRow, Panel, PosterHeadline, Section.
- **Templates:** EditorialPage and DashboardPage.

### Docs

A public Storybook with foundation pages for colour, type, density, materials, motion and data. Each component's page is its spec.

### Removed, and why

| v1 | Why | In v2 |
|---|---|---|
| The ink theme, rust and the domain accents (amber, steel) | Replaced by the new brand: Forest and Paper, with honey as the only accent | Colour roles |
| Inter | Replaced by TeX Gyre Heros and Share Tech Mono | Type |
| `styles.css` and the CSS token files | Hand-written tokens couldn't carry themes, densities and contrast together | DTCG tokens and `dist/tokens/tokens.css` |
| `_ds_bundle.js` and `_ds_manifest.json` | A browser global bundle that had fallen behind the source | The package's ES modules and `dist/medkit.css` |
| `guidelines/` specimen cards and the component `.card.html` files | Static pages that drifted from the code | Foundation docs and stories, read from the live tokens |
| `ui_kits/` (portfolio and studio) | Example pages in the old language | The EditorialPage and DashboardPage templates |
| `*.prompt.md` files beside components | Prompting notes for v1's generator | Specs beside each component |
| `_adherence.oxlintrc.json` | Lint rules for v1's class names | Tests that guard tokens, contrast and data-viz use |
| SectionLabel | Renamed by structure | Eyebrow |
| LiveBadge | A status shown as a badge | StatusPill, always with a word |
| VersionBadge | One badge kind among several | Badge, `tone="version"` |
| VideoCard | Named by purpose | MediaCard, for long-form and Shorts |
| IterationCard | Named by purpose | EntryCard, for the build log and iterations |
| StatTile | Not rebuilt yet | Panel with a value; a dedicated tile may return in a minor release |
| Button, Badge, Chip, Card, Avatar, IconButton, Input, Select, Tabs, Panel, TrackBar, StatusPill, PullQuote, PostCard, DataTable, LineChart, BarChart, DonutChart | Rebuilt from scratch for the new brand, with new APIs | Same names; see each spec |

### Upgrading from v1

There is no upgrade path: v2 shares no code with v1. Install v2, load `tokens.css` or `medkit.css`, set `data-theme` and `data-density`, and rebuild pages from the templates.
