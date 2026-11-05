import type { ComponentPropsWithoutRef, ReactNode } from "react";
import "./metric.css";

export type MetricProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  value: ReactNode;
  label: ReactNode;
};

// Renders a dt and dd, so it needs a dl around it, which MetricRow provides.
export function Metric({ value, label, className, ...rest }: MetricProps) {
  const classes = className ? `mk-metric ${className}` : "mk-metric";

  return (
    <div className={classes} {...rest}>
      <dt className="mk-metric-label">{label}</dt>
      <dd className="mk-metric-value">{value}</dd>
    </div>
  );
}
