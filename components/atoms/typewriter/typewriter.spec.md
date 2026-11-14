# mk-typewriter

**Purpose:** A line typed out as it arrives.
**Atomic level:** Atom. **Status:** Ready. Matches `Motion`.

Props: `text`, `as` (span), `speed` (45ms a character). When 30% in view it types the text with a honey caret blinking at `motion.duration.lamp-blink`, once a second; 1.2s after the last character the caret fades. The whole text is in the page from the start in a visually hidden copy, read once by screen readers; the typed copy is hidden from them. Without the script, an IntersectionObserver or motion, the text is simply shown with no caret. In forced colours the caret is CanvasText.

**Used in:** the portfolio's thesis line, video titles.
