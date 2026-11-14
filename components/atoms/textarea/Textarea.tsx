import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useFieldControl } from "../input/field-context";
import "../input/input.css";
import "./textarea.css";

export type TextareaProps = ComponentPropsWithoutRef<"textarea">;

/** Several lines of text in the same well as Input, with 14px corners because a stadium can't hold lines. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, id, required, rows = 3, ...rest }, ref) {
  const field = useFieldControl();
  return (
    <textarea
      ref={ref}
      className={className ? `mk-well mk-textarea ${className}` : "mk-well mk-textarea"}
      id={id ?? field?.id}
      rows={rows}
      required={required ?? field?.required}
      aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
      aria-invalid={rest["aria-invalid"] ?? (field ? field.invalid : undefined)}
      {...rest}
    />
  );
});
