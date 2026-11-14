import type { ReactNode } from "react";
import { LivingLight } from "../../atoms/living-light";
import type { LightForm } from "../../atoms/living-light/renderer";
import "./poster-headline.css";

export type PosterHeadlineProps = {
  /** The headline. Short words on their own lines read best; use <br /> or one word per line. */
  children: ReactNode;
  as?: "h1" | "h2";
  /** Up to three short lines in the label face, top left. */
  byline?: string[];
  /** One flat Bauhaus shape, or none. */
  shape?: "quarter" | "none";
  form?: LightForm;
  /** The poster's proportions, as a CSS aspect ratio. */
  ratio?: string;
  className?: string;
};

/**
 * A poster moment from the Poster board: type cut through a dark surface to the Blaze light behind
 * it, with one optional flat shape. The headline stays real text for every reader.
 */
export function PosterHeadline({ children, as: Title = "h1", byline, shape = "quarter", form = "ridge", ratio = "4 / 5", className }: PosterHeadlineProps) {
  return (
    <section className={className ? `mk-poster ${className}` : "mk-poster"} data-theme="forest" style={{ aspectRatio: ratio }}>
      <LivingLight theme="blaze" form={form} />
      <div className="mk-poster-cut">
        <Title className="mk-poster-title">{children}</Title>
      </div>
      {shape === "quarter" ? <span className="mk-poster-shape" aria-hidden="true" /> : null}
      {byline?.length ? (
        <p className="mk-poster-byline">
          {byline.slice(0, 3).map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      ) : null}
    </section>
  );
}
