import type { Meta, StoryObj } from "@storybook/react-vite";
import { LivingLight } from "../../atoms/living-light";
import { CaseCard } from "../../organisms/case-card";
import { EntryCard } from "../../organisms/entry-card";
import { MediaCard } from "../../organisms/media-card";
import { PostCard } from "../../organisms/post-card";
import { StatusPill } from "../status-pill";
import { Card } from "./Card";

// Bauhaus thumbnails in the palette only, so no real images ship with the kit.
const P = { forest: "#0f1b14", hunter: "#2e4a38", sage: "#8fa17c", sand: "#cdb88f", honey: "#e0a93f" };
const thumb = (n: number, w = 320, h = 180) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${
      [
        `<rect width="${w}" height="${h}" fill="${P.forest}"/><circle cx="${w * 0.72}" cy="${h * 0.5}" r="${h * 0.38}" fill="${P.honey}"/><rect x="${w * 0.12}" y="${h * 0.58}" width="${w * 0.42}" height="${h * 0.16}" fill="${P.sand}"/>`,
        `<rect width="${w}" height="${h}" fill="${P.hunter}"/><path d="M0 ${h} L${w * 0.5} ${h * 0.2} L${w} ${h}Z" fill="${P.sage}"/>`,
        `<rect width="${w}" height="${h}" fill="${P.sand}"/><rect width="${w * 0.5}" height="${h}" fill="${P.forest}"/>`,
      ][n % 3]
    }</svg>`,
  );
const day = (iso: string) => new Date(`${iso}T12:00:00Z`);
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))", gap: "var(--mk-gap-lg)", alignItems: "start" } as const;

const meta = {
  title: "Molecules/Card",
  component: Card,
  decorators: [
    (Story, { globals }) => (
      <div style={{ position: "relative", isolation: "isolate", padding: "var(--mk-inset-lg)" }}>
        <LivingLight theme={globals.theme === "paper" ? "paper" : "forest"} />
        <Story />
      </div>
    ),
  ],
  args: { title: "Not the artifact: the system that produces it", href: "#" },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board: every kind of card, with missing pictures and a very long title among them. */
export const AllKinds: Story = {
  render: () => (
    <div style={grid}>
      <PostCard title="Not the artifact: the system that produces it" href="#" published={day("2026-11-02")} readingMinutes={7} image={thumb(0)} summary="Why the portfolio shows the design system behind the screens." tags={["Design systems", "Process"]} />
      <MediaCard title="I rebuilt my design system in public" href="#" format="long" duration="18:42" published={day("2026-11-11")} thumbnail={thumb(1)} summary="Tokens, density and a living light, from the canvas to the code." />
      <MediaCard title="One token, two densities" href="#" format="short" duration="0:48" thumbnail={thumb(2, 180, 320)} />
      <MediaCard title="Living light, frame by frame" href="#" format="long" duration="12:07" published={day("2026-10-28")} summary="Missing thumbnail: the frame and duration stay." />
      <MediaCard
        title="Why every chart on this site has a table, a crosshair, keyboard reading and a key you only see when you ask for it, even the very small ones in the corner"
        href="#"
        format="long"
        duration="1:04:18"
        thumbnail={thumb(0)}
      />
      <CaseCard title="Predictor" href="#" period="2025 to 2026" image={thumb(2, 320, 240)} summary="A personal investing system that shows its reasoning." outcome="The gauge shows; the person decides." tags={["Design and build"]} />
      <CaseCard title="MED·Kit v2" href="#" period="2026" image="" summary="One design system for three projects." outcome="Three projects, one set of tokens." />
      <EntryCard title="Controls land in the kit" href="#" date={day("2026-11-14")} added={["Input, Textarea, Select, Field", "Chip, Tabs, Badge, Avatar"]} removed={["Square bordered fields"]} version="v2.0.0-alpha.4" status={<StatusPill status="live">Shipped</StatusPill>} />
    </div>
  ),
};

export const Plain: Story = { args: { meta: "2 Nov 2026", summary: "A card with no picture: the body takes the whole surface." } };
