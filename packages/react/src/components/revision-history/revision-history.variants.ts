import { cva } from 'class-variance-authority';

export const revisionHistoryVariants = cva('grid gap-3.5');
export const revisionHistoryListVariants = cva('grid');

export const revisionHistoryItemVariants = cva([
  'group relative grid h-control-lg w-full cursor-pointer grid-cols-[calc(var(--spacing)*5.5)_1fr_auto] items-center gap-2 rounded-md px-2 text-left font-ui text-text-primary outline-none',
  'hover:bg-fill-hover aria-selected:bg-accent-soft focus-visible:shadow-focus',
]);

export const revisionHistoryGlyphVariants = cva('relative grid h-full place-items-center');
export const revisionHistorySpineVariants = cva('absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border-default group-first:top-1/2 group-last:bottom-1/2');

/** The node on the spine: a ring dot; agent revisions show the rotating spectrum dot; the chosen revision is the accent dot (it wins). */
export const revisionHistoryNodeVariants = cva('relative size-2.5 rounded-full motion-reduce:animate-none', {
  variants: {
    author: { human: '', agent: 'spectrum-fill' },
    selected: { true: 'bg-accent-solid shadow-[inset_0_0_0_2px_var(--cs-color-accent-solid)]', false: '' },
  },
  compoundVariants: [
    { author: 'human', selected: false, class: 'bg-surface-base shadow-[inset_0_0_0_2px_var(--cs-color-text-tertiary)]' },
  ],
  defaultVariants: { author: 'human', selected: false },
});

export const revisionHistoryTextVariants = cva('grid min-w-0');
export const revisionHistoryTitleVariants = cva('truncate text-ui-dense font-medium text-text-primary');
export const revisionHistoryDetailVariants = cva('text-ui-xs font-normal text-text-tertiary group-aria-selected:text-text-secondary');
export const revisionHistoryTimeVariants = cva('text-ui-xs font-normal text-text-tertiary tabular-nums group-aria-selected:text-text-secondary');
export const revisionHistoryFooterVariants = cva('flex items-center justify-between gap-2');
export const revisionHistoryNoteVariants = cva('text-hint text-text-tertiary');
