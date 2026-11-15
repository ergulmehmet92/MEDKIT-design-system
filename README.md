# MED·Kit

**MED·Kit**, the Mehmet Ergul Design Kit, is one design system for a portfolio, a dashboard and a video studio: one brand, two densities. Forest and Paper themes over a living light, glass panels, and charts that tell one story each.

Built and maintained by [Mehmet Ergul](https://github.com/ergulmehmet92). Free to use under the [MIT license](LICENSE).

Docs and every component, live: **[medkit.mehmetergul.com](https://medkit.mehmetergul.com)**.

## Install

MED·Kit is installed from a git tag; it isn't on the npm registry.

```sh
npm install github:ergulmehmet92/MEDKIT-design-system#v2.0.0
```

React 19 is a peer dependency. The package ships TypeScript source, so a bundler compiles it with your app; in Next.js, add it to `transpilePackages`.

```tsx
import "@ergulmehmet92/medkit/tokens.css";
import { Button, Panel, DataTable } from "@ergulmehmet92/medkit";

export function Page() {
  return (
    <div data-theme="forest" data-density="analytical">
      <Panel title="Positions">…</Panel>
    </div>
  );
}
```

Without React, link one stylesheet and use the class names shown in the docs:

```html
<link rel="stylesheet" href="node_modules/@ergulmehmet92/medkit/dist/medkit.css">
```

For video, `@ergulmehmet92/medkit/motion.json` holds the motion scale in milliseconds and bezier points.

## The system in brief

- **Themes:** set `data-theme="forest"` (dark, the default) or `data-theme="paper"` on any element. Colour roles follow, written once with `light-dark()`.
- **Densities:** set `data-density="editorial"` for reading or `"analytical"` for working. Density changes size and space, never colour, and can be nested.
- **Colour:** a small palette with one accent, honey. Status colours report state and always sit beside a word. Charts have their own roles: a lead series, grey context, green and red for direction, honey for the one thing that matters.
- **Type:** TeX Gyre Heros for reading and Share Tech Mono for labels. Both ship in `fonts/`.
- **Materials:** a living light behind the page; glass panels and cards; Lens for quiet controls; Eclipse for the one primary action.
- **Motion:** one scale of durations and easings. Every motion has a reduced-motion end state.
- **Accessibility:** WCAG 2.2 AA. Every story is checked with axe in both themes and both densities; charts have keyboard reading, live regions and tables; forced colours are supported throughout.

## What's inside

| Level | Components |
|---|---|
| Atoms | Avatar, Badge, Button, IconButton, Chip, CountUp, DrawLine, Eyebrow, GridRails, Heading, Input, Link, LivingLight, Reveal, Rule, Select, StatusLamp, Textarea, Typewriter |
| Molecules | Card, ChartFrame, Field, Gauge, Metric, PullQuote, Sparkline, StatusPill, StepRelay, Tabs, ThemeSwitch, TrackBar |
| Organisms | Fifteen charts, four cards (Case, Entry, Media, Post), ContactRoutes, DataTable, Footer, Header, MetricRow, Panel, PosterHeadline, Section |
| Templates | EditorialPage, DashboardPage |

## Working on the kit

```sh
npm install
npm run build             # tokens, motion.json and medkit.css
npm test                  # unit, accessibility and token tests
npm run typecheck
npm run contrast          # every colour pair against WCAG
npm run storybook         # docs and stories on :6006
npm run check:private     # nothing private in the package or docs
```

- `tokens/` holds the DTCG sources and the resolver; `dist/` is generated and never edited by hand.
- Each component lives in `components/<level>/<name>/` with its code, CSS, spec, stories and tests.
- `docs/` holds the foundation pages, the [lineage map](docs/lineage.md) and the [versioning policy](docs/versioning.md). Changes are listed in the [changelog](CHANGELOG.md).

## License

MIT, see [LICENSE](LICENSE). Names, projects and figures in stories and examples are samples that demonstrate the system's content patterns.
