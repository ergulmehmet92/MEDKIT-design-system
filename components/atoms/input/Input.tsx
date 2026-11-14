import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useFieldControl } from "./field-context";
import "./input.css";

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  /** A small leading icon, such as a magnifier. Decorative: the label names the field. */
  icon?: ReactNode;
};

/** A one-line text field: Lens glass pressed into the surface. Put it in a Field for its label. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ icon, className, id, required, ...rest }, ref) {
  const field = useFieldControl();
  const classes = className ? `mk-well mk-input ${className}` : "mk-well mk-input";
  const input = (
    <input
      ref={ref}
      className={classes}
      id={id ?? field?.id}
      required={required ?? field?.required}
      aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
      aria-invalid={rest["aria-invalid"] ?? (field ? field.invalid : undefined)}
      {...rest}
    />
  );
  if (!icon) return input;
  return (
    <span className="mk-input-affix">
      <span className="mk-input-icon" aria-hidden="true">
        {icon}
      </span>
      {input}
    </span>
  );
});
