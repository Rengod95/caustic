import { cva, type VariantProps } from 'class-variance-authority';

// Common props (lib/common-props.ts). The elevation is one glass-shadow class from the shadow axis, never a base class:
// tailwind-merge cannot tell two glass utilities apart. The default 4 follows the size as before (3 at md, see below).
// tone and variant re-point the material (solid = the regular glass, today).
export const floatingBarVariants = cva(
  'animate-enter enter-scale glass inline-flex items-center gap-0.5 rounded-toolbar',
  {
    variants: {
      size: {
        xs: 'p-0.5',
        sm: 'p-0.75',
        md: 'p-1',
        lg: 'p-1',
      },
      orientation: { horizontal: '', vertical: 'flex-col' },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full', toolbar: '' },
      shadow: { none: '[--cs-shadow:none]', '1': 'glass-shadow-1', '2': 'glass-shadow-2', '3': 'glass-shadow-3', '4': '', '5': 'glass-shadow-5' },
    },
    compoundVariants: [
      // The default elevation: 4, except the md capsule (the canvas option toggles), which sits one step lower.
      { shadow: '4', size: ['xs', 'sm', 'lg'], className: 'glass-shadow-4' },
      { shadow: '4', size: 'md', className: 'glass-shadow-3' },
      { variant: 'solid', tone: 'accent', className: '[--cs-material:var(--cs-color-accent-tint)]' },
      { variant: 'solid', tone: 'success', className: '[--cs-material:var(--cs-color-success-tint)]' },
      { variant: 'solid', tone: 'warning', className: '[--cs-material:var(--cs-color-warning-tint)]' },
      { variant: 'solid', tone: 'danger', className: '[--cs-material:var(--cs-color-danger-tint)]' },
      { variant: 'solid', tone: 'info', className: '[--cs-material:var(--cs-color-info-tint)]' },
      { variant: 'solid', tone: 'agent', className: '[--cs-material:var(--cs-color-agent-tint)]' },
      { variant: 'soft', tone: 'neutral', className: '[--cs-material:var(--cs-color-neutral-track)]' },
      { variant: 'soft', tone: 'accent', className: '[--cs-material:var(--cs-color-accent-soft)]' },
      { variant: 'soft', tone: 'success', className: '[--cs-material:var(--cs-color-success-soft)]' },
      { variant: 'soft', tone: 'warning', className: '[--cs-material:var(--cs-color-warning-soft)]' },
      { variant: 'soft', tone: 'danger', className: '[--cs-material:var(--cs-color-danger-soft)]' },
      { variant: 'soft', tone: 'info', className: '[--cs-material:var(--cs-color-info-soft)]' },
      { variant: 'soft', tone: 'agent', className: '[--cs-material:var(--cs-color-agent-soft)]' },
      { variant: 'outline', tone: 'neutral', className: 'outline-1 outline-solid -outline-offset-1 outline-neutral-border' },
      { variant: 'outline', tone: 'accent', className: 'outline-1 outline-solid -outline-offset-1 outline-accent-border' },
      { variant: 'outline', tone: 'success', className: 'outline-1 outline-solid -outline-offset-1 outline-success-border' },
      { variant: 'outline', tone: 'warning', className: 'outline-1 outline-solid -outline-offset-1 outline-warning-border' },
      { variant: 'outline', tone: 'danger', className: 'outline-1 outline-solid -outline-offset-1 outline-danger-border' },
      { variant: 'outline', tone: 'info', className: 'outline-1 outline-solid -outline-offset-1 outline-info-border' },
      { variant: 'outline', tone: 'agent', className: 'outline-1 outline-solid -outline-offset-1 outline-agent-border' },
      { variant: 'ghost', tone: 'neutral', className: '[--cs-material:transparent]' },
      { variant: 'ghost', tone: 'accent', className: '[--cs-material:transparent] text-accent-text' },
      { variant: 'ghost', tone: 'success', className: '[--cs-material:transparent] text-success-text' },
      { variant: 'ghost', tone: 'warning', className: '[--cs-material:transparent] text-warning-text' },
      { variant: 'ghost', tone: 'danger', className: '[--cs-material:transparent] text-danger-text' },
      { variant: 'ghost', tone: 'info', className: '[--cs-material:transparent] text-info-text' },
      { variant: 'ghost', tone: 'agent', className: '[--cs-material:transparent] text-agent-text' },
    ],
    defaultVariants: { size: 'lg', orientation: 'horizontal', tone: 'neutral', variant: 'solid', radius: 'toolbar', shadow: '4' },
  },
);

export const floatingBarGroupVariants = cva('inline-flex items-center gap-0.5', {
  variants: { orientation: { horizontal: '', vertical: 'flex-col' } },
  defaultVariants: { orientation: 'horizontal' },
});

// The divider role (PROPOSAL E15), not a border token used as a fill. Short (16px across the bar) with 8px either side along
// the bar (owner 2026-10-27, C + memo): it groups the tools without cutting the capsule.
export const floatingBarSeparatorVariants = cva('shrink-0 bg-divider-line', {
  variants: { orientation: { horizontal: 'mx-2 h-4 w-px', vertical: 'my-2 h-px w-4' } },
  defaultVariants: { orientation: 'horizontal' },
});

export const floatingBarItemVariants = cva(
  [
    'group/item relative inline-grid shrink-0 place-items-center select-none rounded-toolbar-item font-ui',
    'bg-transparent text-text-secondary',
    'transition-control',
    'outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
    // Disabled is a colour, not opacity.
    'disabled:pointer-events-none disabled:text-disabled-text',
    // A toggled-on item inverts (selected utility), as IconButton pressed. The current tool is a location, not a selection
    // (owner 2026-10-27, O4): neutral-selected fill and primary text, no edge.
    'data-[pressed=true]:not-disabled:selected data-[pressed=true]:not-disabled:hover:bg-selection-fill-hover',
    'data-[active=true]:not-disabled:bg-neutral-selected data-[active=true]:not-disabled:text-text-primary data-[active=true]:not-disabled:hover:bg-neutral-selected-hover',
    'disabled:data-[pressed=true]:bg-disabled-fill disabled:data-[pressed=true]:text-disabled-text disabled:data-[active=true]:bg-disabled-fill disabled:data-[active=true]:text-disabled-text',
    'data-[agent=true]:agent-rim data-[agent=true]:text-text-primary',
    // Disabled drops the tone: a disabled agent item loses the spectrum rim and takes disabled-text, as Button agent.
    'disabled:data-[agent=true]:text-disabled-text disabled:data-[agent=true]:after:hidden',
  ],
  {
    variants: {
      size: {
        lg: 'size-toolbar-item press',
        md: 'size-toolbar-item-md press',
        sm: 'size-control-sm press-sm',
        xs: 'size-control-xs press-sm',
      },
    },
    defaultVariants: { size: 'lg' },
  },
);

export const floatingBarIconVariants = cva('inline-grid place-items-center [&_svg]:size-full [&_svg]:stroke-[1.75]', {
  variants: { size: { lg: 'size-icon-md', md: 'size-icon-sm', sm: 'size-icon-sm', xs: 'size-icon-xs' } },
  defaultVariants: { size: 'lg' },
});

// The shortcut hint shows only on demand (owner 2026-10-27, A): hover or keyboard focus on its item. It stays in the aria-label.
export const floatingBarShortcutVariants = cva(
  'pointer-events-none absolute right-0.75 bottom-0.5 font-mono text-mono-micro transition-control opacity-0 group-hover/item:opacity-100 group-focus-visible/item:opacity-100',
  {
    variants: { disabled: { true: 'text-disabled-text', false: 'text-text-tertiary' } },
    defaultVariants: { disabled: false },
  },
);

export type FloatingBarVariantProps = VariantProps<typeof floatingBarVariants>;
