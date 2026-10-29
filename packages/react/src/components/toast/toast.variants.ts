import { cva } from 'class-variance-authority';

// tone is the status (success by default; neutral and accent read as plain news) and sets the --tone-* slots; agent adds
// the spectrum rim. variant is the surface:
//   glass    regular glass with the thick blur and elevation 4 (the specimen); the mark carries the tone
//   solid    tone.solid fill, tone.on text, the mark inverted (tone.on disc, tone.solid glyph)
//   soft     tone.soft fill; outline surface.base with a 1px tone.border border (a border, so it stays under the elevation); ghost surface.base, no edge
// shadow drives the glass elevation (glass-shadow-N) and the plain shadow alike.
export const toastVariants = cva(
  [
    'flex min-h-toast-min min-w-0 items-center gap-3 rounded-toast py-2.5 pl-3.5 font-ui text-ui text-text-primary',
    // Enter (gentle, ease-out) from the starting style; exit (base) when Toaster sets data-state=closed. The store removes
    // the toast after the same base duration (toast.store.ts reads it). Reduced motion is global, so no variant is needed.
    'transition-[opacity,translate] duration-gentle ease-out starting:translate-y-2 starting:opacity-0',
    'data-[state=closed]:translate-y-2 data-[state=closed]:opacity-0 data-[state=closed]:duration-base data-[state=closed]:ease-out',
  ],
  {
    variants: {
      tone: {
      neutral: '[--tone-solid:var(--cs-color-neutral-solid)] [--tone-on:var(--cs-color-neutral-on)] [--tone-soft:var(--cs-color-neutral-soft)] [--tone-border:var(--cs-color-neutral-border)]',
      accent: '[--tone-solid:var(--cs-color-accent-solid)] [--tone-on:var(--cs-color-accent-on)] [--tone-soft:var(--cs-color-accent-soft)] [--tone-border:var(--cs-color-accent-border)]',
      success: '[--tone-solid:var(--cs-color-success-solid)] [--tone-on:var(--cs-color-success-on)] [--tone-soft:var(--cs-color-success-soft)] [--tone-border:var(--cs-color-success-border)]',
      warning: '[--tone-solid:var(--cs-color-warning-solid)] [--tone-on:var(--cs-color-warning-on)] [--tone-soft:var(--cs-color-warning-soft)] [--tone-border:var(--cs-color-warning-border)]',
      danger: '[--tone-solid:var(--cs-color-danger-solid)] [--tone-on:var(--cs-color-danger-on)] [--tone-soft:var(--cs-color-danger-soft)] [--tone-border:var(--cs-color-danger-border)]',
      info: '[--tone-solid:var(--cs-color-info-solid)] [--tone-on:var(--cs-color-info-on)] [--tone-soft:var(--cs-color-info-soft)] [--tone-border:var(--cs-color-info-border)]',
      agent: 'agent-rim [--tone-solid:var(--cs-color-agent-solid)] [--tone-on:var(--cs-color-agent-on)] [--tone-soft:var(--cs-color-agent-soft)] [--tone-border:var(--cs-color-agent-border)]',
      },
      variant: {
        glass: 'glass [--cs-material:var(--cs-color-material-regular)] [--cs-material-blur:var(--cs-blur-thick)]',
        solid: 'bg-(--tone-solid) text-(--tone-on) [&_[data-slot=toast-title]]:text-(--tone-on) [&_[data-slot=toast-description]]:text-(--tone-on) [&_[data-slot=toast-icon]]:bg-(--tone-on) [&_[data-slot=toast-icon]]:text-(--tone-solid) [&_[data-slot=toast-close]]:text-(--tone-on)',
        soft: 'bg-(--tone-soft)',
        outline: 'border border-(color:--tone-border) bg-surface-base',
        ghost: 'bg-surface-base',
      },
      // The trailing xs button (action or close) sits concentric with the corner, so end padding tightens to 12 only when one is present.
      action: { true: 'pr-3', false: 'pr-3.5' },
      size: {
        xs: 'min-h-10 gap-2 py-1.5 pl-2.5 text-ui-sm',
        sm: 'min-h-12 gap-2.5 py-2 pl-3',
        md: '',
        lg: 'min-h-16 gap-3.5 py-3 pl-4 text-ui-lg',
      },
      // The own toast corner (22px) is 3xl: the default key keeps it; every other key sets that radius token.
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': '', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: {
        none: 'shadow-none [--cs-shadow:none]', '1': 'glass-shadow-1 shadow-1', '2': 'glass-shadow-2 shadow-2', '3': 'glass-shadow-3 shadow-3', '4': 'glass-shadow-4 shadow-4', '5': 'glass-shadow-5 shadow-5',
      },
    },
    defaultVariants: { tone: 'success', variant: 'glass', action: false, size: 'md', radius: '3xl', shadow: '4' },
  },
);

/** The status mark: a solid status circle with its on-colour glyph, or the agent orb. */
export const toastMark = cva('', {
  variants: {
    tone: {
      neutral: 'grid size-control-sm flex-none place-items-center rounded-full bg-neutral-solid text-neutral-on [&_svg]:size-icon-md',
      accent: 'grid size-control-sm flex-none place-items-center rounded-full bg-accent-solid text-accent-on [&_svg]:size-icon-md',
      success: 'grid size-control-sm flex-none place-items-center rounded-full bg-success-solid text-success-on [&_svg]:size-icon-md',
      info: 'grid size-control-sm flex-none place-items-center rounded-full bg-info-solid text-info-on [&_svg]:size-icon-md',
      warning: 'grid size-control-sm flex-none place-items-center rounded-full bg-warning-solid text-warning-on [&_svg]:size-icon-md',
      danger: 'grid size-control-sm flex-none place-items-center rounded-full bg-danger-solid text-danger-on [&_svg]:size-icon-md',
      agent: 'orb',
    },
  },
  defaultVariants: { tone: 'success' },
});

export const toastViewport = cva(
  'fixed end-4 bottom-4 z-(--cs-z-toast) grid w-toast-w max-w-full gap-2',
);

/** Toast tone: the common tones (common-props.ts); success is the default. */
export type ToastTone = 'neutral' | 'accent' | 'success' | 'info' | 'warning' | 'danger' | 'agent';
/** Toast surface: the own glass (default) or one of the common variants. */
export type ToastVariant = 'glass' | 'solid' | 'soft' | 'outline' | 'ghost';
