import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { ChartFigure, ChartPlot, ChartTable, formatValue, labelOpacity, useChartViewport, useCrosshair } from "../../molecules/chart-frame";
import { HeatKey } from "./HeatKey";
import { heatColour } from "./scale";
import type { HeatPalette, HeatScale } from "./scale";
import "./heatmap.css";

export type HeatmapProps = {
  title: ReactNode;
  label: string;
  rows: string[];
  columns: string[];
  /** One row of values per row name. Null leaves a cell empty. */
  values: (number | null)[][];
  scale?: HeatScale;
  /** For diverging scales, the value that means nothing, such as zero. It takes the neutral middle. */
  centre?: number;
  palette?: HeatPalette;
  /** Fixes the scale's ends, such as [-1, 1] for correlations. */
  domain?: [number, number];
  /** Lower draws only the lower half and the diagonal, for symmetric grids such as correlations. */
  triangle?: "full" | "lower";
  format?: (value: number) => string;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  tableCaption?: string;
  emptyText?: string;
  keys?: "on-demand" | "shown";
};

const finite = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v);

/**
 * A grid of values as colour, with every value also written in its cell when it fits, so it never
 * rests on colour alone. Diverging grids are centred on a meaningful value.
 */
export function Heatmap({ title, label, rows, columns, values, scale = "sequential", centre = 0, palette = "polarity", domain, triangle = "full", format, titleAs, eyebrow, description, caption, tableCaption, emptyText = "No data to show yet.", keys }: HeatmapProps) {
  const shown = (i: number, j: number) => triangle === "full" || j <= i;
  const cells = useMemo(() => rows.flatMap((_, i) => columns.map((__, j) => ({ i, j, v: values[i]?.[j] ?? null }))).filter((c) => shown(c.i, c.j)), [rows, columns, values, triangle]); // eslint-disable-line react-hooks/exhaustive-deps
  const known = cells.map((c) => c.v).filter(finite);
  const [lo, hi] = domain ?? [Math.min(...known), Math.max(...known)];
  const digits = Math.min(2, Math.max(0, ...known.map((v) => (String(v).split(".")[1] ?? "").length)));
  const fmt = format ?? ((v: number) => formatValue(v, digits));
  const { plotRef, size, reveal, advance } = useChartViewport({ i0: 0, i1: 1, y0: 0, y1: 1 }, { width: 480, height: 320 });

  const rowColumn = Math.max(...rows.map((r) => r.length * advance), 20) + 12;
  const head = triangle === "lower" ? 0 : advance * 2.4;
  const cell = Math.max(8, Math.min((size.width - rowColumn) / Math.max(1, columns.length), (size.height - head - 4) / Math.max(1, rows.length)));
  const x0 = rowColumn;
  const y0 = head + (triangle === "lower" ? advance * 2.4 : 0);
  const writeValues = cell >= fmt(hi).length * advance + 10;

  const describe = useCallback((k: number) => {
    const c = cells[k];
    return `${rows[c.i]}, ${columns[c.j]}. ${finite(c.v) ? fmt(c.v) : "No value"}.`;
  }, [cells]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useCrosshair({
    min: 0,
    max: Math.max(0, cells.length - 1),
    start: 0,
    stride: columns.length,
    indexAt: (px, py) => cells.findIndex((c) => px >= x0 + c.j * cell && px < x0 + (c.j + 1) * cell && py >= y0 + c.i * cell && py < y0 + (c.i + 1) * cell),
    describe,
  });

  if (!known.length) {
    return (
      <ChartFigure title={title} titleAs={titleAs} eyebrow={eyebrow} description={description} caption={caption} keys={keys} table={<ChartTable caption={tableCaption ?? label} columns={[{ label: "Row" }]} rows={[]} />}>
        <ChartPlot label={label} empty={emptyText} />
      </ChartFigure>
    );
  }

  const active = reading.index;
  const colourFor = (v: number) => heatColour(v, scale, lo, hi, centre, palette).colour;
  const crosshair =
    active == null || !cells[active]
      ? null
      : {
          x: x0 + (cells[active].j + 1) * cell,
          top: 0,
          bottom: size.height,
          line: false,
          anchorY: Math.max(0, y0 + cells[active].i * cell - 10),
          tooltip: { title: `${rows[cells[active].i]} and ${columns[cells[active].j]}`, rows: [{ value: finite(cells[active].v) ? fmt(cells[active].v as number) : "–", label: label, colour: finite(cells[active].v) ? colourFor(cells[active].v as number) : undefined, key: "swatch" as const }] },
        };

  return (
    <ChartFigure
      title={title}
      titleAs={titleAs}
      eyebrow={eyebrow}
      description={description}
      caption={caption}
      keys={keys}
      legend={<HeatKey scale={scale} palette={palette} lo={fmt(lo)} hi={fmt(hi)} centre={scale === "diverging" ? fmt(centre) : undefined} />}
      table={
        <ChartTable
          caption={tableCaption ?? label}
          columns={[{ label: "" }, ...columns.map((c) => ({ label: c, numeric: true }))]}
          rows={rows.map((r, i) => ({ header: r, cells: columns.map((_, j) => (shown(i, j) && finite(values[i]?.[j]) ? fmt(values[i][j] as number) : "–")) }))}
        />
      }
    >
      <ChartPlot label={label} plotRef={plotRef} reading={reading} crosshair={crosshair}>
        <g className="mk-heatmap" data-reading={active == null ? undefined : ""}>
          <g opacity={Math.min(1, reveal * 1.5)}>
            {cells.map((c, k) => (
              <rect key={`${c.i}-${c.j}`} className="mk-heat-cell" data-active={active === k ? "" : undefined} data-empty={finite(c.v) ? undefined : ""} x={x0 + c.j * cell + 1} y={y0 + c.i * cell + 1} width={cell - 2} height={cell - 2} rx={2} style={finite(c.v) ? { fill: colourFor(c.v) } : undefined} />
            ))}
          </g>
          <g opacity={labelOpacity(reveal)}>
            {writeValues
              ? cells.map((c) =>
                  finite(c.v) ? (
                    <text key={`t-${c.i}-${c.j}`} className="mk-chart-value mk-heat-value" x={x0 + (c.j + 0.5) * cell} y={y0 + (c.i + 0.5) * cell + 4} textAnchor="middle">
                      {fmt(c.v)}
                    </text>
                  ) : null,
                )
              : null}
            {rows.map((r, i) => (
              <text key={r} className="mk-heat-name" x={x0 - 8} y={y0 + (i + 0.5) * cell + 4} textAnchor="end">
                {r}
              </text>
            ))}
            {columns.map((c, j) =>
              triangle === "lower" ? (
                <text key={c} className="mk-heat-name" x={x0 + j * cell + 4} y={y0 + j * cell - 6}>
                  {c}
                </text>
              ) : (
                <text key={c} className="mk-heat-name" x={x0 + (j + 0.5) * cell} y={head - 8} textAnchor="middle">
                  {c}
                </text>
              ),
            )}
          </g>
        </g>
      </ChartPlot>
    </ChartFigure>
  );
}
