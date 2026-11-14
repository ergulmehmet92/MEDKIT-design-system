import type { ComponentPropsWithoutRef } from "react";
import "./badge.css";

export type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  /** Neutral labels, honey for the one thing to notice, or a version number. */
  tone?: "neutral" | "accent" | "version";
};

/**
 * A small static label: Draft, New, v2.0.0. Badges label things; they never say whether something
 * works. That is StatusPill's job.
 */
export function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return <span className={className ? `mk-badge ${className}` : "mk-badge"} data-tone={tone} {...rest} />;
}
