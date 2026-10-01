import { cva } from 'class-variance-authority';

/** The frosted inline surface, same as List: translucent, never glass (P1). */
export const listDescriptionVariants = cva(
  'frost m-0 grid w-full overflow-hidden rounded-2xl bg-surface-translucent font-ui text-ui text-text-primary shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-1)]',
);

export const listDescriptionRow = cva(
  [
    'group grid min-h-field-lg grid-cols-[var(--cs-size-list-term)_minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-1.5 font-ui text-ui text-text-primary',
    'not-first:border-t not-first:border-border-subtle',
    'max-[480px]:grid-cols-[1fr_auto]',
  ],
);

export const listDescriptionTerm = cva('m-0 font-ui text-ui text-text-tertiary max-[480px]:col-span-full');

export const listDescriptionValue = cva('m-0 flex min-w-0 items-center gap-3 text-text-primary col-span-2', {
  variants: { mono: { true: 'font-mono text-mono', false: 'font-ui text-ui' } },
  defaultVariants: { mono: false },
});

export const listDescriptionValueText = cva('block min-w-0 flex-1 truncate');

export const listDescriptionAction = cva(
  'flex flex-none items-center opacity-0 transition-opacity duration-quick ease-out group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100',
);
