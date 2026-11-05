"use client";

import { useSyncExternalStore } from "react";
import { getTheme, subscribeToTheme, type Theme } from "./theme";

const serverTheme = (): Theme => "forest";

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeToTheme, getTheme, serverTheme);
}
