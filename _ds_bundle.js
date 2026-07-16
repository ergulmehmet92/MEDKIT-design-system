/* @ds-bundle: {"format":3,"namespace":"MehmetErgulDesignSystem_61b8ed","components":[{"name":"IterationCard","sourcePath":"components/content/IterationCard.jsx"},{"name":"PostCard","sourcePath":"components/content/PostCard.jsx"},{"name":"VersionBadge","sourcePath":"components/content/VersionBadge.jsx"},{"name":"VideoCard","sourcePath":"components/content/VideoCard.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"SectionLabel","sourcePath":"components/core/SectionLabel.jsx"},{"name":"LiveBadge","sourcePath":"components/feedback/LiveBadge.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/content/IterationCard.jsx":"14ab0764882d","components/content/PostCard.jsx":"52cd91abec57","components/content/VersionBadge.jsx":"6247dc8133ca","components/content/VideoCard.jsx":"0edd2800871f","components/core/Avatar.jsx":"cd541778795e","components/core/Badge.jsx":"7b2e8841e48f","components/core/Button.jsx":"5dad97a219f9","components/core/Card.jsx":"5723e37d9d95","components/core/Chip.jsx":"9d3c71488c2e","components/core/IconButton.jsx":"13cd5f3f8042","components/core/SectionLabel.jsx":"f012ed528be1","components/feedback/LiveBadge.jsx":"131a81e82612","components/forms/Input.jsx":"15fcb1e41fbb","components/forms/Select.jsx":"133c7edfac0e","components/navigation/Tabs.jsx":"7647cf831b2b","ui_kits/portfolio/components.jsx":"f36d9b6a1ebf","ui_kits/portfolio/screens.jsx":"e3bf7c22c1f2","ui_kits/studio/studio.jsx":"ec7e4d6384ce"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MehmetErgulDesignSystem_61b8ed = window.MehmetErgulDesignSystem_61b8ed || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/PostCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * PostCard — blog / writing surface. A reading-first card: category badge,
 * title, excerpt, and a meta footer (date · reading time). Theme-aware, so it
 * works on both the dark index and a paper-toned blog. `cover` is optional;
 * with one it renders a media-topped card, without it a typographic card.
 */
function PostCard({
  title,
  excerpt,
  category,
  date,
  readingTime,
  cover,
  tone = "editorial",
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const isUrl = typeof cover === "string" && /\.(png|jpe?g|webp|gif|svg)|^https?:|^\//.test(cover);
  const accent = {
    editorial: "var(--signal-editorial)",
    content: "var(--signal-content)",
    craft: "var(--signal-craft)",
    neutral: "var(--color-fg-muted)"
  }[tone];
  return /*#__PURE__*/React.createElement("article", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      cursor: onClick ? "pointer" : "default",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      borderRadius: "var(--radius-lg)",
      border: hover ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
      background: "var(--color-bg-elevated)",
      transform: hover ? "translateY(-2px)" : "none",
      boxShadow: hover ? "var(--shadow-card-hover)" : "none",
      transition: "var(--transition-hover)",
      ...style
    }
  }, rest), cover && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "16 / 9",
      background: isUrl ? "var(--color-bg-panel)" : cover
    }
  }, isUrl && /*#__PURE__*/React.createElement("img", {
    src: cover,
    alt: title,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transform: hover ? "scale(1.03)" : "none",
      transition: "transform 0.7s var(--ease-out-expo)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.85rem",
      padding: "1.4rem"
    }
  }, category && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-2xs)",
      fontWeight: "var(--weight-medium)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wider)",
      color: accent
    }
  }, category), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-2xl)",
      fontWeight: "var(--weight-semibold)",
      lineHeight: 1.25,
      letterSpacing: "var(--tracking-snug)",
      color: "var(--color-fg)"
    }
  }, title), excerpt && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      lineHeight: "var(--leading-relaxed)",
      color: "var(--color-fg-muted)"
    }
  }, excerpt), (date || readingTime) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      marginTop: "0.2rem",
      fontSize: "var(--text-xs)",
      color: "var(--color-fg-subtle)"
    }
  }, date && /*#__PURE__*/React.createElement("span", null, date), date && readingTime && /*#__PURE__*/React.createElement("span", null, "\xB7"), readingTime && /*#__PURE__*/React.createElement("span", null, readingTime))));
}
Object.assign(__ds_scope, { PostCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PostCard.jsx", error: String((e && e.message) || e) }); }

// components/content/VersionBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * VersionBadge — a monospace version tag (v1, v3.2) for design iterations.
 * Optional status dot marks the current / explored / archived state.
 *
 * status: "current" | "explored" | "archived" | null
 */
function VersionBadge({
  version,
  status = null,
  style = {},
  ...rest
}) {
  const statusColor = {
    current: "var(--signal-live)",
    explored: "var(--signal-craft)",
    archived: "var(--color-fg-subtle)"
  }[status];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      borderRadius: "var(--radius-xs)",
      padding: "0.2rem 0.5rem",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-2xs)",
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "0.04em",
      color: "var(--color-fg)",
      background: "var(--color-bg-hover)",
      border: "1px solid var(--color-border)",
      ...style
    }
  }, rest), status && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: statusColor
    }
  }), version);
}
Object.assign(__ds_scope, { VersionBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/VersionBadge.jsx", error: String((e && e.message) || e) }); }

// components/content/IterationCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * IterationCard — a single frame in a design-iteration / creative-exploration
 * gallery. Shows the artwork (image URL or CSS background), a version tag with
 * lifecycle status, a label, and an optional rationale note. The craft domain
 * accent marks the active iteration stream. Theme-aware.
 */
function IterationCard({
  label,
  version,
  status = null,
  note,
  art,
  ratio = "4 / 3",
  current = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const isUrl = typeof art === "string" && /\.(png|jpe?g|webp|gif|svg)|^https?:|^\//.test(art);
  return /*#__PURE__*/React.createElement("figure", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      margin: 0,
      cursor: onClick ? "pointer" : "default",
      display: "flex",
      flexDirection: "column",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      background: "var(--color-bg-elevated)",
      border: current ? "1px solid var(--signal-craft)" : hover ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
      boxShadow: current ? "0 0 0 1px color-mix(in srgb, var(--signal-craft) 35%, transparent)" : "none",
      transition: "var(--transition-hover)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: ratio,
      background: isUrl ? "var(--color-bg-panel)" : art || "var(--color-bg-panel)",
      borderBottom: "1px solid var(--color-border)",
      overflow: "hidden"
    }
  }, isUrl && /*#__PURE__*/React.createElement("img", {
    src: art,
    alt: label,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transform: hover ? "scale(1.02)" : "none",
      transition: "transform 0.7s var(--ease-out-expo)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 10,
      left: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.VersionBadge, {
    version: version,
    status: status
  }))), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.4rem",
      padding: "1rem 1.1rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      color: "var(--color-fg)"
    }
  }, label), note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      lineHeight: "var(--leading-normal)",
      color: "var(--color-fg-subtle)"
    }
  }, note)));
}
Object.assign(__ds_scope, { IterationCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/IterationCard.jsx", error: String((e && e.message) || e) }); }

// components/content/VideoCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * VideoCard — content/YouTube surface. A 16:9 thumbnail with a duration badge
 * and a play affordance that appears on hover, above a title and meta line.
 * `thumb` accepts an image URL or any CSS background (gradient fallback).
 * Theme-aware.
 */
function VideoCard({
  title,
  channel,
  meta,
  duration,
  thumb,
  badge,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const isUrl = typeof thumb === "string" && /\.(png|jpe?g|webp|gif|svg)|^https?:|^\//.test(thumb);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      cursor: onClick ? "pointer" : "default",
      display: "flex",
      flexDirection: "column",
      gap: "0.85rem",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "16 / 9",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      background: isUrl ? "var(--color-bg-elevated)" : thumb || "var(--color-bg-elevated)",
      border: "1px solid var(--color-border)"
    }
  }, isUrl && /*#__PURE__*/React.createElement("img", {
    src: thumb,
    alt: title,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transform: hover ? "scale(1.03)" : "none",
      transition: "transform 0.7s var(--ease-out-expo)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0) 45%)"
    }
  }), badge && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 10,
      left: 10,
      borderRadius: "var(--radius-pill)",
      padding: "0.2rem 0.55rem",
      fontSize: "var(--text-2xs)",
      fontWeight: "var(--weight-medium)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "#0a0a0a",
      background: "var(--signal-content)"
    }
  }, badge), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: hover ? 1 : 0,
      transition: "opacity var(--duration-fast) var(--ease-out-expo)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 56,
      height: 56,
      borderRadius: "50%",
      background: "rgba(10,10,10,0.55)",
      border: "1px solid rgba(255,255,255,0.5)",
      backdropFilter: "blur(8px)",
      transform: hover ? "scale(1)" : "scale(0.85)",
      transition: "transform var(--duration-medium) var(--ease-out-expo)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5v14l11-7z"
  })))), duration && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 10,
      right: 10,
      borderRadius: "var(--radius-xs)",
      padding: "0.15rem 0.4rem",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-2xs)",
      fontVariantNumeric: "tabular-nums",
      color: "#fff",
      background: "rgba(10,10,10,0.8)"
    }
  }, duration)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.3rem"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-lg)",
      fontWeight: "var(--weight-semibold)",
      lineHeight: 1.3,
      letterSpacing: "var(--tracking-snug)",
      color: hover ? "var(--color-fg)" : "var(--color-fg)",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }
  }, title), channel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--color-fg-muted)"
    }
  }, channel), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--color-fg-subtle)"
    }
  }, meta)));
}
Object.assign(__ds_scope, { VideoCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/VideoCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — circular identity mark. Renders an image when `src` is given, else
 * monogram initials on a neutral surface. Theme-aware.
 */
function Avatar({
  src,
  name = "",
  size = 40,
  ring = false,
  style = {},
  ...rest
}) {
  const initials = name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    title: name || undefined,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      background: "var(--color-bg-hover)",
      color: "var(--color-fg-muted)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-semibold)",
      fontSize: Math.round(size * 0.36),
      letterSpacing: "0.02em",
      border: ring ? "2px solid var(--color-bg)" : "1px solid var(--color-border)",
      boxShadow: ring ? "0 0 0 1px var(--color-border)" : "none",
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "?");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Badge — small status / category marker. Unlike the neutral Chip, a Badge
 * carries meaning through a domain accent or the live-status hue.
 *
 * tone: "neutral" | "editorial" | "content" | "craft" | "live" | "accent"
 * variant: "soft" (tinted fill, default) | "solid" | "dot" (leading dot only)
 */
function Badge({
  children,
  tone = "neutral",
  variant = "soft",
  style = {},
  ...rest
}) {
  const toneColor = {
    neutral: "var(--color-fg-muted)",
    editorial: "var(--signal-editorial)",
    content: "var(--signal-content)",
    craft: "var(--signal-craft)",
    live: "var(--signal-live)",
    accent: "var(--accent)"
  }[tone];
  const isLive = tone === "live";
  const variants = {
    soft: {
      color: tone === "neutral" ? "var(--color-fg-muted)" : toneColor,
      backgroundColor: tone === "neutral" ? "var(--color-bg-elevated)" : "color-mix(in srgb, " + toneColor + " 16%, transparent)",
      border: tone === "neutral" ? "1px solid var(--color-border)" : "1px solid color-mix(in srgb, " + toneColor + " 30%, transparent)"
    },
    solid: {
      color: tone === "neutral" ? "var(--on-contrast)" : "#0a0a0a",
      backgroundColor: tone === "neutral" ? "var(--surface-contrast)" : toneColor,
      border: "1px solid transparent"
    },
    dot: {
      color: "var(--color-fg-muted)",
      backgroundColor: "transparent",
      border: "1px solid transparent",
      padding: "0.2rem 0"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      borderRadius: "var(--radius-pill)",
      padding: variant === "dot" ? "0.2rem 0" : "0.25rem 0.6rem",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-2xs)",
      fontWeight: "var(--weight-medium)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wider)",
      lineHeight: 1.3,
      whiteSpace: "nowrap",
      transition: "var(--transition-color)",
      ...variants[variant],
      ...style
    }
  }, rest), variant === "dot" && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      width: 7,
      height: 7
    }
  }, isLive && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: toneColor,
      opacity: 0.7,
      animation: "me-badge-ping 1.4s cubic-bezier(0,0,0.2,1) infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: toneColor
    }
  })), children, variant === "dot" && /*#__PURE__*/React.createElement("style", null, `@keyframes me-badge-ping{75%,100%{transform:scale(2.2);opacity:0}}`));
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Button — the brand's action primitive. Theme-aware: reads semantic tokens
 * so it renders correctly on both ink (dark) and paper (light) surfaces.
 *
 * - "primary": solid contrast-tone pill (ink-on-paper / paper-on-ink). The
 *   highest-emphasis action.
 * - "glass": flat charcoal/paper pill that lifts to a soft glassy state on
 *   hover — the hero/work CTA treatment.
 * - "secondary": hairline-outlined, transparent fill.
 * - "ghost": text-only affordance; hover fades opacity.
 * - "accent": filled with the active domain accent (--accent).
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  onClick,
  type = "button",
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const lit = hover && !disabled;
  const sizes = {
    sm: {
      padding: "0.5rem 0.95rem",
      fontSize: "0.8125rem"
    },
    md: {
      padding: "0.7rem 1.2rem",
      fontSize: "0.875rem"
    },
    lg: {
      padding: "0.9rem 1.6rem",
      fontSize: "0.9375rem"
    }
  };
  const base = {
    appearance: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--weight-semibold)",
    lineHeight: 1.25,
    letterSpacing: "0.02em",
    display: fullWidth ? "flex" : "inline-flex",
    width: fullWidth ? "100%" : "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderRadius: "var(--radius-pill)",
    opacity: disabled ? 0.4 : 1,
    transition: "var(--transition-hover)",
    ...sizes[size]
  };
  const variants = {
    primary: {
      color: "var(--on-contrast)",
      backgroundColor: "var(--surface-contrast)",
      border: "1px solid transparent",
      transform: lit ? "translateY(-1px)" : "none",
      boxShadow: lit ? "var(--shadow-card-hover)" : "none",
      opacity: disabled ? 0.4 : lit ? 0.92 : 1
    },
    glass: {
      color: "var(--color-fg)",
      backgroundColor: lit ? "var(--color-bg-hover)" : "var(--color-bg-elevated)",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
      boxShadow: lit ? "inset 0 1px 0 var(--color-border-glass), var(--shadow-card-hover)" : "none",
      backdropFilter: lit ? "blur(14px) saturate(160%)" : "none"
    },
    secondary: {
      color: lit ? "var(--color-fg)" : "var(--color-fg-muted)",
      backgroundColor: "transparent",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)"
    },
    ghost: {
      color: lit ? "var(--color-fg)" : "var(--color-fg-muted)",
      backgroundColor: "transparent",
      border: "1px solid transparent",
      padding: size === "lg" ? "0.6rem 0.6rem" : "0.4rem 0.5rem"
    },
    accent: {
      color: "var(--accent-on)",
      backgroundColor: "var(--accent)",
      border: "1px solid transparent",
      transform: lit ? "translateY(-1px)" : "none",
      boxShadow: lit ? "var(--shadow-card-hover)" : "none",
      filter: lit ? "brightness(1.06)" : "none"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Card — surface container with the brand's hairline-border hover treatment.
 * Theme-aware: "elevated" and "panel" read semantic tokens and adapt to ink
 * or paper. "contrast" paints the opposite tone (a white diagram card on a
 * dark page, or an ink callout on a light page).
 */
function Card({
  children,
  surface = "elevated",
  hoverable = true,
  lift = false,
  padding = "1.5rem",
  radius = "var(--radius-lg)",
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const lit = hoverable && hover;
  const surfaces = {
    elevated: {
      backgroundColor: "var(--color-bg-elevated)",
      color: "var(--color-fg)",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)"
    },
    panel: {
      backgroundColor: "var(--color-bg-panel)",
      color: "var(--color-fg)",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
      boxShadow: lit ? "var(--shadow-card-hover)" : "none"
    },
    contrast: {
      backgroundColor: "var(--surface-contrast)",
      color: "var(--on-contrast)",
      border: "1px solid var(--color-border-glass)",
      boxShadow: "var(--shadow-float)"
    },
    bare: {
      backgroundColor: "transparent",
      color: "var(--color-fg)",
      border: lit ? "1px solid var(--color-border)" : "1px solid transparent"
    }
  };
  const shouldLift = (lift || surface === "panel") && lit;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: radius,
      padding,
      transform: shouldLift ? "translateY(-2px)" : "none",
      transition: "var(--transition-border), transform var(--duration-medium) var(--ease-out-expo), box-shadow var(--duration-medium) var(--ease-out-expo)",
      cursor: onClick ? "pointer" : "default",
      ...surfaces[surface],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Chip — flat capsule tag for skills, tech stacks, and dates. Theme-aware:
 * charcoal fill on ink, soft warm fill on paper, hairline border that brightens
 * on hover. Use Chip for neutral metadata tags; use Badge for status/category.
 */
function Chip({
  children,
  active = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const lit = hover || active;
  const interactive = typeof onClick === "function";
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem",
      borderRadius: "var(--radius-pill)",
      padding: "0.4rem 0.85rem",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      lineHeight: 1.2,
      letterSpacing: "var(--tracking-wide)",
      color: lit ? "var(--color-fg)" : "var(--color-fg-muted)",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
      backgroundColor: lit ? "var(--color-bg-hover)" : "var(--color-bg-elevated)",
      cursor: interactive ? "pointer" : "default",
      transition: "var(--transition-border), var(--transition-color), background-color var(--duration-fast) var(--ease-out-expo)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * IconButton — square/round affordance for a single glyph (play, share, menu,
 * close). Pass an inline SVG (stroke 2, currentColor) as children. Theme-aware.
 *
 * variant: "ghost" (default) | "outline" | "solid"
 */
function IconButton({
  children,
  label,
  variant = "ghost",
  size = 40,
  round = false,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const lit = hover && !disabled;
  const variants = {
    ghost: {
      color: lit ? "var(--color-fg)" : "var(--color-fg-muted)",
      backgroundColor: lit ? "var(--color-bg-hover)" : "transparent",
      border: "1px solid transparent"
    },
    outline: {
      color: lit ? "var(--color-fg)" : "var(--color-fg-muted)",
      backgroundColor: "transparent",
      border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)"
    },
    solid: {
      color: "var(--on-contrast)",
      backgroundColor: "var(--surface-contrast)",
      border: "1px solid transparent",
      opacity: lit ? 0.92 : 1
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      appearance: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: round ? "50%" : "var(--radius-sm)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transition: "var(--transition-hover)",
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionLabel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SectionLabel — the small uppercase eyebrow that titles every page band
 * ("Recent work", "Thoughts", "Processes"), optionally with a right-aligned
 * meta note ("02 projects"). The brand's primary structural typographic mark.
 */
function SectionLabel({
  children,
  meta = null,
  accent = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: meta ? "space-between" : "flex-start",
      gap: "1rem",
      width: "100%",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      fontWeight: accent ? "var(--weight-medium)" : "var(--weight-regular)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-widest)",
      color: accent ? "var(--text-accent)" : "var(--color-fg-muted)"
    }
  }, children), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--color-fg-subtle)"
    }
  }, meta));
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// components/feedback/LiveBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * LiveBadge — the "in motion" indicator from the Processes band: a mono,
 * tabular elapsed readout next to a pulsing green dot and "live" label.
 * Pass an `elapsed` string (e.g. "03mo 12d 06h") or any children.
 */
function LiveBadge({
  elapsed = "00mo 00d 00h",
  label = "live",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "1rem",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "1.25rem",
      fontVariantNumeric: "tabular-nums",
      color: "var(--color-fg-subtle)"
    }
  }, elapsed), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.375rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      width: 8,
      height: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "var(--live-green)",
      opacity: 0.75,
      animation: "me-ping 1.4s cubic-bezier(0,0,0.2,1) infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "var(--live-green)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.625rem",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wider)",
      color: "var(--live-green)"
    }
  }, label)), /*#__PURE__*/React.createElement("style", null, `@keyframes me-ping{75%,100%{transform:scale(2);opacity:0}}`));
}
Object.assign(__ds_scope, { LiveBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/LiveBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Input — hairline-bordered text field, theme-aware. Renders a single-line
 * input by default, or a textarea when `multiline`. Border brightens on
 * hover/focus to match the brand's quiet interaction language.
 */
function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  rows = 4,
  disabled = false,
  ariaLabel,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const lit = (focus || hover) && !disabled;
  const shared = {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-sm)",
    lineHeight: 1.5,
    color: "var(--color-fg)",
    backgroundColor: "var(--color-bg-elevated)",
    border: lit ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    padding: "0.65rem 0.85rem",
    outline: "none",
    opacity: disabled ? 0.5 : 1,
    transition: "var(--transition-border)",
    resize: multiline ? "vertical" : "none",
    ...style
  };
  const handlers = {
    value,
    onChange,
    placeholder,
    disabled,
    "aria-label": ariaLabel,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    ...rest
  };
  return multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    style: shared
  }, handlers)) : /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    style: shared
  }, handlers));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Select — the hairline-bordered dropdown from the Thoughts index ("Sort by").
 * A thin wrapper over a native <select> styled to the dark UI, with a custom
 * chevron. Border brightens on hover/focus.
 */
function Select({
  value,
  onChange,
  options = [],
  ariaLabel,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "inline-flex",
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange,
    "aria-label": ariaLabel,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onMouseEnter: () => setFocused(true),
    onMouseLeave: () => setFocused(false),
    style: {
      appearance: "none",
      WebkitAppearance: "none",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--color-fg)",
      backgroundColor: "var(--color-bg-elevated)",
      border: focused ? "1px solid var(--color-border-hover)" : "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
      padding: "0.5rem 2.25rem 0.5rem 0.75rem",
      outline: "none",
      cursor: "pointer",
      transition: "var(--transition-border)"
    }
  }, rest), options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      right: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: "var(--color-fg-muted)",
      fontSize: "0.7rem"
    }
  }, "\u25BE"));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Tabs — the brand's underline navigation. A row of wide-tracked labels with
 * a single moving rule beneath the active one. Used to switch content streams
 * (Videos / Writing / Design) on the studio surface. Controlled or uncontrolled.
 *
 * items: Array<{ id, label, count? }>
 */
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  style = {},
  ...rest
}) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? internal;
  const select = id => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: "flex",
      gap: "1.75rem",
      borderBottom: "1px solid var(--color-border)",
      ...style
    }
  }, rest), items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement(Tab, {
      key: it.id,
      item: it,
      active: on,
      onSelect: () => select(it.id)
    });
  }));
}
function Tab({
  item,
  active,
  onSelect
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": active,
    onClick: onSelect,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      appearance: "none",
      background: "none",
      border: "none",
      cursor: "pointer",
      position: "relative",
      padding: "0 0 0.9rem",
      marginBottom: -1,
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wider)",
      color: active ? "var(--color-fg)" : hover ? "var(--color-fg)" : "var(--color-fg-muted)",
      transition: "var(--transition-color)"
    }
  }, item.label, item.count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-2xs)",
      color: "var(--color-fg-subtle)",
      fontVariantNumeric: "tabular-nums"
    }
  }, item.count), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: -1,
      height: 2,
      background: "var(--color-fg)",
      transform: active ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left",
      transition: "transform var(--duration-medium) var(--ease-out-expo)"
    }
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/components.jsx
try { (() => {
/* Portfolio UI kit — shared chrome & cards. Composes the DS primitives.
   Primitives come from window.MehmetErgulDesignSystem_61b8ed (loaded in index.html). */

const DS = window.MehmetErgulDesignSystem_61b8ed;
const {
  Button,
  Chip,
  Card,
  SectionLabel,
  LiveBadge,
  Select
} = DS;

/* ——— Fixed glass header ——— */
function SiteHeader({
  route,
  onNavigate,
  light
}) {
  const links = [{
    id: "home",
    label: "work"
  }, {
    id: "thoughts",
    label: "thoughts"
  }, {
    id: "about",
    label: "about"
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "absolute",
      insetInline: 24,
      top: 16,
      height: 64,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      borderRadius: "var(--radius-lg)",
      border: light ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
      background: light ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.22)",
      boxShadow: "var(--shadow-header)",
      backdropFilter: "var(--blur-glass)",
      WebkitBackdropFilter: "var(--blur-glass)",
      transition: "var(--transition-hover)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onNavigate("home"),
    style: {
      fontSize: 18,
      fontWeight: 500,
      letterSpacing: "0.08em",
      cursor: "pointer",
      color: light ? "#121212" : "var(--color-fg)"
    }
  }, "M\xB7E"), /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      listStyle: "none",
      margin: 0,
      padding: 0,
      gap: 28,
      fontSize: 13,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: light ? "#121212" : "var(--color-fg)"
    }
  }, links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.id
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate(l.id),
    style: {
      cursor: "pointer",
      opacity: route === l.id ? 1 : 0.78,
      transition: "opacity var(--duration-fast) var(--ease-out-expo)"
    },
    onMouseEnter: e => e.currentTarget.style.opacity = 0.55,
    onMouseLeave: e => e.currentTarget.style.opacity = route === l.id ? 1 : 0.78
  }, l.label))))));
}

/* ——— Footer ——— */
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "1px solid var(--color-border)",
      padding: "40px var(--page-inset)",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--color-fg-muted)",
      fontSize: 14
    }
  }, "Mehmet Ergul, 2023\u20132026 \u2014 All Rights Reserved"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: "var(--color-fg-muted)",
      fontSize: 14,
      cursor: "pointer",
      textTransform: "capitalize"
    }
  }, "linkedin"));
}

/* ——— Hero (dark cinematic backdrop in place of looping video) ——— */
function Hero() {
  const body = "I enjoy participating in our civilization through designing experiences, tinkering with AI, solving business problems, and building products.";
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "flex-end",
      overflow: "hidden",
      background: "radial-gradient(120% 90% at 70% 10%, #1c1c1f 0%, #0e0e0e 55%, #080808 100%)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.55)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      width: "100%",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 32,
      padding: "0 36px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 14px",
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: "0.18em",
      color: "rgba(255,255,255,0.7)"
    }
  }, "Hi, Its Mehmet"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "clamp(2rem, 4vw, 3.75rem)",
      fontWeight: 300,
      lineHeight: 1.16,
      letterSpacing: "-0.02em",
      color: "#fff"
    }
  }, body)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "28",
    height: "42",
    viewBox: "0 0 28 42",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1.25",
    y: "1.25",
    width: "25.5",
    height: "37.5",
    rx: "12.75",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "11.5",
    y: "9",
    width: "5",
    height: "8",
    rx: "2.5",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "y",
    values: "9;17;9",
    dur: "1.5s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.18em"
    }
  }, "Scroll"))));
}

/* ——— Work card (uses code's number-fallback for missing media) ——— */
function WorkCard({
  study,
  index,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(study),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "4 / 3",
      borderRadius: "var(--radius-xs)",
      overflow: "hidden",
      background: "var(--color-bg-elevated)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 72,
      fontWeight: 200,
      color: hover ? "var(--color-fg-muted)" : "var(--color-fg-subtle)",
      transform: hover ? "scale(1.02)" : "none",
      transition: "var(--transition-color), transform 0.7s var(--ease-out-expo)"
    }
  }, String(index + 1).padStart(2, "0"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 8px",
      fontSize: 24,
      fontWeight: 300,
      color: hover ? "var(--color-fg)" : "rgba(245,245,245,0.75)",
      transition: "var(--transition-color)"
    }
  }, study.client), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 460,
      fontSize: 14,
      lineHeight: 1.6,
      color: hover ? "rgba(245,245,245,0.9)" : "rgba(153,153,153,0.85)",
      transition: "var(--transition-color)"
    }
  }, study.title)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--color-fg-subtle)",
      flexShrink: 0
    }
  }, study.year)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, study.tags.map(t => /*#__PURE__*/React.createElement(Chip, {
    key: t
  }, t)))));
}

/* ——— Partner wordmark row ——— */
function PartnerRow({
  partners
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: 12
    }
  }, partners.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      aspectRatio: "1 / 1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--color-border)",
      background: "var(--color-bg-elevated)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 300,
      letterSpacing: "0.06em",
      color: "var(--color-fg-muted)",
      opacity: 0.85,
      textAlign: "center",
      padding: "0 8px"
    }
  }, p.name))), /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "1 / 1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-md)",
      border: "1px dashed var(--color-border)",
      color: "var(--color-fg-subtle)",
      fontSize: 13
    }
  }, "Many more"));
}

/* ——— Process (in-motion) card ——— */
function ProcessCard({
  project
}) {
  return /*#__PURE__*/React.createElement(Card, {
    surface: "elevated",
    padding: "2rem",
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: 260
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      borderRadius: "var(--radius-pill)",
      border: "1px solid var(--color-border)",
      padding: "4px 12px",
      fontSize: 12,
      letterSpacing: "0.04em",
      color: "var(--color-fg-subtle)"
    }
  }, project.locked && /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "18",
    height: "11",
    x: "3",
    y: "11",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 11V7a5 5 0 0 1 10 0v4"
  })), project.tag), /*#__PURE__*/React.createElement(LiveBadge, {
    elapsed: project.elapsed
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 16px",
      fontSize: 24,
      fontWeight: 300,
      color: "rgba(245,245,245,0.75)"
    }
  }, project.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.6,
      color: "rgba(153,153,153,0.85)"
    }
  }, project.description)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 32
    }
  }, project.stack.map(s => /*#__PURE__*/React.createElement(Chip, {
    key: s
  }, s))));
}

/* ——— Thought card (section + page variants) ——— */
function ThoughtCard({
  post,
  variant,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  if (variant === "page") {
    return /*#__PURE__*/React.createElement("article", {
      onClick: () => onOpen(post),
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "var(--radius-lg)",
        border: hover ? "1px solid rgba(153,153,153,0.35)" : "1px solid var(--color-border)",
        background: "#000",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "var(--shadow-card-hover)" : "none",
        transition: "var(--transition-hover)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        height: 300,
        background: post.cover
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.72))"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 18,
        background: "var(--color-bg-panel)",
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        lineHeight: 1.3,
        color: "var(--color-fg)"
      }
    }, post.title), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        fontSize: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--signal-orange)"
      }
    }, post.category), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--color-fg-subtle)"
      }
    }, "\xB7"), /*#__PURE__*/React.createElement(Chip, null, post.date))));
  }
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(post),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      cursor: "pointer",
      display: "flex",
      gap: 20,
      minHeight: 200,
      padding: 10,
      borderRadius: "var(--radius-md)",
      border: hover ? "1px solid rgba(153,153,153,0.3)" : "1px solid var(--color-border)",
      background: hover ? "rgba(26,26,26,0.4)" : "rgba(26,26,26,0.25)",
      transition: "var(--transition-hover)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "40%",
      maxWidth: 200,
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      background: post.cover
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.7))"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 12,
      padding: "16px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: "var(--color-fg-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", null, post.category), /*#__PURE__*/React.createElement("span", null, post.date)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 20,
      fontWeight: 300,
      lineHeight: 1.35,
      color: hover ? "var(--color-fg)" : "rgba(245,245,245,0.75)",
      transition: "var(--transition-color)"
    }
  }, post.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.55,
      color: "rgba(153,153,153,0.85)"
    }
  }, post.excerpt)));
}
Object.assign(window, {
  SiteHeader,
  SiteFooter,
  Hero,
  WorkCard,
  PartnerRow,
  ProcessCard,
  ThoughtCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/screens.jsx
try { (() => {
/* Portfolio UI kit — screen compositions + sample content. */

const DSx = window.MehmetErgulDesignSystem_61b8ed;
const {
  Button: B,
  Chip: C,
  Card: Cd,
  SectionLabel: SL,
  Select: Sel
} = DSx;
const CASE_STUDIES = [{
  id: "beta",
  client: "Enriching Data with AI",
  year: "2024–2025",
  title: "An AI-powered production tool for enriching free-text data, designed and shipped as a headline platform feature in 12 weeks.",
  tags: ["AI", "Product Design"]
}, {
  id: "gamma",
  client: "Building a Classical Music Platform",
  year: "December, 2025",
  title: "Younison helps classical musicians showcase verified auditions, receive expert feedback with YNS scoring, and connect with orchestras worldwide.",
  tags: ["Strategy", "Product Management", "Design Direction"]
}];
const PARTNERS = [{
  id: "northlight",
  name: "Northlight"
}, {
  id: "arcform",
  name: "Arcform"
}, {
  id: "fieldwork",
  name: "Fieldwork"
}, {
  id: "kestrel",
  name: "Kestrel & Co"
}, {
  id: "atelier",
  name: "Atelier Nova"
}];
const PROCESSES = [{
  tag: "Client Work · Confidential",
  locked: true,
  title: "Registry Workbench",
  description: "Letting analysts author governed functions and transformations in plain language.",
  stack: ["Python", "AI/ML"],
  elapsed: "03mo 12d 06h"
}, {
  tag: "iOS App · Confidential",
  locked: true,
  title: "Rotivo",
  description: "Solo bootstrapping a Swift app that makes vehicle ownership part of your investment/liability balance.",
  stack: ["Swift", "SwiftUI"],
  elapsed: "03mo 04d 18h"
}, {
  tag: "Tinkering",
  locked: false,
  title: "OpenClaw",
  description: "Tinkering with OpenClaw on editing long-form video creation through DaVinci Resolve.",
  stack: ["DaVinci Resolve", "Video"],
  elapsed: "04mo 09d 02h"
}];
const THOUGHTS = [{
  id: "design-system-case",
  title: "Approaching Design Systems in a Scale-up",
  category: "Design Systems",
  date: "June, 2023",
  excerpt: "Most teams invest in a design system to improve UX. That's the wrong reason, and it's why most of them fail.",
  cover: "radial-gradient(120% 100% at 30% 20%, #2a2320, #0c0c0c)",
  lede: "Most teams invest in a design system to improve UX. That's the wrong reason, and it's why most of them fail."
}, {
  id: "designer-as-input",
  title: "Design(er) as an Input",
  category: "Design Leadership",
  date: "February, 2024",
  excerpt: "Adaptive leadership in design isn't about running better critiques. It's about building a team where each person is the key to someone else's lock.",
  cover: "radial-gradient(120% 100% at 70% 30%, #241f2a, #0c0c0c)",
  lede: "Adaptive leadership in design isn't about running better critiques. It's about building a team where each person is the key to someone else's lock."
}, {
  id: "ux-leadership",
  title: "Thoughts Around Running a Design Function",
  category: "Design Leadership",
  date: "December, 2025",
  excerpt: "UX impact is often invisible to the business, not because it doesn't exist, but because no one built the system to surface it.",
  cover: "radial-gradient(120% 100% at 50% 20%, #1f262a, #0c0c0c)",
  lede: "UX impact is often invisible to the business, not because it doesn't exist, but because no one built the system to surface it."
}];
const PAGE = {
  padding: "var(--section-pad-y) var(--page-inset)"
};

/* ——— HOME ——— */
function HomeScreen({
  onOpenWork,
  onOpenThought
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement("section", {
    style: PAGE
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement(SL, {
    meta: "02 projects"
  }, "Recent work")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "48px 32px"
    }
  }, CASE_STUDIES.map((s, i) => /*#__PURE__*/React.createElement(WorkCard, {
    key: s.id,
    study: s,
    index: i,
    onOpen: onOpenWork
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(SL, null, "Collaborated with")), /*#__PURE__*/React.createElement(PartnerRow, {
    partners: PARTNERS
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...PAGE,
      borderTop: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement(SL, null, "Processes"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontSize: 14,
      color: "var(--color-fg-subtle)"
    }
  }, "Work that is currently in motion.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24
    }
  }, PROCESSES.map(p => /*#__PURE__*/React.createElement(ProcessCard, {
    key: p.title,
    project: p
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...PAGE,
      borderTop: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: 24,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SL, null, "Thoughts"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontSize: 14,
      color: "var(--color-fg-subtle)"
    }
  }, "Articles I write on design, product, and technology.")), /*#__PURE__*/React.createElement(B, {
    variant: "ghost"
  }, "View all \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 28
    }
  }, THOUGHTS.map(p => /*#__PURE__*/React.createElement(ThoughtCard, {
    key: p.id,
    post: p,
    variant: "section",
    onOpen: onOpenThought
  })))), /*#__PURE__*/React.createElement(ContactBand, null));
}
function ContactBand() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...PAGE,
      borderTop: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement(SL, null, "Contact")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "clamp(2rem, 4vw, 3.75rem)",
      fontWeight: 300,
      lineHeight: 1.25,
      letterSpacing: "-0.02em",
      color: "var(--color-fg)"
    }
  }, "Let's talk."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "clamp(2rem, 4vw, 3.75rem)",
      fontWeight: 200,
      fontStyle: "italic",
      lineHeight: 1.25,
      color: "var(--color-fg-muted)"
    }
  }, "I'd love to hear from you.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 8px",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--color-fg-subtle)"
    }
  }, "General inquiries"), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 24,
      fontWeight: 300,
      color: "var(--color-fg)",
      cursor: "pointer"
    }
  }, "hello@studio.example")), /*#__PURE__*/React.createElement("a", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      color: "var(--color-fg-muted)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
  })), "LinkedIn"))));
}

/* ——— THOUGHTS INDEX ——— */
function ThoughtsScreen({
  onOpenThought
}) {
  const [sort, setSort] = React.useState("latest");
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...PAGE,
      paddingTop: 140
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexWrap: "wrap",
      gap: 24,
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "clamp(2rem, 5vw, 3.75rem)",
      fontWeight: 300,
      letterSpacing: "-0.02em",
      color: "var(--color-fg)"
    }
  }, "Thoughts"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      fontSize: 18,
      lineHeight: 1.55,
      color: "var(--color-fg-muted)"
    }
  }, "Articles I write on design, product, and technology.")), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontSize: 14,
      color: "var(--color-fg-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Sort by"), /*#__PURE__*/React.createElement(Sel, {
    ariaLabel: "Sort articles",
    value: sort,
    onChange: e => setSort(e.target.value),
    options: [{
      value: "latest",
      label: "Latest to oldest"
    }, {
      value: "reading-time",
      label: "Reading time"
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "40px 32px"
    }
  }, THOUGHTS.map(p => /*#__PURE__*/React.createElement(ThoughtCard, {
    key: p.id,
    post: p,
    variant: "page",
    onOpen: onOpenThought
  }))));
}

/* ——— ABOUT ——— */
const EXPERIENCE = [{
  role: "Staff Designer, AI & LLM Products",
  company: "Meridian Labs",
  period: "Mar 2024 — Present · Munich",
  summary: "Leading design direction and product architecture for AI tooling used by enterprise teams, from C-levels to analysts."
}, {
  role: "Senior Designer, Automation",
  company: "Northfield Systems",
  period: "May 2022 — Feb 2024 · Munich",
  summary: "Integrating an acquired automation platform into the core product; compliance work that unblocked enterprise sales."
}, {
  role: "Senior Product Designer",
  company: "Atelier Brandt",
  period: "Sep 2019 — Feb 2021 · Munich",
  summary: "Concept through evolution for B2B/B2C and SaaS ventures; design advocacy with executives and squads."
}, {
  role: "Product Designer",
  company: "Studio Lira",
  period: "Mar 2017 — Jun 2019 · Milan",
  summary: "Product and concept design for agritech and consumer electronics across multidisciplinary client work."
}];
function AboutScreen() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...PAGE,
      paddingTop: 140
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820,
      marginBottom: 80
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
      fontWeight: 300,
      lineHeight: 1.18,
      letterSpacing: "-0.02em",
      color: "var(--color-fg)"
    }
  }, "Designer focused on data, AI, and deep-technology products, from enterprise platforms to physical systems."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "32px 0 0",
      fontSize: 18,
      lineHeight: 1.7,
      color: "var(--color-fg-muted)"
    }
  }, "Collecting experience across multiple dimensions of the design discipline has allowed me to push its boundaries further. I think freely, and apply craft across different contexts. My expertise spans B2B and enterprise solutions, especially where data, automation, and LLM-driven complex experiences are brought to the surface.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(SL, null, "Experience")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, EXPERIENCE.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: 24,
      padding: "28px 0",
      borderTop: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 4px",
      fontSize: 18,
      fontWeight: 400,
      color: "var(--color-fg)"
    }
  }, e.company), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: "var(--color-fg-subtle)"
    }
  }, e.period)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 8px",
      fontSize: 16,
      color: "var(--color-fg)"
    }
  }, e.role), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.6,
      color: "var(--color-fg-muted)"
    }
  }, e.summary))))));
}

/* ——— ARTICLE READER (cinematic, rust accent) ——— */
function ArticleScreen({
  post,
  onBack
}) {
  const p = post || THOUGHTS[0];
  return /*#__PURE__*/React.createElement("article", {
    style: {
      padding: "140px var(--page-inset) 80px",
      maxWidth: 980,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: onBack,
    style: {
      cursor: "pointer",
      fontSize: 14,
      color: "var(--color-fg-muted)"
    }
  }, "\u2190 Back to thoughts"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      margin: "48px 0 24px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "var(--text-accent)"
    }
  }, p.category), /*#__PURE__*/React.createElement(C, null, p.date)), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: "-0.03em",
      color: "var(--color-fg)"
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "40px 0 64px",
      fontSize: 20,
      lineHeight: 1.68,
      color: "var(--color-fg-muted)",
      borderLeft: "3px solid var(--text-accent)",
      paddingLeft: 20
    }
  }, p.lede), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 24px",
      fontSize: 24,
      fontWeight: 700,
      color: "var(--color-fg)"
    }
  }, "The wrong reason"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-article)",
      lineHeight: 1.72,
      color: "var(--color-fg-muted)",
      marginBottom: 28
    }
  }, "A design system is infrastructure. Its first job is not prettier screens \u2014 it is to remove the cost of every decision a team makes twice. When you frame it as a UX initiative, you measure it against the wrong outcomes and starve it of the engineering partnership it needs to survive."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-article)",
      lineHeight: 1.72,
      color: "var(--color-fg-muted)",
      marginBottom: 28
    }
  }, "The teams that succeed treat the system as a product with its own users \u2014 the designers and engineers shipping on top of it \u2014 and they hold it to the same bar of adoption, reliability, and support."), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: "48px 0",
      fontSize: 22,
      fontStyle: "italic",
      lineHeight: 1.55,
      color: "var(--color-fg)",
      borderLeft: "3px solid var(--text-accent)",
      padding: "8px 0 8px 24px"
    }
  }, "Adoption is the only metric that matters. Everything else is a proxy."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20,
      margin: "48px 0"
    }
  }, ["Strategy", "Design", "Technology"].map((t, i) => /*#__PURE__*/React.createElement(Cd, {
    key: t,
    surface: "contrast",
    hoverable: false,
    padding: "1.5rem",
    style: {
      borderRadius: "var(--radius-xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "var(--signal-editorial)",
      marginBottom: 10
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: "var(--ink-950)"
    }
  }, t)))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 64,
      paddingTop: 32,
      borderTop: "0.5px solid var(--color-border)",
      fontSize: 13,
      color: "var(--color-fg-subtle)"
    }
  }, "Written by Mehmet Ergul \xB7 Sample article from the MEDKIT UI kit.")));
}
Object.assign(window, {
  HomeScreen,
  ThoughtsScreen,
  AboutScreen,
  ArticleScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/studio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Studio UI kit — a multi-domain content hub demonstrating the system across
   three streams: video (content), writing (blog), and design iterations.
   Composes DS primitives from the compiled bundle. */

const SDS = window.MehmetErgulDesignSystem_61b8ed;
const {
  Button,
  Badge,
  Chip,
  Avatar,
  IconButton,
  Card,
  Tabs,
  VideoCard,
  PostCard,
  IterationCard,
  VersionBadge
} = SDS;
const ICON = {
  search: /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })),
  bell: /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.3 21a1.94 1.94 0 0 0 3.4 0"
  }))
};

/* ——— Top bar ——— */
function StudioBar() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24,
      padding: "16px 28px",
      background: "color-mix(in srgb, var(--color-bg) 82%, transparent)",
      backdropFilter: "var(--blur-glass)",
      WebkitBackdropFilter: "var(--blur-glass)",
      borderBottom: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: "0.1em",
      color: "var(--color-fg)"
    }
  }, "M\xB7E"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      textTransform: "uppercase",
      letterSpacing: "0.18em",
      color: "var(--color-fg-muted)"
    }
  }, "Studio")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Search"
  }, ICON.search), /*#__PURE__*/React.createElement(IconButton, {
    label: "Notifications"
  }, ICON.bell), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm"
  }, "Subscribe"), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mehmet Ergul",
    size: 34
  })));
}

/* ——— Channel identity band ——— */
function StudioHero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      padding: "56px 28px 40px",
      background: "radial-gradient(120% 120% at 80% 0%, #1c1c1f 0%, #0e0e0e 55%, #080808 100%)",
      borderBottom: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 32,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "live",
    variant: "dot"
  }, "Publishing weekly"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "44 works")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "var(--display-md)",
      fontWeight: 300,
      lineHeight: 1.1,
      letterSpacing: "-0.03em",
      color: "#fff"
    }
  }, "Design, in motion and in writing."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px 0 0",
      maxWidth: 600,
      fontSize: 17,
      lineHeight: 1.6,
      color: "rgba(245,245,245,0.7)"
    }
  }, "Process videos, essays on design systems and leadership, and the raw iteration trails behind the work \u2014 one place, three streams.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "glass",
    iconLeft: /*#__PURE__*/React.createElement("span", null, "\u25B6")
  }, "Watch latest"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Subscribe"))));
}

/* ——— Stream: VIDEOS ——— */
const VIDEOS = [{
  id: "v1",
  title: "Designing an AI annotation tool in 12 weeks",
  meta: "24K views · 2 weeks ago",
  duration: "14:22",
  badge: "New",
  thumb: "radial-gradient(120% 100% at 30% 20%, #2a2320, #0c0c0c)"
}, {
  id: "v2",
  title: "How I run design critique without killing momentum",
  meta: "11K views · 1 month ago",
  duration: "09:41",
  thumb: "radial-gradient(120% 100% at 70% 30%, #241f2a, #0c0c0c)"
}, {
  id: "v3",
  title: "Editing long-form video in DaVinci Resolve",
  meta: "8.2K views · 1 month ago",
  duration: "22:08",
  thumb: "radial-gradient(120% 100% at 50% 20%, #1f262a, #0c0c0c)"
}, {
  id: "v4",
  title: "From Figma variables to shipped tokens",
  meta: "31K views · 2 months ago",
  duration: "17:55",
  thumb: "radial-gradient(120% 100% at 40% 60%, #26211a, #0c0c0c)"
}, {
  id: "v5",
  title: "A week designing at a scale-up",
  meta: "6.7K views · 3 months ago",
  duration: "12:30",
  thumb: "radial-gradient(120% 100% at 60% 40%, #1a2420, #0c0c0c)"
}, {
  id: "v6",
  title: "Prototyping motion that respects the brand",
  meta: "14K views · 3 months ago",
  duration: "08:12",
  thumb: "radial-gradient(120% 100% at 30% 70%, #2a2026, #0c0c0c)"
}];
function VideosStream() {
  const [featured, ...rest] = VIDEOS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 28,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(VideoCard, _extends({}, featured, {
    channel: "Mehmet Ergul"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "content"
  }, "Featured"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 28,
      fontWeight: 300,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      color: "var(--color-fg)"
    }
  }, featured.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--color-fg-muted)"
    }
  }, "A full build log \u2014 research, the 12-week sprint, and presenting it as the platform's headline AI feature to an audience of 4,000+."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Chip, null, "Enterprise"), /*#__PURE__*/React.createElement(Chip, null, "AI"), /*#__PURE__*/React.createElement(Chip, null, "Case study")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24
    }
  }, rest.map(v => /*#__PURE__*/React.createElement(VideoCard, _extends({
    key: v.id
  }, v, {
    channel: "Mehmet Ergul"
  })))));
}

/* ——— Stream: WRITING (demonstrates the paper theme) ——— */
const POSTS = [{
  id: "p1",
  category: "Design Systems",
  tone: "editorial",
  title: "Approaching Design Systems in a Scale-up",
  excerpt: "Most teams invest in a design system to improve UX. That's the wrong reason, and it's why most fail.",
  date: "June 2023",
  readingTime: "8 min read",
  cover: "radial-gradient(120% 100% at 30% 20%, #2a2320, #0c0c0c)"
}, {
  id: "p2",
  category: "Design Leadership",
  tone: "editorial",
  title: "Design(er) as an Input",
  excerpt: "Adaptive leadership isn't about better critiques. It's a team where each person is the key to someone else's lock.",
  date: "Feb 2024",
  readingTime: "6 min read",
  cover: "radial-gradient(120% 100% at 70% 30%, #241f2a, #0c0c0c)"
}, {
  id: "p3",
  category: "Craft",
  tone: "craft",
  title: "Notes on Designing Quiet Interfaces",
  excerpt: "Restraint is a feature. What you leave out is the work — a field guide to designing with near-nothing.",
  date: "Dec 2025",
  readingTime: "5 min read",
  cover: "radial-gradient(120% 100% at 50% 20%, #1f262a, #0c0c0c)"
}];
function WritingStream({
  onRead
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 28
    }
  }, POSTS.map(p => /*#__PURE__*/React.createElement(PostCard, _extends({
    key: p.id
  }, p, {
    onClick: () => onRead(p)
  }))));
}

/* A paper-themed reading panel — proves dual-tone with the same primitives */
function ReadingPanel({
  post,
  onClose
}) {
  const p = post || POSTS[0];
  return /*#__PURE__*/React.createElement("div", {
    "data-theme": "paper",
    style: {
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      border: "1px solid var(--color-border)",
      background: "var(--color-bg)",
      boxShadow: "var(--shadow-float)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 22px",
      borderBottom: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.16em",
      color: "var(--color-fg-subtle)"
    }
  }, "Reading \xB7 paper theme"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: onClose
  }, "Close \u2715")), /*#__PURE__*/React.createElement("article", {
    style: {
      maxWidth: 680,
      margin: "0 auto",
      padding: "44px 24px 52px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: p.tone
  }, p.category), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--color-fg-subtle)"
    }
  }, p.date, " \xB7 ", p.readingTime)), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "var(--display-sm)",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.03em",
      color: "var(--color-fg)"
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "28px 0 0",
      fontSize: "var(--text-article)",
      lineHeight: 1.72,
      color: "var(--color-fg-muted)",
      borderLeft: "3px solid var(--accent)",
      paddingLeft: 20
    }
  }, p.excerpt), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "28px 0 0",
      fontSize: "var(--text-article)",
      lineHeight: 1.72,
      color: "var(--color-fg-muted)"
    }
  }, "A design system is infrastructure. Its first job is not prettier screens \u2014 it is to remove the cost of every decision a team makes twice. Frame it as a UX initiative and you measure it against the wrong outcomes."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Mehmet Ergul",
    size: 40
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--color-fg)"
    }
  }, "Mehmet Ergul"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--color-fg-subtle)"
    }
  }, "Staff Product Designer")))));
}

/* ——— Stream: DESIGN ITERATIONS ——— */
const ITERATIONS = [{
  id: "i1",
  label: "First pass — full toolbar",
  version: "v1",
  status: "archived",
  note: "Every action visible. Too dense at small widths.",
  art: "linear-gradient(135deg,#23262b,#0c0c0c)"
}, {
  id: "i2",
  label: "Grouped actions",
  version: "v2",
  status: "explored",
  note: "Primary / secondary split. Better, still two rows.",
  art: "linear-gradient(135deg,#262329,#0c0c0c)"
}, {
  id: "i3",
  label: "Compact toolbar",
  version: "v3",
  status: "current",
  current: true,
  note: "Collapsed secondary into an overflow menu. Shipped.",
  art: "linear-gradient(135deg,#20262a,#0c0c0c)"
}];
function DesignStream() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 300,
      letterSpacing: "-0.02em",
      color: "var(--color-fg)"
    }
  }, "Annotation toolbar"), /*#__PURE__*/React.createElement(Badge, {
    tone: "craft"
  }, "3 iterations")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 640,
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--color-fg-muted)"
    }
  }, "The trail behind one component \u2014 what was tried, what was kept, and why. The current iteration carries the craft-accent border."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24
    }
  }, ITERATIONS.map(it => /*#__PURE__*/React.createElement(IterationCard, _extends({
    key: it.id
  }, it)))));
}
Object.assign(window, {
  StudioBar,
  StudioHero,
  VideosStream,
  WritingStream,
  ReadingPanel,
  DesignStream
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/studio.jsx", error: String((e && e.message) || e) }); }

__ds_ns.IterationCard = __ds_scope.IterationCard;

__ds_ns.PostCard = __ds_scope.PostCard;

__ds_ns.VersionBadge = __ds_scope.VersionBadge;

__ds_ns.VideoCard = __ds_scope.VideoCard;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.LiveBadge = __ds_scope.LiveBadge;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
