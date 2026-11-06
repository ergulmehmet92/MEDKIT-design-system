import { useId } from "react";
import type { ReactNode } from "react";
import { placeNote, placeRail, thinLabels } from "./layout";
import type { Box, Point } from "./layout";

const crisp = (v: number) => Math.round(v) + 0.5;

/**
 * Clips its children to the plot box, and reveals them from left to right as `reveal` goes 0 to 1.
 * Data marks go in here, so nothing draws outside the plot while a range glides.
 */
export function PlotLayer({ box, reveal = 1, children }: { box: Box; reveal?: number; children: ReactNode }) {
  const id = useId().replace(/:/g, "");
  return (
    <>
      <clipPath id={`${id}-clip`}>
        <rect x={box.x - 4} y={box.y - 8} width={Math.max(0, (box.width + 8) * reveal)} height={box.height + 16} />
      </clipPath>
      <g clipPath={`url(#${id}-clip)`}>{children}</g>
    </>
  );
}

/** Labels and notes fade in as the reveal finishes, so they never sit beside half-drawn lines. */
export const labelOpacity = (reveal: number) => Math.max(0, Math.min(1, (reveal - 0.55) / 0.45));

export type GridYProps = {
  ticks: number[];
  y: (value: number) => number;
  left: number;
  right: number;
  format?: (value: number) => string;
  /** A value drawn as the stronger reference line, such as 100 on an indexed chart, or zero. */
  reference?: number;
  referenceLabel?: string;
  /** Puts the reference label inside the plot's right edge, for plots with no right margin. */
  referenceInside?: boolean;
};

/** Horizontal gridlines. Labels sit on their line at the left, so the plot keeps its full width. */
export function GridY({ ticks, y, left, right, format = String, reference, referenceLabel, referenceInside = false }: GridYProps) {
  return (
    <g className="mk-chart-grid">
      {ticks.map((value) => {
        const isReference = reference !== undefined && Math.abs(value - reference) < 1e-9;
        const yy = crisp(y(value));
        return (
          <g key={value} data-reference={isReference ? "" : undefined}>
            <line x1={left} x2={right} y1={yy} y2={yy} />
            {isReference && referenceLabel ? null : (
              <text x={left} y={yy - 6}>
                {format(value)}
              </text>
            )}
          </g>
        );
      })}
      {reference !== undefined && referenceLabel ? (
        <g data-reference="">
          {ticks.includes(reference) ? null : <line x1={left} x2={right} y1={crisp(y(reference))} y2={crisp(y(reference))} />}
          <text className="mk-chart-halo" x={referenceInside ? right - 6 : right + 10} y={referenceInside ? y(reference) - 6 : y(reference) + 4} textAnchor={referenceInside ? "end" : "start"}>
            {referenceLabel}
          </text>
        </g>
      ) : null}
    </g>
  );
}

export type AxisXProps = {
  ticks: { x: number; label: string }[];
  /** Baseline of the labels. */
  y: number;
  /** Width of one label character, from useLabelAdvance. */
  advance: number;
  gap?: number;
  /** Left and right edges labels must stay within. A label that would cross one is aligned to it. */
  bounds?: [number, number];
};

/** Tick labels along the bottom, thinned evenly so they never touch. No axis line: the grid carries it. */
export function AxisX({ ticks, y, advance, gap = 16, bounds }: AxisXProps) {
  const shown = thinLabels(
    ticks.map((t) => t.x),
    ticks.map((t) => t.label.length * advance),
    gap,
  );
  const anchor = (t: { x: number; label: string }) => {
    if (!bounds) return "middle";
    const half = (t.label.length * advance) / 2;
    return t.x - half < bounds[0] ? "start" : t.x + half > bounds[1] ? "end" : "middle";
  };
  return (
    <g className="mk-chart-axis">
      {ticks.map((t, i) =>
        shown[i] ? (
          <text key={`${t.label}-${t.x}`} x={t.x} y={y} textAnchor={anchor(t)}>
            {t.label}
          </text>
        ) : null,
      )}
    </g>
  );
}

/** A vertical marker, such as today. */
export function MarkerLine({ x, top, bottom, label }: { x: number; top: number; bottom: number; label?: string }) {
  return (
    <g className="mk-chart-marker">
      <line x1={crisp(x)} x2={crisp(x)} y1={top} y2={bottom} />
      {label ? (
        <text className="mk-chart-halo" x={crisp(x) + 6} y={top + 16}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

/** A span of the x axis, such as a drawdown, as a quiet wash with its name. The name hides when the span is too narrow for it. */
export function RangeBand({ x0, x1, top, bottom, label, advance }: { x0: number; x1: number; top: number; bottom: number; label?: string; advance?: number }) {
  const width = Math.abs(x1 - x0);
  const fits = label && (advance === undefined || label.length * advance + 16 <= width);
  return (
    <g className="mk-chart-range">
      <rect x={Math.min(x0, x1)} y={top} width={width} height={Math.max(0, bottom - top)} />
      {fits ? (
        <text className="mk-chart-halo" x={Math.min(x0, x1) + 8} y={top + 18}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

/**
 * Measures a gap between two values at one x, such as a fall from a peak. `from` is where the
 * measurement starts; a hairline runs back to it from `fromX`.
 */
export function Bracket({ x, from, to, fromX, label }: { x: number; from: number; to: number; fromX?: number; label: string }) {
  const bx = crisp(x);
  return (
    <g className="mk-chart-bracket">
      {fromX !== undefined ? <line x1={fromX} x2={bx} y1={crisp(from)} y2={crisp(from)} /> : null}
      <path d={`M${bx - 4} ${crisp(from)}H${bx}V${crisp(to)}H${bx - 4}`} />
      <text className="mk-chart-value mk-chart-strong mk-chart-halo" x={bx - 8} y={(from + to) / 2 + 5} textAnchor="end">
        {label}
      </text>
    </g>
  );
}

export type NoteProps = {
  /** The point the note is about. */
  anchor: Point;
  lines: string[];
  /** Data points to keep clear of. */
  avoid: Point[];
  bounds: Box;
  /** Width of the longest line, in pixels. */
  width: number;
  lineHeight: number;
};

/** One annotation in running text, ringed at its point and joined by a leader, placed where it covers the least data. */
export function Note({ anchor, lines, avoid, bounds, width, lineHeight }: NoteProps) {
  const height = lines.length * lineHeight;
  const spot = placeNote(anchor, { width, height }, avoid, bounds);
  if (!spot) return null;
  const right = spot.x > anchor.x;
  const below = spot.y > anchor.y;
  const end = { x: right ? spot.x - 6 : spot.x + width + 6, y: below ? spot.y + 4 : spot.y + height - 4 };
  const angle = Math.atan2(end.y - anchor.y, end.x - anchor.x);
  return (
    <g className="mk-chart-note">
      <circle cx={anchor.x} cy={anchor.y} r={9} />
      <line x1={anchor.x + 9 * Math.cos(angle)} y1={anchor.y + 9 * Math.sin(angle)} x2={end.x} y2={end.y} />
      <text className="mk-chart-halo">
        {lines.map((line, i) => (
          <tspan key={i} x={spot.x} y={spot.y + (i + 0.8) * lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export type ChartEvent = { id: string; x: number; label: string; when: "past" | "next" };

export type EventRailProps = {
  events: ChartEvent[];
  /** Baseline of the first row, just above the plot. */
  y: number;
  /** Bottom of the plot, where each event's guide ends. */
  bottom: number;
  rows?: number;
  advance: number;
  /** Right edge labels must stay inside. */
  limit: number;
  /** An event to emphasise, such as the one under the crosshair. */
  active?: string;
  size?: number;
};

/**
 * Events as diamonds on a rail above the plot: filled for past, hollow for upcoming, so the
 * difference never rests on colour. Labels take the first row with room and otherwise drop to the
 * tooltip.
 */
export function EventRail({ events, y, bottom, rows = 1, advance, limit, active, size = 5 }: EventRailProps) {
  const sorted = [...events].sort((a, b) => a.x - b.x);
  const placed = placeRail(
    sorted.map((e) => ({ x: e.x, width: e.label.length * advance })),
    { rows, mark: size, gap: 12, limit },
  );
  const rowY = (row: number) => y - row * 22;
  return (
    <g className="mk-chart-events">
      {sorted.map((e, i) => {
        const row = placed[i];
        const ex = crisp(e.x);
        return (
          <g key={e.id} className="mk-chart-event" data-when={e.when} data-active={active === e.id ? "" : undefined}>
            <line className="mk-chart-guide" x1={ex} x2={ex} y1={y + size + 2} y2={bottom} />
            {row > 0 ? <line className="mk-chart-guide" x1={ex} x2={ex} y1={rowY(row) + 6} y2={y - size - 2} /> : null}
            <path d={`M${e.x} ${y - size}l${size} ${size}l${-size} ${size}l${-size} ${-size}Z`} />
            {row >= 0 ? (
              <text x={row === 0 ? e.x + size + 4 : e.x + 4} y={rowY(row) + 4}>
                {e.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

/**
 * A series' last point, with its name in muted ink and its value in strong ink. The colour stays on
 * the dot. `side="start"` puts the text before the dot, for a point near the right edge.
 */
export function EndLabel({ x, y, name, value, colour, dy = 4, side = "end" }: { x: number; y: number; name: string; value: string; colour: string; dy?: number; side?: "start" | "end" }) {
  return (
    <g className="mk-chart-end">
      <circle className="mk-chart-dot" cx={x} cy={y} r={4} style={{ fill: colour }} />
      <text className="mk-chart-value mk-chart-halo" x={side === "end" ? x + 10 : x - 10} y={y + dy} textAnchor={side === "end" ? "start" : "end"}>
        {name} <tspan className="mk-chart-strong">{value}</tspan>
      </text>
    </g>
  );
}

/** A categorical slot's colour. Slots run 1 to 8, in the approved order. */
export const slotColour = (slot: number) => `var(--mk-color-dataviz-category-${slot})`;
/** Context series, such as a benchmark, wear muted ink instead of a slot. */
export const CONTEXT_COLOUR = "var(--mk-color-text-muted)";

export type MarkerShape = "circle" | "square" | "triangle" | "down";
const SHAPES: MarkerShape[] = ["circle", "square", "triangle", "down"];
/** The shape for a slot, so five or more series can be told apart without colour. */
export const slotShape = (slot: number): MarkerShape => SHAPES[(slot - 1) % SHAPES.length];

export function markerPath(shape: MarkerShape, x: number, y: number, r: number): string {
  switch (shape) {
    case "circle":
      return `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
    case "square":
      return `M${x - r * 0.9} ${y - r * 0.9}h${r * 1.8}v${r * 1.8}h${-r * 1.8}Z`;
    case "triangle":
      return `M${x} ${y - r * 1.1}l${r * 1.1} ${r * 1.9}h${-r * 2.2}Z`;
    case "down":
      return `M${x} ${y + r * 1.1}l${r * 1.1} ${-r * 1.9}h${-r * 2.2}Z`;
  }
}

/** A series mark in its slot's shape, ringed in the surface colour. */
export function SeriesMarker({ x, y, shape = "circle", colour, r = 4 }: { x: number; y: number; shape?: MarkerShape; colour: string; r?: number }) {
  return <path className="mk-chart-dot" d={markerPath(shape, x, y, r)} style={{ fill: colour }} />;
}
