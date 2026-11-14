import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import "./avatar.css";

export type AvatarProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  /** The person's name: the image's text alternative, and the source of the initials. */
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  /** Set when the name is already written beside the avatar, so it isn't read twice. */
  decorative?: boolean;
};

/** Up to two initials, from the first and last words of a name. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * A circle with a hairline rim. The image, or initials in the label face when there is no image or it
 * fails to load, or a quiet silhouette when there is no name either.
 */
export function Avatar({ name, src, size = "md", decorative = false, className, ...rest }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const classes = className ? `mk-avatar ${className}` : "mk-avatar";
  const label = name ?? "No picture";
  const a11y = decorative ? { "aria-hidden": true as const } : { role: "img" as const, "aria-label": label };

  if (src && !failed) {
    return (
      <span className={classes} data-size={size} {...rest} {...(decorative ? { "aria-hidden": true } : {})}>
        <img src={src} alt={decorative ? "" : label} onError={() => setFailed(true)} />
      </span>
    );
  }
  if (name && initials(name)) {
    return (
      <span className={classes} data-size={size} data-kind="initials" {...a11y} {...rest}>
        {initials(name)}
      </span>
    );
  }
  return (
    <span className={classes} data-size={size} data-kind="missing" {...a11y} {...rest}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="9" r="4.5" />
        <path d="M3.5 22c1-5 4.5-8 8.5-8s7.5 3 8.5 8z" />
      </svg>
    </span>
  );
}
