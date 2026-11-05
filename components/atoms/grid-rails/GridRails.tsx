import type { ComponentPropsWithoutRef } from "react";
import "./grid-rails.css";

export type GridRailsProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export function GridRails({ className, ...rest }: GridRailsProps) {
  const classes = className ? `mk-grid-rails ${className}` : "mk-grid-rails";

  return (
    <div className={classes} aria-hidden="true" {...rest}>
      <span data-rail="start" />
      <span data-rail="middle" />
      <span data-rail="end" />
    </div>
  );
}
