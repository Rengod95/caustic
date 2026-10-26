import { cva } from 'class-variance-authority';

export const angleDialVariants = cva(
  [
    'relative inline-block size-control-md shrink-0 cursor-grab touch-none select-none rounded-full bg-neutral-well align-middle outline-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
    'active:cursor-grabbing focus-visible:shadow-focus',
    'data-[disabled]:pointer-events-none data-[disabled]:bg-disabled-fill data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  ],
);

export const angleDialNeedleVariants = cva(
  'pointer-events-none absolute top-1/2 left-1/2 h-0.5 w-2.5 origin-left rounded-2xs bg-neutral-graphic in-data-[disabled]:bg-disabled-text [transform:rotate(calc(var(--dial-angle)_-_90deg))]',
);

export const angleDialHubVariants = cva(
  'pointer-events-none absolute top-1/2 left-1/2 size-1 -translate-1/2 rounded-full bg-neutral-graphic in-data-[disabled]:bg-disabled-text',
);
