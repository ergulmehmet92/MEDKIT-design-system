import type { ComponentPropsWithoutRef } from "react";
import "./metric-row.css";

export type MetricRowProps = ComponentPropsWithoutRef<"dl">;

export function MetricRow({ className, ...rest }: MetricRowProps) {
  const classes = className ? `mk-metric-row ${className}` : "mk-metric-row";

  return <dl className={classes} {...rest} />;
}
