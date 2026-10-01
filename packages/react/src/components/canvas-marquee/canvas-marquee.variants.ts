import { cva } from 'class-variance-authority';

/** The dragged rectangle: marquee has a solid inset edge and square corners, the draw ghost a dashed edge. */
export const canvasMarqueeVariants = cva('pointer-events-none absolute top-(--rect-t) left-(--rect-l) z-10 h-(--rect-h) w-(--rect-w) bg-canvas-marquee', {
  variants: {
    kind: {
      marquee: 'rounded-none shadow-[inset_0_0_0_1px_var(--cs-color-canvas-selection)]',
      draw: 'rounded-2xs border-[1.5px] border-dashed border-canvas-selection',
    },
  },
  defaultVariants: { kind: 'marquee' },
});

/** Size chip of the draw ghost, centered 24px below its bottom edge. */
export const canvasMarqueeLabelVariants = cva('absolute -bottom-6 left-1/2 -translate-x-1/2');
