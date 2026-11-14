# mk-step-relay

**Purpose:** The steps of a method, in order.
**Atomic level:** Molecule. **Status:** Ready. Matches `Cards`, and moves "Back to the core" out of the site.

## API

`steps` (`{ title, description? }[]`), `orientation` (`"horizontal"` by default, or `"vertical"`).

## Horizontal

As on the landing page: steps in a grid that wraps below 15rem, each under a hairline that a honey baton crosses in turn, two seconds a step, so the cycle grows with the number of steps. Reduced motion shows the baton still and full.

## Vertical

From Mehmet's reference: a ruler of ticks beside the steps. A double-line marker rides the page's scroll, resting 40% down the viewport and clamped to the list; the ticks within about 40px of it extend. When the pointer comes within 72px of the ruler, inside the list, the marker snaps to it, and drifts back to the scroll when the pointer leaves. The step under the marker takes the text colour. The marker only animates while it is moving and the list is on screen. Reduced motion moves it without easing.

## Accessibility

An ordered list, so the order is read. Numbers, batons, the ruler and the marker are decoration and hidden. The current step is visual only; it isn't navigation, so it has no `aria-current`. In forced colours the baton, ticks and marker are CanvasText.

## Lineage

**Contains:** nothing. **Used in:** the landing page's "Back to the core".
