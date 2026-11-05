// Colour checks for chart palettes: lightness, chroma and how far apart colours sit for readers with
// and without colour vision deficiency. Distances are OKLab ΔE × 100. Colour vision deficiency is
// simulated with Machado, Oliveira and Fernandes (2009) at full severity, the model these thresholds
// are calibrated to.

export const THRESHOLDS = {
  band: { paper: [0.43, 0.77], forest: [0.48, 0.67] },
  chroma: 0.1,
  deficient: 8,
  normal: 15,
};

const MACHADO = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
};

const linear = (hex) =>
  [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

function oklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

const simulate = (rgb, kind) =>
  kind ? MACHADO[kind].map((row) => Math.min(1, Math.max(0, row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2]))) : rgb;

export function lightnessChroma(hex) {
  const [l, a, b] = oklab(linear(hex));
  return { lightness: l, chroma: Math.hypot(a, b) };
}

// kind is "protan", "deutan" or undefined for normal vision.
export function distance(first, second, kind) {
  const p = oklab(simulate(linear(first), kind));
  const q = oklab(simulate(linear(second), kind));
  return 100 * Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

// The worst pair among the given index pairs, for deficient and for normal vision.
export function worstPairs(colours, pairs) {
  let deficient = Infinity;
  let normal = Infinity;
  for (const [i, j] of pairs) {
    deficient = Math.min(deficient, distance(colours[i], colours[j], "protan"), distance(colours[i], colours[j], "deutan"));
    normal = Math.min(normal, distance(colours[i], colours[j]));
  }
  return { deficient, normal };
}

export const neighbours = (count) => Array.from({ length: count - 1 }, (_, i) => [i, i + 1]);
export const everyPair = (count) =>
  Array.from({ length: count }, (_, i) => Array.from({ length: count - i - 1 }, (_, k) => [i, i + 1 + k])).flat();
