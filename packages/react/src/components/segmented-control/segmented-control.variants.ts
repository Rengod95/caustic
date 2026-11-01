import { cva, type VariantProps } from 'class-variance-authority';

// Common props (owner 2026-10-26). variant is the track and selection treatment (the deprecated appearance maps onto
// it: raised = solid, outline = outline, subtle = ghost):
//   solid   sunken bg.inset track with a border.subtle edge; the checked segment is the raised thumb (control family):
//           control.raised, the control edge and elevation 1 under it (owner 2026-10-28, like the Switch and Tabs thumbs)
//   soft    sunken bg.inset track, no edge; the checked segment is the tone soft fill
//   outline transparent track with a border.default edge; the checked segment is flat neutral.selected (tone soft)
//   ghost   no track; the checked segment is flat neutral.selected (tone soft)
// tone colours the checked segment: neutral = today; another tone takes its soft fill and text colour (on the solid
// thumb only the label takes the tone text colour, the thumb stays control.raised).
// radius: xl (the default) keeps the size's own concentric radii (track xl / segment md; lg / sm at xs and sm, P5);
// another value sets the track, and none / full carry to the segments (the deprecated shape="pill" = radius full).
export const segmentedControlVariants = cva(
  'inline-flex gap-0.5 p-1 bg-bg-inset shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] rounded-xl',
  {
    variants: {
      variant: {
        solid: '',
        soft: 'shadow-none',
        outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
        ghost: 'bg-transparent shadow-none',
      },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      size: { xs: 'rounded-lg', sm: 'rounded-lg', md: '', lg: '' },
      orientation: { horizontal: 'flex-row', vertical: 'flex-col items-stretch' },
      // After size, so an explicit radius wins over the size's own track radius.
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    },
    defaultVariants: { variant: 'solid', tone: 'neutral', radius: 'xl', shadow: 'none', size: 'md', orientation: 'horizontal' },
  },
);

export const segmentedItemVariants = cva(
  [
    // relative: the sliding thumb sits under the segments (it comes first in the track).
    'relative inline-flex shrink-0 items-center gap-1.25 whitespace-nowrap font-ui font-medium text-text-secondary',
    'transition-control press outline-none',
    'hover:text-text-primary focus-visible:shadow-focus',
    'data-[state=checked]:text-text-primary data-[state=checked]:focus-visible:shadow-focus',
    // Disabled is a colour, not opacity: the label takes disabled.text and a checked segment flattens to disabled.fill.
    'disabled:pointer-events-none disabled:text-disabled-text disabled:data-[state=checked]:bg-disabled-fill disabled:data-[state=checked]:text-disabled-text disabled:data-[state=checked]:shadow-none',
    // While the thumb slides (data-moving on the track) the checked segment has no fill of its own and nothing transitions.
    'group-data-[moving]/seg:transition-none group-data-[moving]/seg:data-[state=checked]:bg-transparent group-data-[moving]/seg:data-[state=checked]:shadow-none',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        // Solid: the segment thumb (control family). The others: a flat selection fill (compound variants).
        solid: 'data-[state=checked]:bg-control-raised data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge),var(--cs-elevation-1)]',
        soft: '',
        outline: '',
        ghost: '',
      },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      size: {
        xs: 'h-control-compact-xs px-2 text-ui-sm rounded-sm',
        sm: 'h-control-compact-sm px-2 text-ui-dense rounded-sm',
        md: 'h-control-inline px-2.5 text-ui-dense rounded-md',
        lg: 'h-control-md px-3 text-ui rounded-md',
      },
      content: { label: '', icon: 'px-1.75' },
      orientation: { horizontal: 'justify-center [&_svg]:size-icon-md', vertical: 'justify-start [&_svg]:size-icon-sm' },
      // Segments follow only the extremes (none, full); other values keep the concentric segment radius.
      radius: {
        none: 'rounded-none', '2xs': '', xs: '', sm: '', md: '', lg: '',
        xl: '', '2xl': '', '3xl': '', '4xl': '', full: 'rounded-full',
      },
    },
    compoundVariants: [
      { variant: ['soft', 'outline', 'ghost'], tone: 'neutral', className: 'data-[state=checked]:bg-neutral-selected' },
      { variant: 'solid', tone: 'accent', className: 'data-[state=checked]:text-accent-text' },
      { variant: 'solid', tone: 'success', className: 'data-[state=checked]:text-success-text' },
      { variant: 'solid', tone: 'warning', className: 'data-[state=checked]:text-warning-text' },
      { variant: 'solid', tone: 'danger', className: 'data-[state=checked]:text-danger-text' },
      { variant: 'solid', tone: 'info', className: 'data-[state=checked]:text-info-text' },
      { variant: 'solid', tone: 'agent', className: 'data-[state=checked]:text-agent-text' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'accent', className: 'data-[state=checked]:bg-accent-soft data-[state=checked]:text-accent-text' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'success', className: 'data-[state=checked]:bg-success-soft data-[state=checked]:text-success-text' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'warning', className: 'data-[state=checked]:bg-warning-soft data-[state=checked]:text-warning-text' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'danger', className: 'data-[state=checked]:bg-danger-soft data-[state=checked]:text-danger-text' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'info', className: 'data-[state=checked]:bg-info-soft data-[state=checked]:text-info-text' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'agent', className: 'data-[state=checked]:bg-agent-soft data-[state=checked]:text-agent-text' },
    ],
    defaultVariants: { variant: 'solid', tone: 'neutral', radius: 'xl', size: 'md', content: 'label', orientation: 'horizontal' },
  },
);

/**
 * The sliding thumb: the checked segment's fill, drawn once under the segments at the checked segment's box (--thumb-*
 * from useIndicator). Invisible at rest, where the segment paints its own fill. While the track has data-moving it is
 * opaque; when the move ends it stays opaque until the segment's fill is back (the opacity delay), so nothing flickers.
 */
export const segmentedThumbVariants = cva(
  [
    'pointer-events-none absolute top-0 left-0 h-(--thumb-h) w-(--thumb-w) translate-x-(--thumb-x) translate-y-(--thumb-y) rounded-(--thumb-r) opacity-0',
    '[transition-property:translate,width,height,opacity] ease-snappy',
    '[transition-duration:var(--cs-duration-snappy),var(--cs-duration-snappy),var(--cs-duration-snappy),var(--cs-duration-instant)]',
    '[transition-delay:var(--cs-duration-instant),var(--cs-duration-instant),var(--cs-duration-instant),var(--cs-duration-quick)]',
    'group-data-[moving]/seg:opacity-100 group-data-[moving]/seg:[transition-delay:var(--cs-duration-instant)]',
    'group-has-[[role=radio][data-state=checked]:disabled]/seg:bg-disabled-fill group-has-[[role=radio][data-state=checked]:disabled]/seg:shadow-none',
  ],
  {
    variants: {
      variant: {
        solid: 'bg-control-raised shadow-[inset_0_0_0_1px_var(--cs-color-control-edge),var(--cs-elevation-1)]',
        soft: '',
        outline: '',
        ghost: '',
      },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    },
    compoundVariants: [
      { variant: ['soft', 'outline', 'ghost'], tone: 'neutral', className: 'bg-neutral-selected' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'accent', className: 'bg-accent-soft' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'success', className: 'bg-success-soft' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'warning', className: 'bg-warning-soft' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'danger', className: 'bg-danger-soft' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'info', className: 'bg-info-soft' },
      { variant: ['soft', 'outline', 'ghost'], tone: 'agent', className: 'bg-agent-soft' },
    ],
    defaultVariants: { tone: 'neutral' },
  },
);

export type SegmentedControlVariantProps = VariantProps<typeof segmentedControlVariants>;
