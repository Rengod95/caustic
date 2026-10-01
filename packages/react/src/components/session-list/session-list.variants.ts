import { cva } from 'class-variance-authority';

export const sessionListVariants = cva('m-0 grid list-none gap-px p-0');

export const sessionListItem = cva('');

/** One row: 16px / 1fr / auto grid, 32px high. The current row rises with the pressed fill. */
export const sessionListButton = cva([
  'grid h-control-md w-full cursor-pointer grid-cols-[calc(var(--spacing)*4)_1fr_auto] items-center gap-2 rounded-lg px-2 text-left font-ui text-ui-dense text-text-primary outline-none',
  'hover:bg-fill-hover aria-[current=true]:bg-fill-pressed aria-[current=true]:font-medium',
  'focus-visible:shadow-focus',
]);

/** 16px glyph column. Color carries the status; text states it too. */
export const sessionListStatus = cva('grid size-icon-md place-items-center', {
  variants: {
    status: {
      running: 'text-text-tertiary',
      review: 'text-info-solid',
      failed: 'text-danger-solid',
      done: 'text-text-tertiary',
    },
  },
  defaultVariants: { status: 'done' },
});

/** The spectrum orb exists only while the agent works on the row (status running, P2). */
export const sessionListOrb = cva('', { variants: { status: { running: 'orb orb-sm rounded-full motion-reduce:animate-none', review: '', failed: '', done: '' } } });

export const sessionListDot = cva('size-radio-dot rounded-full bg-current');

export const sessionListCheck = cva('size-icon-sm');

export const sessionListTitle = cva('min-w-0 truncate');

export const sessionListMeta = cva('text-ui-xs text-text-tertiary');
