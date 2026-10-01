/** Gradient geometry shared by the gradient editor. Points are percentages of the preview box; sizes are px. */
export type GradientType = 'linear' | 'radial' | 'angular';
export interface GradientPoint { x: number; y: number }
export interface GradientStopData { position: number; color: string }
export interface GradientValue { type: GradientType; start: GradientPoint; end: GradientPoint; stops: GradientStopData[] }
export interface BoxSize { w: number; h: number }

/** Color of a stop added from the editor (the add button at 75 %). */
export const newStopColor = '#7FD1C7';

/** The specimen gradient. */
export const defaultGradient: GradientValue = {
  type: 'linear',
  start: { x: 15, y: 50 },
  end: { x: 85, y: 50 },
  stops: [{ position: 0, color: '#E2763F' }, { position: 52, color: '#F4C26B' }, { position: 100, color: '#5F4994' }],
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const toPx = (p: GradientPoint, box: BoxSize) => ({ x: (p.x / 100) * box.w, y: (p.y / 100) * box.h });

export const sortStops = (stops: GradientStopData[]) => [...stops].sort((a, b) => a.position - b.position);

/** Axis angle in degrees, clockwise from straight up, measured in px so it follows the handles on screen. */
export function axisAngle(start: GradientPoint, end: GradientPoint, box: BoxSize): number {
  const a = toPx(start, box), b = toPx(end, box);
  return (((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI) + 90 + 360) % 360;
}

export function axisLength(start: GradientPoint, end: GradientPoint, box: BoxSize): number {
  const a = toPx(start, box), b = toPx(end, box);
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** The CSS gradient painted in the preview, computed from the handles so it matches them exactly. */
export function gradientCss(value: GradientValue, box: BoxSize): string {
  const stops = sortStops(value.stops);
  const list = (map: (s: GradientStopData) => string) => stops.map(map).join(', ');
  if (box.w <= 0 || box.h <= 0) return `linear-gradient(90deg, ${list(s => `${s.color} ${s.position}%`)})`;
  const { start, end, type } = value;
  const len = axisLength(start, end, box) || 1;
  if (type === 'radial') return `radial-gradient(circle ${len.toFixed(1)}px at ${start.x}% ${start.y}%, ${list(s => `${s.color} ${s.position}%`)})`;
  const ang = axisAngle(start, end, box);
  if (type === 'angular') return `conic-gradient(from ${ang.toFixed(1)}deg at ${start.x}% ${start.y}%, ${list(s => `${s.color} ${s.position}%`)})`;
  const t = (ang * Math.PI) / 180;
  const dir = { x: Math.sin(t), y: -Math.cos(t) };
  const L = Math.abs(box.w * Math.sin(t)) + Math.abs(box.h * Math.cos(t)) || 1;
  const cx = box.w / 2, cy = box.h / 2;
  const a = toPx(start, box), b = toPx(end, box);
  const proj = (p: { x: number; y: number }) => (((p.x - cx) * dir.x + (p.y - cy) * dir.y) / L) * 100 + 50;
  const pa = proj(a), pb = proj(b);
  return `linear-gradient(${ang.toFixed(1)}deg, ${list(s => `${s.color} ${(pa + ((pb - pa) * s.position) / 100).toFixed(2)}%`)})`;
}

/** Rotates the axis around its midpoint to `deg` keeping its length; both ends stay inside the box. */
export function rotateAxis(start: GradientPoint, end: GradientPoint, deg: number, box: BoxSize): { start: GradientPoint; end: GradientPoint } {
  if (box.w <= 0 || box.h <= 0) return { start, end };
  const a = toPx(start, box), b = toPx(end, box);
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const h = Math.hypot(b.x - a.x, b.y - a.y) / 2;
  const t = ((deg - 90) * Math.PI) / 180;
  return {
    start: { x: clamp(((m.x - Math.cos(t) * h) / box.w) * 100, 0, 100), y: clamp(((m.y - Math.sin(t) * h) / box.h) * 100, 0, 100) },
    end: { x: clamp(((m.x + Math.cos(t) * h) / box.w) * 100, 0, 100), y: clamp(((m.y + Math.sin(t) * h) / box.h) * 100, 0, 100) },
  };
}

/** Snaps the point dragged around `anchor` to 15 degree steps of the axis angle, keeping the axis length. */
export function snapAxis(point: GradientPoint, anchor: GradientPoint, box: BoxSize): GradientPoint {
  const dx = (point.x - anchor.x) * (box.w / 100), dy = (point.y - anchor.y) * (box.h / 100);
  const len = Math.hypot(dx, dy);
  const q = Math.round(Math.atan2(dy, dx) / (Math.PI / 12)) * (Math.PI / 12);
  if (box.w <= 0 || box.h <= 0) return point;
  return { x: clamp(anchor.x + (Math.cos(q) * len * 100) / box.w, 0, 100), y: clamp(anchor.y + (Math.sin(q) * len * 100) / box.h, 0, 100) };
}

/** Stop position (0-100) of a pointer projected onto the axis. */
export function positionOnAxis(px: { x: number; y: number }, start: GradientPoint, end: GradientPoint, box: BoxSize): number {
  const a = toPx(start, box), b = toPx(end, box);
  const vx = b.x - a.x, vy = b.y - a.y, l2 = vx * vx + vy * vy || 1;
  return Math.round(clamp(((px.x - a.x) * vx + (px.y - a.y) * vy) / l2, 0, 1) * 100);
}
