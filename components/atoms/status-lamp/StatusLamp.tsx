import type { ComponentPropsWithoutRef } from "react";
import "./status-lamp.css";

export type Status = "live" | "stale" | "failed";

export type StatusLampProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  status: Status;
  /** Inline scales with the text beside it; large is the 44px lamp of a control bank. */
  size?: "inline" | "large";
  /** Holds the lamp still, as reduced motion does. */
  still?: boolean;
};

/**
 * A flat, geometric status graphic from the Lamps board. Live is a solid circle with a radar pulse,
 * Stale a tinted circle scanned from south-west to north-east, Failed a blinking hexagon in a halo.
 * It is decoration only: a word beside it carries the meaning, so use StatusPill.
 */
export function StatusLamp({ status, size = "inline", still = false, className, ...rest }: StatusLampProps) {
  const classes = className ? `mk-status-lamp ${className}` : "mk-status-lamp";
  return <span className={classes} data-status={status} data-size={size} data-still={still ? "" : undefined} aria-hidden="true" {...rest} />;
}
