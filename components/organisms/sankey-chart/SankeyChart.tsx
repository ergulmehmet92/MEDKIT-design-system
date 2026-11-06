import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ACCENT_COLOUR,
  CONTEXT_COLOUR,
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
import { layoutSankey, ribbon } from "./layout";
import type { SankeyLinkInput, SankeyNodeInput } from "./layout";
import "./sankey-chart.css";

export type SankeyNode = SankeyNodeInput;
export type SankeyLink = SankeyLinkInput;

export type SankeyChartProps = {
  title: ReactNode;
  label: string;
  nodes: SankeyNode[];
  links: SankeyLink[];
  format?: (value: number) => string;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

/**
 * Where something came from and where it went. Flows wear the tint of where they land; the subject
 * lands in the accent, other destinations in warm greys, and everything upstream in grey.
 */
export function SankeyChart({ title, label, nodes, links, format, titleAs, eyebrow, description, caption, tableCaption, emptyText = "No data to show yet.", keys }: SankeyChartProps) {
  const digits = Math.min(2, Math.max(0, ...links.map((l) => (String(l.value).split(".")[1] ?? "").length)));
  const fmt = format ?? ((v: number) => formatValue(v, digits));
  const name = useMemo(() => new Map(nodes.map((n) => [n.id, n.name])), [nodes]);
  const { plotRef, size, reveal, advance } = useChartViewport({ i0: 0, i1: 1, y0: 0, y1: 1 }, { width: 520, height: 300 });

  const roughly = layoutSankey(nodes, links, 100, 100, 1, 1);
  const lastColumn = roughly.columns - 1;
  const widest = (col: number) => Math.max(0, ...roughly.nodes.filter((n) => n.column === col).map((n) => (n.name.length + fmt(n.value).length + 2) * advance * 0.82));
  const m = { l: widest(0) + 14, r: widest(lastColumn) + 14, t: advance * 2.2, b: 4 };
  const laid = useMemo(() => layoutSankey(nodes, links, Math.max(10, size.width - m.l - m.r), Math.max(10, size.height - m.t - m.b), 10, 10), [nodes, links, size.width, size.height, m.l, m.r, m.t]); // eslint-disable-line react-hooks/exhaustive-deps
  const colourOf = useMemo(() => {
    let k = 0;
    const map = new Map<string, string>();
    laid.nodes
      .filter((n) => n.column === lastColumn)
      .forEach((n) => map.set(n.id, n.highlight ? ACCENT_COLOUR : neutralColour((k++ % 4) + 1)));
    laid.nodes.filter((n) => n.column !== lastColumn).forEach((n) => map.set(n.id, n.highlight ? ACCENT_COLOUR : CONTEXT_COLOUR));
    return (id: string) => map.get(id) ?? CONTEXT_COLOUR;
  }, [laid, lastColumn]);
  const outOf = (id: string) => laid.links.filter((l) => l.source === id).reduce((s, l) => s + l.value, 0);

  const describe = useCallback((k: number) => {
    const l = laid.links[k];
    return l ? `${name.get(l.source)} to ${name.get(l.target)}. ${fmt(l.value)}, ${Math.round((l.value / outOf(l.source)) * 100)}% of ${name.get(l.source)}.` : "";
  }, [laid, name]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useCrosshair({
    min: 0,
    max: Math.max(0, laid.links.length - 1),
    start: 0,
    stride: 3,
    indexAt: (x, y) => {
      // The flow whose band is under the pointer, found along the ribbon's midline.
      const px = x - m.l;
      const py = y - m.t;
      return laid.links.findIndex((l) => {
        if (px < l.sx || px > l.tx) return false;
        const t = (px - l.sx) / Math.max(1, l.tx - l.sx);
        const ease = t * t * (3 - 2 * t);
        const top = l.sy + (l.ty - l.sy) * ease;
        return py >= top && py <= top + Math.max(l.width, 4);
      });
    },
    describe,
  });

  if (!laid.links.length) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "From" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  const legend: LegendItem[] = laid.nodes.filter((n) => n.column === lastColumn).map((n) => ({ label: n.name, key: "area", colour: colourOf(n.id) }));
  const crosshair =
    active == null || !laid.links[active]
      ? null
      : {
          x: m.l + (laid.links[active].sx + laid.links[active].tx) / 2,
          top: 0,
          bottom: size.height,
          line: false,
          anchorY: Math.max(0, m.t + (laid.links[active].sy + laid.links[active].ty) / 2 - 30),
          tooltip: {
            title: `${name.get(laid.links[active].source)} to ${name.get(laid.links[active].target)}`,
            rows: [{ value: fmt(laid.links[active].value), label: `${Math.round((laid.links[active].value / outOf(laid.links[active].source)) * 100)}% of ${name.get(laid.links[active].source)}`, colour: colourOf(laid.links[active].target), key: "swatch" as const }],
          },
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
          columns={[{ label: "From" }, { label: "To" }, { label: "Value", numeric: true }]}
          rows={laid.links.map((l) => ({ header: name.get(l.source) ?? l.source, cells: [name.get(l.target) ?? l.target, fmt(l.value)] }))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-sankey" data-reading={active == null ? undefined : ""} transform={`translate(${m.l} ${m.t})`} opacity={Math.min(1, reveal * 1.6)}>
          {laid.links.map((l, k) => (
            <path key={`${l.source}-${l.target}`} className="mk-sankey-flow" data-active={active === k ? "" : undefined} d={ribbon(l)} style={{ color: colourOf(l.target) }} data-upstream={laid.nodes.find((n) => n.id === l.target)?.column !== lastColumn ? "" : undefined} />
          ))}
          {laid.nodes.map((n) => (
            <rect key={n.id} className="mk-sankey-node" x={n.x} y={n.y} width={10} height={Math.max(1, n.height)} rx={2} style={{ fill: colourOf(n.id) }} />
          ))}
        </g>
        <g transform={`translate(${m.l} ${m.t})`} opacity={labelOpacity(reveal)}>
          {laid.nodes.map((n) => {
            const first = n.column === 0;
            const last = n.column === lastColumn;
            const x = first ? n.x - 8 : last ? n.x + 18 : n.x + 5;
            const y = first || last ? n.y + n.height / 2 + 4 : n.y - 6;
            return (
              <text key={n.id} className="mk-chart-value mk-sankey-label" x={x} y={y} textAnchor={first ? "end" : last ? "start" : "middle"}>
                {last ? (
                  <>
                    <tspan className="mk-chart-strong">{fmt(n.value)}</tspan> {n.name}
                  </>
                ) : (
                  <>
                    {n.name} <tspan className="mk-chart-strong">{fmt(n.value)}</tspan>
                  </>
                )}
              </text>
            );
          })}
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
