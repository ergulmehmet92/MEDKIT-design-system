# mk-count-up

**Purpose:** A number that counts to its value as it arrives.
**Atomic level:** Atom. **Status:** Ready. Matches `Motion`.

Props: `value`, `from` (0), `format` (the value's own decimals, grouped, real minus), `as` (span). When 30% in view it counts over `motion.duration.reveal` on out-expo, in tabular figures so its width holds. The visible digits are hidden from screen readers, which read the final value once from a visually hidden copy. Without the script, an IntersectionObserver or motion, the final value is simply shown.

`motion.ts` beside it holds the shared helpers: reading a duration token, out-expo, and the motion and visibility gates. Typewriter uses them too.

**Used in:** Metric moments on editorial pages.
