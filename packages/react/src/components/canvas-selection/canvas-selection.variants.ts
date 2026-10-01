import { cva } from 'class-variance-authority';

/** The human selection: a 1.5px canvas.selection outline hugging the object, or (hover) a canvas.hover ring. Only handles take the pointer. */
export const canvasSelectionVariants = cva('pointer-events-none absolute top-(--rect-t) left-(--rect-l) z-10 h-(--rect-h) w-(--rect-w) rounded-2xs', {
  variants: {
    mode: {
      selected: 'outline-[1.5px] outline-offset-0 outline-canvas-selection outline-solid',
      hover: 'shadow-[0_0_0_1.5px_var(--cs-color-canvas-hover)]',
    },
  },
  defaultVariants: { mode: 'selected' },
});

/** A 7px square resize handle, centered on its corner or edge midpoint. */
export const canvasSelectionHandleClass =
  'pointer-events-auto absolute size-1.75 rounded-2xs border-[1.5px] border-canvas-selection bg-canvas-handle';

export type CanvasSelectionHandle = 'tl' | 'tm' | 'tr' | 'ml' | 'mr' | 'bl' | 'bm' | 'br';

/** Position and resize cursor per handle (static literals so the scanner sees every class). */
export const canvasSelectionHandlePosition: Record<CanvasSelectionHandle, string> = {
  tl: '-top-1 -left-1 cursor-nwse-resize',
  tm: '-top-1 left-1/2 -ml-1 cursor-ns-resize',
  tr: '-top-1 -right-1 cursor-nesw-resize',
  ml: 'top-1/2 -left-1 -mt-1 cursor-ew-resize',
  mr: 'top-1/2 -right-1 -mt-1 cursor-ew-resize',
  bl: '-bottom-1 -left-1 cursor-nesw-resize',
  bm: '-bottom-1 left-1/2 -ml-1 cursor-ns-resize',
  br: '-right-1 -bottom-1 cursor-nwse-resize',
};

/** Rotate handle: a 14px circle 26px above the top edge, joined to the box by a 12px stem. */
export const canvasSelectionRotateClass =
  'pointer-events-auto absolute -top-6.5 left-1/2 size-icon-sm -translate-x-1/2 cursor-grab rounded-full bg-canvas-handle shadow-[0_0_0_1.5px_var(--cs-color-canvas-selection)] after:absolute after:top-3.5 after:left-1/2 after:h-3 after:w-[1.5px] after:-translate-x-1/2 after:bg-canvas-selection';

/** Size chip, centered 24px below the bottom edge. */
export const canvasSelectionLabelClass = 'absolute -bottom-6 left-1/2 -translate-x-1/2';
