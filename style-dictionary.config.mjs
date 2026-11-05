// Token build: DTCG 2025.10 sources to CSS custom properties, via Style Dictionary 5.
// Style Dictionary doesn't read resolver documents yet, so this script does, and the resolver
// stays the single source of truth for which files make up the tokens.
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

const resolver = JSON.parse(await readFile(join(TOKENS, "tokens.resolver.json"), "utf8"));

const isGroup = (value) => value && typeof value === "object" && !Array.isArray(value) && !("$value" in value);

// Groups merge. A token declared again replaces the earlier one.
function merge(into, from) {
  for (const [key, value] of Object.entries(from)) {
    into[key] = isGroup(value) && isGroup(into[key]) ? merge(into[key], value) : structuredClone(value);
  }
  return into;
}

async function resolve() {
  const tree = {};
  for (const { $ref } of resolver.resolutionOrder) {
    const name = $ref.split("/").at(-1);
    for (const source of resolver.sets[name].sources) {
      merge(tree, JSON.parse(await readFile(join(TOKENS, source.$ref), "utf8")));
    }
  }
  delete tree.$schema;
  delete tree.$description;
  return tree;
}

const transforms = StyleDictionary.hooks.transformGroups.css.map((name) => (name === "color/css" ? "color/oklch" : name));

const dictionary = new StyleDictionary({
  tokens: await resolve(),
  usesDtcg: true,
  log: { verbosity: "silent" },
  platforms: { css: { transforms, prefix: PREFIX } },
});
const { allTokens } = await dictionary.getPlatformTokens("css");
const byPath = new Map(allTokens.map((token) => [token.path.join("."), token]));

// A pure alias becomes var(--target), so the cascade decides the final value.
function cssValue(token) {
  const alias = typeof token.original.$value === "string" && token.original.$value.match(/^\{([^{}]+)\}$/);
  return alias ? `var(--${byPath.get(alias[1]).name})` : token.$value;
}

const declarations = allTokens.map((token) => `    --${token.name}: ${cssValue(token)};`).join("\n");
const css = `/* Generated. Do not edit. Load before any other stylesheet. */\n${LAYERS}\n\n@layer tokens {\n  :root {\n${declarations}\n  }\n}\n`;

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, "tokens.css"), css);
console.log(`Built ${allTokens.length} tokens into dist/tokens/tokens.css`);
