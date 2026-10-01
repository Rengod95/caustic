import { rgbToHex, type Rgb } from './color-math.ts';

/**
 * Resolves any CSS color (hex, oklch, a var(--cs-...) token color) to rgb in the browser.
 * Client only: call it from an event handler, never during render. Returns null when the color cannot be resolved.
 */
export function resolveCssColor(css: string, scope: Element | null): (Rgb & { a: number }) | null {
  if (typeof document === 'undefined') return null;
  const host = scope ?? document.body;
  const probe = document.createElement('span');
  probe.style.color = css;
  host.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0, a = 255] = ctx.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: Math.round((a / 255) * 100) };
}

export const resolveCssHex = (css: string, scope: Element | null) => {
  const rgb = resolveCssColor(css, scope);
  return rgb ? rgbToHex(rgb) : null;
};
