/** Shared timing for scripted motion: the token durations, the default easing, and the gates. */

/** A motion duration token in milliseconds, read from the page, with a fallback. */
export function tokenMs(el: Element, name: string, fallback: number): number {
  const raw = getComputedStyle(el).getPropertyValue(`--mk-motion-duration-${name}`).trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return fallback;
  return raw.endsWith("ms") ? n : n * 1000;
}

/** out-expo, the default easing: fast, then settling. */
export const outExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/** Whether scripted motion may run: not when reduced, and only where we can tell it's on screen. */
export function motionAllowed(): boolean {
  if (typeof window === "undefined" || typeof IntersectionObserver !== "function") return false;
  return !(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
}

/** Calls `start` once, when the element is at least 30% in view. Returns a cleanup. */
export function whenSeen(el: Element, start: () => void): () => void {
  const seen = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        seen.disconnect();
        start();
      }
    },
    { threshold: 0.3 },
  );
  seen.observe(el);
  return () => seen.disconnect();
}
