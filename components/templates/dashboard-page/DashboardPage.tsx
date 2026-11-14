import type { ReactNode } from "react";
import { LivingLight } from "../../atoms/living-light";
import "./dashboard-page.css";

export type DashboardPageProps = {
  /** The page's name: "Predictor". */
  title: ReactNode;
  /** A line beside the title in the label face: the as-of time. */
  meta?: ReactNode;
  /** Controls on the right of the bar: a range, the one primary action. */
  actions?: ReactNode;
  /** A row of figures above everything else. */
  tiles?: ReactNode;
  /** The narrow left column: a gauge, a list of states. */
  aside?: ReactNode;
  /** The main column: tables, charts, track bars. */
  children: ReactNode;
};

/**
 * The dashboard template from Data board 3, in analytical density: a bar, a row of tiles, then a
 * narrow column beside a wide one, all as glass panels over the living light.
 */
export function DashboardPage({ title, meta, actions, tiles, aside, children }: DashboardPageProps) {
  return (
    <div className="mk-dashboard-page" data-density="analytical">
      <LivingLight form="ridge" calm={0.4} />
      <main className="mk-dashboard-page-main">
        <div className="mk-dashboard-bar">
          <h1 className="mk-dashboard-title">{title}</h1>
          {meta ? <p className="mk-dashboard-meta">{meta}</p> : null}
          {actions ? <div className="mk-dashboard-actions">{actions}</div> : null}
        </div>
        {tiles ? <div className="mk-dashboard-tiles">{tiles}</div> : null}
        <div className="mk-dashboard-body" data-aside={aside ? "" : undefined}>
          {aside ? <div className="mk-dashboard-aside">{aside}</div> : null}
          <div className="mk-dashboard-content">{children}</div>
        </div>
      </main>
    </div>
  );
}
