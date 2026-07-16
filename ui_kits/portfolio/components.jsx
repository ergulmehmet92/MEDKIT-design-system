/* Portfolio UI kit — shared chrome & cards. Composes the DS primitives.
   Primitives come from window.MehmetErgulDesignSystem_61b8ed (loaded in index.html). */

const DS = window.MehmetErgulDesignSystem_61b8ed;
const { Button, Chip, Card, SectionLabel, LiveBadge, Select } = DS;

/* ——— Fixed glass header ——— */
function SiteHeader({ route, onNavigate, light }) {
  const links = [
    { id: "home", label: "work" },
    { id: "thoughts", label: "thoughts" },
    { id: "about", label: "about" },
  ];
  return (
    <header
      style={{
        position: "absolute", insetInline: 24, top: 16, height: 64, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", borderRadius: "var(--radius-lg)",
        border: light ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
        background: light ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.22)",
        boxShadow: "var(--shadow-header)",
        backdropFilter: "var(--blur-glass)", WebkitBackdropFilter: "var(--blur-glass)",
        transition: "var(--transition-hover)",
      }}
    >
      <span
        onClick={() => onNavigate("home")}
        style={{ fontSize: 18, fontWeight: 500, letterSpacing: "0.08em", cursor: "pointer",
          color: light ? "#121212" : "var(--color-fg)" }}
      >M·E</span>
      <nav>
        <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0, gap: 28,
          fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em",
          color: light ? "#121212" : "var(--color-fg)" }}>
          {links.map((l) => (
            <li key={l.id}>
              <a
                onClick={() => onNavigate(l.id)}
                style={{ cursor: "pointer", opacity: route === l.id ? 1 : 0.78,
                  transition: "opacity var(--duration-fast) var(--ease-out-expo)" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.55)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = route === l.id ? 1 : 0.78)}
              >{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/* ——— Footer ——— */
function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", padding: "40px var(--page-inset)",
      display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 24 }}>
      <p style={{ margin: 0, color: "var(--color-fg-muted)", fontSize: 14 }}>
        Mehmet Ergul, 2023–2026 — All Rights Reserved
      </p>
      <a style={{ color: "var(--color-fg-muted)", fontSize: 14, cursor: "pointer", textTransform: "capitalize" }}>linkedin</a>
    </footer>
  );
}

/* ——— Hero (dark cinematic backdrop in place of looping video) ——— */
function Hero() {
  const body = "I enjoy participating in our civilization through designing experiences, tinkering with AI, solving business problems, and building products.";
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex",
      alignItems: "flex-end", overflow: "hidden",
      background: "radial-gradient(120% 90% at 70% 10%, #1c1c1f 0%, #0e0e0e 55%, #080808 100%)" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
      <div style={{ position: "relative", zIndex: 2, width: "100%",
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: 32, padding: "0 36px 40px" }}>
        <div style={{ maxWidth: 900 }}>
          <p style={{ margin: "0 0 14px", fontSize: 14, textTransform: "uppercase",
            letterSpacing: "0.18em", color: "rgba(255,255,255,0.7)" }}>Hi, Its Mehmet</p>
          <p style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3.75rem)", fontWeight: 300,
            lineHeight: 1.16, letterSpacing: "-0.02em", color: "#fff" }}>{body}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          color: "rgba(255,255,255,0.6)", flexShrink: 0 }}>
          <svg width="28" height="42" viewBox="0 0 28 42" fill="none">
            <rect x="1.25" y="1.25" width="25.5" height="37.5" rx="12.75" stroke="currentColor" strokeWidth="1.5" />
            <rect x="11.5" y="9" width="5" height="8" rx="2.5" fill="currentColor">
              <animate attributeName="y" values="9;17;9" dur="1.5s" repeatCount="indefinite" />
            </rect>
          </svg>
          <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.18em" }}>Scroll</span>
        </div>
      </div>
    </section>
  );
}

/* ——— Work card (uses code's number-fallback for missing media) ——— */
function WorkCard({ study, index, onOpen }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={() => onOpen(study)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 24 }}
    >
      <div style={{ aspectRatio: "4 / 3", borderRadius: "var(--radius-xs)", overflow: "hidden",
        background: "var(--color-bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 72, fontWeight: 200,
          color: hover ? "var(--color-fg-muted)" : "var(--color-fg-subtle)",
          transform: hover ? "scale(1.02)" : "none",
          transition: "var(--transition-color), transform 0.7s var(--ease-out-expo)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 300,
              color: hover ? "var(--color-fg)" : "rgba(245,245,245,0.75)",
              transition: "var(--transition-color)" }}>{study.client}</h3>
            <p style={{ margin: 0, maxWidth: 460, fontSize: 14, lineHeight: 1.6,
              color: hover ? "rgba(245,245,245,0.9)" : "rgba(153,153,153,0.85)",
              transition: "var(--transition-color)" }}>{study.title}</p>
          </div>
          <span style={{ fontSize: 12, color: "var(--color-fg-subtle)", flexShrink: 0 }}>{study.year}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {study.tags.map((t) => <Chip key={t}>{t}</Chip>)}
        </div>
      </div>
    </div>
  );
}

/* ——— Partner wordmark row ——— */
function PartnerRow({ partners }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
      {partners.map((p) => (
        <div key={p.id} style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "center",
          justifyContent: "center", borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)", background: "var(--color-bg-elevated)" }}>
          <span style={{ fontSize: 14, fontWeight: 300, letterSpacing: "0.06em",
            color: "var(--color-fg-muted)", opacity: 0.85, textAlign: "center", padding: "0 8px" }}>{p.name}</span>
        </div>
      ))}
      <div style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "var(--radius-md)", border: "1px dashed var(--color-border)",
        color: "var(--color-fg-subtle)", fontSize: 13 }}>Many more</div>
    </div>
  );
}

/* ——— Process (in-motion) card ——— */
function ProcessCard({ project }) {
  return (
    <Card surface="elevated" padding="2rem" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 260 }}>
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 24 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: "var(--radius-pill)",
            border: "1px solid var(--color-border)", padding: "4px 12px", fontSize: 12,
            letterSpacing: "0.04em", color: "var(--color-fg-subtle)" }}>
            {project.locked && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
            {project.tag}
          </span>
          <LiveBadge elapsed={project.elapsed} />
        </div>
        <h3 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 300, color: "rgba(245,245,245,0.75)" }}>{project.title}</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "rgba(153,153,153,0.85)" }}>{project.description}</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32 }}>
        {project.stack.map((s) => <Chip key={s}>{s}</Chip>)}
      </div>
    </Card>
  );
}

/* ——— Thought card (section + page variants) ——— */
function ThoughtCard({ post, variant, onOpen }) {
  const [hover, setHover] = React.useState(false);
  if (variant === "page") {
    return (
      <article onClick={() => onOpen(post)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ cursor: "pointer", display: "flex", flexDirection: "column", overflow: "hidden",
          borderRadius: "var(--radius-lg)", border: hover ? "1px solid rgba(153,153,153,0.35)" : "1px solid var(--color-border)",
          background: "#000", transform: hover ? "translateY(-2px)" : "none",
          boxShadow: hover ? "var(--shadow-card-hover)" : "none", transition: "var(--transition-hover)" }}>
        <div style={{ position: "relative", height: 300, background: post.cover }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.72))" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, background: "var(--color-bg-panel)", padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3, color: "var(--color-fg)" }}>{post.title}</h3>
          <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, fontSize: 14 }}>
            <span style={{ fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--signal-orange)" }}>{post.category}</span>
            <span style={{ color: "var(--color-fg-subtle)" }}>·</span>
            <Chip>{post.date}</Chip>
          </span>
        </div>
      </article>
    );
  }
  return (
    <div onClick={() => onOpen(post)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", display: "flex", gap: 20, minHeight: 200, padding: 10,
        borderRadius: "var(--radius-md)", border: hover ? "1px solid rgba(153,153,153,0.3)" : "1px solid var(--color-border)",
        background: hover ? "rgba(26,26,26,0.4)" : "rgba(26,26,26,0.25)", transition: "var(--transition-hover)" }}>
      <div style={{ position: "relative", width: "40%", maxWidth: 200, borderRadius: "var(--radius-md)", overflow: "hidden", background: post.cover }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.7))" }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: "16px 12px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-fg-subtle)" }}>
          <span>{post.category}</span><span>{post.date}</span>
        </div>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 300, lineHeight: 1.35, color: hover ? "var(--color-fg)" : "rgba(245,245,245,0.75)", transition: "var(--transition-color)" }}>{post.title}</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "rgba(153,153,153,0.85)" }}>{post.excerpt}</p>
      </div>
    </div>
  );
}

Object.assign(window, { SiteHeader, SiteFooter, Hero, WorkCard, PartnerRow, ProcessCard, ThoughtCard });
