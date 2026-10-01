/** Small color maths shared by the paint controls. Hex digits are written without a leading #. */
export interface Rgb { r: number; g: number; b: number }
export interface Hsv { h: number; s: number; v: number }

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
export const round = (n: number, digits = 2) => { const m = 10 ** digits; return Math.round(n * m) / m; };

export const isHex = (v: string) => /^[0-9a-fA-F]+$/.test(v) && [3, 4, 6, 8].includes(v.length);

/** Parses 3, 4, 6 or 8 hex digits into rgb (0-255) and alpha (0-100). Returns null when invalid. */
export function parseHex(hex: string): (Rgb & { a: number }) | null {
  const v = hex.replace(/^#/, '');
  if (!isHex(v)) return null;
  const full = v.length <= 4 ? [...v].map(c => c + c).join('') : v;
  const n = (i: number) => parseInt(full.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: full.length === 8 ? Math.round((n(6) / 255) * 100) : 100 };
}

/** Six uppercase hex digits for an rgb color. */
export function rgbToHex({ r, g, b }: Rgb): string {
  return [r, g, b].map(c => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === R) h = ((G - B) / d) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

export const hsvToHex = (hsv: Hsv) => rgbToHex(hsvToRgb(hsv));

/** Hex digits (3, 4, 6, 8) to hsv, or null. */
export function hexToHsv(hex: string): Hsv | null {
  const rgb = parseHex(hex);
  return rgb ? rgbToHsv(rgb) : null;
}

/** CSS color for hex digits plus alpha 0-100. */
export const cssColor = (hex: string, alpha = 100) => (alpha >= 100 ? `#${hex}` : `color-mix(in oklab, #${hex} ${round(alpha, 1)}%, transparent)`);
