import type { ComponentPropsWithoutRef } from "react";
import "./eyebrow.css";

type EyebrowElement = "p" | "span" | "h2" | "h3" | "h4";

export type EyebrowProps<T extends EyebrowElement = "p"> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Eyebrow<T extends EyebrowElement = "p">({ as, className, ...rest }: EyebrowProps<T>) {
  const Element = (as ?? "p") as EyebrowElement;
  const classes = className ? `mk-eyebrow ${className}` : "mk-eyebrow";

  return <Element className={classes} {...(rest as ComponentPropsWithoutRef<"p">)} />;
}
