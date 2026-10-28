import { cva, type VariantProps } from 'class-variance-authority';

// Common props (owner 2026-10-26), set on the group and read by every item. The circle carries the emphasis:
//   solid   (default) checked = tone solid fill, the dot in the tone on colour, no edge (accent = today)
//   soft    checked = tone soft fill, tone border-strong edge, the dot in the tone text colour
//   outline checked = surface fill, a 1.5px tone solid edge, the dot in the tone solid colour
//   ghost   checked = no fill change, the control edge stays, the dot in the tone solid colour
// radius / shadow apply to the circles (the group container has no surface); null when unset keeps full / flat.
// An explicit shadow replaces the control edge (both are box-shadow).
// size steps the circle, the dot, the label type and the gaps (md = size-check 18 / dot 8 (space-2, owner 2026-10-28) / ui).
// Hover (owner 2026-10-28): an enabled unchecked circle steps its edge to border.strong under the pointer, on the circle or
// its label; focus-visible keeps its ring.
export const radioGroupVariants = cva('flex', {
  variants: {
    orientation: { horizontal: 'flex-row flex-wrap items-center', vertical: 'flex-col' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { orientation: 'horizontal', size: 'xs', className: 'gap-2' },
    { orientation: 'horizontal', size: 'sm', className: 'gap-2.5' },
    { orientation: 'horizontal', size: 'md', className: 'gap-3' },
    { orientation: 'horizontal', size: 'lg', className: 'gap-4' },
    { orientation: 'vertical', size: 'xs', className: 'gap-1' },
    { orientation: 'vertical', size: 'sm', className: 'gap-1.5' },
    { orientation: 'vertical', size: 'md', className: 'gap-2' },
    { orientation: 'vertical', size: 'lg', className: 'gap-2.5' },
  ],
  defaultVariants: { orientation: 'vertical', size: 'md' },
});

export const radioItemVariants = cva(
  [
    'inline-grid shrink-0 place-items-center rounded-full bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
    'outline-none focus-visible:shadow-focus data-[state=checked]:focus-visible:shadow-focus',
    'data-[state=unchecked]:not-disabled:not-focus-visible:hover:shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]',
    'in-[label:hover]:data-[state=unchecked]:not-disabled:not-focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]',
    // Disabled is a colour, not opacity: the tone drops out and the dot takes disabled.text.
    'disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)] disabled:data-[state=checked]:bg-disabled-fill',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: 'data-[state=checked]:shadow-none', soft: '', outline: '', ghost: '' },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
      },
      // none adds no elevation and keeps the control edge (an edge, not an elevation).
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: 'size-3.5', sm: 'size-4', md: 'size-check', lg: 'size-5' },
    },
    compoundVariants: [
      { variant: 'solid', tone: 'neutral', className: 'text-neutral-on data-[state=checked]:bg-neutral-solid' },
      { variant: 'solid', tone: 'accent', className: 'text-accent-on data-[state=checked]:bg-accent-solid' },
      { variant: 'solid', tone: 'success', className: 'text-success-on data-[state=checked]:bg-success-solid' },
      { variant: 'solid', tone: 'warning', className: 'text-warning-on data-[state=checked]:bg-warning-solid' },
      { variant: 'solid', tone: 'danger', className: 'text-danger-on data-[state=checked]:bg-danger-solid' },
      { variant: 'solid', tone: 'info', className: 'text-info-on data-[state=checked]:bg-info-solid' },
      { variant: 'solid', tone: 'agent', className: 'text-agent-on data-[state=checked]:bg-agent-solid' },
      { variant: 'soft', tone: 'neutral', className: 'text-neutral-text data-[state=checked]:bg-neutral-soft data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border-strong)]' },
      { variant: 'soft', tone: 'accent', className: 'text-accent-text data-[state=checked]:bg-accent-soft data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]' },
      { variant: 'soft', tone: 'success', className: 'text-success-text data-[state=checked]:bg-success-soft data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)]' },
      { variant: 'soft', tone: 'warning', className: 'text-warning-text data-[state=checked]:bg-warning-soft data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)]' },
      { variant: 'soft', tone: 'danger', className: 'text-danger-text data-[state=checked]:bg-danger-soft data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)]' },
      { variant: 'soft', tone: 'info', className: 'text-info-text data-[state=checked]:bg-info-soft data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)]' },
      { variant: 'soft', tone: 'agent', className: 'text-agent-text data-[state=checked]:bg-agent-soft data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)]' },
      { variant: 'outline', tone: 'neutral', className: 'text-neutral-solid data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-neutral-solid)]' },
      { variant: 'outline', tone: 'accent', className: 'text-accent-solid data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid)]' },
      { variant: 'outline', tone: 'success', className: 'text-success-solid data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-success-solid)]' },
      { variant: 'outline', tone: 'warning', className: 'text-warning-solid data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-solid)]' },
      { variant: 'outline', tone: 'danger', className: 'text-danger-solid data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-solid)]' },
      { variant: 'outline', tone: 'info', className: 'text-info-solid data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-info-solid)]' },
      { variant: 'outline', tone: 'agent', className: 'text-agent-solid data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-solid)]' },
      { variant: 'ghost', tone: 'neutral', className: 'text-neutral-solid' },
      { variant: 'ghost', tone: 'accent', className: 'text-accent-solid' },
      { variant: 'ghost', tone: 'success', className: 'text-success-solid' },
      { variant: 'ghost', tone: 'warning', className: 'text-warning-solid' },
      { variant: 'ghost', tone: 'danger', className: 'text-danger-solid' },
      { variant: 'ghost', tone: 'info', className: 'text-info-solid' },
      { variant: 'ghost', tone: 'agent', className: 'text-agent-solid' },
    ],
    defaultVariants: { tone: 'accent', variant: 'solid', radius: 'full', shadow: 'none', size: 'md' },
  },
);

export const radioIndicatorVariants = cva('rounded-full bg-current', {
  variants: { size: { xs: 'size-1.5', sm: 'size-1.5', md: 'size-2', lg: 'size-2.5' } },
  defaultVariants: { size: 'md' },
});

// The label text dims with a disabled item (disabled.text), like the dot.
export const radioLabelVariants = cva('inline-flex items-center text-text-primary has-disabled:text-disabled-text', {
  variants: { size: { xs: 'gap-1.5 text-ui-xs', sm: 'gap-2 text-ui-dense', md: 'gap-2.5 text-ui', lg: 'gap-3 text-ui-lg' } },
  defaultVariants: { size: 'md' },
});

export type RadioItemVariantProps = VariantProps<typeof radioItemVariants>;
