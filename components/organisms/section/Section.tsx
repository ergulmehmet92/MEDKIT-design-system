import type { ComponentPropsWithoutRef } from "react";
import { GridRails } from "../../atoms/grid-rails";
import "./section.css";

export type SectionTone = "page" | "inverse" | "forest" | "paper";

export type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /** `page` follows the page. `inverse` flips it. `forest` and `paper` pin a theme. */
  tone?: SectionTone;
  /** Draws the full-height hairline rails behind the content. */
  rails?: boolean;
};

export function Section({ tone = "page", rails = false, className, children, ...rest }: SectionProps) {
  const classes = className ? `mk-section ${className}` : "mk-section";
  const pinned = tone === "forest" || tone === "paper" ? tone : undefined;

  return (
    <section className={classes} data-tone={tone} data-theme={pinned} {...rest}>
      {rails && <GridRails />}
      {children}
    </section>
  );
}
