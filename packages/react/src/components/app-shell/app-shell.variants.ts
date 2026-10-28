import { cva } from 'class-variance-authority';

// Five common props (lib/common-props.ts); each axis' default is the shell's own look and adds no class:
//   variant / tone  the window ground: solid neutral = bg.app (own); solid in a tone = its soft; soft = the tint
//                   (neutral.tint or the tone tint); outline = a 1px tone border around the window, no fill; ghost = none.
//   radius / shadow the window box (none, flat). size: the window inset and region gaps (and the titlebar height),
//                   xs 6 · sm 8 · md 10 (own) · lg 12.
export const appShellVariants = cva(
  'group/app-shell relative isolate flex size-full min-h-0 min-w-0 flex-col overflow-hidden bg-bg-app font-ui text-text-primary',
  {
    variants: {
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      radius: {
        none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: 'gap-1.5 p-1.5', sm: 'gap-2 p-2', md: 'gap-2.5 p-studio-window-inset', lg: 'gap-3 p-3' },
    },
    compoundVariants: [
      { variant: 'solid', tone: 'accent', className: 'bg-accent-soft' },
      { variant: 'solid', tone: 'success', className: 'bg-success-soft' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-soft' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-soft' },
      { variant: 'solid', tone: 'info', className: 'bg-info-soft' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-soft' },
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-tint' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
      { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
      { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
      { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
      { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
      { variant: 'ghost', tone: 'neutral', className: 'bg-transparent shadow-none' },
      { variant: 'ghost', tone: 'accent', className: 'bg-transparent shadow-none' },
      { variant: 'ghost', tone: 'success', className: 'bg-transparent shadow-none' },
      { variant: 'ghost', tone: 'warning', className: 'bg-transparent shadow-none' },
      { variant: 'ghost', tone: 'danger', className: 'bg-transparent shadow-none' },
      { variant: 'ghost', tone: 'info', className: 'bg-transparent shadow-none' },
      { variant: 'ghost', tone: 'agent', className: 'bg-transparent shadow-none' },
    ],
    defaultVariants: { variant: 'solid', tone: 'neutral', radius: 'none', shadow: 'none', size: 'md' },
  },
);

export const appShellSkipVariants = cva(
  [
    'absolute left-2 top-2 z-20 -translate-y-[200%] rounded-lg bg-control-raised px-3 py-2 font-ui text-ui-strong text-text-primary opacity-0 outline-none',
    '[--cs-focus-offset:var(--cs-color-bg-app)] focus:translate-y-0 focus:opacity-100 focus-visible:focus-ring',
  ],
);

export const appShellTitlebarVariants = cva('flex flex-none items-center', {
  variants: { size: { xs: 'h-control-md gap-1.5', sm: 'h-control-lg gap-2', md: 'h-studio-titlebar-h gap-2.5', lg: 'h-control-xl gap-3' } },
  defaultVariants: { size: 'md' },
});

export const appShellBodyVariants = cva('relative flex min-h-0 min-w-0 flex-1', {
  variants: { size: { xs: 'gap-1.5', sm: 'gap-2', md: 'gap-2.5', lg: 'gap-3' } },
  defaultVariants: { size: 'md' },
});

/** Regions dock in the wide layout; below it an overlaying region floats over the stage as a sheet. */
export const appShellStartVariants = cva('flex min-h-0 flex-none empty:contents', {
  variants: {
    layout: {
      wide: '',
      medium: '',
      compact: 'pointer-events-none absolute inset-0 z-20 w-full *:pointer-events-auto',
    },
  },
  defaultVariants: { layout: 'wide' },
});

export const appShellEndVariants = cva('flex min-h-0 flex-none', {
  variants: {
    layout: {
      wide: '',
      medium: 'pointer-events-none absolute inset-y-0 end-0 z-20 max-w-[76%] *:pointer-events-auto *:shadow-3',
      compact: 'pointer-events-none absolute inset-y-0 end-0 z-20 w-full *:pointer-events-auto *:shadow-3',
    },
  },
  defaultVariants: { layout: 'wide' },
});

/** The stage is one sheet (owner 2026-10-27): 2xl corners and a border.subtle hairline, so it sits beside the floating panels
 *  as a made surface instead of a square cut into bg.app. The hairline is drawn twice: on the stage (an empty stage) and on
 *  an ::after ring above its content (a canvas that fills the stage would cover an inset shadow). */
export const appShellStageVariants = cva([
  'relative isolate min-h-0 min-w-0 flex-1 cursor-default overflow-hidden rounded-2xl outline-none',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
  'after:pointer-events-none after:absolute after:inset-0 after:z-30 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] after:content-[""]',
]);

export const appShellOverlayVariants = cva('pointer-events-none absolute inset-0 z-20 *:pointer-events-auto');
