import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Eyebrow } from "../../atoms/eyebrow";
import { GridRails } from "../../atoms/grid-rails";
import { Heading } from "../../atoms/heading";
import { LivingLight } from "../../atoms/living-light";
import type { LightForm } from "../../atoms/living-light/renderer";
import { Rule } from "../../atoms/rule";
import "./editorial-page.css";

export type EditorialPageProps = {
  /** A Header. It floats over the hero's light and stays a banner, outside main. */
  header?: ReactNode;
  /** A PageHero, then Sections. */
  children: ReactNode;
  /** A Footer. */
  footer?: ReactNode;
};

/** The editorial template from the landing direction: a header over the light, the page, the footer. */
export function EditorialPage({ header, children, footer }: EditorialPageProps) {
  return (
    <div className="mk-editorial-page" data-density="editorial">
      {header ? <div className="mk-editorial-page-header">{header}</div> : null}
      <main className="mk-editorial-page-main">{children}</main>
      {footer ? <div className="mk-editorial-page-footer">{footer}</div> : null}
    </div>
  );
}

export type PageHeroProps = {
  eyebrow?: ReactNode;
  /** The headline, set as a display h1. */
  title: ReactNode;
  /** A second sentence in the accent colour, after the title. */
  accent?: ReactNode;
  /** A label beside the lead, under the rule. */
  kicker?: ReactNode;
  lead?: ReactNode;
  form?: LightForm;
};

/** The hero: a headline over the living light, a rule, then a label beside the lead. */
export function PageHero({ eyebrow, title, accent, kicker, lead, form = "ridge" }: PageHeroProps) {
  return (
    <section className="mk-page-hero" aria-labelledby="mk-page-hero-title">
      <LivingLight form={form} calm={0.95} />
      <GridRails />
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading id="mk-page-hero-title" level={1} size="display" className="mk-page-hero-title">
        {title}
        {accent ? (
          <>
            {" "}
            <span className="mk-page-hero-accent">{accent}</span>
          </>
        ) : null}
      </Heading>
      {kicker || lead ? (
        <>
          <Rule />
          <Split>
            {kicker ? <Eyebrow>{kicker}</Eyebrow> : <span />}
            {lead ? <p className="mk-lead">{lead}</p> : null}
          </Split>
        </>
      ) : null}
    </section>
  );
}

export type SplitProps = ComponentPropsWithoutRef<"div"> & {
  /** Align the columns' bottoms, as for a title beside a summary. */
  align?: "start" | "end";
};

/** Two columns that stack below 26.25rem each: the editorial page's basic layout. */
export function Split({ align = "start", className, ...rest }: SplitProps) {
  return <div className={className ? `mk-split ${className}` : "mk-split"} data-align={align} {...rest} />;
}
