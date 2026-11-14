# mk-draw-line

**Purpose:** Line art that draws on: a chart line, a rule, an underline.
**Atomic level:** Atom. **Status:** Ready. Matches `Motion`. The base for motion vectors, which wait for Mehmet to place them.

Props: every `svg` prop, plus `title`. With a title the drawing is an image named by it; without, it is decoration and hidden.

When the drawing is 30% in view, each shape draws along its length over `motion.duration.reveal` (1.4s) on the default easing, each one 240ms after the one before. The script sets `pathLength="1"` on the shapes and arms them; without the script, an IntersectionObserver or motion, the lines are simply drawn. It draws once.

**Used in:** charts, rules and underlines.
