// A small layered sankey layout. d3-sankey's own dependency ranges clash with the kit's d3 pins, and
// the kit's flows are short and acyclic, so columns come from each node's longest path from a source.

export type SankeyNodeInput = { id: string; name: string; highlight?: boolean };
export type SankeyLinkInput = { source: string; target: string; value: number };

export type LaidNode = SankeyNodeInput & { column: number; value: number; x: number; y: number; height: number };
export type LaidLink = SankeyLinkInput & { width: number; sy: number; ty: number; sx: number; tx: number };

export function layoutSankey(nodes: SankeyNodeInput[], links: SankeyLinkInput[], width: number, height: number, nodeWidth: number, gap: number) {
  const live = links.filter((l) => Number.isFinite(l.value) && l.value > 0 && l.source !== l.target);
  const ids = new Set(nodes.map((n) => n.id));
  const used = live.filter((l) => ids.has(l.source) && ids.has(l.target));

  // Longest path from any source, which keeps every flow moving rightwards.
  const column = new Map(nodes.map((n) => [n.id, 0]));
  for (let pass = 0; pass < nodes.length; pass++) {
    let moved = false;
    for (const l of used) {
      const next = (column.get(l.source) ?? 0) + 1;
      if (next > (column.get(l.target) ?? 0)) {
        column.set(l.target, next);
        moved = true;
      }
    }
    if (!moved) break;
  }
  const columns = Math.max(0, ...column.values()) + 1;
  const flowIn = (id: string) => used.filter((l) => l.target === id).reduce((s, l) => s + l.value, 0);
  const flowOut = (id: string) => used.filter((l) => l.source === id).reduce((s, l) => s + l.value, 0);
  const valued = nodes.map((n) => ({ ...n, column: column.get(n.id) ?? 0, value: Math.max(flowIn(n.id), flowOut(n.id)) })).filter((n) => n.value > 0);

  // One scale for every column, set by the fullest, so widths compare across the chart.
  const byColumn = Array.from({ length: columns }, (_, c) => valued.filter((n) => n.column === c));
  const scale = Math.min(...byColumn.map((list) => (height - gap * Math.max(0, list.length - 1)) / Math.max(1e-9, list.reduce((s, n) => s + n.value, 0))));
  const step = columns > 1 ? (width - nodeWidth) / (columns - 1) : 0;
  const laid = new Map<string, LaidNode>();
  byColumn.forEach((list) => {
    const used = list.reduce((s, n) => s + n.value * scale, 0) + gap * Math.max(0, list.length - 1);
    let y = (height - used) / 2;
    list.forEach((n) => {
      laid.set(n.id, { ...n, x: n.column * step, y, height: n.value * scale });
      y += n.value * scale + gap;
    });
  });

  // Flows leave and arrive in the order of the nodes at their other end, so ribbons don't cross needlessly.
  const outOffset = new Map<string, number>();
  const inOffset = new Map<string, number>();
  const ordered = [...used].sort((a, b) => (laid.get(a.target)?.y ?? 0) - (laid.get(b.target)?.y ?? 0) || (laid.get(a.source)?.y ?? 0) - (laid.get(b.source)?.y ?? 0));
  const flows: LaidLink[] = [];
  for (const l of ordered) {
    const s = laid.get(l.source);
    const t = laid.get(l.target);
    if (!s || !t) continue;
    const w = l.value * scale;
    const so = outOffset.get(l.source) ?? 0;
    outOffset.set(l.source, so + w);
    flows.push({ ...l, width: w, sx: s.x + nodeWidth, tx: t.x, sy: s.y + so, ty: 0 });
  }
  [...flows].sort((a, b) => (laid.get(a.source)?.y ?? 0) - (laid.get(b.source)?.y ?? 0)).forEach((f) => {
    const t = laid.get(f.target)!;
    const io = inOffset.get(f.target) ?? 0;
    inOffset.set(f.target, io + f.width);
    f.ty = t.y + io;
  });
  return { nodes: [...laid.values()], links: flows, columns };
}

/** A ribbon from one node's side to another's, as a filled band with smooth curves. */
export function ribbon(l: LaidLink): string {
  const mx = (l.sx + l.tx) / 2;
  return `M${l.sx} ${l.sy}C${mx} ${l.sy} ${mx} ${l.ty} ${l.tx} ${l.ty}L${l.tx} ${l.ty + l.width}C${mx} ${l.ty + l.width} ${mx} ${l.sy + l.width} ${l.sx} ${l.sy + l.width}Z`;
}
