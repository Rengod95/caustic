import { cva } from 'class-variance-authority';

// tone is the status (success by default; neutral and accent read as plain news) and sets the --tone-* slots; agent adds
// the spectrum rim. variant is the surface (owner 2026-11-12: outline by default, a bare glyph, tighter padding):
//   outline  surface.base with a 1px tone.border border (a border, so it stays under the elevation); the default
//   glass    regular glass with the thick blur
//   solid    tone.solid fill, tone.on text and glyph
//   soft     tone.soft fill; ghost surface.base, no edge
// The glyph never sits on a fill: it is the tone text colour (AA on surface.base in both themes, where the graphic step
// leaves a light warning glyph near 1.8 : 1); tone.on on solid. neutral (plain news, no glyph) takes the quiet
// border.strong hairline: neutral.border is the 3.6 : 1 control border and read heavier than every status tone.
// shadow drives the glass elevation (glass-shadow-N) and the plain shadow alike.
export const toastVariants = cva(
  [
    'flex min-w-0 items-center rounded-2xl font-ui text-text-primary',
    // Enter (gentle, ease-out) rises 8px in from the starting style; exit (swift, shorter) drops 4px when Toaster sets
    // data-state=closed. The store removes the toast after the same swift duration (toast.store.ts reads it). Reduced
    // motion is global, so no variant is needed.
    'transition-[opacity,translate] duration-gentle ease-out starting:translate-y-2 starting:opacity-0',
    'data-[state=closed]:translate-y-1 data-[state=closed]:opacity-0 data-[state=closed]:duration-swift data-[state=closed]:ease-out',
  ],
  {
    variants: {
      tone: {
        neutral: '[--tone-solid:var(--cs-color-neutral-solid)] [--tone-on:var(--cs-color-neutral-on)] [--tone-soft:var(--cs-color-neutral-soft)] [--tone-border:var(--cs-color-border-strong)] [--tone-glyph:var(--cs-color-neutral-text)]',
        accent: '[--tone-solid:var(--cs-color-accent-solid)] [--tone-on:var(--cs-color-accent-on)] [--tone-soft:var(--cs-color-accent-soft)] [--tone-border:var(--cs-color-accent-border)] [--tone-glyph:var(--cs-color-accent-text)]',
        success: '[--tone-solid:var(--cs-color-success-solid)] [--tone-on:var(--cs-color-success-on)] [--tone-soft:var(--cs-color-success-soft)] [--tone-border:var(--cs-color-success-border)] [--tone-glyph:var(--cs-color-success-text)]',
        warning: '[--tone-solid:var(--cs-color-warning-solid)] [--tone-on:var(--cs-color-warning-on)] [--tone-soft:var(--cs-color-warning-soft)] [--tone-border:var(--cs-color-warning-border)] [--tone-glyph:var(--cs-color-warning-text)]',
        danger: '[--tone-solid:var(--cs-color-danger-solid)] [--tone-on:var(--cs-color-danger-on)] [--tone-soft:var(--cs-color-danger-soft)] [--tone-border:var(--cs-color-danger-border)] [--tone-glyph:var(--cs-color-danger-text)]',
        info: '[--tone-solid:var(--cs-color-info-solid)] [--tone-on:var(--cs-color-info-on)] [--tone-soft:var(--cs-color-info-soft)] [--tone-border:var(--cs-color-info-border)] [--tone-glyph:var(--cs-color-info-text)]',
        agent: 'agent-rim [--tone-solid:var(--cs-color-agent-solid)] [--tone-on:var(--cs-color-agent-on)] [--tone-soft:var(--cs-color-agent-soft)] [--tone-border:var(--cs-color-agent-border)] [--tone-glyph:var(--cs-color-agent-text)]',
      },
      variant: {
        glass: 'glass [--cs-material:var(--cs-color-material-regular)] [--cs-material-blur:var(--cs-blur-thick)]',
        solid: 'bg-(--tone-solid) text-(--tone-on) [--tone-glyph:var(--tone-on)] [&_[data-slot=toast-title]]:text-(--tone-on) [&_[data-slot=toast-description]]:text-(--tone-on) [&_[data-slot=toast-close]]:text-(--tone-on)',
        soft: 'bg-(--tone-soft)',
        outline: 'border border-(color:--tone-border) bg-surface-base',
        ghost: 'bg-surface-base',
      },
      // A trailing xs button (action or close) ends the row: the end padding drops 4px so the button sits concentric with the corner.
      action: { true: '', false: '' },
      size: {
        xs: 'min-h-8 gap-1.5 py-1 ps-2 text-ui-sm',
        sm: 'min-h-10 gap-2 py-1.5 ps-2.5 text-ui',
        md: 'min-h-12 gap-2 py-2 ps-3 text-ui',
        lg: 'min-h-16 gap-2.5 py-2.5 ps-3.5 text-ui-lg',
      },
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': '', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: {
        none: 'shadow-none [--cs-shadow:none]', '1': 'glass-shadow-1 shadow-1', '2': 'glass-shadow-2 shadow-2', '3': 'glass-shadow-3 shadow-3', '4': 'glass-shadow-4 shadow-4', '5': 'glass-shadow-5 shadow-5',
      },
    },
    compoundVariants: [
      { size: 'xs', action: false, className: 'pe-2' },
      { size: 'xs', action: true, className: 'pe-1' },
      { size: 'sm', action: false, className: 'pe-2.5' },
      { size: 'sm', action: true, className: 'pe-1.5' },
      { size: 'md', action: false, className: 'pe-3' },
      { size: 'md', action: true, className: 'pe-2' },
      { size: 'lg', action: false, className: 'pe-3.5' },
      { size: 'lg', action: true, className: 'pe-2.5' },
    ],
    defaultVariants: { tone: 'success', variant: 'outline', action: false, size: 'md', radius: '2xl', shadow: '3' },
  },
);

/** The text block: a mark column and the title/detail column, 6px apart (8 at lg). */
export const toastMain = cva('grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-start break-keep wrap-anywhere', {
  variants: {
    size: { xs: 'gap-x-1.5', sm: 'gap-x-1.5', md: 'gap-x-1.5', lg: 'gap-x-2' },
  },
  defaultVariants: { size: 'md' },
});

/** The status mark: a bare glyph in the tone text colour (no fill), in a box as tall as the title line; or the agent orb. */
export const toastMark = cva('grid flex-none place-items-center', {
  variants: {
    kind: { glyph: 'text-(--tone-glyph)', agent: '' },
    size: {
      xs: 'h-4.5 [&_svg]:size-icon-sm',
      sm: 'h-4.5 [&_svg]:size-icon-md',
      md: 'h-4.5 [&_svg]:size-icon-md',
      lg: 'h-5 [&_svg]:size-icon-lg',
    },
  },
  defaultVariants: { kind: 'glyph', size: 'md' },
});

/** The agent orb inside the mark box (agent tone only). */
export const toastOrb = cva('', {
  variants: { tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: 'orb' } },
  defaultVariants: { tone: 'success' },
});

export const toastViewport = cva(
  'fixed end-4 bottom-4 z-(--cs-z-toast) grid w-toast-w max-w-full gap-2',
);

/** Toast tone: the common tones (common-props.ts); success is the default. */
export type ToastTone = 'neutral' | 'accent' | 'success' | 'info' | 'warning' | 'danger' | 'agent';
/** Toast surface: outline (default) or one of the other common variants. */
export type ToastVariant = 'glass' | 'solid' | 'soft' | 'outline' | 'ghost';
