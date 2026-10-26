import { cva } from 'class-variance-authority';

/**
 * Alignment aids: smart guide and measurement are the canvas guide magenta (canvas.guide), a user-placed guide is info blue (canvas.guide-user).
 * Position comes from the rect custom properties (--rect-*); the snap mark is centered on its point.
 */
export const canvasGuideVariants = cva('pointer-events-none absolute top-(--rect-t) right-(--rect-r) bottom-(--rect-b) left-(--rect-l) z-10', {
  variants: {
    kind: {
      smart: 'bg-canvas-guide',
      user: 'bg-canvas-guide-user',
      measure: 'flex items-center justify-center bg-canvas-guide before:absolute before:bg-canvas-guide after:absolute after:bg-canvas-guide',
      snap: 'size-1.75 -translate-x-1/2 -translate-y-1/2 before:absolute before:top-1/2 before:left-1/2 before:h-[1.5px] before:w-2.25 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-canvas-guide after:absolute after:top-1/2 after:left-1/2 after:h-[1.5px] after:w-2.25 after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:bg-canvas-guide',
    },
    orientation: {
      horizontal: 'h-px w-(--rect-w)',
      vertical: 'h-(--rect-h) w-px',
    },
  },
  compoundVariants: [
    { kind: 'measure', orientation: 'horizontal', class: 'before:-top-1 before:left-0 before:h-2.25 before:w-px after:-top-1 after:right-0 after:h-2.25 after:w-px' },
    { kind: 'measure', orientation: 'vertical', class: 'before:top-0 before:-left-1 before:h-px before:w-2.25 after:-left-1 after:bottom-0 after:h-px after:w-2.25' },
    { kind: 'snap', class: 'h-1.75 w-1.75' },
  ],
  defaultVariants: { kind: 'smart', orientation: 'horizontal' },
});

/** Measurement value, centered on the line. */
export const canvasGuideLabelVariants = cva('relative z-10 inline-flex h-4 items-center rounded-xs bg-canvas-guide px-1 font-mono text-mono-sm font-semibold whitespace-nowrap text-canvas-guide-on');
