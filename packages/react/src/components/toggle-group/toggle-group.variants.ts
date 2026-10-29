import { cva, type VariantProps } from 'class-variance-authority';

// variant is the track: soft = inset fill + border.subtle hairline (the specimen; the old appearance "filled"); outline =
// transparent + border.default hairline (the old "outline"); solid = neutral.track fill, no edge; ghost = no fill, no edge.
// relative and group: a single group draws its sliding thumb in the track (toggleGroupThumb), under the items.
export const toggleGroupVariants = cva(
  'relative group/toggle-group inline-flex gap-0.5 rounded-xl p-1',
  {
    variants: {
      variant: {
        soft: 'bg-bg-inset shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
        outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
        solid: 'bg-neutral-track',
        ghost: 'bg-transparent',
      },
      orientation: { horizontal: 'flex-row', vertical: 'flex-col' },
      // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    },
    defaultVariants: { variant: 'soft', orientation: 'horizontal', radius: 'xl', shadow: 'none' },
  },
);

export const toggleGroupItem = cva(
  [
    // relative: the sliding thumb sits under the items (single groups).
    'relative inline-grid shrink-0 place-items-center rounded-md bg-transparent text-text-secondary',
    'transition-control outline-none',
    // An off item hovers as a neutral.hover well inside the track (owner 2026-10-28): text colour alone was too weak a cue on a 32px icon target.
    'hover:text-text-primary data-[state=off]:hover:bg-neutral-hover focus-visible:shadow-focus',
    // On = the segment thumb (control family): raised fill + control edge.
    'data-[state=on]:bg-control-raised data-[state=on]:text-text-primary',
    'data-[state=on]:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] data-[state=on]:focus-visible:shadow-focus',
    // Disabled is a colour, not opacity: the label takes disabled.text and an on thumb flattens to disabled.fill.
    'disabled:pointer-events-none disabled:text-disabled-text disabled:data-[state=on]:bg-disabled-fill disabled:data-[state=on]:text-disabled-text disabled:data-[state=on]:shadow-none',
    // While the thumb slides (data-moving on the group) the on item has no fill of its own and nothing transitions.
    'group-data-[moving]/toggle-group:transition-none group-data-[moving]/toggle-group:data-[state=on]:bg-transparent group-data-[moving]/toggle-group:data-[state=on]:shadow-none',
  ],
  {
    variants: {
      // tone colours the icon of an on item; the thumb stays the control-raised chip (neutral = text.primary, the specimen).
      tone: {
        neutral: '',
        accent: 'data-[state=on]:text-accent-text',
        success: 'data-[state=on]:text-success-text',
        warning: 'data-[state=on]:text-warning-text',
        danger: 'data-[state=on]:text-danger-text',
        info: 'data-[state=on]:text-info-text',
        agent: 'data-[state=on]:text-agent-text',
      },
      // Icon targets at 28px and under press to 0.94 (press-sm); larger ones to 0.97.
      size: { xs: 'size-control-xs press-sm', sm: 'size-control-sm press-sm', md: 'size-control-md press', lg: 'size-control-lg press' },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

/**
 * The sliding thumb of a single group: the on fill (the control-raised segment thumb), drawn once under the items at the
 * on item's box (--thumb-* from useIndicator). Invisible at rest, where the on item draws its own fill; opaque while the
 * group has data-moving; it stays up until the item's fill is back (the opacity delay). A disabled on item takes the
 * disabled look.
 */
export const toggleGroupThumb = cva([
  'pointer-events-none absolute top-0 left-0 h-(--thumb-h) w-(--thumb-w) translate-x-(--thumb-x) translate-y-(--thumb-y) rounded-(--thumb-r) bg-control-raised shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] opacity-0',
  '[transition-property:translate,width,height,opacity] ease-snappy',
  '[transition-duration:var(--cs-duration-snappy),var(--cs-duration-snappy),var(--cs-duration-snappy),var(--cs-duration-instant)]',
  '[transition-delay:var(--cs-duration-instant),var(--cs-duration-instant),var(--cs-duration-instant),var(--cs-duration-quick)]',
  'group-data-[moving]/toggle-group:opacity-100 group-data-[moving]/toggle-group:[transition-delay:var(--cs-duration-instant)]',
  'group-has-[[data-slot=toggle-group-item][data-state=on]:disabled]/toggle-group:bg-disabled-fill group-has-[[data-slot=toggle-group-item][data-state=on]:disabled]/toggle-group:shadow-none',
]);

export type ToggleGroupVariantProps = VariantProps<typeof toggleGroupVariants>;
