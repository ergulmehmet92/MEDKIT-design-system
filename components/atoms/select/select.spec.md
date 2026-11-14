# mk-select

**Purpose:** Choose one of a few options.
**Atomic level:** Atom.
**Status:** Ready. Matches `Controls`.

## API

Every native `select` prop, with `option` children. Inside a Field it takes its wiring from the Field.

## Behaviour

A native `select` with `appearance: none`, in the same well as Input, with our chevron. The list itself is the browser's, so it behaves as people expect on every keyboard, screen reader and touch device. Options take the page's text and surface colours where the browser allows. Customisable selects (`appearance: base-select`) aren't widely available yet, so they wait.

For a required choice, start with a disabled empty option such as "Choose a call"; the Field shows the error after a failed submit.

## Lineage

**Contains:** nothing. **Used in:** Field, Predictor's call form.
