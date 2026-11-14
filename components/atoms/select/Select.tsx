import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useFieldControl } from "../input/field-context";
import "../input/input.css";
import "./select.css";

export type SelectProps = ComponentPropsWithoutRef<"select">;

/**
 * A native select in the well. Only the well and the chevron are ours; the list is the browser's,
 * so it works with every keyboard, screen reader and touch device as people expect.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, id, required, children, ...rest }, ref) {
  const field = useFieldControl();
  return (
    <span className="mk-select">
      <select
        ref={ref}
        className={className ? `mk-well ${className}` : "mk-well"}
        id={id ?? field?.id}
        required={required ?? field?.required}
        aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
        aria-invalid={rest["aria-invalid"] ?? (field ? field.invalid : undefined)}
        {...rest}
      >
        {children}
      </select>
      <svg className="mk-select-chevron" viewBox="0 0 12 8" aria-hidden="true" focusable="false">
        <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
});
