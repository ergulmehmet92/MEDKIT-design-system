import type { ComponentPropsWithoutRef } from "react";
import "./button.css";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "quiet";
};

export function Button({ variant = "primary", type = "button", className, ...rest }: ButtonProps) {
  const classes = className ? `mk-button ${className}` : "mk-button";

  return <button className={classes} data-variant={variant} type={type} {...rest} />;
}
