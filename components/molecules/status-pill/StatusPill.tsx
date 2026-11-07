import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { StatusLamp, type Status } from "../../atoms/status-lamp";
import "./status-pill.css";

export type StatusPillProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  status: Status;
  /** The words. Defaults to Live, Stale or Failed; a full sentence reads better, such as "Daily snapshot is stale". */
  children?: ReactNode;
  /** Announce changes politely, for a status that updates while someone is on the page. */
  live?: boolean;
  still?: boolean;
};

const WORDS: Record<Status, string> = { live: "Live", stale: "Stale", failed: "Failed" };

/** A lamp and the words it stands beside. The words always show, so the lamp never carries the meaning alone. */
export function StatusPill({ status, children, live = false, still, className, ...rest }: StatusPillProps) {
  const classes = className ? `mk-status-pill ${className}` : "mk-status-pill";
  return (
    <span className={classes} data-status={status} role={live ? "status" : undefined} {...rest}>
      <StatusLamp status={status} still={still} />
      <span className="mk-status-pill-text">{children ?? WORDS[status]}</span>
    </span>
  );
}
