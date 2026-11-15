import { Controls, Markdown, Stories, Title, useOf } from "@storybook/addon-docs/blocks";

// Every component's docs page is its spec: the spec.md beside its stories, the specs of any
// subcomponents shown in the same stories, then the stories and controls.
const specs = import.meta.glob("../components/**/*.spec.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const byName = new Map(
  Object.values(specs).flatMap((text) => {
    const m = text.match(/^# mk-([a-z-]+)/);
    return m ? [[m[1], text] as const] : [];
  }),
);
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const body = (text: string) => text.replace(/^# .*\n/, "");

const specFor = (fileName: string | undefined) => {
  if (!fileName) return null;
  const dir = fileName.replace(/^\.\//, "../").replace(/\/[^/]+$/, "/");
  const match = Object.keys(specs).find((path) => path.startsWith(dir));
  return match ? specs[match] : null;
};

export function SpecPage() {
  const meta = useOf("meta");
  const parameters = meta.preparedMeta.parameters;
  const spec = specFor(parameters.fileName as string | undefined);
  const subs = Object.keys((meta.preparedMeta as { subcomponents?: Record<string, unknown> }).subcomponents ?? {});
  return (
    <>
      <Title />
      {spec ? <Markdown>{body(spec)}</Markdown> : null}
      {subs.map((name) => {
        const text = byName.get(kebab(name));
        return text ? (
          <section key={name}>
            <Markdown>{`## ${name}\n\n${body(text).replace(/^## /gm, "### ")}`}</Markdown>
          </section>
        ) : null;
      })}
      <Stories includePrimary title="Stories" />
      <Controls />
    </>
  );
}
