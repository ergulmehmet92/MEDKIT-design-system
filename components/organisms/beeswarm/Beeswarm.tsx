import { quantile } from "d3-array";
import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ACCENT_COLOUR,
  CONTEXT_COLOUR,
  ChartFigure,
  ChartPlot,
  ChartTable,
  LEAD_COLOUR,
  Legend,
  labelOpacity,
  useChartViewport,
  useCrosshair,
} from "../../molecules/chart-frame";
import type { LegendItem } from "../../molecules/chart-frame";
import "./beeswarm.css";

export type BeeswarmGroup = { id: string; name: string; values: number[]; highlight?: boolean };

export type BeeswarmProps = {
  title: ReactNode;
  label: string;
  groups: BeeswarmGroup[];
  /** A value drawn as the stronger line, such as zero. Zero gets one when values cross it. */
  reference?: number;
  /** Marks each group's median. */
  showMedian?: boolean;
  format?: (value: number) => string;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

type Dot = { x: number; dy: number; v: number };

/**
 * Places dots along a row so none overlap, each as close to the middle as it can sit. When the row
 * runs out of room, dots shrink; past the smallest size they overlap, faintly, so thousands still draw.
 */
export function swarm(xs: { x: number; v: number }[], radius: number, halfHeight: number): { dots: Dot[]; radius: number; packed: boolean } {
  const sorted = [...xs].sort((a, b) => a.x - b.x);
  const span = sorted.length ? sorted[sorted.length - 1].x - sorted[0].x : 0;
  for (let r = radius; r >= 1.5; r -= 0.5) {
    // Skip sizes that can't possibly fit, so thousands of values don't try every size in full.
    if (sorted.length * (r * 2 + 1) ** 2 > (span + r * 2) * halfHeight * 2 * 0.8) continue;
    const dots: Dot[] = [];
    let fits = true;
    for (const p of sorted) {
      let placed: number | null = null;
      for (let k = 0; k < 400; k++) {
        const dy = (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (r * 0.5);
        if (Math.abs(dy) > halfHeight - r) break;
        let clear = true;
        for (let j = dots.length - 1; j >= 0 && p.x - dots[j].x < r * 2 + 1; j--) {
          if (Math.hypot(p.x - dots[j].x, dy - dots[j].dy) < r * 2 + 1) {
            clear = false;
            break;
          }
        }
        if (clear) {
          placed = dy;
          break;
        }
      }
      if (placed === null) {
        fits = false;
        break;
      }
      dots.push({ x: p.x, dy: placed, v: p.v });
    }
    if (fits) return { dots, radius: r, packed: true };
  }
  // Too many to separate: a faint strip, spread evenly up and down the row.
  return { dots: sorted.map((p, k) => ({ x: p.x, v: p.v, dy: (((k * 0.618) % 1) * 2 - 1) * (halfHeight - 2) })), radius: 1.5, packed: false };
}

/**
 * Every value as a dot, one row per group: the subject group in the accent, the rest in grey, with
 * each group's median marked. Hovering reads the nearest dot; the keyboard reads each group.
 */
export function Beeswarm({ title, label, groups, reference, showMedian = true, format = (v) => String(Math.round(v * 100) / 100).replace("-", "−"), titleAs, eyebrow, description, caption, tableCaption, emptyText = "No data to show yet.", keys }: BeeswarmProps) {
  const live = useMemo(() => groups.map((g) => ({ ...g, values: g.values.filter(Number.isFinite).sort((a, b) => a - b) })).filter((g) => g.values.length), [groups]);
  const all = live.flatMap((g) => g.values);
  const anyHighlight = live.some((g) => g.highlight);
  const colourOf = (g: BeeswarmGroup) => (anyHighlight ? (g.highlight ? ACCENT_COLOUR : CONTEXT_COLOUR) : LEAD_COLOUR);
  const target = useMemo(() => {
    let lo = Math.min(...all, reference ?? Infinity);
    let hi = Math.max(...all, reference ?? -Infinity);
    if (!Number.isFinite(lo)) [lo, hi] = [0, 1];
    if (lo === hi) [lo, hi] = [lo - 1, hi + 1];
    const [y0, y1] = scaleLinear().domain([lo, hi]).nice(5).domain();
    return { i0: 0, i1: 1, y0, y1 };
  }, [all.join(","), reference]); // eslint-disable-line react-hooks/exhaustive-deps
  const { plotRef, size, density, reveal, advance, view } = useChartViewport(target, { width: 520, height: 300 });
  const dense = density === "analytical";
  const nameColumn = Math.min(size.width * 0.28, Math.max(...live.map((g) => g.name.length * advance), 30) + 16);
  const m = { t: 8, b: 24, l: nameColumn, r: 8 };
  const x = scaleLinear().domain([view.y0, view.y1]).range([m.l, size.width - m.r]);
  const row = (size.height - m.t - m.b) / Math.max(1, live.length);
  const centre = (k: number) => m.t + row * (k + 0.5);
  const ref = reference ?? (view.y0 < 0 && view.y1 > 0 ? 0 : undefined);
  const placed = useMemo(() => live.map((g) => swarm(g.values.map((v) => ({ x: x(v), v })), dense ? 3.5 : 4.5, row / 2 - (showMedian ? 10 : 2))), [live, size.width, size.height, view.y0, view.y1, dense, row, showMedian]); // eslint-disable-line react-hooks/exhaustive-deps
  const med = (g: BeeswarmGroup) => quantile(g.values, 0.5) ?? 0;

  const describe = useCallback((k: number) => {
    const g = live[k];
    return `${g.name}. ${g.values.length} values, median ${format(med(g))}, from ${format(g.values[0])} to ${format(g.values[g.values.length - 1])}.`;
  }, [live]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useCrosshair({ min: 0, max: Math.max(0, live.length - 1), start: 0, axis: "y", indexAt: (py) => Math.floor((py - m.t) / row), describe, stride: 1 });

  if (!live.length) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Group" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  const legend: LegendItem[] = [...live.map((g) => ({ label: g.name, key: "area" as const, colour: colourOf(g) })), ...(showMedian ? [{ label: "Median", key: "line" as const, colour: "var(--mk-color-text-default)" }] : [])];
  const crosshair =
    active == null || !live[active]
      ? null
      : {
          x: x(med(live[active])),
          top: m.t,
          bottom: size.height - m.b,
          line: false,
          anchorY: Math.max(0, centre(active) - row / 2),
          tooltip: {
            title: live[active].name,
            rows: [
              { value: format(med(live[active])), label: "Median", colour: colourOf(live[active]) },
              { value: `${format(live[active].values[0])} to ${format(live[active].values.at(-1)!)}`, label: "Range" },
              { value: String(live[active].values.length), label: "Values" },
            ],
          },
        };
  const ticks = x.ticks(5);

  return (
    <ChartFigure
      title={title}
      titleAs={titleAs}
      eyebrow={eyebrow}
      description={description}
      caption={caption}
      keys={keys}
      legend={<Legend items={legend} />}
      table={
        <ChartTable
          caption={tableCaption ?? label}
          columns={[{ label: "Group" }, { label: "Count", numeric: true }, { label: "Median", numeric: true }, { label: "Lowest", numeric: true }, { label: "Highest", numeric: true }]}
          rows={live.map((g) => ({ header: g.name, cells: [String(g.values.length), format(med(g)), format(g.values[0]), format(g.values.at(-1)!)] }))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-beeswarm" data-reading={active == null ? undefined : ""}>
          {ref !== undefined ? <line className="mk-beeswarm-reference" x1={Math.round(x(ref)) + 0.5} x2={Math.round(x(ref)) + 0.5} y1={m.t} y2={size.height - m.b} /> : null}
          {live.map((g, k) => (
            <g key={g.id} className="mk-beeswarm-row" data-active={active === k ? "" : undefined} data-packed={placed[k].packed ? "" : undefined} style={{ color: colourOf(g) }} opacity={Math.min(1, reveal * 1.4)}>
              {placed[k].dots.map((d, j) => (
                <circle key={j} className="mk-beeswarm-dot" cx={d.x} cy={centre(k) + d.dy} r={placed[k].radius} />
              ))}
            </g>
          ))}
          <g opacity={labelOpacity(reveal)}>
            {live.map((g, k) => (
              <g key={g.id}>
                <text className="mk-beeswarm-name" x={0} y={centre(k) + 4}>
                  {g.name}
                </text>
                {showMedian ? (
                  <g className="mk-beeswarm-median">
                    <line x1={Math.round(x(med(g))) + 0.5} x2={Math.round(x(med(g))) + 0.5} y1={centre(k) - row / 2 + 6} y2={centre(k) + row / 2 - 6} />
                    <text className="mk-chart-value mk-chart-halo" x={x(med(g)) + 6} y={centre(k) - row / 2 + 14}>
                      Median {format(med(g))}
                    </text>
                  </g>
                ) : null}
              </g>
            ))}
            {ticks.map((t) => (
              <text key={t} x={x(t)} y={size.height - 6} textAnchor="middle">
                {format(t)}
              </text>
            ))}
          </g>
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
