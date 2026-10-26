import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The row wrapper (a listitem of the List). Swipe mode clips the row and the tray. The separator sits above the
 * opaque row (z-20) and starts at the List text edge: 14 + the leading width + 12, or 14 without a leading element.
 */
export const listActionsVariants = cva(
  [
    'relative font-ui',
    'before:absolute before:right-0 before:top-0 before:z-20 before:h-[1px] before:bg-border-subtle',
    'before:left-[calc(var(--spacing)*3.5+var(--li-lead,0px)+var(--spacing)*3)] first:before:hidden',
    'data-[lead=none]:before:left-3.5',
  ],
  {
    variants: {
      reveal: { hover: '', swipe: 'overflow-hidden' },
      lead: { none: '', avatar: '[--li-lead:var(--cs-size-avatar-lg)]' },
    },
    defaultVariants: { reveal: 'hover', lead: 'none' },
  },
);

/**
 * The visible row, a List row box. Swipe: opaque so the tray is hidden behind it, translated by --row-x
 * (set from the measured tray width and the drag), spring transition except while dragging. Hover: fills on hover.
 */
export const listActionsRowVariants = cva(
  'group relative flex min-h-list-row items-center gap-3 px-3.5 py-2 font-ui text-ui text-text-primary',
  {
    variants: {
      reveal: {
        hover: 'transition-[background-color] duration-120 ease-out hover:bg-neutral-hover',
        swipe: 'z-10 translate-x-[var(--row-x,0px)] cursor-grab touch-pan-y bg-surface-base transition-[translate] duration-320 ease-spring outline-none motion-reduce:transition-none data-[dragging]:cursor-grabbing data-[dragging]:transition-none',
      },
    },
    defaultVariants: { reveal: 'hover' },
  },
);

/** The tray under the row, pinned to the end edge. */
export const listActionsTrayVariants = cva('absolute inset-y-0 right-0 flex');

/**
 * One tray action: icon over a short label, 72px wide, full row height, solid fill that names the intent. Hover takes
 * solid-hover; press takes solid-hover plus a 1px inner edge of the tone's text slot (step 11, §2 solid row), and
 * pressed + focus draws the ring next to that edge.
 */
export const listActionsActionVariants = cva(
  'grid w-18 flex-none cursor-pointer place-content-center place-items-center gap-0.5 border-0 text-micro font-semibold outline-none focus-visible:shadow-focus',
  {
    variants: {
      tone: {
        neutral: 'bg-neutral-solid text-neutral-on hover:bg-neutral-solid-hover active:bg-neutral-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-neutral-text)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-neutral-text),var(--cs-focus)]',
        warning: 'bg-warning-solid text-warning-on hover:bg-warning-solid-hover active:bg-warning-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-warning-text)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-warning-text),var(--cs-focus)]',
        danger: 'bg-danger-solid text-danger-on hover:bg-danger-solid-hover active:bg-danger-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-danger-text)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-text),var(--cs-focus)]',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export const listActionsActionIconVariants = cva('size-icon-md [&_svg]:size-icon-md');
export const listActionsActionLabelVariants = cva('');

/** Hover tools: faded in on row hover or focus within; always visible without hover (touch). */
export const listActionsToolsVariants = cva(
  'flex flex-none items-center gap-0.5 opacity-0 transition-[opacity] duration-120 ease-out group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100',
);

export type ListActionsVariantProps = VariantProps<typeof listActionsRowVariants>;
export type ListActionsTone = NonNullable<VariantProps<typeof listActionsActionVariants>['tone']>;
