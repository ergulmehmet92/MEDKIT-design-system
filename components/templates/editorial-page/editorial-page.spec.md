# mk-editorial-page

**Purpose:** The editorial template from the landing direction.
**Atomic level:** Template. **Status:** Ready.

`EditorialPage` takes `header`, `children` and `footer`. The header floats over the hero's light but stays outside `main`, so it is still a banner; the footer takes the page inset. `PageHero` takes `eyebrow`, `title`, `accent` (a second sentence in the accent colour), `kicker`, `lead` and `form`: a display h1 over the calmed living light, a rule, then the kicker beside the lead. `Split` lays two columns that stack below 26.25rem each, aligned at the start or the end. `.mk-card-grid` holds cards in as many 18rem columns as fit.

## Tried

Real, long, short and missing-picture content, at 320, 768, 1024 and 1440px, in both themes and densities: no sideways scroll and no axe violations. Display headlines wrap without hyphens.

## Fixed in the kit along the way

None needed for this template; see DashboardPage.

**Contains:** LivingLight, GridRails, Eyebrow, Heading, Rule; pages add Header, Section, cards, StepRelay, PullQuote, ContactRoutes and Footer.
