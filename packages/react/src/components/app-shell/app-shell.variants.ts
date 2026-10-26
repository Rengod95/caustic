import { cva } from 'class-variance-authority';

export const appShellVariants = cva(
  'group/app-shell relative isolate flex size-full min-h-0 min-w-0 flex-col gap-2.5 overflow-hidden bg-bg-app p-studio-window-inset font-ui text-text-primary',
);

export const appShellSkipVariants = cva(
  [
    'absolute left-2 top-2 z-20 -translate-y-[200%] rounded-lg bg-control-raised px-3 py-2 font-ui text-ui-strong text-text-primary opacity-0 outline-none',
    '[--cs-focus-offset:var(--cs-color-bg-app)] focus:translate-y-0 focus:opacity-100 focus-visible:focus-ring',
  ],
);

export const appShellTitlebarVariants = cva('flex h-studio-titlebar-h flex-none items-center gap-2.5');

export const appShellBodyVariants = cva('relative flex min-h-0 min-w-0 flex-1 gap-2.5');

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

export const appShellStageVariants = cva('relative isolate min-h-0 min-w-0 flex-1 cursor-default overflow-hidden outline-none focus-visible:shadow-none');

export const appShellOverlayVariants = cva('pointer-events-none absolute inset-0 z-20 *:pointer-events-auto');
