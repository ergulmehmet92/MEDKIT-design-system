/* Portfolio UI kit — screen compositions + sample content. */

const DSx = window.MehmetErgulDesignSystem_61b8ed;
const { Button: B, Chip: C, Card: Cd, SectionLabel: SL, Select: Sel } = DSx;

const CASE_STUDIES = [
  { id: "beta", client: "Enriching Data with AI", year: "2024–2025",
    title: "An AI-powered production tool for enriching free-text data, designed and shipped as a headline platform feature in 12 weeks.",
    tags: ["AI", "Product Design"] },
  { id: "gamma", client: "Building a Classical Music Platform", year: "December, 2025",
    title: "Younison helps classical musicians showcase verified auditions, receive expert feedback with YNS scoring, and connect with orchestras worldwide.",
    tags: ["Strategy", "Product Management", "Design Direction"] },
];

const PARTNERS = [
  { id: "northlight", name: "Northlight" },
  { id: "arcform", name: "Arcform" },
  { id: "fieldwork", name: "Fieldwork" },
  { id: "kestrel", name: "Kestrel & Co" },
  { id: "atelier", name: "Atelier Nova" },
];

const PROCESSES = [
  { tag: "Client Work · Confidential", locked: true, title: "Registry Workbench",
    description: "Letting analysts author governed functions and transformations in plain language.",
    stack: ["Python", "AI/ML"], elapsed: "03mo 12d 06h" },
  { tag: "iOS App · Confidential", locked: true, title: "Rotivo",
    description: "Solo bootstrapping a Swift app that makes vehicle ownership part of your investment/liability balance.",
    stack: ["Swift", "SwiftUI"], elapsed: "03mo 04d 18h" },
  { tag: "Tinkering", locked: false, title: "OpenClaw",
    description: "Tinkering with OpenClaw on editing long-form video creation through DaVinci Resolve.",
    stack: ["DaVinci Resolve", "Video"], elapsed: "04mo 09d 02h" },
];

const THOUGHTS = [
  { id: "design-system-case", title: "Approaching Design Systems in a Scale-up", category: "Design Systems", date: "June, 2023",
    excerpt: "Most teams invest in a design system to improve UX. That's the wrong reason, and it's why most of them fail.",
    cover: "radial-gradient(120% 100% at 30% 20%, #2a2320, #0c0c0c)",
    lede: "Most teams invest in a design system to improve UX. That's the wrong reason, and it's why most of them fail." },
  { id: "designer-as-input", title: "Design(er) as an Input", category: "Design Leadership", date: "February, 2024",
    excerpt: "Adaptive leadership in design isn't about running better critiques. It's about building a team where each person is the key to someone else's lock.",
    cover: "radial-gradient(120% 100% at 70% 30%, #241f2a, #0c0c0c)",
    lede: "Adaptive leadership in design isn't about running better critiques. It's about building a team where each person is the key to someone else's lock." },
  { id: "ux-leadership", title: "Thoughts Around Running a Design Function", category: "Design Leadership", date: "December, 2025",
    excerpt: "UX impact is often invisible to the business, not because it doesn't exist, but because no one built the system to surface it.",
    cover: "radial-gradient(120% 100% at 50% 20%, #1f262a, #0c0c0c)",
    lede: "UX impact is often invisible to the business, not because it doesn't exist, but because no one built the system to surface it." },
];

const PAGE = { padding: "var(--section-pad-y) var(--page-inset)" };

/* ——— HOME ——— */
function HomeScreen({ onOpenWork, onOpenThought }) {
  return (
    <div>
      <Hero />
      <section style={PAGE}>
        <div style={{ marginBottom: 64 }}><SL meta="02 projects">Recent work</SL></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px 32px" }}>
          {CASE_STUDIES.map((s, i) => <WorkCard key={s.id} study={s} index={i} onOpen={onOpenWork} />)}
        </div>
        <div style={{ marginTop: 80 }}>
          <div style={{ marginBottom: 32 }}><SL>Collaborated with</SL></div>
          <PartnerRow partners={PARTNERS} />
        </div>
      </section>

      <section style={{ ...PAGE, borderTop: "1px solid var(--color-border)" }}>
        <div style={{ marginBottom: 64 }}>
          <SL>Processes</SL>
          <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--color-fg-subtle)" }}>Work that is currently in motion.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {PROCESSES.map((p) => <ProcessCard key={p.title} project={p} />)}
        </div>
      </section>

      <section style={{ ...PAGE, borderTop: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginBottom: 56 }}>
          <div>
            <SL>Thoughts</SL>
            <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--color-fg-subtle)" }}>Articles I write on design, product, and technology.</p>
          </div>
          <B variant="ghost">View all →</B>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {THOUGHTS.map((p) => <ThoughtCard key={p.id} post={p} variant="section" onOpen={onOpenThought} />)}
        </div>
      </section>

      <ContactBand />
    </div>
  );
}

function ContactBand() {
  return (
    <section style={{ ...PAGE, borderTop: "1px solid var(--color-border)" }}>
      <div style={{ marginBottom: 64 }}><SL>Contact</SL></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
        <div>
          <p style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3.75rem)", fontWeight: 300, lineHeight: 1.25, letterSpacing: "-0.02em", color: "var(--color-fg)" }}>Let's talk.</p>
          <p style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3.75rem)", fontWeight: 200, fontStyle: "italic", lineHeight: 1.25, color: "var(--color-fg-muted)" }}>I'd love to hear from you.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 32 }}>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-fg-subtle)" }}>General inquiries</p>
            <a style={{ fontSize: 24, fontWeight: 300, color: "var(--color-fg)", cursor: "pointer" }}>hello@studio.example</a>
          </div>
          <a style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--color-fg-muted)", cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

/* ——— THOUGHTS INDEX ——— */
function ThoughtsScreen({ onOpenThought }) {
  const [sort, setSort] = React.useState("latest");
  return (
    <section style={{ ...PAGE, paddingTop: 140 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 64 }}>
        <div style={{ maxWidth: 560 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.75rem)", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--color-fg)" }}>Thoughts</h1>
          <p style={{ margin: "16px 0 0", fontSize: 18, lineHeight: 1.55, color: "var(--color-fg-muted)" }}>Articles I write on design, product, and technology.</p>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "var(--color-fg-muted)" }}>
          <span>Sort by</span>
          <Sel ariaLabel="Sort articles" value={sort} onChange={(e) => setSort(e.target.value)}
            options={[{ value: "latest", label: "Latest to oldest" }, { value: "reading-time", label: "Reading time" }]} />
        </label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px 32px" }}>
        {THOUGHTS.map((p) => <ThoughtCard key={p.id} post={p} variant="page" onOpen={onOpenThought} />)}
      </div>
    </section>
  );
}

/* ——— ABOUT ——— */
const EXPERIENCE = [
  { role: "Staff Designer, AI & LLM Products", company: "Meridian Labs", period: "Mar 2024 — Present · Munich",
    summary: "Leading design direction and product architecture for AI tooling used by enterprise teams, from C-levels to analysts." },
  { role: "Senior Designer, Automation", company: "Northfield Systems", period: "May 2022 — Feb 2024 · Munich",
    summary: "Integrating an acquired automation platform into the core product; compliance work that unblocked enterprise sales." },
  { role: "Senior Product Designer", company: "Atelier Brandt", period: "Sep 2019 — Feb 2021 · Munich",
    summary: "Concept through evolution for B2B/B2C and SaaS ventures; design advocacy with executives and squads." },
  { role: "Product Designer", company: "Studio Lira", period: "Mar 2017 — Jun 2019 · Milan",
    summary: "Product and concept design for agritech and consumer electronics across multidisciplinary client work." },
];

function AboutScreen() {
  return (
    <section style={{ ...PAGE, paddingTop: 140 }}>
      <div style={{ maxWidth: 820, marginBottom: 80 }}>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 300, lineHeight: 1.18, letterSpacing: "-0.02em", color: "var(--color-fg)" }}>
          Designer focused on data, AI, and deep-technology products, from enterprise platforms to physical systems.
        </h1>
        <p style={{ margin: "32px 0 0", fontSize: 18, lineHeight: 1.7, color: "var(--color-fg-muted)" }}>
          Collecting experience across multiple dimensions of the design discipline has allowed me to push its boundaries further. I think freely, and apply craft across different contexts. My expertise spans B2B and enterprise solutions, especially where data, automation, and LLM-driven complex experiences are brought to the surface.
        </p>
      </div>
      <div style={{ marginBottom: 32 }}><SL>Experience</SL></div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {EXPERIENCE.map((e, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24,
            padding: "28px 0", borderTop: "1px solid var(--color-border)" }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 400, color: "var(--color-fg)" }}>{e.company}</h3>
              <p style={{ margin: 0, fontSize: 13, color: "var(--color-fg-subtle)" }}>{e.period}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 16, color: "var(--color-fg)" }}>{e.role}</p>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--color-fg-muted)" }}>{e.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ——— ARTICLE READER (cinematic, rust accent) ——— */
function ArticleScreen({ post, onBack }) {
  const p = post || THOUGHTS[0];
  return (
    <article style={{ padding: "140px var(--page-inset) 80px", maxWidth: 980, margin: "0 auto" }}>
      <a onClick={onBack} style={{ cursor: "pointer", fontSize: 14, color: "var(--color-fg-muted)" }}>← Back to thoughts</a>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "48px 0 24px" }}>
          <span style={{ fontSize: 14, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-accent)" }}>{p.category}</span>
          <C>{p.date}</C>
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(2.5rem, 6vw, 4.25rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", color: "var(--color-fg)" }}>{p.title}</h1>
        <p style={{ margin: "40px 0 64px", fontSize: 20, lineHeight: 1.68, color: "var(--color-fg-muted)", borderLeft: "3px solid var(--text-accent)", paddingLeft: 20 }}>{p.lede}</p>

        <h2 style={{ margin: "0 0 24px", fontSize: 24, fontWeight: 700, color: "var(--color-fg)" }}>The wrong reason</h2>
        <p style={{ fontSize: "var(--text-article)", lineHeight: 1.72, color: "var(--color-fg-muted)", marginBottom: 28 }}>
          A design system is infrastructure. Its first job is not prettier screens — it is to remove the cost of every decision a team makes twice. When you frame it as a UX initiative, you measure it against the wrong outcomes and starve it of the engineering partnership it needs to survive.
        </p>
        <p style={{ fontSize: "var(--text-article)", lineHeight: 1.72, color: "var(--color-fg-muted)", marginBottom: 28 }}>
          The teams that succeed treat the system as a product with its own users — the designers and engineers shipping on top of it — and they hold it to the same bar of adoption, reliability, and support.
        </p>

        <blockquote style={{ margin: "48px 0", fontSize: 22, fontStyle: "italic", lineHeight: 1.55, color: "var(--color-fg)", borderLeft: "3px solid var(--text-accent)", padding: "8px 0 8px 24px" }}>
          Adoption is the only metric that matters. Everything else is a proxy.
        </blockquote>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, margin: "48px 0" }}>
          {["Strategy", "Design", "Technology"].map((t, i) => (
            <Cd key={t} surface="contrast" hoverable={false} padding="1.5rem" style={{ borderRadius: "var(--radius-xl)" }}>
              <div style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--signal-editorial)", marginBottom: 10 }}>0{i + 1}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink-950)" }}>{t}</div>
            </Cd>
          ))}
        </div>

        <p style={{ marginTop: 64, paddingTop: 32, borderTop: "0.5px solid var(--color-border)", fontSize: 13, color: "var(--color-fg-subtle)" }}>
          Written by Mehmet Ergul · Sample article from the MEDKIT UI kit.
        </p>
      </div>
    </article>
  );
}

Object.assign(window, { HomeScreen, ThoughtsScreen, AboutScreen, ArticleScreen });
