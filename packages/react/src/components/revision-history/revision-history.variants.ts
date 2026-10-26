import { cva } from 'class-variance-authority';

export const revisionHistoryVariants = cva('grid gap-3.5');
export const revisionHistoryListVariants = cva('grid');

export const revisionHistoryItemVariants = cva([
  'group relative grid h-control-lg w-full cursor-pointer grid-cols-[calc(var(--spacing)*5.5)_1fr_auto_var(--cs-icon-sm)] items-center gap-2 rounded-md px-2 text-left font-ui text-text-primary outline-none',
  'hover:bg-neutral-hover focus-visible:shadow-focus',
  // The chosen revision inverts (selected utility: ink fill, paper text, no edge; detail, time, check and the accent node invert
  // with it); hover on it is selection.fill-hover. Focus keeps only its ring, whose gap reads the fill.
  'aria-selected:selected aria-selected:hover:bg-selection-fill-hover',
]);

export const revisionHistoryGlyphVariants = cva('relative grid h-full place-items-center');
export const revisionHistorySpineVariants = cva('absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-divider-line group-first:top-1/2 group-last:bottom-1/2');

/** The node on the spine: a ring dot; agent revisions show the rotating spectrum dot; the chosen revision is a paper (selection.on) dot on the inverted row (it wins). */
export const revisionHistoryNodeVariants = cva('relative size-2.5 rounded-full motion-reduce:animate-none', {
  variants: {
    author: { human: '', agent: 'spectrum-fill animate-none' },
    selected: { true: 'bg-selection-on shadow-[inset_0_0_0_2px_var(--cs-color-selection-on)]', false: '' },
  },
  compoundVariants: [
    { author: 'human', selected: false, class: 'bg-surface-base shadow-[inset_0_0_0_2px_var(--cs-color-neutral-graphic)]' },
  ],
  defaultVariants: { author: 'human', selected: false },
});

export const revisionHistoryTextVariants = cva('grid min-w-0');
export const revisionHistoryTitleVariants = cva('truncate text-ui-dense font-medium text-text-primary');
export const revisionHistoryDetailVariants = cva('text-ui-xs font-normal text-text-tertiary group-aria-selected:text-text-secondary');
export const revisionHistoryTimeVariants = cva('text-ui-xs font-normal text-text-tertiary tabular-nums group-aria-selected:text-text-secondary');
/** Trailing check cell: kept on every row so the times align; the check shows on the chosen revision in primary text (selection.on on the inverted row). */
export const revisionHistoryCheckVariants = cva('inline-grid size-icon-sm shrink-0 place-items-center text-text-primary [&_svg]:size-full [&_svg]:stroke-[2]');
export const revisionHistoryFooterVariants = cva('flex items-center justify-between gap-2');
export const revisionHistoryNoteVariants = cva('text-hint text-text-tertiary');
