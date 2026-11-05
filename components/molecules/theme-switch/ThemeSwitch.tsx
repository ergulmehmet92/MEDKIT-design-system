"use client";

import { IconButton, type IconButtonProps } from "../../atoms/icon-button";
import { setTheme, type Theme } from "./theme";
import { useTheme } from "./useTheme";

const NAME: Record<Theme, string> = { forest: "Forest", paper: "Paper" };

export function ThemeSwitch({ onClick, ...rest }: Omit<IconButtonProps, "children" | "label">) {
  const theme = useTheme();
  const next: Theme = theme === "paper" ? "forest" : "paper";

  return (
    <IconButton
      label={`Switch to ${NAME[next]} theme`}
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
    </IconButton>
  );
}
