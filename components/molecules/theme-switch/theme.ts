export type Theme = "forest" | "paper";

export const THEME_STORAGE_KEY = "mk-theme";

const THEME_CHANGE_EVENT = "mk:themechange";

/**
 * Inline this in the document head, before anything paints, so a saved choice never flashes.
 * First-time visitors keep the default: Forest, whatever the device prefers.
 */
export const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="paper"||t==="forest")document.documentElement.dataset.theme=t}catch(e){}`;

const isTheme = (value: string | null): value is Theme => value === "forest" || value === "paper";

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "paper" ? "paper" : "forest";
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked. The theme still applies for this visit.
  }
  document.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function subscribeToTheme(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY || !isTheme(event.newValue)) return;
    document.documentElement.dataset.theme = event.newValue;
    onChange();
  };

  document.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);

  return () => {
    document.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
