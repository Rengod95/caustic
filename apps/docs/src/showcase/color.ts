// OKLCH math + WCAG contrast. Everything is computed on the sRGB gamut-mapped result (CSS chroma reduction),
// which is what a browser paints on a non-wide-gamut screen.
export type LCH = readonly [number, number, number];

const rad = (h: number) => (h * Math.PI) / 180;

export function toLinear([L, C, H]: LCH): [number, number, number] {
  const a = C * Math.cos(rad(H)), b = C * Math.sin(rad(H));
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb: number[]) => rgb.every(v => v >= -0.0005 && v <= 1.0005);
export const isInGamut = (c: LCH) => inGamut(toLinear(c));

/** Reduce chroma until the colour fits sRGB (what the browser will show). */
export function gamutMap(c: LCH): LCH {
  if (inGamut(toLinear(c))) return c;
  let lo = 0, hi = c[1];
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(toLinear([c[0], mid, c[2]]))) lo = mid; else hi = mid;
  }
  return [c[0], lo, c[2]];
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const linRgb = (c: LCH) => toLinear(gamutMap(c)).map(clamp01) as [number, number, number];
const lum = ([r, g, b]: number[]) => 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
export const luminance = (c: LCH) => lum(linRgb(c));

export function contrastLin(a: number[], b: number[]) {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
export const contrast = (a: LCH, b: LCH) => contrastLin(linRgb(a), linRgb(b));

/** `fg` at `alpha` over `bg` (premultiplied in linear light, like the compositor). */
export function over(fg: LCH, alpha: number, bg: LCH): number[] {
  const f = linRgb(fg), b = linRgb(bg);
  return f.map((v, i) => v * alpha + b[i]! * (1 - alpha));
}

const toSrgb = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
export function hex(c: LCH): string {
  return '#' + linRgb(c).map(v => Math.round(clamp01(toSrgb(v)) * 255).toString(16).padStart(2, '0')).join('');
}

const f = (n: number, d: number) => String(+n.toFixed(d));
export function css(c: LCH, alpha?: number): string {
  const [L, C, H] = gamutMap(c);
  return `oklch(${f(L, 3)} ${f(C, 3)} ${f(H, 1)}${alpha !== undefined ? ` / ${f(alpha, 3)}` : ''})`;
}
/** Authored value, for display. */
export const label = (c: LCH) => `${f(c[0], 3)} ${f(c[1], 3)} ${f(c[2], 0)}`;

/** Move lightness away from `bg` until `target` contrast is reached (chroma kept, gamut-mapped). */
export function ensure(c: LCH, bg: LCH, target: number): LCH {
  if (contrast(c, bg) >= target) return c;
  const dir = luminance(bg) > 0.4 ? -1 : 1;
  let L = c[0];
  for (let i = 0; i < 200; i++) {
    L += dir * 0.005;
    if (L <= 0.02 || L >= 0.99) break;
    const cand = gamutMap([L, c[1], c[2]]);
    if (contrast(cand, bg) >= target) return cand;
  }
  return [L, c[1], c[2]];
}
