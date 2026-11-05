import type { ComponentPropsWithoutRef } from "react";
import "./heading.css";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "display" | "heading" | "subheading" | "title";

export type HeadingProps = ComponentPropsWithoutRef<"h2"> & {
  /** The heading's place in the outline. */
  level?: HeadingLevel;
  /** How large it looks, independent of the level. */
  size?: HeadingSize;
};

export function Heading({ level = 2, size = "title", className, ...rest }: HeadingProps) {
  const Element = `h${level}` as const;
  const classes = className ? `mk-heading ${className}` : "mk-heading";

  return <Element className={classes} data-size={size} {...rest} />;
}
