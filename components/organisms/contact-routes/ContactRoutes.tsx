import type { ComponentPropsWithoutRef } from "react";
import "./contact-routes.css";

export type ContactRoute = { label: string; href: string };

export type ContactRoutesProps = Omit<ComponentPropsWithoutRef<"ul">, "children"> & {
  routes: ContactRoute[];
};

export function ContactRoutes({ routes, className, ...rest }: ContactRoutesProps) {
  const classes = className ? `mk-contact-routes ${className}` : "mk-contact-routes";

  return (
    <ul className={classes} {...rest}>
      {routes.map(({ label, href }) => (
        <li key={href}>
          <a href={href}>
            {label}
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M5 2l5 5-5 5" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
