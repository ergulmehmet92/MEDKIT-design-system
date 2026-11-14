import type { ReactNode } from "react";
import "./footer.css";

export type FooterLink = { label: string; href: string };
export type FooterGroup = { title: string; links: FooterLink[] };

export type FooterProps = {
  name: ReactNode;
  /** One line under the name. */
  thesis?: ReactNode;
  groups: FooterGroup[];
  /** The small print, left to right: copyright, the kit's version, back to top. */
  smallPrint?: ReactNode[];
  /** Names the footer's link navigation. */
  navLabel?: string;
  className?: string;
};

/** The site footer from the Cards board: the name and thesis, short link lists, and the small print. */
export function Footer({
  name,
  thesis,
  groups,
  smallPrint = [],
  navLabel = "Footer",
  className,
}: FooterProps) {
  return (
    <footer className={className ? `mk-footer ${className}` : "mk-footer"}>
      <div className="mk-footer-inner">
        <div className="mk-footer-sign">
          <p className="mk-footer-name">{name}</p>
          {thesis ? <p className="mk-footer-thesis">{thesis}</p> : null}
        </div>
        <nav className="mk-footer-nav" aria-label={navLabel}>
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="mk-footer-title">{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {smallPrint.length ? (
          <div className="mk-footer-small">
            {smallPrint.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
