import { hierarchy, treemap, treemapSquarify } from "d3-hierarchy";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ACCENT_COLOUR,
  ChartFigure,
  ChartPlot,
  ChartTable,
  Legend,
  formatValue,
  labelOpacity,
  neutralColour,
  useChartViewport,
  useCrosshair,
} from "../../molecules/chart-frame";
import type { LegendItem } from "../../molecules/chart-frame";
import "./treemap.css";

export type TreemapLeaf = { id: string; name: string; value: number };
export type TreemapGroup = { id: string; name: string; highlight?: boolean; children: TreemapLeaf[] };

export type TreemapProps = {
  title: ReactNode;
  label: string;
  groups: TreemapGroup[];
  format?: (value: number) => string;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

type Node = { name: string; value?: number; id?: string; group?: TreemapGroup; children?: Node[] };

/**
 * Nested part to whole: groups hold their items, sized by value. Tiles are tints of their group's
 * colour with a full-colour edge, the subject group in the accent and the rest in warm greys.
 * Labels go only where they fit; the tooltip and table carry the rest.
 */
export function Treemap({ title, label, groups, format, titleAs, eyebrow, description, caption, tableCaption, emptyText = "No data to show yet.", keys }: TreemapProps) {
  const live = useMemo(() => groups.map((g) => ({ ...g, children: g.children.filter((c) => Number.isFinite(c.value) && c.value > 0) })).filter((g) => g.children.length), [groups]);
  const total = live.reduce((s, g) => s + g.children.reduce((a, c) => a + c.value, 0), 0);
  const digits = Math.min(2, Math.max(0, ...live.flatMap((g) => g.children.map((c) => (String(c.value).split(".")[1] ?? "").length))));
  const fmt = format ?? ((v: number) => formatValue(v, digits));
  const pct = (v: number) => `${((v / total) * 100).toFixed(1)}%`;
  const colourOf = useMemo(() => {
    let k = 0;
    const map = new Map<string, string>();
    [...live].sort((a, b) => b.children.reduce((s, c) => s + c.value, 0) - a.children.reduce((s, c) => s + c.value, 0)).forEach((g) => map.set(g.id, g.highlight ? ACCENT_COLOUR : neutralColour((k++ % 4) + 1)));
    return (g: TreemapGroup) => map.get(g.id) ?? neutralColour(4);
  }, [live]);
  const { plotRef, size, reveal, advance } = useChartViewport({ i0: 0, i1: 1, y0: 0, y1: 1 }, { width: 480, height: 300 });
  const head = Math.round(advance * 2.1);

  const leaves = useMemo(() => {
    if (!live.length || size.width < 10) return [];
    const root = hierarchy<Node>({ name: "root", children: live.map((g) => ({ name: g.name, group: g, children: g.children.map((c) => ({ ...c, group: g })) })) })
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    treemap<Node>()
      .tile(treemapSquarify)
      .size([size.width, size.height])
      .paddingInner(2)
      .paddingTop((d) => (d.depth === 1 && d.x1 - d.x0 > 70 && d.y1 - d.y0 > head * 3 ? head : 0))(root);
    return root.leaves() as unknown as { x0: number; x1: number; y0: number; y1: number; data: Node; parent: { x0: number; y0: number; x1: number; y1: number; data: Node } }[];
  }, [live, size.width, size.height, head]);
  const groupBoxes = useMemo(() => {
    const seen = new Map<string, (typeof leaves)[number]["parent"]>();
    leaves.forEach((l) => seen.set(l.data.group!.id, l.parent));
    return [...seen.entries()];
  }, [leaves]);

  const describe = useCallback((k: number) => {
    const l = leaves[k];
    return l ? `${l.data.name}, in ${l.data.group!.name}. ${fmt(l.data.value!)}, ${pct(l.data.value!)} of everything.` : "";
  }, [leaves]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useCrosshair({
    min: 0,
    max: Math.max(0, leaves.length - 1),
    start: 0,
    stride: 3,
    indexAt: (x, y) => leaves.findIndex((l) => x >= l.x0 && x <= l.x1 && y >= l.y0 && y <= l.y1),
    describe,
  });

  if (!live.length) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Item" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  const legend: LegendItem[] = live.map((g) => ({ label: g.name, key: "area", colour: colourOf(g) }));
  const tile = (l: (typeof leaves)[number]) => ({ x: l.x0, y: l.y0, w: Math.max(0, l.x1 - l.x0), h: Math.max(0, l.y1 - l.y0) });
  const crosshair =
    active == null || !leaves[active]
      ? null
      : {
          x: leaves[active].x1,
          top: 0,
          bottom: size.height,
          line: false,
          anchorY: leaves[active].y0,
          tooltip: { title: leaves[active].data.name, rows: [{ value: fmt(leaves[active].data.value!), label: `${pct(leaves[active].data.value!)} · ${leaves[active].data.group!.name}`, colour: colourOf(leaves[active].data.group!), key: "swatch" as const }] },
        };

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
          columns={[{ label: "Item" }, { label: "Group" }, { label: "Value", numeric: true }, { label: "Share", numeric: true }]}
          rows={live.flatMap((g) => g.children.map((c) => ({ header: c.name, cells: [g.name, fmt(c.value), pct(c.value)] })))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-treemap" data-reading={active == null ? undefined : ""} opacity={Math.min(1, reveal * 1.6)}>
          {leaves.map((l, k) => {
            const t = tile(l);
            const colour = colourOf(l.data.group!);
            const fitsName = t.w > l.data.name.length * advance + 16 && t.h > advance * 2.4;
            const fitsValue = fitsName && t.h > advance * 4.4;
            return (
              <g key={l.data.id} className="mk-treemap-tile" data-active={active === k ? "" : undefined} style={{ color: colour }}>
                <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={2} />
                <line x1={t.x + 1.5} x2={t.x + 1.5} y1={t.y + 1} y2={t.y + t.h - 1} />
                {fitsName ? (
                  <text className="mk-treemap-name" x={t.x + 10} y={t.y + advance * 2}>
                    {l.data.name}
                  </text>
                ) : null}
                {fitsValue ? (
                  <text className="mk-chart-value" x={t.x + 10} y={t.y + advance * 3.9}>
                    {pct(l.data.value!)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
        <g opacity={labelOpacity(reveal)}>
          {groupBoxes.map(([id, box]) =>
            box.x1 - box.x0 > 70 && box.y1 - box.y0 > head * 3 ? (
              <text key={id} className="mk-treemap-group" x={box.x0 + 4} y={box.y0 + head - 6}>
                {box.data.name.length * advance > box.x1 - box.x0 - 10 ? box.data.name.split(" ")[0] : box.data.name}
              </text>
            ) : null,
          )}
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
