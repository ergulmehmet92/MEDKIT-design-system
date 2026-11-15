# MED·Kit

One design system for the portfolio, Predictor and the YouTube studio. See `README.md` for how it works and `SKILL.md` for how to build with it.

## Browser support

Baseline Widely Available: use freely. Baseline Newly Available: only with feature detection and a fallback. Anything else: ask first. One approved exception: refraction on quiet buttons is Chromium-only, and other browsers get blurred glass. Decided 2026-11-05, see `docs/kickoff.md`.

## Rules

- This repo is public. Don't commit private plans or career details.
- Components read semantic tokens only, never primitives.
- Generated files in `dist/` are never edited by hand.
- Every component ships with a spec, stories and tests; run `npm test`, `npm run typecheck` and `npm run check:private` before committing.
- Record changes in `CHANGELOG.md` and follow `docs/versioning.md`.
