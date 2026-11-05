import { useId, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Button } from "../../atoms/button";
import { Eyebrow } from "../../atoms/eyebrow";
import "./chart-frame.css";

export type ChartFigureProps = Omit<ComponentPropsWithoutRef<"figure">, "title" | "children"> & {
  /** States the point of the chart, or names it on a dashboard. */
  title: ReactNode;
  titleAs?: "h2" | "h3" | "h4";
  eyebrow?: ReactNode;
  description?: ReactNode;
  legend?: ReactNode;
  /** The same data as a table. Every chart has one. */
  table: ReactNode;
  /** Source and notes, below the chart. */
  caption?: ReactNode;
  /** Labels for the table switch. */
  toggleLabels?: { table: string; chart: string };
  /** Starts on the table instead of the chart. */
  defaultView?: "chart" | "table";
  /** The plot, usually a ChartPlot. */
  children: ReactNode;
};

/**
 * The outside of every chart: title, legend, a switch to the table, and the caption. The plot and
 * the table share one slot, so switching never moves the rest of the page.
 */
export function ChartFigure({
  title,
  titleAs: Title = "h3",
  eyebrow,
  description,
  legend,
  table,
  caption,
  toggleLabels = { table: "View as table", chart: "View as chart" },
  defaultView = "chart",
  className,
  children,
  ...rest
}: ChartFigureProps) {
  const [view, setView] = useState(defaultView);
  const titleId = useId();
  const showTable = view === "table";

  return (
    <figure className={className ? `mk-chart ${className}` : "mk-chart"} aria-labelledby={titleId} data-view={view} {...rest}>
      <div className="mk-chart-head">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Title className="mk-chart-title" id={titleId}>
          {title}
        </Title>
        {description ? <p className="mk-chart-description">{description}</p> : null}
      </div>
      <div className="mk-chart-bar">
        {legend}
        <Button variant="quiet" className="mk-chart-switch" onClick={() => setView(showTable ? "chart" : "table")}>
          {showTable ? toggleLabels.chart : toggleLabels.table}
        </Button>
      </div>
      <div className="mk-chart-body">
        <div className="mk-chart-view" hidden={showTable}>
          {children}
        </div>
        <div className="mk-chart-view" hidden={!showTable}>
          {table}
        </div>
      </div>
      {caption ? <figcaption className="mk-chart-caption">{caption}</figcaption> : null}
    </figure>
  );
}
