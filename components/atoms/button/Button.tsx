import type { ComponentPropsWithoutRef } from "react";
import "./button.css";

type Variant = { variant?: "primary" | "quiet" };

export type ButtonAsButtonProps = ComponentPropsWithoutRef<"button"> & Variant & { href?: undefined };
export type ButtonAsLinkProps = ComponentPropsWithoutRef<"a"> & Variant & { href: string };

/** Without `href` it's a native button. With one, it's a native link in the same material. */
export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant = "primary", className, ...rest } = props;
    return <a className={className ? `mk-button ${className}` : "mk-button"} data-variant={variant} {...rest} />;
  }

  const { variant = "primary", type = "button", className, ...rest } = props;
  return <button className={className ? `mk-button ${className}` : "mk-button"} data-variant={variant} type={type} {...rest} />;
}
