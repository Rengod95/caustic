import { cva, type VariantProps } from 'class-variance-authority';

// tone sets the --tone-* slots the on state reads (accent by default); variant picks how the on track carries it:
//   solid   on track tone.solid, thumb tone.on (default)
//   soft    on track tone.soft, thumb tone.solid
//   outline track transparent with a border.control edge; on: tone.border-strong edge, thumb tone.solid
//   ghost   track transparent, no edge; on: thumb tone.solid
export const switchVariants = cva(
  [
    'group relative inline-flex shrink-0 items-center rounded-full bg-control-off p-0.5 transition-[background-color] duration-200 ease-out',
    'outline-none focus-visible:shadow-focus',
    // Disabled is a colour, not opacity: the track drops to disabled.fill on and off; the thumb position still says which.
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:data-[state=checked]:bg-disabled-fill',
  ],
  {
    variants: {
      tone: {
        neutral: '[--tone-solid:var(--cs-color-neutral-solid)] [--tone-on:var(--cs-color-neutral-on)] [--tone-soft:var(--cs-color-neutral-soft)] [--tone-border-strong:var(--cs-color-neutral-border-strong)]',
        accent: '[--tone-solid:var(--cs-color-accent-solid)] [--tone-on:var(--cs-color-accent-on)] [--tone-soft:var(--cs-color-accent-soft)] [--tone-border-strong:var(--cs-color-accent-border-strong)]',
        success: '[--tone-solid:var(--cs-color-success-solid)] [--tone-on:var(--cs-color-success-on)] [--tone-soft:var(--cs-color-success-soft)] [--tone-border-strong:var(--cs-color-success-border-strong)]',
        warning: '[--tone-solid:var(--cs-color-warning-solid)] [--tone-on:var(--cs-color-warning-on)] [--tone-soft:var(--cs-color-warning-soft)] [--tone-border-strong:var(--cs-color-warning-border-strong)]',
        danger: '[--tone-solid:var(--cs-color-danger-solid)] [--tone-on:var(--cs-color-danger-on)] [--tone-soft:var(--cs-color-danger-soft)] [--tone-border-strong:var(--cs-color-danger-border-strong)]',
        info: '[--tone-solid:var(--cs-color-info-solid)] [--tone-on:var(--cs-color-info-on)] [--tone-soft:var(--cs-color-info-soft)] [--tone-border-strong:var(--cs-color-info-border-strong)]',
        agent: '[--tone-solid:var(--cs-color-agent-solid)] [--tone-on:var(--cs-color-agent-on)] [--tone-soft:var(--cs-color-agent-soft)] [--tone-border-strong:var(--cs-color-agent-border-strong)]',
      },
      variant: {
        solid: 'data-[state=checked]:bg-(--tone-solid)',
        soft: 'data-[state=checked]:bg-(--tone-soft)',
        outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] data-[state=checked]:bg-transparent data-[state=checked]:shadow-[inset_0_0_0_1px_var(--tone-border-strong)]',
        ghost: 'bg-transparent data-[state=checked]:bg-transparent',
      },
      // iOS 26 proportions (owner 2026-10-28): a wider track, 64 × 28 at md and 48 × 23 at sm. The widths are space steps
      // until the switch width tokens are updated (central request). xs and lg take the sm and md track.
      size: {
        xs: 'h-switch-sm-h w-switch-sm-w', sm: 'h-switch-sm-h w-switch-sm-w',
        md: 'h-switch-md-h w-switch-md-w', lg: 'h-switch-md-h w-switch-md-w',
      },
      // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: '' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    },
    defaultVariants: { tone: 'accent', variant: 'solid', size: 'md', radius: 'full', shadow: 'none' },
  },
);

// The iOS 26 thumb is a capsule, wider than tall (owner 2026-10-28): 40 × 24 at md, 28 × 19 at sm, inset 2px. It travels
// 20 / 16px when on, and while held it widens to 48 / 32px toward the centre (a static :active width; the press motion is later).
export const switchThumb = cva(
  [
    'block rounded-full bg-control-thumb transition-[transform,width] duration-320 ease-spring',
    'shadow-2',
  ],
  {
    variants: {
      // On, the thumb takes the colour that sits on the on track: tone.on on tone.solid (white on the dark light-mode accent,
      // black on the light dark-mode one); tone.solid on the soft, outline and ghost tracks.
      variant: {
        solid: 'group-enabled:data-[state=checked]:bg-(--tone-on)',
        soft: 'group-enabled:data-[state=checked]:bg-(--tone-solid)',
        outline: 'group-enabled:data-[state=checked]:bg-(--tone-solid)',
        ghost: 'group-enabled:data-[state=checked]:bg-(--tone-solid)',
      },
      size: {
        xs: 'h-switch-sm-thumb w-switch-sm-thumb-w data-[state=checked]:translate-x-switch-sm-travel group-active:w-switch-sm-press group-active:data-[state=checked]:translate-x-3',
        sm: 'h-switch-sm-thumb w-switch-sm-thumb-w data-[state=checked]:translate-x-switch-sm-travel group-active:w-switch-sm-press group-active:data-[state=checked]:translate-x-3',
        md: 'h-switch-md-thumb w-switch-md-thumb-w data-[state=checked]:translate-x-switch-md-travel group-active:w-switch-md-press group-active:data-[state=checked]:translate-x-3',
        lg: 'h-switch-md-thumb w-switch-md-thumb-w data-[state=checked]:translate-x-switch-md-travel group-active:w-switch-md-press group-active:data-[state=checked]:translate-x-3',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
);
export type SwitchVariantProps = VariantProps<typeof switchVariants>;
