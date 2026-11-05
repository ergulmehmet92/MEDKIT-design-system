// Token build: DTCG 2025.10 sources to CSS custom properties, via Style Dictionary 5.
// Style Dictionary doesn't read resolver documents yet, so this script does, and the resolver
// stays the single source of truth for which files make up each theme.
// Adapted from the atomic-design skill's template (MIT, Gökberk Nur).

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";

const ROOT = dirname(fileURLToPath(import.meta.url));
const TOKENS = join(ROOT, "tokens");
const OUT = join(ROOT, "dist/tokens");
const PREFIX = "mk";
const LAYERS = "@layer reset, tokens, base, components, utilities;";
const SUPPORTS = "(color: light-dark(#fff, #000))";

const resolver = JSON.parse(await readFile(join(TOKENS, "tokens.resolver.json"), "utf8"));

const isGroup = (value) => value && typeof value === "object" && !Array.isArray(value) && !("$value" in value);

// Groups merge. A token declared again replaces the earlier one.
function merge(into, from) {
  for (const [key, value] of Object.entries(from)) {
    into[key] = isGroup(value) && isGroup(into[key]) ? merge(into[key], value) : structuredClone(value);
  }
  return into;
}

async function resolve(input) {
  const tree = {};
  for (const { $ref } of resolver.resolutionOrder) {
    const [, kind, name] = $ref.split("/");
    const sources = kind === "sets" ? resolver.sets[name].sources : resolver.modifiers[name].contexts[input[name] ?? resolver.modifiers[name].default];
    for (const source of sources) {
      merge(tree, JSON.parse(await readFile(join(TOKENS, source.$ref), "utf8")));
    }
  }
  delete tree.$schema;
  delete tree.$description;
  return tree;
}

const transforms = StyleDictionary.hooks.transformGroups.css.map((name) => (name === "color/css" ? "color/oklch" : name));

// Returns a map of custom property name to its CSS value for one theme.
async function build(input) {
  const dictionary = new StyleDictionary({
    tokens: await resolve(input),
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
  return new Map(allTokens.map((token) => [token.name, cssValue(token)]));
}

const declarations = (entries, pad) => entries.map(([name, value]) => `${pad}--${name}: ${value};`).join("\n");

const forest = await build({ scheme: "forest" });
const paper = await build({ scheme: "paper" });
const themed = [...forest.keys()].filter((name) => forest.get(name) !== paper.get(name));

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
}

@layer base {
  /* Repeats the inherited colour on each themed subtree, because light-dark() resolves when computed. */
  :where(:root, [data-theme]) {
    background-color: var(--${PREFIX}-color-surface-default);
    color: var(--${PREFIX}-color-text-default);
  }
}
`;

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, "tokens.css"), css);
console.log(`Built ${forest.size} tokens into dist/tokens/tokens.css`);
