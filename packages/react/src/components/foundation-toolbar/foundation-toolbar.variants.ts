import { cva, type VariantProps } from 'class-variance-authority';

/** The capsule: regular glass, toolbar radius, a column of the bar line and the domain line. */
// Common props (lib/common-props.ts). The elevation is one glass-shadow class from the shadow axis (default 4), never a
// base class: tailwind-merge cannot tell two glass utilities apart. tone and variant re-point the material (solid = the
// regular glass, today); size steps the capsule padding and gap (md = 6px, today) and the domain tiles.
// The gap between the bar line and the domain row is one step wider than the padding (owner 2026-10-27): md 10px.
export const foundationToolbarVariants = cva('glass flex min-w-0 max-w-full flex-col items-center gap-2.5 rounded-toolbar p-1.5 font-ui', {
  variants: {
    layout: { row: '', compact: 'w-full' },
    size: { xs: 'gap-1 p-0.5', sm: 'gap-1.5 p-1', md: '', lg: 'gap-3 p-2' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full', toolbar: '' },
    shadow: { none: '[--cs-shadow:none]', '1': 'glass-shadow-1', '2': 'glass-shadow-2', '3': 'glass-shadow-3', '4': 'glass-shadow-4', '5': 'glass-shadow-5' },
  },
  compoundVariants: [
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
  defaultVariants: { layout: 'row', size: 'md', tone: 'neutral', variant: 'solid', radius: 'toolbar', shadow: '4' },
});

export type FoundationToolbarVariantProps = VariantProps<typeof foundationToolbarVariants>;

export const foundationToolbarBarVariants = cva('flex w-full min-w-0 items-center gap-1.5');

export const foundationToolbarActionsVariants = cva('ms-auto flex items-center gap-0.5');

// When the row scrolls, the edge with more domains beyond it fades over 16px (owner 2026-10-27, A). The component sets
// data-overflow (start / end / both) from the scroll position; a row that fits has no fade. The mask reads only alpha.
export const foundationToolbarDomainsVariants = cva([
  'flex max-w-full gap-0.5 overflow-x-auto p-0.5',
  'data-[overflow=start]:[mask-image:linear-gradient(to_right,transparent,var(--cs-color-text-primary)_var(--cs-space-4))]',
  'data-[overflow=end]:[mask-image:linear-gradient(to_left,transparent,var(--cs-color-text-primary)_var(--cs-space-4))]',
  'data-[overflow=both]:[mask-image:linear-gradient(to_right,transparent,var(--cs-color-text-primary)_var(--cs-space-4),var(--cs-color-text-primary)_calc(100%-var(--cs-space-4)),transparent)]',
]);

export const foundationToolbarDomainVariants = cva([
  'inline-flex min-h-control-xl min-w-16 shrink-0 cursor-pointer select-none flex-col items-center justify-center gap-1.5 whitespace-nowrap rounded-md p-1.5 font-ui text-label text-text-secondary outline-none',
  'transition-[background-color,color,box-shadow] duration-120 ease-out',
  'hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
  // The chosen domain is neutral (owner 2026-10-27, O4): neutral-selected fill, primary icon and label, no edge.
  'aria-pressed:not-disabled:bg-neutral-selected aria-pressed:not-disabled:text-text-primary aria-pressed:not-disabled:hover:bg-neutral-selected-hover',
  // Disabled is a colour, not opacity, and drops the fill.
  'disabled:pointer-events-none disabled:text-disabled-text disabled:aria-pressed:bg-disabled-fill disabled:aria-pressed:text-disabled-text',
], {
  // The domain tile steps with the toolbar size: height 32, 40 and 48 (md and lg) minimum, padding 4 below md. Every tile
  // shares one minimum width wide enough for the usual labels (owner 2026-10-27), so the row reads as equal tiles: 40, 48,
  // 64 (md and lg). Icon to label: 6px (4 at xs).
  variants: { size: { xs: 'min-h-control-md min-w-10 gap-1 p-1', sm: 'min-h-control-lg min-w-12 p-1', md: '', lg: '' } },
  defaultVariants: { size: 'md' },
});

export const foundationToolbarDomainIconVariants = cva('inline-grid size-icon-lg shrink-0 place-items-center [&_svg]:size-full [&_svg]:stroke-[1.75]', {
  variants: { size: { xs: 'size-icon-sm', sm: 'size-icon-md', md: '', lg: '' } },
  defaultVariants: { size: 'md' },
});

export const foundationToolbarPickerVariants = cva('w-full min-w-0');
