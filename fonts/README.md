# Fonts

| Family | Files | Source | Licence |
|---|---|---|---|
| TeX Gyre Heros | `texgyreheros-regular.otf`, `texgyreheros-bold.otf` | [GUST e-foundry](https://www.gust.org.pl/projects/e-foundry/tex-gyre/heros), version 2.004, unmodified | [GUST Font License 1.0](GUST-FONT-LICENSE.txt) |
| Share Tech Mono | `share-tech-mono-latin-400-normal.woff2` | [@fontsource/share-tech-mono](https://www.npmjs.com/package/@fontsource/share-tech-mono) 5.3.0, Latin subset, as distributed | [SIL Open Font License 1.1](Share-Tech-Mono-OFL.txt) |

## Why Heros ships as OTF

The GUST licence asks that derived fonts be renamed and listed in a manifest, so converting to WOFF2 would create a font that needs both. Serving the original files avoids that. The cost is size: about 134 KB per weight, loaded only on pages that use that weight.

To convert later, follow the licence's naming request, add `MANIFEST-qhv.txt`, and check the conditions for modified works in the LaTeX Project Public License.

## Share Tech Mono's reserved name

"Share Tech Mono" is a Reserved Font Name under its licence. Modifying the font means renaming it.
