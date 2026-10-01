import { cva, type VariantProps } from 'class-variance-authority';

export const strokeEditorVariants = cva('flex min-w-0 flex-col gap-2 font-ui');

export const strokeEditorWeightRowVariants = cva('grid grid-cols-[1fr_1fr_auto] items-center gap-1.5');

export const strokeEditorDashRowVariants = cva('grid grid-cols-3 items-center gap-1.5');

export const strokeEditorPreviewVariants = cva('grid h-5 items-center');

/** The dash and gap (px) arrive as runtime variables: --dash and --period (dash + gap). */
export const strokeEditorPreviewLineVariants = cva(
  'block h-0.5 rounded-2xs [background:repeating-linear-gradient(90deg,var(--cs-color-text-primary)_0_var(--dash),transparent_var(--dash)_var(--period))]',
);

export const strokeEditorIndependentVariants = cva('flex items-center justify-between gap-2 text-footnote text-text-primary');

// 3 x 3: 36px middle column and row (the box).
export const strokeEditorSidesVariants = cva('grid grid-cols-[1fr_var(--cs-field-compact-md)_1fr] grid-rows-[auto_var(--cs-field-compact-md)_auto] items-center justify-items-center gap-1');

export const strokeEditorSideVariants = cva('flex w-16', {
  variants: {
    side: {
      t: 'col-start-2 row-start-1',
      l: 'col-start-1 row-start-2',
      r: 'col-start-3 row-start-2',
      b: 'col-start-2 row-start-3',
    },
  },
});

/** The frame picture: each edge is an inset shadow as wide as that side (runtime --l, --t, --rn, --bn). */
export const strokeEditorBoxVariants = cva(
  'col-start-2 row-start-2 block size-field-sm rounded-xs shadow-[inset_var(--l)_0_0_var(--cs-color-text-primary),inset_0_var(--t)_0_var(--cs-color-text-primary),inset_var(--rn)_0_0_var(--cs-color-text-primary),inset_0_var(--bn)_0_var(--cs-color-text-primary)]',
);

export type StrokeEditorVariantProps = VariantProps<typeof strokeEditorVariants>;
