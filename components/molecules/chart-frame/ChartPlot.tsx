import { useId, useLayoutEffect, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, PointerEvent, ReactNode, Ref } from "react";
import "./chart-frame.css";

export type TooltipRow = {
  value: string;
  label: string;
  /** Series colour for the key beside the row. */
  colour?: string;
  key?: "line" | "dotted" | "swatch";
};

export type TooltipContent = { title: string; rows: TooltipRow[]; note?: string };

export type CrosshairMark = {
  /** Pixels from the plot's left edge. */
  x: number;
  top: number;
  bottom: number;
  /** A dot on each series where the crosshair crosses it. */
  dots?: { y: number; colour: string }[];
  tooltip?: TooltipContent;
};

export type ChartReading = {
  handlers: Pick<HTMLAttributes<HTMLElement>, "onFocus" | "onBlur"> & {
    onPointerMove: (event: PointerEvent<HTMLElement>) => void;
    onPointerLeave: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  };
  announcement: string;
};

export type ChartPlotProps = {
  /** Names the plot for assistive technology, such as "Portfolio and S&P 500, indexed to 100". */
  label: string;
  /** How to read it by keyboard. */
  instructions?: string;
  /** From useElementSize, so the chart can size its scales to this element. */
  plotRef?: Ref<HTMLDivElement>;
  /** From useCrosshair. Without it the plot is static. */
  reading?: ChartReading;
  crosshair?: CrosshairMark | null;
  /** Shown instead of the plot when there's nothing to draw. */
  empty?: ReactNode;
  /** SVG content: gridlines, marks, labels. */
  children?: ReactNode;
};

/**
 * The plot area: an SVG for the chart, a crosshair and glass tooltip on top, and a live region that
 * reads out each point the keyboard lands on. The SVG is hidden from assistive technology, which
 * gets the live readout and the table instead.
 */
export function ChartPlot({
  label,
  instructions = "Use the left and right arrow keys to read each point. Hold Shift to move further, and press Home or End to jump to either end.",
  plotRef,
  reading,
  crosshair,
  empty,
  children,
}: ChartPlotProps) {
  const hintId = useId();
  const tip = useRef<HTMLDivElement>(null);
  const [tipWidth, setTipWidth] = useState(0);
  const host = useRef<HTMLDivElement | null>(null);
  const tooltip = crosshair?.tooltip;

  useLayoutEffect(() => {
    if (tip.current) setTipWidth(tip.current.offsetWidth);
  }, [tooltip]);

  if (empty) {
    return (
      <div className="mk-chart-plot" data-empty="" ref={plotRef}>
        <p className="mk-chart-empty">{empty}</p>
      </div>
    );
  }

  const interactive = Boolean(reading);
  const width = host.current?.clientWidth ?? 0;
  const tipX = crosshair ? (crosshair.x + 16 + tipWidth > width && crosshair.x - 16 - tipWidth >= 0 ? crosshair.x - 16 - tipWidth : Math.min(crosshair.x + 16, Math.max(0, width - tipWidth))) : 0;

  return (
    <div
      className="mk-chart-plot"
      ref={(node) => {
        host.current = node;
        if (typeof plotRef === "function") plotRef(node);
        else if (plotRef) (plotRef as { current: HTMLDivElement | null }).current = node;
      }}
      {...(interactive ? { tabIndex: 0, role: "group", "aria-label": label, "aria-describedby": hintId, ...reading!.handlers } : { role: "img", "aria-label": label })}
    >
      <svg className="mk-chart-svg" aria-hidden="true">
        {children}
        {crosshair ? (
          <g className="mk-chart-crosshair">
            <line x1={Math.round(crosshair.x) + 0.5} x2={Math.round(crosshair.x) + 0.5} y1={crosshair.top} y2={crosshair.bottom} />
            {crosshair.dots?.map((dot, i) => (
              <circle key={i} className="mk-chart-dot" cx={crosshair.x} cy={dot.y} r={4} style={{ fill: dot.colour }} />
            ))}
          </g>
        ) : null}
      </svg>
      {tooltip ? (
        <div className="mk-chart-tooltip" ref={tip} aria-hidden="true" style={{ transform: `translate(${Math.round(tipX)}px, ${Math.round(crosshair!.top)}px)` }}>
          <p className="mk-chart-tooltip-title">{tooltip.title}</p>
          {tooltip.rows.map((row, i) => (
            <p className="mk-chart-tooltip-row" key={i}>
              <span className="mk-chart-key" data-key={row.key ?? "line"} style={row.colour ? { color: row.colour } : undefined} />
              <b>{row.value}</b>
              <span>{row.label}</span>
            </p>
          ))}
          {tooltip.note ? <p className="mk-chart-tooltip-note">{tooltip.note}</p> : null}
        </div>
      ) : null}
      {interactive ? (
        <>
          <p className="mk-chart-sr" id={hintId}>
            {instructions}
          </p>
          <p className="mk-chart-sr" aria-live="polite">
            {reading!.announcement}
          </p>
        </>
      ) : null}
    </div>
  );
}
