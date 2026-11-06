import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import "./panel.css";

export type PanelProps = Omit<ComponentPropsWithoutRef<"section">, "title"> & {
  /** Names the panel and labels its region. Leave it out when the content brings its own title, as a chart does. */
  title?: ReactNode;
  /** A short label above the title, in the label face: what kind of thing this is. */
  kind?: ReactNode;
  titleAs?: "h2" | "h3" | "h4";
  /** Controls on the right of the head, such as quiet buttons. */
  actions?: ReactNode;
  /** Sources, an as-of time or a note, under a hairline. */
  footer?: ReactNode;
  children: ReactNode;
};

/** A glass card over the living light that holds one chart, table or gauge. */
export function Panel({ title, kind, titleAs: Title = "h3", actions, footer, children, className, ...rest }: PanelProps) {
  const titleId = `${useId()}-title`;
  const classes = className ? `mk-panel ${className}` : "mk-panel";
  const head =
    title || kind || actions ? (
      <div className="mk-panel-head">
        {title || kind ? (
          <div className="mk-panel-titles">
            {kind ? <p className="mk-panel-kind">{kind}</p> : null}
            {title ? (
              <Title className="mk-panel-title" id={titleId}>
                {title}
              </Title>
            ) : null}
          </div>
        ) : null}
        {actions ? <div className="mk-panel-actions">{actions}</div> : null}
      </div>
    ) : null;

  return (
    <section className={classes} aria-labelledby={title ? titleId : undefined} {...rest}>
      {head}
      <div className="mk-panel-body">{children}</div>
      {footer ? <div className="mk-panel-foot">{footer}</div> : null}
    </section>
  );
}
