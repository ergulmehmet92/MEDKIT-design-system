// Colour steps for heatmaps, all from the kit's data-viz tokens. Seven classes at most, so neighbouring
// classes stay distinguishable.

export type HeatScale = "sequential" | "diverging";
/**
 * Polarity is blue below and amber above. Direction is red below and green above, for gains and
 * losses. Accent is grey below and honey above, for strength such as correlation (Data board 2B).
 */
export type HeatPalette = "polarity" | "direction" | "accent";

const SEQUENTIAL = [300, 400, 500, 600, 700].map((s) => `var(--mk-color-dataviz-sequential-${s})`);
const POLARITY = ["below-3", "below-2", "below-1", "mid", "above-1", "above-2", "above-3"].map((s) => `var(--mk-color-dataviz-diverging-${s})`);
const mix = (role: "up" | "down", p: number) => `color-mix(in oklab, var(--mk-color-dataviz-${role}) ${p}%, var(--mk-color-dataviz-diverging-mid))`;
const DIRECTION = [mix("down", 100), mix("down", 66), mix("down", 33), "var(--mk-color-dataviz-diverging-mid)", mix("up", 33), mix("up", 66), mix("up", 100)];
const tone = (role: "context" | "accent", p: number) => `color-mix(in oklab, var(--mk-color-dataviz-${role}) ${p}%, var(--mk-color-surface-subtle))`;
const ACCENT = [tone("context", 90), tone("context", 60), tone("context", 30), tone("accent", 8), tone("accent", 40), tone("accent", 70), tone("accent", 100)];
const PALETTES = { polarity: POLARITY, direction: DIRECTION, accent: ACCENT };

/**
 * Returns the colour step for a value. Sequential runs from `lo` to `hi`. Diverging is centred on
 * `centre`, which takes the neutral middle step, and stretches to the furthest value either side.
 */
export function heatColour(value: number, scale: HeatScale, lo: number, hi: number, centre = 0, palette: HeatPalette = "polarity"): { colour: string; step: number } {
  if (scale === "sequential") {
    const t = hi === lo ? 1 : (value - lo) / (hi - lo);
    const step = Math.max(0, Math.min(SEQUENTIAL.length - 1, Math.floor(t * SEQUENTIAL.length - 1e-9)));
    return { colour: SEQUENTIAL[step], step };
  }
  const reach = Math.max(Math.abs(hi - centre), Math.abs(lo - centre)) || 1;
  const t = (value - centre) / reach;
  const step = Math.max(0, Math.min(6, Math.round((t + 1) * 3)));
  return { colour: PALETTES[palette][step], step };
}

/** The steps in order, for the key. */
export const heatSteps = (scale: HeatScale, palette: HeatPalette = "polarity") => (scale === "sequential" ? SEQUENTIAL : PALETTES[palette]);
