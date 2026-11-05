// A shader can't read CSS variables, so these repeat the ambient tokens. A test keeps them in step.

export const DAWN_SECONDS = 1.8;

export type LightTheme = "forest" | "paper";
export type Rgb = [number, number, number];

export const PALETTES = {
  forest: { base: "#0F1B14", mid: "#35543F", high: "#DDD2AC", accent: "#D9A441", grain: 1 },
  paper: { base: "#EFE8DA", mid: "#CDB88F", high: "#FBF8F1", accent: "#B7BE95", grain: 0.45 },
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
