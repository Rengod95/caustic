import { cva, type VariantProps } from 'class-variance-authority';

export const popoverVariants = cva(
  'group glass glass-thick glass-shadow-4 z-40 grid max-w-full gap-2.5 rounded-2xl px-3.5 py-3.5 text-ui text-text-primary outline-none',
  {
    variants: {
      trigger: { click: '', hover: '' },
      size: { sm: 'w-popover-sm', md: 'w-popover-md' },
    },
    defaultVariants: { trigger: 'click', size: 'md' },
  },
);

/**
 * The pointer: a 12px box clipped to a diamond, centered on the surface edge. Clipping (not rotating)
 * keeps the box 12px; two gradient bands draw the rim on the two outer edges.
 */
export const popoverArrow = cva([
  'pointer-events-none absolute size-popover-arrow rounded-xs bg-material-thick [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]',
  'group-data-[side=bottom]:-top-1.5 group-data-[side=top]:-bottom-1.5 group-data-[side=right]:-left-1.5 group-data-[side=left]:-right-1.5',
  'group-data-[side=bottom]:bg-[linear-gradient(135deg,var(--cs-color-material-rim)_25%,transparent_31%),linear-gradient(225deg,var(--cs-color-material-rim)_25%,transparent_31%)]',
  'group-data-[side=top]:bg-[linear-gradient(45deg,var(--cs-color-material-rim)_25%,transparent_31%),linear-gradient(315deg,var(--cs-color-material-rim)_25%,transparent_31%)]',
  'group-data-[side=right]:bg-[linear-gradient(135deg,var(--cs-color-material-rim)_25%,transparent_31%),linear-gradient(45deg,var(--cs-color-material-rim)_25%,transparent_31%)]',
  'group-data-[side=left]:bg-[linear-gradient(225deg,var(--cs-color-material-rim)_25%,transparent_31%),linear-gradient(315deg,var(--cs-color-material-rim)_25%,transparent_31%)]',
  'group-data-[side=bottom]:group-data-[align=start]:left-6 group-data-[side=top]:group-data-[align=start]:left-6',
  'group-data-[side=bottom]:group-data-[align=end]:right-6 group-data-[side=top]:group-data-[align=end]:right-6',
  'group-data-[side=bottom]:group-data-[align=center]:left-[calc(50%-var(--spacing)*1.5)] group-data-[side=top]:group-data-[align=center]:left-[calc(50%-var(--spacing)*1.5)]',
  'group-data-[side=left]:group-data-[align=start]:top-6 group-data-[side=right]:group-data-[align=start]:top-6',
  'group-data-[side=left]:group-data-[align=end]:bottom-6 group-data-[side=right]:group-data-[align=end]:bottom-6',
  'group-data-[side=left]:group-data-[align=center]:top-[calc(50%-var(--spacing)*1.5)] group-data-[side=right]:group-data-[align=center]:top-[calc(50%-var(--spacing)*1.5)]',
]);

export type PopoverVariantProps = VariantProps<typeof popoverVariants>;
