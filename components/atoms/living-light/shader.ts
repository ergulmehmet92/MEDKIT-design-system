export const VERTEX_SHADER = "attribute vec2 aP; void main(){ gl_Position = vec4(aP, 0.0, 1.0); }";

export const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 uRes;
  uniform float uT, uN, uForm, uGrain, uGrainSize, uCalm, uSeed, uShift;
  uniform vec3 uBaseA, uMidA, uHiA, uAccentA;
  uniform vec3 uBaseB, uMidB, uHiB, uAccentB;

  float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float vn(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float s = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      s += a * vn(p);
      p = p * 2.03 + vec2(11.7, 5.3);
      a *= 0.5;
    }
    return s;
  }
  float light(vec2 q, float t) {
    float d;
    float soft;
    float dir = 1.0;
    if (uForm < 0.5) {
      vec2 c = vec2(0.26 + 0.10 * sin(t * 0.11), -0.62 + 0.07 * cos(t * 0.09));
      vec2 v = (q - c) * vec2(0.86, 1.0);
      d = length(v) - (0.78 + 0.06 * sin(t * 0.13));
      float a = atan(v.y, v.x);
      soft = mix(0.012, 0.42, smoothstep(0.6, 2.4, a + 0.35 * sin(t * 0.07)));
      dir = smoothstep(-0.7, 1.0, sin(a));
    } else {
      d = q.y - (-0.06 + 0.22 * sin(q.x * 1.7 + t * 0.10) + 0.08 * sin(q.x * 3.4 - t * 0.07 + 1.0));
      soft = mix(0.015, 0.34, smoothstep(-0.5, 0.7, sin(q.x * 1.3 - t * 0.05 + 2.0)));
      dir = 0.75 + 0.25 * sin(q.x * 1.1 + t * 0.06);
    }
    float inside = 1.0 - smoothstep(-soft, soft * 0.4, d);
    float band = exp(min(d, 0.0) * 2.6);
    float halo = exp(-max(d, 0.0) * 14.0) * 0.06;
    return clamp(inside * band * dir + halo, 0.0, 1.0);
  }
  vec3 shade(float v, float pool, vec3 base, vec3 middle, vec3 high, vec3 accent) {
    vec3 c = mix(base, middle, smoothstep(0.0, 0.55, v));
    c = mix(c, high, smoothstep(0.45, 1.0, v));
    return mix(c, accent, pool);
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float t = uT + uSeed * 37.0;
    vec2 w = vec2(fbm(p * 1.05 + vec2(0.0, t * 0.035)), fbm(p * 1.05 + vec2(5.2, -t * 0.03))) - 0.46;
    vec2 q = p + w * 0.42;
    vec2 ca = (p / (length(p) + 0.001)) * (0.0035 + 0.0065 * length(p));
    float vr = light(q + ca, t);
    float vg = light(q, t);
    float vb = light(q - ca, t);
    float pool = smoothstep(0.45, 0.8, fbm(q * 0.8 + vec2(t * 0.02, -t * 0.03) + 7.0)) * smoothstep(0.02, 0.4, vg) * 0.55;
    vec3 from = vec3(shade(vr, pool, uBaseA, uMidA, uHiA, uAccentA).r, shade(vg, pool, uBaseA, uMidA, uHiA, uAccentA).g, shade(vb, pool, uBaseA, uMidA, uHiA, uAccentA).b);
    vec3 to = vec3(shade(vr, pool, uBaseB, uMidB, uHiB, uAccentB).r, shade(vg, pool, uBaseB, uMidB, uHiB, uAccentB).g, shade(vb, pool, uBaseB, uMidB, uHiB, uAccentB).b);
    // Dawn: the new theme spreads out from the brightest part of the light.
    float reach = (1.0 - vg) * 0.75 + fbm(q * 1.3 + 3.0) * 0.35;
    float m = smoothstep(reach - 0.18, reach + 0.18, uShift * 1.6 - 0.25);
    vec3 col = mix(from, to, m);
    col = mix(col, uHiB, m * (1.0 - m) * 0.5);
    vec3 rest = mix(uBaseA, uBaseB, m);
    col = mix(col, rest, uCalm * (1.0 - smoothstep(0.05, 0.7, uv.y)));
    // Behind text, the light keeps its shape but can't move far enough from the base to hurt contrast.
    vec3 lift = col - rest;
    float ceiling = mix(1.8, 0.31, uCalm * (1.0 - smoothstep(0.72, 0.95, uv.y)));
    col = rest + lift * min(1.0, ceiling / max(length(lift), 0.001));
    // Grain in cells of uGrainSize device pixels, reseeded by uN.
    float n = hash(floor(gl_FragCoord.xy / uGrainSize) + uN * vec2(311.0, 173.0)) - 0.5;
    col += n * uGrain * (0.55 + 0.75 * vg);
    gl_FragColor = vec4(col, 1.0);
  }
`;
