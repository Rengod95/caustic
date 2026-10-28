import { cva } from 'class-variance-authority';

// tone sets the --tone-* slots; neutral is the ink pair (ink.solid, ink.on: the specimen). variant sets --tip-bg, the bubble
// and arrow fill: solid = tone.solid with tone.on text (default); soft = tone.soft with tone.text; outline = surface.raised
// with a 1px tone.border edge and elevation 3; ghost = surface.raised, elevation only. The text and the shortcut sit 12px apart
// (8px at xs) so "Undo ⌘Z" does not read as one word (owner 2026-10-28).
export const tooltipVariants = cva(
  'group z-60 inline-flex items-center gap-3 whitespace-nowrap rounded-md bg-(--tip-bg) font-ui shadow-3 select-none',
  {
    variants: {
      tone: {
        neutral: '[--tone-solid:var(--cs-color-ink-solid)] [--tone-on:var(--cs-color-ink-on)] [--tone-soft:var(--cs-color-neutral-soft)] [--tone-text:var(--cs-color-text-primary)] [--tone-border:var(--cs-color-border-default)]',
        accent: '[--tone-solid:var(--cs-color-accent-solid)] [--tone-on:var(--cs-color-accent-on)] [--tone-soft:var(--cs-color-accent-soft)] [--tone-text:var(--cs-color-accent-text)] [--tone-border:var(--cs-color-accent-border)]',
        success: '[--tone-solid:var(--cs-color-success-solid)] [--tone-on:var(--cs-color-success-on)] [--tone-soft:var(--cs-color-success-soft)] [--tone-text:var(--cs-color-success-text)] [--tone-border:var(--cs-color-success-border)]',
        warning: '[--tone-solid:var(--cs-color-warning-solid)] [--tone-on:var(--cs-color-warning-on)] [--tone-soft:var(--cs-color-warning-soft)] [--tone-text:var(--cs-color-warning-text)] [--tone-border:var(--cs-color-warning-border)]',
        danger: '[--tone-solid:var(--cs-color-danger-solid)] [--tone-on:var(--cs-color-danger-on)] [--tone-soft:var(--cs-color-danger-soft)] [--tone-text:var(--cs-color-danger-text)] [--tone-border:var(--cs-color-danger-border)]',
        info: '[--tone-solid:var(--cs-color-info-solid)] [--tone-on:var(--cs-color-info-on)] [--tone-soft:var(--cs-color-info-soft)] [--tone-text:var(--cs-color-info-text)] [--tone-border:var(--cs-color-info-border)]',
        agent: '[--tone-solid:var(--cs-color-agent-solid)] [--tone-on:var(--cs-color-agent-on)] [--tone-soft:var(--cs-color-agent-soft)] [--tone-text:var(--cs-color-agent-text)] [--tone-border:var(--cs-color-agent-border)]',
      },
      variant: {
        solid: '[--tip-bg:var(--tone-solid)] text-(--tone-on)',
        soft: '[--tip-bg:var(--tone-soft)] text-(--tone-text)',
        outline: '[--tip-bg:var(--cs-color-surface-raised)] text-text-primary shadow-[inset_0_0_0_1px_var(--tone-border),var(--cs-elevation-3)]',
        ghost: '[--tip-bg:var(--cs-color-surface-raised)] text-text-primary',
      },
      size: {
        xs: 'min-h-control-xs gap-2 px-1.5 py-0.5 text-ui-xs',
        sm: 'min-h-control-xs px-2 py-1 text-ui-sm',
        md: 'min-h-control-sm px-2 py-1.25 text-ui-sm',
        lg: 'min-h-control-md px-2.5 py-1.5 text-ui',
      },
      // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: '', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: 'shadow-none', '1': 'shadow-1', '2': 'shadow-2', '3': '', '4': 'shadow-4', '5': 'shadow-5' },
    },
    // The shortcut chord keeps the ink.kbd plate only on the ink bubble; on every other bubble it reads in the bubble text.
    compoundVariants: [
      { tone: ['accent', 'success', 'warning', 'danger', 'info', 'agent'], className: '[&_[data-slot=tooltip-shortcut]]:bg-transparent [&_[data-slot=tooltip-shortcut]]:text-current' },
      { variant: ['soft', 'outline', 'ghost'], className: '[&_[data-slot=tooltip-shortcut]]:bg-transparent [&_[data-slot=tooltip-shortcut]]:text-current' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'solid', size: 'md', radius: 'md', shadow: '3' },
  },
);

export const tooltipArrow = cva(
  'block size-2 rotate-45 rounded-br-xs bg-(--tip-bg) group-data-[side=top]:-translate-y-1/2 group-data-[side=bottom]:translate-y-1/2 group-data-[side=left]:-translate-x-1/2 group-data-[side=right]:translate-x-1/2',
);
