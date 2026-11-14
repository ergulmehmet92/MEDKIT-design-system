# mk-textarea

**Purpose:** Several lines of text.
**Atomic level:** Atom.
**Status:** Ready. Matches `Controls`.

## API

Every native `textarea` prop; `rows` defaults to 3. Inside a Field it takes its wiring from the Field.

## Behaviour

The same well as Input, with 14px corners, because a stadium can't hold lines. It starts at 2.4 control heights and resizes vertically. Where `field-sizing: content` is supported, it grows with its text up to 24 lines.

## Lineage

**Contains:** nothing. **Used in:** Field, Predictor's call reasons.
