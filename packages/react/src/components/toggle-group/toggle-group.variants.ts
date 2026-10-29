import { cva, type VariantProps } from 'class-variance-authority';

// variant is the track: soft = inset fill + border.subtle hairline (the specimen; the old appearance "filled"); outline =
// transparent + border.default hairline (the old "outline"); solid = neutral.track fill, no edge; ghost = no fill, no edge.
export const toggleGroupVariants = cva(
  'inline-flex gap-0.5 rounded-xl p-1',
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
    'inline-grid shrink-0 place-items-center rounded-md bg-transparent text-text-secondary',
    'transition-control outline-none',
    // An off item hovers as a neutral.hover well inside the track (owner 2026-10-28): text colour alone was too weak a cue on a 32px icon target.
    'hover:text-text-primary data-[state=off]:hover:bg-neutral-hover focus-visible:shadow-focus',
    // On = the segment thumb (control family): raised fill + control edge.
    'data-[state=on]:bg-control-raised data-[state=on]:text-text-primary',
    'data-[state=on]:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] data-[state=on]:focus-visible:shadow-focus',
    // Disabled is a colour, not opacity: the label takes disabled.text and an on thumb flattens to disabled.fill.
    'disabled:pointer-events-none disabled:text-disabled-text disabled:data-[state=on]:bg-disabled-fill disabled:data-[state=on]:text-disabled-text disabled:data-[state=on]:shadow-none',
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

export type ToggleGroupVariantProps = VariantProps<typeof toggleGroupVariants>;
