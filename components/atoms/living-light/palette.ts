// A shader can't read CSS variables, so these repeat the ambient tokens. A test keeps them in step.

export const DAWN_SECONDS = 1.8;

/** Forest and Paper follow the page. Blaze is for poster moments only, where type cuts through to the light. */
export type LightTheme = "forest" | "paper" | "blaze";
export type Rgb = [number, number, number];

export const PALETTES = {
  forest: { base: "#0F1B14", mid: "#35543F", high: "#DDD2AC", accent: "#D9A441", grain: 1 },
  paper: { base: "#EFE8DA", mid: "#CDB88F", high: "#FBF8F1", accent: "#B7BE95", grain: 0.45 },
  blaze: { base: "#4B6B4E", mid: "#B7B07E", high: "#F6E9C2", accent: "#E0A93F", grain: 0.8 },
} as const;

export function hexToRgb(hex: string): Rgb {
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255) as Rgb;
}

export function nextShift(shift: number, deltaSeconds: number, reducedMotion: boolean) {
  if (reducedMotion) return 1;
  return Math.min(1, shift + deltaSeconds / DAWN_SECONDS);
}

export function easeShift(shift: number) {
  return shift * shift * (3 - 2 * shift);
}

export function blend(from: Rgb, to: Rgb, amount: number): Rgb {
  return from.map((value, i) => value + (to[i] - value) * amount) as Rgb;
}
