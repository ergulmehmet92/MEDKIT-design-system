# MED·Kit v2: kickoff

Date: 2026-11-05. Owner: Mehmet Ergul.

## Vehicle

Piggybacks on the rewrite of mehmetergul.com, which is the pilot product and, for now, the only consumer.

## Pitch

Not applicable. MED·Kit has one maker and no budget holder.

## Browser support policy

- Baseline Widely Available: use freely.
- Baseline Newly Available: only with feature detection and a working fallback.
- Anything else: ask first.

No exceptions. No `browserslist` is set. This policy is also in `AGENTS.md`.

## Stack

Detected: React 19 with TypeScript, from the site's `package.json`, on Next.js 16.
Target: React.
Reason: one framework, one consumer.

## Scope

v2 keeps Atomic Design's hierarchy, DTCG tokens, per-component specs and tests, and accessibility as a gate. It leaves out multi-brand, compact density and team governance because nothing needs them yet.
