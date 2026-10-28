import { cva, type VariantProps } from 'class-variance-authority';

// Common props (owner 2026-10-26) on the root. tone is the scrollbar thumb colour, passed to the viewport as
// --scroll-area-thumb (neutral = neutral.track, today; another tone = its border-strong). variant gives the area a
// surface: ghost = none (today: the area shows its parent); soft = the tone soft fill; outline = a 1px tone border
// edge; solid = surface.base. radius / shadow shape the root (null when unset: the root inherits the parent's radius
// and has no shadow). size steps the edge-fade band (xs space-3, sm space-4, md space-6 = today, lg space-8).
export const scrollAreaVariants = cva('relative grid size-full min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-[inherit]', {
  variants: {
    scrollbar: { hover: '', always: '' },
    tone: {
      neutral: '[--scroll-area-thumb:var(--cs-color-neutral-track)]', accent: '[--scroll-area-thumb:var(--cs-color-accent-border-strong)]', success: '[--scroll-area-thumb:var(--cs-color-success-border-strong)]', warning: '[--scroll-area-thumb:var(--cs-color-warning-border-strong)]',
      danger: '[--scroll-area-thumb:var(--cs-color-danger-border-strong)]', info: '[--scroll-area-thumb:var(--cs-color-info-border-strong)]', agent: '[--scroll-area-thumb:var(--cs-color-agent-border-strong)]',
    },
    variant: { solid: 'bg-surface-base', soft: '', outline: '', ghost: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: {
      xs: '[--scroll-area-fade:var(--cs-space-3)]', sm: '[--scroll-area-fade:var(--cs-space-4)]',
      md: '[--scroll-area-fade:var(--cs-space-6)]', lg: '[--scroll-area-fade:var(--cs-space-8)]',
    },
  },
  compoundVariants: [
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { scrollbar: 'hover', tone: 'neutral', variant: 'ghost', radius: 'none', shadow: 'none', size: 'md' },
});

/** Scrollbar thumb: the tone colour set on the root (neutral.track by default: a fill, not a border token). */
// Width: thin at rest (the base layer); while the pointer is over the area it widens to the platform width so the
// thumb is easier to grab (owner 2026-10-28, A). Both scrollbar modes.
const WIDEN = 'group-hover/scroll-area:[scrollbar-width:auto]';
const THUMB = '[scrollbar-color:var(--scroll-area-thumb)_transparent]';

export const scrollAreaViewportVariants = cva(
  ['min-h-0 min-w-0 overscroll-contain scroll-auto rounded-[inherit] outline-none focus-visible:shadow-[var(--cs-focus-field),var(--cs-focus)]', WIDEN],
  {
    variants: {
      scrollbar: {
        hover: [
          '[scrollbar-color:transparent_transparent]',
          'group-hover/scroll-area:[scrollbar-color:var(--scroll-area-thumb)_transparent]',
          'focus-within:[scrollbar-color:var(--scroll-area-thumb)_transparent]',
          'data-[scrolling=true]:[scrollbar-color:var(--scroll-area-thumb)_transparent]',
        ],
        always: THUMB,
      },
      orientation: {
        vertical: 'overflow-x-hidden overflow-y-auto',
        horizontal: 'overflow-x-auto overflow-y-hidden',
        both: 'overflow-auto',
      },
      fade: { true: '', false: '' },
    },
    compoundVariants: [
      {
        fade: true,
        orientation: ['vertical', 'both'],
        className: [
          'data-[overflow-y-start=true]:data-[overflow-y-end=true]:[mask-image:linear-gradient(to_bottom,transparent,black_var(--scroll-area-fade),black_calc(100%-var(--scroll-area-fade)),transparent)]',
          'data-[overflow-y-start=true]:data-[overflow-y-end=false]:[mask-image:linear-gradient(to_bottom,transparent,black_var(--scroll-area-fade))]',
          'data-[overflow-y-start=false]:data-[overflow-y-end=true]:[mask-image:linear-gradient(to_bottom,black_calc(100%-var(--scroll-area-fade)),transparent)]',
        ],
      },
      {
        fade: true,
        orientation: 'horizontal',
        className: [
          'data-[overflow-x-start=true]:data-[overflow-x-end=true]:[mask-image:linear-gradient(to_right,transparent,black_var(--scroll-area-fade),black_calc(100%-var(--scroll-area-fade)),transparent)]',
          'data-[overflow-x-start=true]:data-[overflow-x-end=false]:[mask-image:linear-gradient(to_right,transparent,black_var(--scroll-area-fade))]',
          'data-[overflow-x-start=false]:data-[overflow-x-end=true]:[mask-image:linear-gradient(to_right,black_calc(100%-var(--scroll-area-fade)),transparent)]',
        ],
      },
    ],
    defaultVariants: { scrollbar: 'hover', orientation: 'vertical', fade: false },
  },
);

export const scrollAreaContentVariants = cva('min-w-0', {
  variants: {
    orientation: { vertical: '', horizontal: 'w-max', both: 'w-max' },
  },
  defaultVariants: { orientation: 'vertical' },
});

export type ScrollAreaVariantProps = VariantProps<typeof scrollAreaVariants>;
