import { cva, type VariantProps } from 'class-variance-authority';

export const fontOptionsVariants = cva('flex min-w-0 flex-col gap-3.5 font-ui');

export const fontOptionsStageVariants = cva('grid place-items-center rounded-xl bg-bg-inset p-3.5');

/** The sample is set in the user font (runtime --face), with the axis and feature settings as runtime variables. */
export const fontOptionsSampleVariants = cva(
  'text-center text-stat pb-[0.5px] text-text-primary text-balance transition-[font-variation-settings] duration-base ease-out motion-reduce:transition-none [font-family:var(--face)] [font-variation-settings:var(--fvs)] [font-feature-settings:var(--ffs)]',
);

export const fontOptionsAxesVariants = cva('flex flex-col gap-2');

// 44px tag column (otp-w), the ruler, the 56px field.
export const fontOptionsAxisVariants = cva('grid h-control-md grid-cols-[var(--cs-control-compact-xl)_1fr_var(--cs-size-axis-field-w)] items-center gap-2');

export const fontOptionsAxisTagVariants = cva('font-mono text-mono-sm text-text-secondary');

export const fontOptionsFeaturesVariants = cva('flex flex-wrap items-center gap-1.5');

export const fontOptionsFeatureVariants = cva([
  'group inline-flex h-chip-h items-center gap-1.5 rounded-md px-2 text-ui-sm font-normal whitespace-nowrap text-text-primary outline-none',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] transition-[background-color,box-shadow,color] duration-120 ease-out motion-reduce:transition-none',
  'hover:bg-neutral-hover focus-visible:shadow-focus',
  // On: accent soft selected (soft-pressed fill, border-strong edge, leading check); hover keeps the fill and steps the edge to graphic.
  'aria-pressed:bg-accent-soft-pressed aria-pressed:text-accent-text aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]',
  'aria-pressed:hover:bg-accent-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-graphic)]',
  'aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong),var(--cs-focus)]',
  // Disabled, on or off: disabled fill, text and border; the accent drops out.
  'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  'disabled:aria-pressed:bg-disabled-fill disabled:aria-pressed:text-disabled-text disabled:aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
]);

/** Leading check of an enabled feature: takes the label colour (accent text, disabled text) through currentColor. */
export const fontOptionsFeatureCheckVariants = cva('size-icon-sm shrink-0 stroke-[1.75]');

export const fontOptionsFeatureCodeVariants = cva('font-mono text-mono-sm text-text-tertiary group-aria-pressed:text-current group-disabled:text-disabled-text');

export type FontOptionsVariantProps = VariantProps<typeof fontOptionsVariants>;
