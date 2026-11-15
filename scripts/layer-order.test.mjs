import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const files = (dir) => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? files(join(dir, n)) : n.endsWith(".css") ? [join(dir, n)] : []));
const ORDER = "@layer reset, tokens, base, components, utilities;";

describe("layer order", () => {
  // A bundler may emit a component's CSS before tokens.css. Declaring the order first in every file
  // keeps the kit's components above a host's base reset, such as Tailwind's, whatever the order.
  it("is declared at the top of every component stylesheet", () => {
    const missing = files("components").filter((f) => !readFileSync(f, "utf8").startsWith(ORDER));
    expect(missing).toEqual([]);
  });

  it("matches the order tokens.css declares", () => {
    expect(readFileSync("dist/tokens/tokens.css", "utf8")).toContain(ORDER);
  });
});
