import { Button, type ButtonProps } from "../button";
import "./icon-button.css";

export type IconButtonProps = Omit<ButtonProps, "variant"> & {
  /** Names the button for assistive technology, and shows as a tooltip. Required, as there's no visible text. */
  label: string;
};

export function IconButton({ label, className, ...rest }: IconButtonProps) {
  const classes = className ? `mk-icon-button ${className}` : "mk-icon-button";

  return <Button variant="quiet" className={classes} aria-label={label} title={label} {...rest} />;
}
