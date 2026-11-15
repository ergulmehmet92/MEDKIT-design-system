# Versioning

MED·Kit uses semantic versions, `major.minor.patch`, tagged in git as `v2.0.0`. Consumers install from a tag, so a version never changes once tagged.

## Major: something that worked stops working

- A component, prop, token, class name, CSS custom property or export is removed or renamed.
- A prop's or token's meaning changes, such as a colour role taking a different job.
- A default changes in a way consumers would notice and have to undo, such as a default density.
- Markup changes that consumers style or test against: element types, ARIA roles, data attributes.
- A dependency's major version changes and consumers have to act.

## Minor: something new, and nothing breaks

- A new component, prop, variant, token or export.
- A new value for an existing prop or token that existing uses don't see.
- A visual refinement inside a component's approved design: spacing, motion or a colour step within its role.

## Patch: something is fixed

- A bug, an accessibility fix or a contrast fix that keeps the API and the approved design.
- Docs, stories, tests and specs.

## Process

1. Every change lands with its spec updated and its tests passing, including axe in both themes and densities.
2. `CHANGELOG.md` gets an entry under "Unreleased", grouped as Added, Changed, Fixed and Removed.
3. A major change says how to upgrade.
4. A component on its way out is marked deprecated in its spec and in a console warning in development for at least one minor release before a major removes it.
5. Tagging and publishing need Mehmet's go-ahead.
