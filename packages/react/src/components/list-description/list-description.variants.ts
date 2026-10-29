import { cva } from 'class-variance-authority';

/**
 * The inline surface, same as List: opaque surface fill with a 1px inset border.subtle hairline and no elevation, never
 * glass (P1). The variant is the surface emphasis and the tone its colour (lib/common-props): outline (default) is that
 * surface (hued: border 6 edge); soft = soft 3 fill, no edge (neutral: neutral.soft); solid = surface.base, no edge
 * (hued: border-strong 7 edge); ghost = no fill or edge (the row dividers stay).
 */
export const listDescriptionVariants = cva('m-0 grid w-full overflow-hidden rounded-2xl font-ui text-text-primary', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: {
      solid: 'bg-surface-base',
      soft: 'bg-neutral-soft',
      outline: 'bg-surface-translucent shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
      ghost: 'bg-transparent',
    },
  },
  compoundVariants: [
    // solid × tone
    { variant: 'solid', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]' },
    { variant: 'solid', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)]' },
    { variant: 'solid', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)]' },
    { variant: 'solid', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)]' },
    { variant: 'solid', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)]' },
    { variant: 'solid', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)]' },
    // soft × tone
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    // outline × tone
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'outline' },
});

/** Common radius / shadow (lib/common-props) of the surface, applied after its classes so an explicit value wins. */
export const listDescriptionFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': '', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: '2xl', shadow: 'none' },
});

/** One term/value group; size steps the minimum height, the padding and the type (md = 44px / ui, today). A hovered row
 *  takes a full-width neutral.hover band (owner 2026-10-28, A) so the eye keeps the term and its value together on a wide
 *  list; the surface clips the band at its corners. */
export const listDescriptionRow = cva(
  [
    'group grid grid-cols-[var(--cs-size-list-term)_minmax(0,1fr)_auto] items-center gap-3 font-ui text-text-primary',
    'transition-colors duration-quick ease-standard hover:bg-neutral-hover',
    'not-first:border-t not-first:border-border-subtle',
    'max-[480px]:grid-cols-[1fr_auto]',
  ],
  {
    variants: {
      size: {
        xs: 'min-h-control-md px-3 py-1 text-ui-sm',
        sm: 'min-h-field-sm px-3 py-1 text-ui',
        md: 'min-h-field-lg px-3.5 py-1.5 text-ui',
        lg: 'min-h-control-xl px-4 py-2 text-ui-md',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export const listDescriptionTerm = cva('m-0 font-ui text-text-tertiary max-[480px]:col-span-full');

export const listDescriptionValue = cva('m-0 flex min-w-0 items-center gap-3 text-text-primary col-span-2', {
  variants: { mono: { true: 'font-mono text-mono', false: 'font-ui' } },
  defaultVariants: { mono: false },
});

export const listDescriptionValueText = cva('block min-w-0 flex-1 truncate');

export const listDescriptionAction = cva(
  'flex flex-none items-center opacity-0 transition-opacity duration-quick ease-out group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100',
);
