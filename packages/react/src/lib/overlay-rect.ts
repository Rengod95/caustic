import type { CSSProperties } from 'react';

/** Position and size of a canvas overlay in px from the canvas host origin. */
export interface OverlayRect {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
}

const keys = { left: '--rect-l', top: '--rect-t', right: '--rect-r', bottom: '--rect-b', width: '--rect-w', height: '--rect-h' } as const;

/** Maps a rect to custom properties (--rect-l/t/r/b/w/h) that utilities such as left-(--rect-l) read back. Merge with any caller style. */
export function overlayRectStyle(rect: OverlayRect | undefined, style?: CSSProperties): CSSProperties | undefined {
  if (!rect) return style;
  const out: Record<string, string | number | undefined> = {};
  for (const k of Object.keys(keys) as (keyof typeof keys)[]) {
    const v = rect[k];
    if (v !== undefined) out[keys[k]] = `${v}px`;
  }
  return { ...out, ...style } as CSSProperties;
}
