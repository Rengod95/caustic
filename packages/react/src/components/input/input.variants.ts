import { cva } from 'class-variance-authority';

// One focus edge (P9): the container shows focus-field (its border.default hairline); the inner input draws nothing.
// Focus is a fill change (owner 2026-10-28, field/input proposal 2): a white field (outline, solid, ghost) turns neutral.well,
// a field that rests on grey (soft, sunken) turns surface.base, so the change reads either way. No black edge.
// Soft turns surface.raised: the same white as surface.base in light, one step up in dark, where neutral.soft is already
// surface.base. Focus wins over hover: hover:focus-within keeps the focus fill under the pointer.
// Invalid is the danger border-strong edge; invalid + focus keeps it and adds the outer focus ring (both visible).
// Disabled is a colour (disabled fill, text and edge), not opacity. The invalid and readonly looks apply only
// while the field is enabled, so a disabled field drops its tone (an invalid one shows the disabled edge).
// The variant is the field emphasis and the tone its colour family (lib/common-props): outline is the default field;
// sunken is the inspector well (32px whatever the size); the tone colours the edge (outline, solid) or the fill (soft, sunken)
// and the hover (ghost). Focus, invalid and disabled are the same in every tone.
export const inputVariants = cva(
  [
    'flex min-w-0 cursor-text items-center gap-2 text-text-tertiary transition-control',
    'data-[invalid]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
    'data-[disabled]:pointer-events-none data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text data-[disabled]:shadow-[inset_0_0_0_0.5px_var(--cs-color-disabled-border)]',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: {
        solid: 'bg-control-raised shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2)] focus-within:bg-neutral-well focus-within:shadow-focus-field',
        soft: 'bg-neutral-soft hover:bg-neutral-soft-hover focus-within:bg-surface-raised hover:focus-within:bg-surface-raised focus-within:shadow-focus-field',
        outline: [
          'bg-surface-translucent shadow-[inset_0_0_0_0.5px_var(--cs-color-border-default)]',
          'hover:shadow-[inset_0_0_0_0.5px_var(--cs-color-border-default)]',
          'focus-within:bg-neutral-well focus-within:shadow-[var(--cs-focus-field)] hover:focus-within:shadow-[var(--cs-focus-field)]',
          'data-[readonly]:not-data-[disabled]:bg-bg-inset data-[readonly]:not-data-[disabled]:shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)] data-[readonly]:focus-within:shadow-[var(--cs-focus-field)]',
          // A read-only field still shows focus: its grey inset fill turns surface.base (the soft rule), the text stays secondary.
          'data-[readonly]:not-data-[disabled]:focus-within:bg-surface-base',
        ],
        ghost: 'bg-transparent hover:bg-neutral-hover focus-within:bg-neutral-well hover:focus-within:bg-neutral-well focus-within:shadow-focus-field',
        sunken: 'bg-neutral-well hover:bg-neutral-hover focus-within:bg-surface-base hover:focus-within:bg-surface-base focus-within:shadow-focus-field',
      },
      size: {
        xs: 'h-control-md rounded-lg px-2.5 text-ui-sm',
        sm: 'h-field-sm rounded-lg px-2.5 text-ui',
        md: 'h-field-md rounded-xl px-3 text-ui',
        lg: 'h-field-lg rounded-2xl px-3.5 text-body',
      },
      // Add-on mode (was InputGroup): the prefix and suffix become full-height segments, so the box drops its own
      // padding and gap, stretches its items and clips the add-ons to its radius (the compound at the end wins).
      addons: { true: '', false: '' },
    },
    compoundVariants: [
      { variant: 'sunken', size: 'sm', className: 'h-control-md rounded-lg px-2.5' },
      { variant: 'sunken', size: 'md', className: 'h-control-md rounded-lg px-2.5' },
      { variant: 'sunken', size: 'lg', className: 'h-control-md rounded-lg px-2.5' },
      // solid × tone
      { variant: 'solid', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]' },
      { variant: 'solid', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)]' },
      { variant: 'solid', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)]' },
      { variant: 'solid', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)]' },
      { variant: 'solid', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)]' },
      { variant: 'solid', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)]' },
      // soft × tone
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft hover:bg-accent-soft-hover' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft hover:bg-success-soft-hover' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft hover:bg-warning-soft-hover' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft hover:bg-danger-soft-hover' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft hover:bg-info-soft-hover' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft hover:bg-agent-soft-hover' },
      // outline × tone
      { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]' },
      { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)]' },
      { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)]' },
      { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)]' },
      { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)]' },
      { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)]' },
      // ghost × tone
      { variant: 'ghost', tone: 'accent', className: 'hover:bg-accent-tint' },
      { variant: 'ghost', tone: 'success', className: 'hover:bg-success-tint' },
      { variant: 'ghost', tone: 'warning', className: 'hover:bg-warning-tint' },
      { variant: 'ghost', tone: 'danger', className: 'hover:bg-danger-tint' },
      { variant: 'ghost', tone: 'info', className: 'hover:bg-info-tint' },
      { variant: 'ghost', tone: 'agent', className: 'hover:bg-agent-tint' },
      // sunken × tone
      { variant: 'sunken', tone: 'accent', className: 'bg-accent-soft hover:bg-accent-soft-hover' },
      { variant: 'sunken', tone: 'success', className: 'bg-success-soft hover:bg-success-soft-hover' },
      { variant: 'sunken', tone: 'warning', className: 'bg-warning-soft hover:bg-warning-soft-hover' },
      { variant: 'sunken', tone: 'danger', className: 'bg-danger-soft hover:bg-danger-soft-hover' },
      { variant: 'sunken', tone: 'info', className: 'bg-info-soft hover:bg-info-soft-hover' },
      { variant: 'sunken', tone: 'agent', className: 'bg-agent-soft hover:bg-agent-soft-hover' },
      // addons (last, so it wins over the size and sunken padding)
      { addons: true, className: 'items-stretch gap-0 overflow-hidden px-0' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'outline', size: 'md', addons: false },
  },
);

/** Common radius / shadow (lib/common-props) of the container, applied after its classes so an explicit value wins. */
export const inputFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'xl', shadow: 'none' },
});

// Icons size to 16 unless the icon sets its own size (:where keeps this default weaker than any class on the svg).
export const inputPrefixVariants = cva('inline-flex shrink-0 items-center text-text-tertiary in-data-[disabled]:text-disabled-text [:where(&)_svg]:size-icon-md', {
  variants: { variant: { solid: '', soft: '', outline: '', ghost: '', sunken: 'w-3 text-ui-xs font-medium' } },
  defaultVariants: { variant: 'outline' },
});
// An IconButton in the suffix sits 6px closer to the edge so its hit area balances the padding.
export const inputSuffixClass = 'inline-flex shrink-0 items-center gap-2 text-ui text-text-tertiary in-data-[disabled]:text-disabled-text [:where(&)_svg]:size-icon-md [&_[data-slot=icon-button]]:-me-1.5';

// Add-ons (addons, was InputGroup's start / end) share the field fill (no fill of their own: the scheme is part of the value,
// not a button; owner 2026-10-27, proposal A), tertiary text, set off by a subtle divider. In a disabled field the text and
// divider take the disabled axis.
export const inputAddonVariants = cva(
  'flex shrink-0 items-center whitespace-nowrap border-border-subtle bg-transparent px-3 text-text-tertiary in-data-[disabled]:border-disabled-border in-data-[disabled]:text-disabled-text',
  {
    variants: {
      side: { start: 'border-e', end: 'border-s' },
      size: { xs: 'px-2.5 text-ui-sm', sm: 'text-ui', md: 'text-ui', lg: 'text-ui' },
    },
    defaultVariants: { side: 'start', size: 'md' },
  },
);
