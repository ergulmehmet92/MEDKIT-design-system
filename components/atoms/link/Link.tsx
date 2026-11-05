import type { ComponentPropsWithoutRef } from "react";
import "./link.css";

export type LinkProps = ComponentPropsWithoutRef<"a">;

/** A link inside running text. Routers can wrap it, or pass their own anchor with the class. */
export function Link({ className, ...rest }: LinkProps) {
  const classes = className ? `mk-link ${className}` : "mk-link";

  return <a className={classes} {...rest} />;
}
