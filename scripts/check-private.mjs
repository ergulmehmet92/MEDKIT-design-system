// Fails if the public package, docs or built Storybook mention anything that belongs in the private
// portfolio repo: employers' products, career plans, private specs and plans, or personal addresses.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const TERMS = /salary|recruit|job search|career|SPEC-medkit|SPEC-brand|tasks\/plan|tasks\/todo/i;
const ROOTS = ["components", "docs", "examples", "dist", "storybook-static", "README.md", "SKILL.md"];
const TEXT = /\.(tsx?|jsx?|mjs|css|json|md|mdx|html|txt)$/;

async function* files(path) {
  let entries;
  try {
    entries = await readdir(path, { withFileTypes: true });
  } catch {
    if (TEXT.test(path)) yield path;
    return;
  }
  for (const e of entries) yield* files(join(path, e.name));
}

const hits = [];
for (const root of ROOTS) {
  for await (const file of files(root)) {
    if (!TEXT.test(file)) continue;
    const text = await readFile(file, "utf8").catch(() => "");
    const m = text.match(TERMS);
    if (m) hits.push(`${file}: "${m[0]}"`);
  }
}
if (hits.length) {
  console.error(`Private terms found:\n${hits.join("\n")}`);
  process.exit(1);
}
console.log("No private terms in the package, docs or built Storybook.");
