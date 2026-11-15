// Fails if the public package, docs or built Storybook mention anything that belongs in a private
// repo: career plans, private specs and plans, or personal addresses. Names that would themselves be
// private go one per line in .private-terms, which git ignores, and are added to the check.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const GENERIC = ["salary", "recruit", "job search", "career", "SPEC-medkit", "SPEC-brand", "tasks/plan", "tasks/todo"];
const LOCAL = (await readFile(".private-terms", "utf8").catch(() => "")).split("\n").map((t) => t.trim()).filter(Boolean);
const escape = (t) => t.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const TERMS = new RegExp([...GENERIC, ...LOCAL].map(escape).join("|"), "i");
if (!LOCAL.length) console.warn("No .private-terms file: checking the generic terms only.");
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
