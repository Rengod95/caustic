import { cva } from 'class-variance-authority';

/** Name and size of a frame, written above it. Artboard labels are canvas.label with a diamond; frame labels are quieter. */
export const frameLabelVariants = cva('pointer-events-none absolute top-(--rect-t) left-(--rect-l) flex items-center text-ui-xs font-medium whitespace-nowrap', {
  variants: {
    kind: {
      artboard: 'gap-1.25 text-canvas-label',
      frame: 'gap-1.5 text-text-tertiary',
    },
  },
  defaultVariants: { kind: 'artboard' },
});

/** Marker: a 7px diamond (artboard) or a 12px frame icon (frame). The diamond is drawn by a rotated ring so the box stays 7px square. */
export const frameLabelMarkerVariants = cva('relative inline-flex shrink-0', {
  variants: {
    kind: {
      artboard: 'size-1.75 rounded-2xs before:absolute before:inset-0 before:rotate-45 before:rounded-2xs before:shadow-[inset_0_0_0_1.5px_currentColor]',
      frame: 'size-icon-xs text-text-tertiary [&_svg]:size-icon-xs',
    },
  },
  defaultVariants: { kind: 'artboard' },
});

/** The dimensions: mono and quiet on an artboard, the same type as the name on a frame. */
export const frameLabelSizeVariants = cva('', {
  variants: {
    kind: {
      artboard: 'font-mono text-mono-sm text-text-tertiary',
      frame: 'text-text-tertiary',
    },
  },
  defaultVariants: { kind: 'artboard' },
});
