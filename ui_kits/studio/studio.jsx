/* Studio UI kit — a multi-domain content hub demonstrating the system across
   three streams: video (content), writing (blog), and design iterations.
   Composes DS primitives from the compiled bundle. */

const SDS = window.MehmetErgulDesignSystem_61b8ed;
const { Button, Badge, Chip, Avatar, IconButton, Card, Tabs, VideoCard, PostCard, IterationCard, VersionBadge } = SDS;

const ICON = {
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
};

/* ——— Top bar ——— */
function StudioBar() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: 24, padding: "16px 28px",
      background: "color-mix(in srgb, var(--color-bg) 82%, transparent)",
      backdropFilter: "var(--blur-glass)", WebkitBackdropFilter: "var(--blur-glass)",
      borderBottom: "1px solid var(--color-border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: "0.1em", color: "var(--color-fg)" }}>M·E</span>
        <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-fg-muted)" }}>Studio</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconButton label="Search">{ICON.search}</IconButton>
        <IconButton label="Notifications">{ICON.bell}</IconButton>
        <Button variant="accent" size="sm">Subscribe</Button>
        <Avatar name="Mehmet Ergul" size={34} />
      </div>
    </header>
  );
}

/* ——— Channel identity band ——— */
function StudioHero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "56px 28px 40px",
      background: "radial-gradient(120% 120% at 80% 0%, #1c1c1f 0%, #0e0e0e 55%, #080808 100%)",
      borderBottom: "1px solid var(--color-border)" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <Badge tone="live" variant="dot">Publishing weekly</Badge>
            <Badge tone="neutral">44 works</Badge>
          </div>
          <h1 style={{ margin: 0, fontSize: "var(--display-md)", fontWeight: 300, lineHeight: 1.1,
            letterSpacing: "-0.03em", color: "#fff" }}>Design, in motion and in writing.</h1>
          <p style={{ margin: "18px 0 0", maxWidth: 600, fontSize: 17, lineHeight: 1.6, color: "rgba(245,245,245,0.7)" }}>
            Process videos, essays on design systems and leadership, and the raw iteration
            trails behind the work — one place, three streams.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="glass" iconLeft={<span>▶</span>}>Watch latest</Button>
          <Button variant="secondary">Subscribe</Button>
        </div>
      </div>
    </section>
  );
}

/* ——— Stream: VIDEOS ——— */
const VIDEOS = [
  { id: "v1", title: "Designing an AI annotation tool in 12 weeks", meta: "24K views · 2 weeks ago", duration: "14:22", badge: "New", thumb: "radial-gradient(120% 100% at 30% 20%, #2a2320, #0c0c0c)" },
  { id: "v2", title: "How I run design critique without killing momentum", meta: "11K views · 1 month ago", duration: "09:41", thumb: "radial-gradient(120% 100% at 70% 30%, #241f2a, #0c0c0c)" },
  { id: "v3", title: "Editing long-form video in DaVinci Resolve", meta: "8.2K views · 1 month ago", duration: "22:08", thumb: "radial-gradient(120% 100% at 50% 20%, #1f262a, #0c0c0c)" },
  { id: "v4", title: "From Figma variables to shipped tokens", meta: "31K views · 2 months ago", duration: "17:55", thumb: "radial-gradient(120% 100% at 40% 60%, #26211a, #0c0c0c)" },
  { id: "v5", title: "A week designing at a scale-up", meta: "6.7K views · 3 months ago", duration: "12:30", thumb: "radial-gradient(120% 100% at 60% 40%, #1a2420, #0c0c0c)" },
  { id: "v6", title: "Prototyping motion that respects the brand", meta: "14K views · 3 months ago", duration: "08:12", thumb: "radial-gradient(120% 100% at 30% 70%, #2a2026, #0c0c0c)" },
];

function VideosStream() {
  const [featured, ...rest] = VIDEOS;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* featured */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28, alignItems: "center" }}>
        <VideoCard {...featured} channel="Mehmet Ergul" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Badge tone="content">Featured</Badge>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 300, lineHeight: 1.2, letterSpacing: "-0.02em", color: "var(--color-fg)" }}>{featured.title}</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--color-fg-muted)" }}>
            A full build log — research, the 12-week sprint, and presenting it as the
            platform's headline AI feature to an audience of 4,000+.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Chip>Enterprise</Chip><Chip>AI</Chip><Chip>Case study</Chip>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {rest.map((v) => <VideoCard key={v.id} {...v} channel="Mehmet Ergul" />)}
      </div>
    </div>
  );
}

/* ——— Stream: WRITING (demonstrates the paper theme) ——— */
const POSTS = [
  { id: "p1", category: "Design Systems", tone: "editorial", title: "Approaching Design Systems in a Scale-up", excerpt: "Most teams invest in a design system to improve UX. That's the wrong reason, and it's why most fail.", date: "June 2023", readingTime: "8 min read", cover: "radial-gradient(120% 100% at 30% 20%, #2a2320, #0c0c0c)" },
  { id: "p2", category: "Design Leadership", tone: "editorial", title: "Design(er) as an Input", excerpt: "Adaptive leadership isn't about better critiques. It's a team where each person is the key to someone else's lock.", date: "Feb 2024", readingTime: "6 min read", cover: "radial-gradient(120% 100% at 70% 30%, #241f2a, #0c0c0c)" },
  { id: "p3", category: "Craft", tone: "craft", title: "Notes on Designing Quiet Interfaces", excerpt: "Restraint is a feature. What you leave out is the work — a field guide to designing with near-nothing.", date: "Dec 2025", readingTime: "5 min read", cover: "radial-gradient(120% 100% at 50% 20%, #1f262a, #0c0c0c)" },
];

function WritingStream({ onRead }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
      {POSTS.map((p) => <PostCard key={p.id} {...p} onClick={() => onRead(p)} />)}
    </div>
  );
}

/* A paper-themed reading panel — proves dual-tone with the same primitives */
function ReadingPanel({ post, onClose }) {
  const p = post || POSTS[0];
  return (
    <div data-theme="paper" style={{ borderRadius: "var(--radius-xl)", overflow: "hidden",
      border: "1px solid var(--color-border)", background: "var(--color-bg)", boxShadow: "var(--shadow-float)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 22px", borderBottom: "1px solid var(--color-border)" }}>
        <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--color-fg-subtle)" }}>Reading · paper theme</span>
        <Button variant="ghost" size="sm" onClick={onClose}>Close ✕</Button>
      </div>
      <article style={{ maxWidth: 680, margin: "0 auto", padding: "44px 24px 52px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Badge tone={p.tone}>{p.category}</Badge>
          <span style={{ fontSize: 13, color: "var(--color-fg-subtle)" }}>{p.date} · {p.readingTime}</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "var(--display-sm)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: "var(--color-fg)" }}>{p.title}</h1>
        <p style={{ margin: "28px 0 0", fontSize: "var(--text-article)", lineHeight: 1.72, color: "var(--color-fg-muted)", borderLeft: "3px solid var(--accent)", paddingLeft: 20 }}>{p.excerpt}</p>
        <p style={{ margin: "28px 0 0", fontSize: "var(--text-article)", lineHeight: 1.72, color: "var(--color-fg-muted)" }}>
          A design system is infrastructure. Its first job is not prettier screens — it is to
          remove the cost of every decision a team makes twice. Frame it as a UX initiative and
          you measure it against the wrong outcomes.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 36 }}>
          <Avatar name="Mehmet Ergul" size={40} />
          <div>
            <div style={{ fontSize: 14, color: "var(--color-fg)" }}>Mehmet Ergul</div>
            <div style={{ fontSize: 12, color: "var(--color-fg-subtle)" }}>Staff Product Designer</div>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ——— Stream: DESIGN ITERATIONS ——— */
const ITERATIONS = [
  { id: "i1", label: "First pass — full toolbar", version: "v1", status: "archived", note: "Every action visible. Too dense at small widths.", art: "linear-gradient(135deg,#23262b,#0c0c0c)" },
  { id: "i2", label: "Grouped actions", version: "v2", status: "explored", note: "Primary / secondary split. Better, still two rows.", art: "linear-gradient(135deg,#262329,#0c0c0c)" },
  { id: "i3", label: "Compact toolbar", version: "v3", status: "current", current: true, note: "Collapsed secondary into an overflow menu. Shipped.", art: "linear-gradient(135deg,#20262a,#0c0c0c)" },
];

function DesignStream() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 300, letterSpacing: "-0.02em", color: "var(--color-fg)" }}>Annotation toolbar</h2>
        <Badge tone="craft">3 iterations</Badge>
      </div>
      <p style={{ margin: 0, maxWidth: 640, fontSize: 15, lineHeight: 1.6, color: "var(--color-fg-muted)" }}>
        The trail behind one component — what was tried, what was kept, and why. The current
        iteration carries the craft-accent border.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {ITERATIONS.map((it) => <IterationCard key={it.id} {...it} />)}
      </div>
    </div>
  );
}

Object.assign(window, { StudioBar, StudioHero, VideosStream, WritingStream, ReadingPanel, DesignStream });
