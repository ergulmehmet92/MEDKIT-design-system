import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import motion from "../dist/tokens/motion.json";

/** Reads a token's computed value inside the docs page, so the page always shows what the kit ships. */
function useToken(name: string) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).getPropertyValue(`--mk-${name}`).trim());
  }, [name]);
  return { ref, value };
}

const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))", gap: 16, margin: "16px 0 32px" };
const mono: CSSProperties = { fontFamily: "var(--mk-font-family-label)", fontSize: 12, letterSpacing: "0.04em" };

function Swatch({ token, note }: { token: string; note?: string }) {
  const { ref, value } = useToken(token);
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <span ref={ref} style={{ blockSize: 56, borderRadius: 10, background: `var(--mk-${token})`, boxShadow: "inset 0 0 0 1px color-mix(in srgb, currentColor 18%, transparent)" }} />
      <span style={mono}>{token.replace(/^color-/, "")}</span>
      {note ? <span style={{ fontSize: 13, opacity: 0.75 }}>{note}</span> : null}
      <span style={{ ...mono, opacity: 0.6 }}>{value.length > 40 ? value.slice(0, 40) + "…" : value}</span>
    </div>
  );
}

/** A grid of colour tokens, each with its role and live value. */
export function Swatches({ tokens }: { tokens: [string, string?][] }) {
  return (
    <div style={grid}>
      {tokens.map(([t, n]) => (
        <Swatch key={t} token={t} note={n} />
      ))}
    </div>
  );
}

/** Shows the same content in both themes side by side. */
export function BothThemes({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: 16, margin: "16px 0 32px" }}>
      {(["forest", "paper"] as const).map((theme) => (
        <div key={theme} data-theme={theme} style={{ padding: 20, borderRadius: 14, background: "var(--mk-color-surface-default)", color: "var(--mk-color-text-default)" }}>
          <p style={{ ...mono, margin: "0 0 12px", textTransform: "uppercase", opacity: 0.7 }}>{theme}</p>
          {children}
        </div>
      ))}
    </div>
  );
}

/** Type sizes in both densities, set in the face they belong to. */
export function TypeScale({ roles }: { roles: [string, string][] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))", gap: 16, margin: "16px 0 32px" }}>
      {(["editorial", "analytical"] as const).map((density) => (
        <div key={density} data-density={density} style={{ display: "grid", gap: 12 }}>
          <p style={{ ...mono, margin: 0, textTransform: "uppercase", opacity: 0.7 }}>{density}</p>
          {roles.map(([role, sample]) => (
            <div key={role} style={{ display: "grid", gap: 2 }}>
              <span style={{ fontSize: `var(--mk-font-size-${role})`, fontFamily: role === "label" ? "var(--mk-font-family-label)" : "var(--mk-font-family-body)", lineHeight: 1.1, letterSpacing: role === "label" ? "var(--mk-tracking-label)" : undefined, textTransform: role === "label" ? "uppercase" : undefined }}>{sample}</span>
              <span style={{ ...mono, opacity: 0.6 }}>font.size.{role}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** The motion scale from motion.json, with a dot travelling each duration on its easing. */
export function MotionScale() {
  const [run, setRun] = useState(0);
  return (
    <div style={{ display: "grid", gap: 10, margin: "16px 0 32px" }}>
      <button type="button" className="mk-button" data-variant="quiet" style={{ justifySelf: "start" }} onClick={() => setRun((n) => n + 1)}>
        Replay
      </button>
      {Object.entries(motion.duration).map(([name, ms]) => (
        <div key={name} style={{ display: "grid", gridTemplateColumns: "10rem 4rem 1fr", gap: 12, alignItems: "center" }}>
          <span style={mono}>{name}</span>
          <span style={{ ...mono, opacity: 0.6 }}>{ms}ms</span>
          <span style={{ position: "relative", blockSize: 2, background: "var(--mk-color-border-default)" }}>
            <i
              key={run}
              style={{
                position: "absolute",
                insetBlockStart: -4,
                inlineSize: 10,
                blockSize: 10,
                borderRadius: "50%",
                background: "var(--mk-color-text-default)",
                animation: `mk-docs-travel ${ms}ms cubic-bezier(${motion.easing.default.join(",")}) both`,
              }}
            />
          </span>
        </div>
      ))}
      <style>{"@keyframes mk-docs-travel { from { inset-inline-start: 0 } to { inset-inline-start: calc(100% - 10px) } } @media (prefers-reduced-motion: reduce) { [style*='mk-docs-travel'] { animation: none !important; inset-inline-start: calc(100% - 10px) } }"}</style>
    </div>
  );
}
