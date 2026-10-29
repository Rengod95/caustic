import { cva, type VariantProps } from 'class-variance-authority';

// Common props (lib/common-props.ts): radius, shadow and size on the root (size steps the stack gap; the rows and toggles
// keep their own size); tone and variant on the sample stage.
export const fontOptionsVariants = cva('flex min-w-0 flex-col gap-3.5 font-ui', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-2', sm: 'gap-3', md: '', lg: 'gap-4' },
  },
  defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
});

// soft (default) is today's bg.inset stage; a tone tints it (tint), solid takes the soft step, outline is an edge only.
export const fontOptionsStageVariants = cva('grid place-items-center rounded-xl bg-bg-inset p-3.5', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-neutral-track' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'solid', tone: 'success', className: 'bg-success-soft' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'solid', tone: 'info', className: 'bg-info-soft' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
    { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
    { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'neutral', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'soft' },
});

/** The sample is set in the user font (runtime --face), with the axis and feature settings as runtime variables. */
export const fontOptionsSampleVariants = cva(
  'text-center text-stat pb-[0.5px] text-text-primary text-balance [font-family:var(--face)] [font-variation-settings:var(--fvs)] [font-feature-settings:var(--ffs)]',
);

export const fontOptionsAxesVariants = cva('flex flex-col gap-2');

// 44px tag column (otp-w), the ruler, the 56px field.
export const fontOptionsAxisVariants = cva('grid h-control-md grid-cols-[var(--cs-control-compact-xl)_1fr_var(--cs-size-axis-field-w)] items-center gap-2');

export const fontOptionsAxisTagVariants = cva('font-mono text-mono-sm text-text-secondary');

export const fontOptionsFeaturesVariants = cva('flex flex-wrap items-center gap-1.5');

export const fontOptionsFeatureVariants = cva([
  'group inline-flex h-chip-h items-center gap-1.5 rounded-md px-2 text-ui-sm font-normal whitespace-nowrap text-text-primary outline-none',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] transition-control',
  'hover:bg-neutral-hover focus-visible:shadow-focus',
  // On = selected (owner 2026-10-27, proposal A): the selected inversion, selection.fill with selection.on text, no edge,
  // a leading check; hover selection.fill-hover; focus keeps the focus ring only.
  'aria-pressed:not-disabled:selected aria-pressed:not-disabled:shadow-none aria-pressed:not-disabled:hover:bg-selection-fill-hover aria-pressed:not-disabled:focus-visible:shadow-focus',
  // Disabled, on or off: disabled fill, text and border; the accent drops out.
  'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  'disabled:aria-pressed:bg-disabled-fill disabled:aria-pressed:text-disabled-text disabled:aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
]);

/** Leading check of an enabled feature: takes the label colour (selection.on, disabled text) through currentColor. */
export const fontOptionsFeatureCheckVariants = cva('size-icon-sm shrink-0 stroke-[1.75] animate-enter');

export const fontOptionsFeatureCodeVariants = cva('font-mono text-mono-sm text-text-tertiary group-aria-pressed:group-enabled:text-selection-on-secondary group-disabled:text-disabled-text');

export type FontOptionsVariantProps = VariantProps<typeof fontOptionsVariants>;
