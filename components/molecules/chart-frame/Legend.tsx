import type { ComponentPropsWithoutRef } from "react";
import { markerPath } from "./parts";
import type { MarkerShape } from "./parts";
import "./chart-frame.css";

export type LegendKey = "line" | "context" | "forecast" | "area" | "range" | "past" | "next" | "rise" | "fall";
export type LegendItem = { label: string; key: LegendKey; colour?: string; marker?: MarkerShape };

export type LegendProps = Omit<ComponentPropsWithoutRef<"ul">, "children"> & { items: LegendItem[] };

function Key({ kind, colour, marker }: { kind: LegendKey; colour?: string; marker?: MarkerShape }) {
  const stroke = colour ?? "currentColor";
  switch (kind) {
    case "line":
      return (
        <>
          <line x1="1" y1="7" x2="21" y2="7" style={{ stroke }} strokeWidth="2" strokeLinecap="round" />
          {marker ? <path className="mk-chart-dot" d={markerPath(marker, 11, 7, 3.5)} style={{ fill: stroke }} /> : null}
        </>
      );
    case "context":
      return <line x1="1" y1="7" x2="21" y2="7" className="mk-chart-context-key" strokeWidth="1.5" strokeLinecap="round" />;
    case "forecast":
      return (
        <>
          <rect x="0" y="0" width="22" height="14" rx="2" style={{ fill: `color-mix(in oklab, ${stroke} 10%, transparent)` }} />
          <rect x="0" y="3.5" width="22" height="7" style={{ fill: `color-mix(in oklab, ${stroke} 22%, transparent)` }} />
          <line x1="2" y1="7" x2="20" y2="7" style={{ stroke }} strokeWidth="2.5" strokeDasharray="0.5 5" strokeLinecap="round" />
        </>
      );
    case "area":
      return <rect x="0" y="0" width="22" height="14" rx="2" style={{ fill: stroke }} />;
    case "range":
      return <rect x="0.5" y="0.5" width="21" height="13" rx="2" className="mk-chart-range-key" />;
    case "rise":
    case "fall":
      return (
        <>
          <line x1="11" y1="0.5" x2="11" y2="13.5" style={{ stroke }} strokeWidth="1" />
          <rect x="7.5" y="3.5" width="7" height="7" className="mk-chart-candle-key" data-direction={kind} style={{ stroke, fill: kind === "fall" ? stroke : undefined }} />
        </>
      );
    case "past":
    case "next":
      return <path d="M11 2l5 5l-5 5l-5 -5Z" className="mk-chart-event-key" data-when={kind} />;
  }
}

/** Names every series. Each key mirrors its mark, so identity never rests on colour alone. */
export function Legend({ items, className, ...rest }: LegendProps) {
  return (
    <ul className={className ? `mk-chart-legend ${className}` : "mk-chart-legend"} {...rest}>
      {items.map((item) => (
        <li key={`${item.key}-${item.label}`}>
          <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
            <Key kind={item.key} colour={item.colour} marker={item.marker} />
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
