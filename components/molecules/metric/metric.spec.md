# mk-metric

**Purpose:** Pairs a large value with what it measures.
**Atomic level:** Molecule, because it's two parts doing one job.
**Status:** Ready

## Anatomy

| Part | Element | Notes |
|---|---|---|
| root | `div` | Must sit inside a `dl`, which MetricRow provides |
| label | `dt` | Read first, shown second |
| value | `dd` | Read second, shown first |

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `ReactNode` | required | |
| `label` | `ReactNode` | required | |
| native props | | | Passed to the root |

## States

Static. Hover, focus, active, disabled, loading, error and empty are n/a. Long values wrap.

## Variants

None.

## Tokens and theming

**Tokens consumed:** `--mk-font-size-feature`, `--mk-font-size-body`, `--mk-tracking-display`, `--mk-color-text-muted`, plus gap and line-height roles.

## Events

None.

## Accessibility

A description list keeps each value tied to its label. Visual order differs from reading order on purpose, and only within this pair.

## Responsive behaviour

The value scales with the viewport, and wraps within its container.

## Content constraints

Keep values short, and only use facts that can be checked.

## "What if" variations

Covered by MetricRow's stories.

## Lineage

**Contains:** nothing. **Used in:** MetricRow.
