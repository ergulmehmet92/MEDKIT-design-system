// Token build: DTCG 2025.10 sources to CSS custom properties, via Style Dictionary 5.
// Style Dictionary doesn't read resolver documents yet, so scripts/resolve-tokens.mjs does, and
// the resolver stays the single source of truth for which files make up each theme.
// Adapted from the atomic-design skill's template (MIT, Gökberk Nur).

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import { resolveTokens } from "./scripts/resolve-tokens.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "dist/tokens");
const FLUID = await readFile(join(ROOT, "tokens/fluid.css"), "utf8");
const PREFIX = "mk";
const LAYERS = "@layer reset, tokens, base, components, utilities;";
const SUPPORTS = "(color: light-dark(#fff, #000))";
const FORCED_KEY = "com.medkit.forcedColors";

const transforms = StyleDictionary.hooks.transformGroups.css.map((name) => (name === "color/css" ? "color/oklch" : name));

// Returns each token's CSS value and forced-colors system colour for one theme permutation.
async function build(input) {
  const dictionary = new StyleDictionary({
    tokens: await resolveTokens(input),
    usesDtcg: true,
    log: { verbosity: "silent" },
    platforms: { css: { transforms, prefix: PREFIX } },
  });
  const { allTokens } = await dictionary.getPlatformTokens("css");
  const byPath = new Map(allTokens.map((token) => [token.path.join("."), token]));

  // A pure alias becomes var(--target), so the cascade decides the final value.
  const cssValue = (token) => {
    const alias = typeof token.original.$value === "string" && token.original.$value.match(/^\{([^{}]+)\}$/);
    return alias ? `var(--${byPath.get(alias[1]).name})` : token.$value;
  };
  return {
    values: new Map(allTokens.map((token) => [token.name, cssValue(token)])),
    forced: allTokens.filter((token) => token.$extensions?.[FORCED_KEY]).map((token) => [token.name, token.$extensions[FORCED_KEY]]),
  };
}

const declarations = (entries, pad) => entries.map(([name, value]) => `${pad}--${name}: ${value};`).join("\n");

const { values: forest, forced } = await build({ scheme: "forest" });
const { values: paper } = await build({ scheme: "paper" });
const { values: more } = await build({ contrast: "more" });

const names = [...forest.keys()];
const themed = names.filter((name) => forest.get(name) !== paper.get(name));
const promoted = names.filter((name) => forest.get(name) !== more.get(name)).map((name) => [name, more.get(name)]);

const css = `/* Generated. Do not edit. Load before any other stylesheet. */
${LAYERS}

@layer tokens {
  :root {
    color-scheme: dark;
  }

  [data-theme="paper"] {
    color-scheme: light;
  }

  [data-theme="forest"] {
    color-scheme: dark;
  }

  :root {
${declarations([...forest], "    ")}
  }

  @supports ${SUPPORTS} {
    :root {
${declarations(themed.map((name) => [name, `light-dark(${paper.get(name)}, ${forest.get(name)})`]), "      ")}
    }
  }

  @supports not ${SUPPORTS} {
    [data-theme="paper"] {
${declarations(themed.map((name) => [name, paper.get(name)]), "      ")}
    }

    [data-theme="forest"] {
${declarations(themed.map((name) => [name, forest.get(name)]), "      ")}
    }
  }

  @media (prefers-contrast: more) {
    :root,
    [data-theme] {
${declarations(promoted, "      ")}
    }
  }

  @media (forced-colors: active) {
    :root,
    [data-theme] {
${declarations(forced, "      ")}
    }
  }

${FLUID.trimEnd().split("\n").map((line) => (line ? `  ${line}` : line)).join("\n")}
}

@layer base {
  :where(:root) {
    font-family: var(--${PREFIX}-font-family-body);
    font-size: var(--${PREFIX}-font-size-body);
    font-weight: var(--${PREFIX}-font-weight-body);
    line-height: var(--${PREFIX}-line-height-body);
  }

  /* Repeats the inherited colour on each themed subtree, because light-dark() resolves when computed. */
  :where(:root, [data-theme]) {
    background-color: var(--${PREFIX}-color-surface-default);
    color: var(--${PREFIX}-color-text-default);
    transition:
      background-color var(--${PREFIX}-motion-duration-theme-text) ease var(--${PREFIX}-motion-delay-theme-text),
      color var(--${PREFIX}-motion-duration-theme-text) ease var(--${PREFIX}-motion-delay-theme-text);
  }

  @media (prefers-reduced-motion: reduce) {
    :where(:root, [data-theme]) {
      transition: none;
    }
  }
}
`;

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, "tokens.css"), css);
console.log(`Built ${names.length} tokens into dist/tokens/tokens.css`);
