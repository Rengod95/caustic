import { cva, type VariantProps } from 'class-variance-authority';

// tone sets --tone-graphic, the ink of the dash preview and the side-width box (neutral.graphic by default).
// variant is the section container: ghost = none (the specimen, the inspector panel draws it); soft = neutral.well fill;
// outline = border.subtle hairline; solid = surface.raised fill; the three containers pad 12px. size steps the gap
// between the three sections (fields, preview, side widths).
// Sections (owner 2026-10-28): the fields are one group (paint, then a three-column grid of weight / dash / corner rows
// whose columns line up), the preview line sits in its own well, and the side widths start under a divider line.
export const strokeEditorVariants = cva('flex min-w-0 flex-col gap-3 font-ui', {
  variants: {
    tone: {
      neutral: '[--tone-graphic:var(--cs-color-neutral-graphic)]',
      accent: '[--tone-graphic:var(--cs-color-accent-graphic)]',
      success: '[--tone-graphic:var(--cs-color-success-graphic)]',
      warning: '[--tone-graphic:var(--cs-color-warning-graphic)]',
      danger: '[--tone-graphic:var(--cs-color-danger-graphic)]',
      info: '[--tone-graphic:var(--cs-color-info-graphic)]',
      agent: '[--tone-graphic:var(--cs-color-agent-graphic)]',
    },
    variant: {
      ghost: '',
      soft: 'bg-neutral-well p-3',
      outline: 'p-3 shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]',
      solid: 'bg-surface-raised p-3',
    },
    size: { xs: 'gap-2', sm: 'gap-2.5', md: '', lg: 'gap-4' },
      // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
      radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { tone: 'neutral', variant: 'ghost', size: 'md', radius: 'none', shadow: 'none' },
});

/** Section 1: the paint above the line grid. */
export const strokeEditorFieldsVariants = cva('flex min-w-0 flex-col gap-1.5');

/** One grid for the related rows, so their columns line up: two equal columns and an end column (the details button).
 *  Each row is a subgrid and holds one kind of setting. */
export const strokeEditorLineVariants = cva('grid grid-cols-[1fr_1fr_auto] items-center gap-1.5');

/** Weight and position, then the details button. */
export const strokeEditorWeightRowVariants = cva('col-span-3 grid grid-cols-subgrid items-center');

/** Dash and gap under weight and position (or the dash pattern across both). */
export const strokeEditorDashRowVariants = cva('col-span-3 grid grid-cols-subgrid items-center');

/** The line ends and corners: caps, then the K2e join. */
export const strokeEditorEndsRowVariants = cva('col-span-3 grid grid-cols-subgrid items-center justify-items-start');

/** K2e: opacity and miter limit. */
export const strokeEditorExtraRowVariants = cva('col-span-3 grid grid-cols-subgrid items-center');

/** Section 2: the preview line in its own neutral.well, 32px high, inset 12px. */
export const strokeEditorPreviewVariants = cva('grid h-control-md items-center rounded-md bg-neutral-well px-3');

/** Section 3: the side widths, under a divider.line rule. */
export const strokeEditorWidthsVariants = cva('flex min-w-0 flex-col gap-2 border-t border-divider-line pt-3');

/** The dash and gap (px) arrive as runtime variables: --dash and --period (dash + gap). */
export const strokeEditorPreviewLineVariants = cva(
  'block h-0.5 rounded-2xs [background:repeating-linear-gradient(90deg,var(--tone-graphic)_0_var(--dash),transparent_var(--dash)_var(--period))]',
);

export const strokeEditorIndependentVariants = cva('flex items-center justify-between gap-2 text-footnote text-text-primary');

// 3 x 3: 36px middle column and row (the box); the side fields hug the box, centred as one group.
// It rises when the switch turns it on (enter); a group present at the first paint stays still.
export const strokeEditorSidesVariants = cva('grid grid-cols-[auto_var(--cs-field-compact-md)_auto] justify-center grid-rows-[auto_var(--cs-field-compact-md)_auto] items-center justify-items-center gap-1', {
  variants: { enter: { true: 'animate-rise', false: '' } },
  defaultVariants: { enter: false },
});

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
  'col-start-2 row-start-2 block size-field-sm rounded-xs shadow-[inset_var(--l)_0_0_var(--tone-graphic),inset_0_var(--t)_0_var(--tone-graphic),inset_var(--rn)_0_0_var(--tone-graphic),inset_0_var(--bn)_0_var(--tone-graphic)]',
);

export type StrokeEditorVariantProps = VariantProps<typeof strokeEditorVariants>;
