// Reads tokens/tokens.resolver.json and merges the token tree for one theme permutation.

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TOKENS = join(dirname(fileURLToPath(import.meta.url)), "../tokens");

export const resolver = JSON.parse(await readFile(join(TOKENS, "tokens.resolver.json"), "utf8"));

const isGroup = (value) => value && typeof value === "object" && !Array.isArray(value) && !("$value" in value);

// Groups merge. A token declared again replaces the earlier one.
function merge(into, from) {
  for (const [key, value] of Object.entries(from)) {
    into[key] = isGroup(value) && isGroup(into[key]) ? merge(into[key], value) : structuredClone(value);
  }
  return into;
}

export async function resolveTokens(input = {}) {
  const tree = {};
  for (const { $ref } of resolver.resolutionOrder) {
    const [, kind, name] = $ref.split("/");
    const modifier = resolver.modifiers[name];
    const sources = kind === "sets" ? resolver.sets[name].sources : modifier.contexts[input[name] ?? modifier.default];
    for (const source of sources) {
      merge(tree, source.$ref ? JSON.parse(await readFile(join(TOKENS, source.$ref), "utf8")) : source);
    }
  }
  delete tree.$schema;
  delete tree.$description;
  return tree;
}
