import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The anchored thick-glass panel. Common props (owner 2026-10-26), unset = this panel: variant solid (default) is the
 * thick material; soft re-points the material to the tone's soft 3 (opaque, the arrow follows); outline draws a 1px rim
 * in the tone's border 6; ghost is the material without elevation (Popover passes shadow none). On solid and ghost a hue
 * draws the rim. glass-thick and glass-shadow-4 live in the axes, not the base: two classes that set --cs-material or
 * --cs-shadow tie and sort by name, so only one of each may be present.
 * size: xs 240 with 10px padding and ui-sm · sm 240 · md 280 · lg 320 with 18px padding.
 */
export const popoverVariants = cva(
  'group glass z-40 grid grid-rows-[minmax(0,1fr)] max-w-full gap-2.5 rounded-2xl text-ui text-text-primary outline-none',
  {
    variants: {
      trigger: { click: 'max-h-(--radix-popover-content-available-height)', hover: 'max-h-(--radix-hover-card-content-available-height)' },
      size: {
        xs: 'w-popover-sm px-2.5 py-2.5 text-ui-sm', sm: 'w-popover-sm px-3.5 py-3.5', md: 'w-popover-md px-3.5 py-3.5',
        lg: 'w-dialog-sm px-4.5 py-4.5',
      },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: 'glass-thick', soft: '', outline: 'glass-thick', ghost: 'glass-thick' },
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': '', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '[--cs-shadow:none]', '1': 'glass-shadow-1', '2': 'glass-shadow-2', '3': 'glass-shadow-3', '4': 'glass-shadow-4', '5': 'glass-shadow-5' },
    },
    compoundVariants: [
      { variant: 'solid', tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
      { variant: 'solid', tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
      { variant: 'solid', tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
      { variant: 'solid', tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
      { variant: 'solid', tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
      { variant: 'solid', tone: 'agent', className: 'outline outline-1 -outline-offset-1 outline-agent-border' },
      { variant: 'soft', tone: 'neutral', className: '[--cs-material:var(--cs-color-neutral-soft)]' },
      { variant: 'soft', tone: 'accent', className: '[--cs-material:var(--cs-color-accent-soft)]' },
      { variant: 'soft', tone: 'success', className: '[--cs-material:var(--cs-color-success-soft)]' },
      { variant: 'soft', tone: 'warning', className: '[--cs-material:var(--cs-color-warning-soft)]' },
      { variant: 'soft', tone: 'danger', className: '[--cs-material:var(--cs-color-danger-soft)]' },
      { variant: 'soft', tone: 'info', className: '[--cs-material:var(--cs-color-info-soft)]' },
      { variant: 'soft', tone: 'agent', className: '[--cs-material:var(--cs-color-agent-soft)]' },
      { variant: 'outline', tone: 'neutral', className: 'outline outline-1 -outline-offset-1 outline-neutral-border' },
      { variant: 'outline', tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
      { variant: 'outline', tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
      { variant: 'outline', tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
      { variant: 'outline', tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
      { variant: 'outline', tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
      { variant: 'outline', tone: 'agent', className: 'outline outline-1 -outline-offset-1 outline-agent-border' },
      { variant: 'ghost', tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
      { variant: 'ghost', tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
      { variant: 'ghost', tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
      { variant: 'ghost', tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
      { variant: 'ghost', tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
      { variant: 'ghost', tone: 'agent', className: 'outline outline-1 -outline-offset-1 outline-agent-border' },
    ],
    defaultVariants: { trigger: 'click', size: 'md', tone: 'neutral', variant: 'solid', radius: '2xl', shadow: '4' },
  },
);

/**
 * The pointer: an 8px (space-2) box clipped to a diamond, centered on the surface edge (owner 2026-10-28, proposal B: the
 * 12px diamond read as a separate shape next to a 280px panel). Clipping (not rotating) keeps the box 8px. The arrow is the material fill only (no rim); it reads the panel's --cs-material, so a soft panel
 * takes its arrow along.
 */
export const popoverArrow = cva([
  'pointer-events-none absolute size-2 rounded-xs bg-(--cs-material) [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]',
  'group-data-[side=bottom]:-top-1 group-data-[side=top]:-bottom-1 group-data-[side=right]:-left-1 group-data-[side=left]:-right-1',
  'group-data-[side=bottom]:group-data-[align=start]:left-6 group-data-[side=top]:group-data-[align=start]:left-6',
  'group-data-[side=bottom]:group-data-[align=end]:right-6 group-data-[side=top]:group-data-[align=end]:right-6',
  'group-data-[side=bottom]:group-data-[align=center]:left-[calc(50%-var(--spacing)*1)] group-data-[side=top]:group-data-[align=center]:left-[calc(50%-var(--spacing)*1)]',
  'group-data-[side=left]:group-data-[align=start]:top-6 group-data-[side=right]:group-data-[align=start]:top-6',
  'group-data-[side=left]:group-data-[align=end]:bottom-6 group-data-[side=right]:group-data-[align=end]:bottom-6',
  'group-data-[side=left]:group-data-[align=center]:top-[calc(50%-var(--spacing)*1)] group-data-[side=right]:group-data-[align=center]:top-[calc(50%-var(--spacing)*1)]',
]);

export type PopoverVariantProps = VariantProps<typeof popoverVariants>;
