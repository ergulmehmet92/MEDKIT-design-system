"use client";

import { Button, type ButtonProps } from "../../atoms/button";
import { setTheme, type Theme } from "./theme";
import { useTheme } from "./useTheme";
import "./theme-switch.css";

const LABEL: Record<Theme, string> = { forest: "Forest", paper: "Paper" };

export function ThemeSwitch({ className, onClick, ...rest }: Omit<ButtonProps, "children" | "variant">) {
  const theme = useTheme();
  const next: Theme = theme === "paper" ? "forest" : "paper";
  const classes = className ? `mk-theme-switch ${className}` : "mk-theme-switch";

  return (
    <Button
      variant="quiet"
      className={classes}
      aria-label={`${LABEL[theme]} theme. Switch to ${LABEL[next]}`}
      onClick={(event) => {
        setTheme(next);
        onClick?.(event);
      }}
      {...rest}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
        <path d="M8 1a7 7 0 0 1 0 14z" fill="currentColor" />
      </svg>
      {LABEL[theme]}
    </Button>
  );
}
