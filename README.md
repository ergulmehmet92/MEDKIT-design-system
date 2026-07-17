# MEDKIT — Design System

**MEDKIT** is a quiet, cinematic, editorial design system: a near-black canvas, large light-weight type, restrained monochrome greys, and a single warm rust accent reserved for long-form writing. It ships as tokens, theme-aware React components, foundation specimen cards, and two full UI kits — everything needed to produce pages, mocks, and prototypes in this language.

Built and maintained by [Mehmet Ergul](https://github.com/ergulmehmet92). Free to use under the [MIT license](LICENSE).

## How it scales (architecture)

Two structural ideas let one quiet language stretch across domains without becoming generic:

1. **Dual tone** — every surface declares `data-theme="ink"` (near-black, default — app/video/hero) or `data-theme="paper"` (warm off-white — reading/blog/docs). Components read **semantic tokens only** (`--color-bg`, `--color-fg`, `--surface-contrast`, …), so the *same* component renders correctly in either tone with no props.
2. **Domain signals** — monochrome stays the foundation; a small, disciplined accent set gives each content stream a signature: **editorial** rust (`#c0551a`, writing), **content** amber (`#e08a1f`, video), **craft** steel (`#7d8aa0`, design iterations), plus **live** green for status only. The rule: *differentiate with value, never with new hues.* `--accent` is the generic alias a domain re-points locally; `Button variant="accent"` and `Badge tone="…"` inherit it.

---

## Content fundamentals

How the system writes.

- **Voice — first person, plain, unembellished.** Copy speaks directly, with no marketing gloss, no exclamation, no hype words.
- **Confident, contrarian openers.** Article ledes lead with a sharp claim: *"Most teams invest in a design system to improve UX. That's the wrong reason, and it's why most of them fail."* Strong thesis first, nuance after.
- **Lowercase navigation.** Primary nav is lowercase (`work`, `thoughts`, `about`). Section eyebrows are uppercase ("RECENT WORK", "PROCESSES", "CONTACT"). This casing split is a signature.
- **Quiet meta.** Dates and counts are stated flatly ("02 projects", "December, 2025", "Mar 2024 — Present · Munich"). Locations append with a middot.
- **Specific, factual project framing.** Work is described with concrete scope and proof: *"designed and shipped as a headline platform feature in 12 weeks."* Numbers earn their place; no vague superlatives.
- **No emoji.** None anywhere. Tone is professional-editorial, never playful-casual.
- **Contractions, warm sign-off.** Contact copy softens: *"Let's talk. I'd love to hear from you."* — the one place the voice warms up, set in light italic.
- **Sentence case for headings**, tight and declarative. Article titles are statements ("Design(er) as an Input", "Approaching Design Systems in a Scale-up").

---

## Visual foundations

- **Palette — monochrome on near-black.** The canvas is `#0e0e0e`; surfaces step up through `#121212` / `#1a1a1a`. Text is off-white `#f5f5f5` → muted `#999` → subtle `#666`. Greys carry all structure. There is **one** accent — a warm rust `#c0551a` — used *only* in long-form editorial (issue labels, ledes, pullquote rules, step numbers). A brighter `#f97316` marks category eyebrows on thought cards; green `#4ade80` appears solely as a "live" status pulse. Never introduce new hues.
- **Typography — Inter, set light.** A single family across everything. Display and section headings run at weight **300** with tight `-0.03em` tracking; editorial article H1s invert to bold **700**. Body in UI is 14px; long-form body is large (~22px) at **1.72** leading. Labels are small, uppercase, wide-tracked grey (`0.12em`–`0.18em`). Data/timers use a tabular monospace stack.
- **Backgrounds.** Heroes run a **full-bleed looping video or dark gradient** under an ~80% black scrim with copy bottom-anchored. Elsewhere the page is flat near-black; bands are separated by 1px hairline borders, not color blocks. Long-form articles can run a **cinematic scroll** that morphs the backdrop dark → light → twilight, inverting the header for legibility. No decorative gradients, no patterns/textures.
- **Motion.** One signature curve — `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). Entrances **fade up** (opacity 0→1, translateY ~24–60px) staggered by ~0.08–0.15s. Durations: 0.3s (hover), 0.5s (state), 0.8s+ (entrance). Respect `prefers-reduced-motion`.
- **Hover states.** Borders **brighten** (`#2a2a2a` → `#444`/white-ish), text lifts from muted → full white, media **scales 1.02**, cards translate up 2px. CTAs lift from flat charcoal to a soft glassy state. Links fade to ~0.55–0.7 opacity. No color inversions on hover, no shrink.
- **Borders & radii.** Hairline `1px` borders everywhere (`#2a2a2a`); translucent white borders (`rgba(255,255,255,0.1–0.16)`) on glass surfaces over imagery. Radii are restrained: `2px` on media frames, `8px` controls, `12–18px` cards, **pill** (`9999px`) on chips and CTAs.
- **Shadows.** Soft and deep on dark (`0 28px 70px rgba(0,0,0,0.35)` on lifted cards); lift is felt more through brightening borders than shadow. White editorial cards carry a hairline + `0 16px 44px rgba(0,0,0,0.1)` float.
- **Transparency & blur.** The fixed header is **glass**: `backdrop-filter: blur(16px) saturate(150%)` over `rgba(0,0,0,0.22)`, rounded `16px`, floating inset from the edges. Chips and CTAs use faint translucent fills/borders.
- **Imagery vibe.** Cool, dark, cinematic; covers sit under black gradient scrims (top→bottom 40%→72%) so white type stays legible. Missing media degrades gracefully to a large light-weight index number on an elevated panel.
- **Cards.** Dark elevated surface, hairline border, generous padding, roomy radius; no heavy shadow at rest. White ("inverted") cards appear only inside articles for diagrams/specimens.
- **Layout.** Fluid page inset `clamp(1rem, 5vw, 2.25rem)`; large vertical section rhythm (`8rem`). Editorial copy measures ~900px; figures widen to ~1200px. The header is `position: fixed`, floating with side insets.

---

## Iconography

- **Minimal, mostly absent.** The system barely uses icons — restraint is the point. There is **no icon font and no sprite**.
- **Inline SVG, thin stroke.** The few UI icons are hand-inline SVGs with `stroke-width: 2`, round caps/joins, `currentColor` (e.g. the lock on confidential process cards, the animated scroll-mouse in the hero). They match a **Lucide**-style 24×24 line aesthetic — if you need more icons, use [Lucide](https://lucide.dev) at stroke 2 to stay consistent, and flag any additions.
- **No emoji, no unicode-as-icon** (one exception: a `▾` chevron on the select control).

---

## Index / manifest

**Root**
- `styles.css` — global entry; `@import`s every token + font file. Consumers link this.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radii.css`, `motion.css`
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Motion)
- `SKILL.md` — Agent-Skill front matter for use in Claude Code

**Components** (`window.MehmetErgulDesignSystem_61b8ed`) — all theme-aware
- `components/core/` — **Button** (primary / glass / secondary / ghost / accent), **Badge** (status/category, domain-toned), **Chip** (neutral tag), **Card** (elevated / panel / contrast / bare), **Avatar**, **IconButton**, **SectionLabel**
- `components/navigation/` — **Tabs** (underline, moving rule)
- `components/feedback/` — **LiveBadge** (in-motion pulse + tabular timer)
- `components/forms/` — **Input** (field / textarea), **Select** (dropdown)
- `components/content/` — **VideoCard** (video/content), **PostCard** (blog), **IterationCard** + **VersionBadge** (design iterations), **PullQuote** (editorial excerpt)
- `components/data/` — **Panel** (labeled dashboard surface), **StatTile** (KPI), **TrackBar** (meter with target tick), **StatusPill** (machine-state pill). Chart-ink + data-table specs live in `guidelines/chart-ink.html` and `guidelines/data-tables.html`.

**UI kits**
- `ui_kits/portfolio/` — a full click-through personal-portfolio example: Home (hero · recent work · collaborators · processes · thoughts · contact), Thoughts index, About, and a cinematic Article reader.
- `ui_kits/studio/` — a **multi-domain content hub**: a tabbed studio with **Videos**, **Writing** (opens a `paper`-theme reading panel), and **Design** (iteration trail v1→v3). The proof that the system spans domains.

> Fonts: **Inter** is the real typeface, loaded from Google Fonts in `tokens/fonts.css` — no substitution. The monospace token is a system stack used only for tabular data.

---

## License

MIT — see [LICENSE](LICENSE). All names, companies, projects, and statistics in the UI-kit sample content are fictional and exist only to demonstrate the system's content patterns.
