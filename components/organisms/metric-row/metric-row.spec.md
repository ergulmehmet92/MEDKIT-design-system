# mk-metric-row

**Purpose:** Sets one to four metrics side by side.
**Atomic level:** Organism, because it's a distinct section of repeated parts.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `dl` | Holds Metric children |

## API

Native `dl` props. **Children:** one to four Metrics.

## States

Static. Hover, focus, active, disabled, loading and error are n/a. With no children, it renders nothing visible.

## Variants

None.

## Tokens and theming

**Tokens consumed:** `--mk-gap-lg`.

## Events

None.

## Accessibility

A description list, so each value stays tied to its label.

## Responsive behaviour

Fits as many columns as the width allows, at 11.25rem or wider, and stacks when it can't.

## Content constraints

One to four metrics.

## "What if" variations

One, two, four and long values are covered by stories.

## Lineage

**Contains:** Metric. **Used in:** none yet.
