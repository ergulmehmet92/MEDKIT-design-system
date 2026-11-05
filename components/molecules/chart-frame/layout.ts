// Pure layout helpers shared by every chart. No DOM, so each one is tested on its own.

export type Point = { x: number; y: number };
export type Box = { x: number; y: number; width: number; height: number };

/** Keeps every k-th label, with k as small as it can be while labels stay `gap` apart. */
export function thinLabels(positions: number[], widths: number[], gap: number): boolean[] {
  if (positions.length < 2) return positions.map(() => true);
  for (let every = 1; every <= positions.length; every++) {
    let clear = true;
    let lastEnd = -Infinity;
    for (let i = 0; i < positions.length; i += every) {
      const start = positions[i] - widths[i] / 2;
      if (start < lastEnd + gap) {
        clear = false;
        break;
      }
      lastEnd = positions[i] + widths[i] / 2;
    }
    if (clear) return positions.map((_, i) => i % every === 0);
  }
  return positions.map((_, i) => i === 0);
}

export type RailItem = { x: number; width: number };
export type RailOptions = { rows: number; mark: number; gap: number; limit: number };

/**
 * Places event labels on a rail. Row 0 sits beside each mark, so a label there has to clear the next
 * mark as well as the last label. Higher rows sit above the marks and only clear other labels. A
 * label with no room returns -1 and is left to the tooltip.
 */
export function placeRail(items: RailItem[], { rows, mark, gap, limit }: RailOptions): number[] {
  const ends = Array.from({ length: rows }, () => -Infinity);
  return items.map((item, k) => {
    const next = k + 1 < items.length ? items[k + 1].x - mark - gap : limit;
    const startFor = (row: number) => (row === 0 ? item.x + mark + 4 : item.x + 4);
    const row = ends.findIndex((end, r) => {
      const start = startFor(r);
      const stop = start + item.width;
      return start > end + gap && stop <= (r === 0 ? next : limit) && stop <= limit;
    });
    if (row >= 0) ends[row] = startFor(row) + item.width;
    // A mark blocks the rows above it, so no higher label sits on its stem.
    for (let r = 1; r < rows; r++) if (r !== row) ends[r] = Math.max(ends[r], item.x + mark);
    return row;
  });
}

/**
 * Spreads end labels apart vertically so none sit closer than `gap`, staying inside [min, max].
 * The caller draws a leader from each label back to its mark, so moved labels stay attached.
 */
export function spreadLabels(targets: number[], gap: number, min: number, max: number): number[] {
  const order = targets.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  const ys = order.map((o) => o.y);
  for (let pass = 0; pass < 50; pass++) {
    let moved = false;
    for (let k = 1; k < ys.length; k++) {
      const overlap = gap - (ys[k] - ys[k - 1]);
      if (overlap > 0.01) {
        ys[k - 1] -= overlap / 2;
        ys[k] += overlap / 2;
        moved = true;
      }
    }
    for (let k = 0; k < ys.length; k++) ys[k] = Math.min(max, Math.max(min, ys[k]));
    for (let k = 1; k < ys.length; k++) if (ys[k] < ys[k - 1] + gap) ys[k] = Math.min(max, ys[k - 1] + gap);
    if (!moved) break;
  }
  const out = new Array<number>(targets.length);
  order.forEach((o, k) => (out[o.i] = ys[k]));
  return out;
}

/**
 * Picks where a note's text box goes around its anchor: the candidate covering the fewest data
 * points, inside the plot. Returns the box's top-left corner, or null when no side fits, so a note
 * drops out of a narrow plot instead of spilling over it.
 */
export function placeNote(anchor: Point, size: { width: number; height: number }, points: Point[], bounds: Box, offset = 28): Point | null {
  const { width, height } = size;
  const candidates: Point[] = [
    { x: anchor.x + offset, y: anchor.y + offset },
    { x: anchor.x + offset, y: anchor.y - offset - height },
    { x: anchor.x - offset - width, y: anchor.y + offset },
    { x: anchor.x - offset - width, y: anchor.y - offset - height },
  ];
  let best = candidates[0];
  let bestScore = Infinity;
  for (const c of candidates) {
    const outside = c.x < bounds.x || c.y < bounds.y || c.x + width > bounds.x + bounds.width || c.y + height > bounds.y + bounds.height;
    let score = outside ? 1e6 : 0;
    for (const p of points) if (p.x >= c.x - 6 && p.x <= c.x + width + 6 && p.y >= c.y - 6 && p.y <= c.y + height + 6) score++;
    if (score < bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return bestScore >= 1e6 ? null : best;
}

/** Index of the nearest position, for pointer and keyboard reading. */
export function nearestIndex(positions: number[], x: number): number {
  let best = 0;
  for (let i = 1; i < positions.length; i++) if (Math.abs(positions[i] - x) < Math.abs(positions[best] - x)) best = i;
  return best;
}

/** Signed number with a true minus sign, for deltas and annotations. */
export function signed(value: number, digits = 1): string {
  const text = Math.abs(value).toFixed(digits);
  if (Number(text) === 0) return text;
  return (value < 0 ? "−" : "+") + text;
}
