import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Badge } from "../../atoms/badge";
import { Eyebrow } from "../../atoms/eyebrow";
import { Heading } from "../../atoms/heading";
import { Reveal } from "../../atoms/reveal";
import { ThemeSwitch } from "../../molecules/theme-switch";
import { PullQuote } from "../../molecules/pull-quote";
import { StepRelay } from "../../molecules/step-relay";
import { CaseCard } from "../../organisms/case-card";
import { ContactRoutes } from "../../organisms/contact-routes";
import { EntryCard } from "../../organisms/entry-card";
import { Footer } from "../../organisms/footer";
import { Header } from "../../organisms/header";
import { MediaCard } from "../../organisms/media-card";
import { PostCard } from "../../organisms/post-card";
import { Section } from "../../organisms/section";
import { EditorialPage, PageHero, Split } from "./EditorialPage";

// Sample content only: the kit carries no real personal copy.
const day = (iso: string) => new Date(`${iso}T12:00:00Z`);
const P = { forest: "#0f1b14", hunter: "#2e4a38", sage: "#8fa17c", sand: "#cdb88f", honey: "#e0a93f" };
const thumb = (n: number, w = 320, h = 180) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${
      [
        `<rect width="${w}" height="${h}" fill="${P.forest}"/><circle cx="${w * 0.72}" cy="${h * 0.5}" r="${h * 0.38}" fill="${P.honey}"/>`,
        `<rect width="${w}" height="${h}" fill="${P.hunter}"/><path d="M0 ${h} L${w * 0.5} ${h * 0.2} L${w} ${h}Z" fill="${P.sage}"/>`,
        `<rect width="${w}" height="${h}" fill="${P.sand}"/><rect width="${w * 0.5}" height="${h}" fill="${P.forest}"/>`,
      ][n % 3]
    }</svg>`,
  );

type Content = {
  title: ReactNode;
  accent?: ReactNode;
  lead?: ReactNode;
  cases: { title: string; summary?: string; outcome?: string; image?: string }[];
  quote?: string;
  steps: string[];
  posts: { title: string; image?: string }[];
  footer: boolean;
};

const page = (c: Content) => (
  <EditorialPage
    header={
      <Header brand={<a href="#top">Sample Studio</a>} actions={<ThemeSwitch />}>
        <a href="#work">Work</a>
        <a href="#method">Method</a>
        <a href="#writing">Writing</a>
      </Header>
    }
    footer={
      c.footer ? (
        <Footer
          name="Sample Studio"
          thesis="Design systems, dashboards and the videos that explain them."
          groups={[
            { title: "Work", links: [{ label: "Case studies", href: "#work" }, { label: "Build log", href: "#log" }] },
            { title: "Writing", links: [{ label: "Posts", href: "#writing" }] },
            { title: "Elsewhere", links: [{ label: "YouTube", href: "#" }, { label: "GitHub", href: "#" }] },
          ]}
          smallPrint={["© 2026 Sample Studio", <>Built with MED·Kit <Badge tone="version">v2.0.0</Badge></>]}
        />
      ) : undefined
    }
  >
    <PageHero eyebrow="[00] Thesis" title={c.title} accent={c.accent} kicker={c.lead ? "Product design, built in code" : undefined} lead={c.lead} />
    <Section id="work" aria-labelledby="work-title">
      <Eyebrow>[01] Selected work</Eyebrow>
      <Heading id="work-title" size="heading">Case studies</Heading>
      <div className="mk-card-grid">
        {c.cases.map((k, i) => (
          <Reveal key={k.title} order={i % 3}>
            <CaseCard title={k.title} href="#" period="2026" summary={k.summary} outcome={k.outcome} image={k.image} />
          </Reveal>
        ))}
      </div>
    </Section>
    <Section id="method" tone="inverse" aria-labelledby="method-title">
      <Eyebrow as="h2" id="method-title">[02] Back to the core</Eyebrow>
      <StepRelay steps={c.steps.map((title) => ({ title }))} />
    </Section>
    {c.quote ? (
      <Section aria-label="Quote">
        <PullQuote attribution="Sample Studio">{c.quote}</PullQuote>
      </Section>
    ) : null}
    <Section id="writing" aria-labelledby="writing-title">
      <Split align="end">
        <Heading id="writing-title" size="heading">Writing and video</Heading>
        <p className="mk-lead">Posts, long-form videos and Shorts, with the build log beside them.</p>
      </Split>
      <div className="mk-card-grid">
        {c.posts.map((p, i) => (
          <PostCard key={p.title} title={p.title} href="#" published={day("2026-11-02")} readingMinutes={6 + i} image={p.image} summary="A sample summary, long enough to wrap onto a second line in a narrow column." tags={["Process"]} />
        ))}
        <MediaCard title="Rebuilding a design system in public" href="#" format="long" duration="18:42" published={day("2026-11-11")} thumbnail={thumb(1)} />
        <EntryCard title="Controls land in the kit" href="#" date={day("2026-11-14")} added={["Input, Select, Field"]} removed={["Square fields"]} version="v2.0.0-alpha.4" />
      </div>
    </Section>
    <Section id="contact" aria-labelledby="contact-title">
      <Eyebrow as="h2" id="contact-title">[03] Get in touch</Eyebrow>
      <ContactRoutes routes={[{ label: "Talk about a role", href: "#" }, { label: "Start a project", href: "#" }]} />
    </Section>
  </EditorialPage>
);

const steps = ["What is the problem?", "Why does it exist?", "How can I communicate it to a user?", "What is the optimal experience?"];

const meta = {
  title: "Templates/EditorialPage",
  component: EditorialPage,
  parameters: { layout: "fullscreen", bare: true },
  args: { children: null },
} satisfies Meta<typeof EditorialPage>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The landing direction, with sample content. */
export const Real: Story = {
  render: () =>
    page({
      title: "The designer's job is no longer the artifact.",
      accent: "It's building the system that produces it.",
      lead: "Start from the core: what the problem is, why it exists, how to say it to a user, and what the best experience could be.",
      cases: [
        { title: "Predictor", summary: "A personal investing system that shows its reasoning.", outcome: "The gauge shows; the person decides.", image: thumb(0, 320, 240) },
        { title: "MED·Kit v2", summary: "One design system for three projects.", outcome: "Three projects, one set of tokens.", image: thumb(2, 320, 240) },
        { title: "Studio pipeline", summary: "Videos rendered from the same tokens as the site.", image: thumb(1, 320, 240) },
      ],
      quote: "The gauge shows. The person decides.",
      steps,
      posts: [{ title: "Not the artifact: the system that produces it", image: thumb(0) }, { title: "Fewer colours, each with one job" }],
      footer: true,
    }),
};

/** Awkward and long: a long headline, long titles, a paragraph quote, six steps. */
export const LongContent: Story = {
  render: () =>
    page({
      title: "Every chart on this site has a table, a crosshair, keyboard reading and a key you only see when you ask,",
      accent: "because a design system is only finished when its most careful reader can use every part of it.",
      lead: "This lead runs long on purpose. It keeps going past the point where a lead should stop, to see whether the measure holds, whether the split collapses in time, and whether the hero still leaves room for the headline above it on a small phone held upright.",
      cases: Array.from({ length: 5 }, (_, i) => ({
        title: i === 0 ? "A case study whose title is far too long for any card, so it clamps at three lines while screen readers still hear every word of it" : `Case ${i + 1}`,
        summary: "A summary that also runs on, so it clamps at three lines and keeps the cards in a row the same rhythm even when one of them says a great deal more than the others do.",
        outcome: "An outcome line.",
        image: i % 2 ? "" : thumb(i, 320, 240),
      })),
      quote: "A design system earns its keep when the second and third products need it more than the first did: when the dashboard, the site and the video studio all reach for the same token, and nobody has to ask which green, which grey, or how long a hover should take.",
      steps: [...steps, "How do we know it worked?", "What do we keep, and what do we throw away?"],
      posts: [{ title: "Why every chart on this site has a table, a crosshair, keyboard reading and a key you only see when you ask for it" }, { title: "Short" }],
      footer: true,
    }),
};

/** Sparse: a one-word headline, one case, no lead, no quote, no footer. */
export const ShortContent: Story = {
  render: () =>
    page({ title: "Systems.", cases: [{ title: "MED·Kit" }], steps: steps.slice(0, 2), posts: [{ title: "One post" }], footer: false }),
};

/** Missing pictures everywhere: frames hold their ratios. */
export const MissingImages: Story = {
  render: () =>
    page({
      title: "Not the artifact.",
      accent: "The system.",
      lead: "Every picture on this page failed to load, or was never given.",
      cases: [{ title: "Predictor", image: "" }, { title: "MED·Kit v2", image: "" }, { title: "Studio pipeline", image: "" }],
      steps,
      posts: [{ title: "No picture here", image: "" }, { title: "Nor here", image: "" }],
      footer: true,
    }),
};
