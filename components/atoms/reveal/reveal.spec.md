# mk-reveal

**Purpose:** Content arriving as it scrolls into view.
**Atomic level:** Atom. **Status:** Ready. Matches `Motion`.

Props: `children`, `as` (div), `order` (its place in a group). The content rises 12px and fades in over the first 70% of its entry into view, driven by the scroll itself (`animation-timeline: view()`). Each step of `order` starts it 4% of the entry later, about the 60ms stagger at reading speed.

Scroll-driven animation is newly available, so it sits behind `@supports`; where it isn't supported the content is simply shown. Reduced motion shows it at once. No script.

**Used in:** editorial pages, case studies.
