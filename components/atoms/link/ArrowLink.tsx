import type { ComponentPropsWithoutRef } from "react";
import "./link.css";

export type ArrowLinkProps = ComponentPropsWithoutRef<"a">;

/** A link that stands on its own, such as "Read the story". The arrow is decoration. */
export function ArrowLink({ className, children, ...rest }: ArrowLinkProps) {
  const classes = className ? `mk-arrow-link ${className}` : "mk-arrow-link";

  return (
    <a className={classes} {...rest}>
      <span className="mk-arrow-link-label">{children}</span>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true" focusable="false">
        <path d="M1 8h13" />
        <path d="M9 3l5 5-5 5" />
      </svg>
    </a>
  );
}
