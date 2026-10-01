import { cva, type VariantProps } from 'class-variance-authority';

export const compareViewVariants = cva('relative h-compare-h w-full overflow-hidden rounded-xl bg-bg-canvas');

export const compareViewSideVariants = cva('absolute inset-0 grid place-items-center');

/** The after side: clipped from the divider in split mode, faded by --ov in overlay mode. */
export const compareViewAfterVariants = cva('bg-bg-canvas', {
  variants: {
    mode: {
      split: '[clip-path:inset(0_0_0_var(--split))]',
      overlay: 'opacity-(--ov)',
    },
  },
  defaultVariants: { mode: 'split' },
});
export type CompareViewAfterProps = VariantProps<typeof compareViewAfterVariants>;

export const compareViewLabelVariants = cva('glass glass-thick absolute top-2.5 z-10 grid h-control-2xs place-items-center rounded-full px-2 text-ui-xs font-medium text-text-primary', {
  variants: { side: { before: 'left-2.5', after: 'right-2.5' } },
  defaultVariants: { side: 'before' },
});

export const compareViewDividerVariants = cva(
  'absolute top-0 bottom-0 left-(--split) z-20 w-0.5 cursor-ew-resize touch-none bg-control-thumb shadow-[0_0_0_0.5px_var(--cs-color-swatch-edge)] outline-none focus-visible:shadow-focus',
);

export const compareViewKnobVariants = cva('pointer-events-none absolute top-1/2 left-1/2 size-6.5 -translate-1/2 rounded-full bg-control-thumb shadow-3');
