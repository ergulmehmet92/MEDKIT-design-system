import type { ComponentPropsWithoutRef, ReactNode } from "react";
import "./chip.css";

type Base = { children: ReactNode; className?: string };

export type ChipProps =
  | (Base & { pressed?: undefined; onPressedChange?: undefined; onRemove?: undefined } & Omit<ComponentPropsWithoutRef<"span">, "children">)
  | (Base & {
      /** A toggle: on or off, announced with aria-pressed. */
      pressed: boolean;
      onPressedChange?: (pressed: boolean) => void;
      onRemove?: undefined;
    } & Omit<ComponentPropsWithoutRef<"button">, "children" | "onChange">)
  | (Base & {
      pressed?: undefined;
      onPressedChange?: undefined;
      /** Removable: a 24px close button after the label. */
      onRemove: () => void;
      /** Names the close button. Defaults to "Remove" and the label, when the label is text. */
      removeLabel?: string;
    } & Omit<ComponentPropsWithoutRef<"span">, "children">);

const Tick = () => (
  <svg className="mk-chip-tick" viewBox="0 0 10 10" aria-hidden="true" focusable="false">
    <path d="M1.5 5.5l2.5 2.5 4.5-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
    <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * A small Lens stadium. Static chips label; toggle chips filter, filling with the Eclipse body and
 * a tick when pressed; removable chips carry a close button.
 */
export function Chip(props: ChipProps) {
  if (props.pressed !== undefined) {
    const { pressed, onPressedChange, children, className, onClick, ...rest } = props;
    return (
      <button
        type="button"
        className={className ? `mk-chip ${className}` : "mk-chip"}
        aria-pressed={pressed}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) onPressedChange?.(!pressed);
        }}
        {...rest}
      >
        <Tick />
        {children}
      </button>
    );
  }
  if (props.onRemove) {
    const { onRemove, removeLabel, children, className, ...rest } = props;
    const name = removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove");
    return (
      <span className={className ? `mk-chip ${className}` : "mk-chip"} data-removable="" {...rest}>
        {children}
        <button type="button" className="mk-chip-remove" aria-label={name} onClick={onRemove}>
          <Cross />
        </button>
      </span>
    );
  }
  const { children, className, ...rest } = props as Base & Omit<ComponentPropsWithoutRef<"span">, "children">;
  return (
    <span className={className ? `mk-chip ${className}` : "mk-chip"} {...rest}>
      {children}
    </span>
  );
}
