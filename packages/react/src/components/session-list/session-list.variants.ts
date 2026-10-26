import { cva } from 'class-variance-authority';

export const sessionListVariants = cva('m-0 grid list-none gap-px p-0');

export const sessionListItem = cva('');

/** One row: 16px / 1fr / auto grid, 32px high. The current row is the B2 segment thumb (control-raised + control edge), as list-navigation and page-list; focus keeps the edge. */
export const sessionListButton = cva([
  'grid h-control-md w-full cursor-pointer grid-cols-[calc(var(--spacing)*4)_1fr_auto] items-center gap-2 rounded-lg px-2 text-left font-ui text-ui-dense text-text-primary outline-none',
  'hover:bg-neutral-hover aria-[current=true]:bg-control-raised aria-[current=true]:font-medium',
  'aria-[current=true]:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] aria-[current=true]:hover:bg-control-raised-hover',
  'focus-visible:shadow-focus aria-[current=true]:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge),var(--cs-focus)]',
]);

/** 16px glyph column. Color carries the status (the small dot is a graphic mark, step 8); text states it too. */
export const sessionListStatus = cva('grid size-icon-md place-items-center', {
  variants: {
    status: {
      running: 'text-text-tertiary',
      review: 'text-info-graphic',
      failed: 'text-danger-graphic',
      done: 'text-text-tertiary',
    },
  },
  defaultVariants: { status: 'done' },
});

/** The spectrum orb exists only while the agent works on the row (status running, P2). */
export const sessionListOrb = cva('', { variants: { status: { running: 'orb orb-sm motion-reduce:animate-none', review: '', failed: '', done: '' } } });

export const sessionListDot = cva('size-radio-dot rounded-full bg-current');

export const sessionListCheck = cva('size-icon-sm');

export const sessionListTitle = cva('min-w-0 truncate');

export const sessionListMeta = cva('text-ui-xs text-text-tertiary');
