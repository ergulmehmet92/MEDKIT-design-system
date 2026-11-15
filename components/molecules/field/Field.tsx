import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { FieldContext } from "../../atoms/input/field-context";
import "./field.css";

export type FieldProps = {
  label: ReactNode;
  /** Help that stays under the control. */
  hint?: ReactNode;
  /** An error the app has found. Shown at once, and the control is marked invalid. */
  error?: ReactNode;
  /**
   * What to say when the browser's own checks fail (required, min, max, pattern), once someone has
   * used the field. Defaults to the browser's message.
   */
  invalidMessage?: string;
  /** Says "optional" beside the label. Fields are required by default only when the control says so. */
  optional?: boolean;
  required?: boolean;
  /** One Input, Textarea or Select. */
  children: ReactNode;
  className?: string;
};

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
const isControl = (t: EventTarget | null): t is Control =>
  t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement;

/**
 * :user-invalid's rule, tracked here so the error and aria-invalid change together: a control is
 * invalid once someone has typed in or changed it and its value fails the browser's checks.
 */
function userInvalid(el: Control, touched: boolean): boolean {
  return touched && !el.validity.valid;
}

const Hexagon = () => (
  <svg className="mk-field-error-icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M6 0.5l4.76 2.75v5.5L6 11.5 1.24 8.75v-5.5z" />
  </svg>
);

/**
 * A label, the control, a hint and an error, tied together. Errors appear only after the field has
 * been used, or when the app passes one, and always as a sentence beside the Failed hexagon.
 */
export function Field({ label, hint, error, invalidMessage, optional, required = false, children, className }: FieldProps) {
  const base = useId();
  const id = `${base}-control`;
  const hintId = hint ? `${base}-hint` : undefined;
  const errorId = `${base}-error`;
  const [native, setNative] = useState<{ invalid: boolean; message: string; touched: boolean }>({ invalid: false, message: "", touched: false });

  const root = useRef<HTMLDivElement>(null);

  // Keep the error in step with :user-invalid, as the browser decides it: check on blur, change and a
  // failed submit, and clear as soon as typing fixes it. 'invalid' doesn't bubble, so listen in capture.
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let touched = false;
    const check = (event: Event) => {
      const el = event.target;
      if (!isControl(el)) return;
      if (event.type !== "blur") touched = true;
      const invalid = event.type === "invalid" || userInvalid(el, touched);
      setNative((prev) => {
        if (event.type === "input" && !prev.invalid) return prev;
        return prev.invalid === invalid && prev.message === el.validationMessage ? prev : { invalid, message: el.validationMessage, touched };
      });
    };
    const events = ["blur", "change", "input", "invalid"] as const;
    events.forEach((type) => node.addEventListener(type, check, true));
    // A form reset clears the browser's own flag, so it clears ours.
    const form = node.closest("form");
    const reset = () => {
      touched = false;
      setNative({ invalid: false, message: "", touched: false });
    };
    form?.addEventListener("reset", reset);
    return () => {
      events.forEach((type) => node.removeEventListener(type, check, true));
      form?.removeEventListener("reset", reset);
    };
  }, []);

  const shown = error ?? (native.invalid ? invalidMessage ?? native.message : null);
  const describedBy = [hintId, shown ? errorId : undefined].filter(Boolean).join(" ") || undefined;
  const control = useMemo(() => ({ id, describedBy, invalid: Boolean(shown), required }), [id, describedBy, shown, required]);

  return (
    <div
      className={className ? `mk-field ${className}` : "mk-field"}
      ref={root}
      data-invalid={shown ? "" : undefined}
    >
      <label className="mk-field-label" htmlFor={id}>
        {label}
        {optional ? <span className="mk-field-optional"> optional</span> : null}
      </label>
      <FieldContext.Provider value={control}>{children}</FieldContext.Provider>
      {hint ? (
        <p className="mk-field-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {shown ? (
        <p className="mk-field-error" id={errorId}>
          <Hexagon />
          {shown}
        </p>
      ) : null}
    </div>
  );
}
