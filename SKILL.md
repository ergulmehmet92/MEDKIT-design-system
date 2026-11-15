---
name: medkit-design
description: Use this skill to build interfaces, pages, dashboards, charts, mocks or prototypes with MED·Kit, the Mehmet Ergul Design Kit (Forest and Paper themes over a living light, glass panels, honey as the one accent, editorial and analytical densities). Covers its tokens, components, templates and rules.
user-invocable: true
---

MED·Kit is a React 19 design system with DTCG tokens. Read `README.md` first, then the spec beside any component you use (`components/<level>/<name>/<name>.spec.md`).

## Where things live

- `dist/tokens/tokens.css`: every token as a CSS custom property. Load it first. `dist/medkit.css` adds every component's CSS, for pages without React.
- `dist/tokens/motion.json`: the motion scale for video.
- `components/`: atoms, molecules, organisms and templates, each with a spec, stories and tests. `components/index.ts` exports them all.
- `docs/`: the foundation pages (colour, type, density, materials, motion, data), the lineage map and the versioning policy.
- `examples/plain.html`: static components with `medkit.css` alone.

## Building with it

1. Set `data-theme` (`forest` or `paper`) and `data-density` (`editorial` for reading, `analytical` for working) on the page or any section.
2. Start from a template: `EditorialPage` with `PageHero`, `Section`s and a `Footer`, or `DashboardPage` with tiles, an aside and panels.
3. Put each chart, table or gauge in a `Panel`. Under a page's h1, give panels `titleAs="h2"`.
4. Use components' props for variation, and semantic tokens (`--mk-color-text-default`, `--mk-gap-md`) for anything custom. Never use primitives or raw colours.

For a throwaway mock without a build, link `dist/medkit.css` and write the class names from the docs.

## Rules

- **Colour:** Forest is the default theme. Honey is the only accent, once per view. Status colours (Live, Stale, Failed) only report state, always beside a word in a StatusPill. Errors use the Failed colour with a sentence saying how to fix them. No new colours.
- **Charts:** one story series in the lead colour, comparisons in grey, green and red for up and down with a sign, honey for the one thing that matters. Keys appear on hover or focus. Every chart keeps its table.
- **Type:** TeX Gyre Heros for reading, Share Tech Mono uppercase for labels. Tabular figures for numbers that compare, and a real minus.
- **Materials:** one primary action per view, in Eclipse (`Button`); everything else is Lens (`variant="quiet"`). One-line controls are stadiums; panels and cards have 18px corners.
- **Motion:** use the motion tokens. Nothing blinks faster than once a second. Every motion needs a reduced-motion end state.
- **Writing:** plain, first person, short sentences. Titles state the point, such as "NVDA is over its range", rather than naming the data.
- **Accessibility:** WCAG 2.2 AA in both themes and densities. Don't remove a component's labels, tables or live regions.
