# mk-dashboard-page

**Purpose:** The dashboard template from Data board 3.
**Atomic level:** Template. **Status:** Ready.

`DashboardPage` takes `title` (the h1), `meta`, `actions`, `tiles`, `aside` and `children`, in analytical density over the living light. The bar holds the title, the as-of line and the actions; tiles fill as many 13rem columns as fit; from 64rem of the page's own width, the aside takes a 27.5rem column beside the content. Panels under the h1 take `titleAs="h2"`, and their sections h3.

## Tried

Real, empty, loading and long content, at 320, 768, 1024 and 1440px, in both themes and densities: no sideways scroll and no axe violations.

## Fixed in the kit along the way

- Panel and Tabs now lay out in one shrinkable column, so a wide table scrolls inside them instead of widening the page.
- TrackBar contains its hidden label, which had sat 1px past the page's edge at 320px.
- Storybook's `bare` parameter renders templates edge to edge, as on a phone.

No template-only overrides.

**Contains:** LivingLight; pages add Panel, Gauge, TrackBar, LineChart, Tabs, DataTable, StatusPill, CountUp and Button.
