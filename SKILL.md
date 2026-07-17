---
name: medkit-design
description: Use this skill to generate well-crafted interfaces and assets with MEDKIT (a quiet, near-black, cinematic editorial design language with one warm rust accent), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this system.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Where things live
- `README.md` — full design guide: scaling architecture, content voice, visual foundations, iconography, manifest.
- `styles.css` — global stylesheet; link it to inherit every token. `@import`s `tokens/*.css`.
- `tokens/` — colors (dual theme + domain signals), typography, spacing, radii/shadows, motion, fonts (Inter via Google Fonts).
- `components/` — theme-aware React primitives (Button, Badge, Chip, Card, Avatar, IconButton, SectionLabel, Tabs, Input, Select, LiveBadge), content components (VideoCard, PostCard, IterationCard, VersionBadge, PullQuote), and data components (Panel, StatTile, TrackBar, StatusPill), exported on `window.MehmetErgulDesignSystem_61b8ed` via `_ds_bundle.js` (bundle predates the data/PullQuote additions — import those from source until it is regenerated).
- `guidelines/` — foundation specimen cards.
- `ui_kits/portfolio/` — a personal-portfolio example (Home, Thoughts, About, Article).
- `ui_kits/studio/` — multi-domain content hub (Videos, Writing on the paper theme, Design iterations).

## Scaling across domains
- Wrap any surface in `data-theme="ink"` (dark, default) or `data-theme="paper"` (warm light reading). Components adapt automatically — author against semantic tokens (`--color-bg`, `--color-fg`, `--surface-contrast`), never raw hex.
- Give a content stream its signature with a domain accent: `editorial` (rust) · `content` (amber) · `craft` (steel) · `live` (green, status only). Re-point `--accent` locally and use `Button variant="accent"` / `Badge tone="…"`. Never introduce hues outside this set.

## House rules (the short version)
- Near-black canvas (`#0e0e0e`), monochrome greys, **one** rust accent (`#c0551a`) used only in long-form editorial. No new hues.
- Inter everywhere; display set **light (300)** with tight tracking; editorial article H1s bold (700). Labels small, uppercase, wide-tracked grey. Lowercase nav.
- Hairline `1px` borders; pill chips/CTAs; restrained radii; soft deep shadows. Glass header with backdrop blur.
- Motion: ease-out-expo `cubic-bezier(0.16,1,0.3,1)`, fade-up entrances, hovers brighten borders / lift text. No emoji.
