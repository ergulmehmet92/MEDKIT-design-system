import { Children, type ComponentPropsWithoutRef, type ReactNode } from "react";
import "./header.css";

export type HeaderProps = ComponentPropsWithoutRef<"header"> & {
  /** The site's name, usually a link home. */
  brand: ReactNode;
  /** Controls after the navigation, such as ThemeSwitch. */
  actions?: ReactNode;
  /** The navigation landmark's name. */
  navigationLabel?: string;
  /** Navigation links. Works with plain anchors or a framework's link component. */
  children?: ReactNode;
};

export function Header({ brand, actions, navigationLabel = "Primary", children, className, ...rest }: HeaderProps) {
  const links = Children.toArray(children);
  const classes = className ? `mk-header ${className}` : "mk-header";

  return (
    <header className={classes} {...rest}>
      <div className="mk-header-layout">
        <div className="mk-header-brand">{brand}</div>
        {links.length > 0 && (
          <nav aria-label={navigationLabel}>
            <ul className="mk-header-links">
              {links.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </nav>
        )}
        {actions && <div className="mk-header-actions">{actions}</div>}
      </div>
    </header>
  );
}
