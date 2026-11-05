// The pointer is the light source: every Button faces it. Without this running, buttons use the
// defaults in button.css, and quiet buttons use plain blurred glass.

export type LightPoint = { x: number; y: number };
export type LightBox = { left: number; top: number; width: number; height: number };

const LENS_BEND = 44;
const LENS_EDGE = 18;
const LENS_DISPERSION = 0.1;
const EASE = 0.14;

export function lightOn(source: LightPoint, box: LightBox, reach: number) {
  const dx = source.x - (box.left + box.width / 2);
  const dy = source.y - (box.top + box.height / 2);

  return {
    angle: (Math.atan2(dx, -dy) * 180) / Math.PI,
    x: ((source.x - box.left) / box.width) * 100,
    y: ((source.y - box.top) / box.height) * 100,
    near: Math.max(0, 1 - Math.hypot(dx, dy) / reach),
  };
}

// An feDisplacementMap image for a rounded box: strongest at the rim, none in the middle.
export function lensMap(width: number, height: number, radius: number, edge: number) {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + 0.5 - width / 2;
      const py = y + 0.5 - height / 2;
      const qx = Math.abs(px) - (width / 2 - radius);
      const qy = Math.abs(py) - (height / 2 - radius);
      const distance = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
      const depth = Math.min(Math.max(-distance / edge, 0), 1);
      const strength = Math.pow(1 - depth, 2.4);

      let nx = 0;
      let ny = 0;
      if (qx > 0 && qy > 0) {
        const length = Math.hypot(qx, qy) || 1;
        nx = (qx / length) * Math.sign(px);
        ny = (qy / length) * Math.sign(py);
      } else if (qx > qy) {
        nx = Math.sign(px);
      } else {
        ny = Math.sign(py);
      }

      const i = (y * width + x) * 4;
      data[i] = 128 - 127 * nx * strength;
      data[i + 1] = 128 - 127 * ny * strength;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }

  return data;
}

const CHANNELS = [
  { name: "r", bend: 1 + LENS_DISPERSION, values: "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" },
  { name: "g", bend: 1, values: "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" },
  { name: "b", bend: 1 - LENS_DISPERSION, values: "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" },
];

let lensCount = 0;

// Only Chromium accepts SVG filters in backdrop-filter, and there's no feature test for it:
// @supports reports true elsewhere, and those browsers then show no filter at all.
function startLens() {
  if (!/Chrome\//.test(navigator.userAgent) || typeof ResizeObserver === "undefined") {
    return { watch() {}, stop() {} };
  }

  const NS = "http://www.w3.org/2000/svg";
  const make = (name: string, attributes: Record<string, string | number>, parent: Element) => {
    const node = document.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    parent.append(node);
    return node;
  };

  const host = make("svg", { "data-mk-lens": "", width: 0, height: 0, "aria-hidden": "true", style: "position:absolute" }, document.body);
  const filters = new Map<string, string>();

  const filterFor = (width: number, height: number) => {
    const key = `${width}x${height}`;
    const known = filters.get(key);
    if (known) return known;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.putImageData(new ImageData(lensMap(width, height, Math.min(width, height) / 2, LENS_EDGE), width, height), 0, 0);

    const id = `mk-lens-${lensCount++}`;
    const box = { x: 0, y: 0, width, height };
    const filter = make("filter", { id, ...box, filterUnits: "userSpaceOnUse", primitiveUnits: "userSpaceOnUse", "color-interpolation-filters": "sRGB" }, host);
    make("feImage", { href: canvas.toDataURL(), ...box, preserveAspectRatio: "none", result: "map" }, filter);
    for (const { name, bend, values } of CHANNELS) {
      make("feDisplacementMap", { in: "SourceGraphic", in2: "map", scale: LENS_BEND * bend, xChannelSelector: "R", yChannelSelector: "G", result: `d${name}` }, filter);
      make("feColorMatrix", { in: `d${name}`, type: "matrix", values, result: `c${name}` }, filter);
    }
    make("feBlend", { in: "cr", in2: "cg", mode: "screen", result: "rg" }, filter);
    make("feBlend", { in: "rg", in2: "cb", mode: "screen" }, filter);

    const reference = `url(#${id})`;
    filters.set(key, reference);
    return reference;
  };

  const sizes = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const button = target as HTMLElement;
      if (!button.offsetWidth) continue;
      const reference = filterFor(button.offsetWidth, button.offsetHeight);
      if (reference) button.style.setProperty("--mk-lens", reference);
    }
  });
  const watched = new Set<Element>();

  return {
    watch() {
      for (const button of document.querySelectorAll('.mk-button[data-variant="quiet"]')) {
        if (!watched.has(button)) {
          watched.add(button);
          sizes.observe(button);
        }
      }
    },
    stop() {
      sizes.disconnect();
      for (const button of watched) (button as HTMLElement).style.removeProperty("--mk-lens");
      host.remove();
    },
  };
}

export function startLight() {
  const goal: LightPoint = { x: window.innerWidth / 2, y: window.innerHeight * 0.2 };
  const source = { ...goal };
  const lens = startLens();
  const still = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  let frame = 0;

  const paint = () => {
    const reach = Math.hypot(window.innerWidth, window.innerHeight) * 0.42;
    for (const element of document.querySelectorAll<HTMLElement>(".mk-button")) {
      const box = element.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) continue;
      const light = lightOn(source, box, reach);
      element.style.setProperty("--mk-light-angle", `${light.angle.toFixed(1)}deg`);
      element.style.setProperty("--mk-light-x", `${light.x.toFixed(1)}%`);
      element.style.setProperty("--mk-light-y", `${light.y.toFixed(1)}%`);
      element.style.setProperty("--mk-light-near", light.near.toFixed(3));
    }
  };

  const tick = () => {
    frame = 0;
    const ease = still?.matches ? 1 : EASE;
    source.x += (goal.x - source.x) * ease;
    source.y += (goal.y - source.y) * ease;
    paint();
    if (Math.hypot(goal.x - source.x, goal.y - source.y) > 0.5) schedule();
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };
  const follow = (event: PointerEvent) => {
    goal.x = event.clientX;
    goal.y = event.clientY;
    schedule();
  };
  const changed = () => {
    lens.watch();
    schedule();
  };

  const passive = { passive: true };
  const added = new MutationObserver(changed);
  added.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("pointermove", follow, passive);
  document.addEventListener("pointerdown", follow, passive);
  window.addEventListener("scroll", schedule, { passive: true, capture: true });
  window.addEventListener("resize", schedule, passive);
  changed();

  return () => {
    if (frame) cancelAnimationFrame(frame);
    added.disconnect();
    document.removeEventListener("pointermove", follow);
    document.removeEventListener("pointerdown", follow);
    window.removeEventListener("scroll", schedule, { capture: true });
    window.removeEventListener("resize", schedule);
    lens.stop();
  };
}
