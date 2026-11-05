import type { ComponentPropsWithoutRef } from "react";
import "./rule.css";

export type RuleProps = ComponentPropsWithoutRef<"hr"> & {
  strength?: "default" | "strong";
};

/** A hairline. Decorative unless it has a label, when it becomes a real separator. */
export function Rule({ strength = "default", className, ...rest }: RuleProps) {
  const labelled = Boolean(rest["aria-label"] || rest["aria-labelledby"]);
  const classes = className ? `mk-rule ${className}` : "mk-rule";

  return <hr className={classes} data-strength={strength} aria-hidden={labelled ? undefined : true} {...rest} />;
}
