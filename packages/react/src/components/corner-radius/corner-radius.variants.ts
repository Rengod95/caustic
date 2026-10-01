import { cva } from 'class-variance-authority';

export const cornerRadiusVariants = cva('grid gap-3.5 font-ui aria-disabled:opacity-42');

export const cornerRadiusStage = cva('flex items-center justify-center gap-3.5 rounded-xl bg-bg-inset px-3.5 py-5');

// The radius is data: --r holds the border-radius shorthand derived from the value.
export const cornerRadiusShape = cva(
  'h-radius-preview-h w-radius-preview-w shrink-0 rounded-(--r) bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-text-primary),var(--cs-elevation-2)] transition-[border-radius] duration-gentle ease-spring',
);

export const cornerRadiusFields = cva('grid grid-cols-[1fr_1fr_auto] items-center gap-1.5');

export const cornerRadiusCorners = cva('grid grid-cols-2 gap-1.5');

// Top and left edges only, with a 6px top-left radius. The other corners mirror it.
export const cornerRadiusGlyph = cva(
  'block size-icon-xs rounded-tl-sm border-t-[1.5px] border-l-[1.5px] border-current text-text-tertiary',
  {
    variants: { corner: { tl: '', tr: '-scale-x-100', bl: '-scale-y-100', br: '-scale-100' } },
    defaultVariants: { corner: 'tl' },
  },
);
