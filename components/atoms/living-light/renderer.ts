import { blend, easeShift, hexToRgb, nextShift, PALETTES, type LightTheme, type Rgb } from "./palette";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shader";

export type LightForm = "ridge" | "dune";
export type LightOptions = { form: LightForm; theme: LightTheme; calm: number; grain: number; speed: number; seed: number };

const FORMS: Record<LightForm, number> = { ridge: 0, dune: 1 };
const UNIFORMS = ["uRes", "uT", "uN", "uForm", "uGrain", "uGrainSize", "uCalm", "uSeed", "uShift", "uBaseA", "uMidA", "uHiA", "uAccentA", "uBaseB", "uMidB", "uHiB", "uAccentB"];
const FRAME_MS = 33;
const MAX_DENSITY = 1.25;
const MAX_SIDE = 1600;
// Tuned by Mehmet on the Grain board, 2026-11-06: grain in 2px cells, reseeded ten times a second
// on the clock, so a faster light doesn't make it shimmer faster.
const GRAIN_SIZE = 2;
const GRAIN_RATE = 10;

type Colours = { base: Rgb; mid: Rgb; high: Rgb; accent: Rgb; grain: number };

const coloursOf = (theme: LightTheme): Colours => {
  const palette = PALETTES[theme];
  return { base: hexToRgb(palette.base), mid: hexToRgb(palette.mid), high: hexToRgb(palette.high), accent: hexToRgb(palette.accent), grain: palette.grain };
};

function createProgram(gl: WebGLRenderingContext) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

// Draws until stopped, and only while something can see it. Returns null without WebGL, which
// leaves the CSS fallback showing.
export function startRenderer(canvas: HTMLCanvasElement, initial: LightOptions) {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
  if (!gl) return null;
  const program = createProgram(gl);
  if (!program) return null;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aP");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniforms = Object.fromEntries(UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]));

  let options = initial;
  let from = coloursOf(options.theme);
  let to = from;
  let shift = 1;
  let time = 12;
  let clock = 0;
  let scale = 1;
  let frame = 0;
  let last = 0;
  let alive = true;
  let visible = true;
  const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

  const resize = () => {
    const density = Math.min(window.devicePixelRatio || 1, MAX_DENSITY);
    const longest = Math.max(canvas.clientWidth, canvas.clientHeight, 1) * density;
    const fit = longest > MAX_SIDE ? MAX_SIDE / longest : 1;
    scale = density * fit;
    const width = Math.max(1, Math.round(canvas.clientWidth * density * fit));
    const height = Math.max(1, Math.round(canvas.clientHeight * density * fit));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };

  const draw = (now: number) => {
    frame = 0;
    if (!alive) return;
    if (last && now - last < FRAME_MS) {
      frame = requestAnimationFrame(draw);
      return;
    }
    const delta = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    const still = Boolean(motion?.matches);
    if (!still) {
      time += delta * options.speed;
      clock += delta;
    }
    shift = nextShift(shift, delta, still);
    const eased = easeShift(shift);

    resize();
    gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
    gl.uniform1f(uniforms.uT, time);
    gl.uniform1f(uniforms.uN, Math.floor(clock * GRAIN_RATE) % 97);
    gl.uniform1f(uniforms.uGrainSize, GRAIN_SIZE * scale);
    gl.uniform1f(uniforms.uForm, FORMS[options.form]);
    gl.uniform1f(uniforms.uGrain, options.grain * (from.grain + (to.grain - from.grain) * eased));
    gl.uniform1f(uniforms.uCalm, options.calm);
    gl.uniform1f(uniforms.uSeed, options.seed);
    gl.uniform1f(uniforms.uShift, eased);
    gl.uniform3fv(uniforms.uBaseA, from.base);
    gl.uniform3fv(uniforms.uMidA, from.mid);
    gl.uniform3fv(uniforms.uHiA, from.high);
    gl.uniform3fv(uniforms.uAccentA, from.accent);
    gl.uniform3fv(uniforms.uBaseB, to.base);
    gl.uniform3fv(uniforms.uMidB, to.mid);
    gl.uniform3fv(uniforms.uHiB, to.high);
    gl.uniform3fv(uniforms.uAccentB, to.accent);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.setAttribute("data-ready", "");

    if (visible && !document.hidden && (!still || shift < 1)) frame = requestAnimationFrame(draw);
  };

  const wake = () => {
    if (!frame && alive && visible && !document.hidden) {
      last = 0;
      frame = requestAnimationFrame(draw);
    }
  };

  const sizes = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(wake);
  sizes?.observe(canvas);
  const view =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver((entries) => {
          visible = entries[entries.length - 1].isIntersecting;
          wake();
        });
  view?.observe(canvas);
  document.addEventListener("visibilitychange", wake);

  const lost = () => {
    alive = false;
    canvas.removeAttribute("data-ready");
  };
  canvas.addEventListener("webglcontextlost", lost);
  wake();

  return {
    update(next: LightOptions) {
      if (next.theme !== options.theme) {
        // Starts from wherever the last change reached, so a quick second press stays clean.
        const reached = easeShift(shift);
        from = {
          base: blend(from.base, to.base, reached),
          mid: blend(from.mid, to.mid, reached),
          high: blend(from.high, to.high, reached),
          accent: blend(from.accent, to.accent, reached),
          grain: from.grain + (to.grain - from.grain) * reached,
        };
        to = coloursOf(next.theme);
        shift = 0;
      }
      options = next;
      wake();
    },
    stop() {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      sizes?.disconnect();
      view?.disconnect();
      document.removeEventListener("visibilitychange", wake);
      canvas.removeEventListener("webglcontextlost", lost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
