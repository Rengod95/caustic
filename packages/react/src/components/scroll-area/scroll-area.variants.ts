import { cva, type VariantProps } from 'class-variance-authority';

export const scrollAreaVariants = cva('relative grid size-full min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-[inherit]', {
  variants: {
    scrollbar: { hover: '', always: '' },
  },
  defaultVariants: { scrollbar: 'hover' },
});

const THUMB = '[scrollbar-color:var(--cs-color-border-strong)_transparent]';

export const scrollAreaViewportVariants = cva(
  'min-h-0 min-w-0 overscroll-contain scroll-auto rounded-[inherit] outline-none focus-visible:shadow-[var(--cs-focus-field),var(--cs-focus)]',
  {
    variants: {
      scrollbar: {
        hover: [
          '[scrollbar-color:transparent_transparent]',
          'group-hover/scroll-area:[scrollbar-color:var(--cs-color-border-strong)_transparent]',
          'focus-within:[scrollbar-color:var(--cs-color-border-strong)_transparent]',
          'data-[scrolling=true]:[scrollbar-color:var(--cs-color-border-strong)_transparent]',
        ],
        always: THUMB,
      },
      orientation: {
        vertical: 'overflow-x-hidden overflow-y-auto',
        horizontal: 'overflow-x-auto overflow-y-hidden',
        both: 'overflow-auto',
      },
      fade: { true: '', false: '' },
    },
    compoundVariants: [
      {
        fade: true,
        orientation: ['vertical', 'both'],
        className: [
          'data-[overflow-y-start=true]:data-[overflow-y-end=true]:[mask-image:linear-gradient(to_bottom,transparent,black_var(--cs-space-6),black_calc(100%-var(--cs-space-6)),transparent)]',
          'data-[overflow-y-start=true]:data-[overflow-y-end=false]:[mask-image:linear-gradient(to_bottom,transparent,black_var(--cs-space-6))]',
          'data-[overflow-y-start=false]:data-[overflow-y-end=true]:[mask-image:linear-gradient(to_bottom,black_calc(100%-var(--cs-space-6)),transparent)]',
        ],
      },
      {
        fade: true,
        orientation: 'horizontal',
        className: [
          'data-[overflow-x-start=true]:data-[overflow-x-end=true]:[mask-image:linear-gradient(to_right,transparent,black_var(--cs-space-6),black_calc(100%-var(--cs-space-6)),transparent)]',
          'data-[overflow-x-start=true]:data-[overflow-x-end=false]:[mask-image:linear-gradient(to_right,transparent,black_var(--cs-space-6))]',
          'data-[overflow-x-start=false]:data-[overflow-x-end=true]:[mask-image:linear-gradient(to_right,black_calc(100%-var(--cs-space-6)),transparent)]',
        ],
      },
    ],
    defaultVariants: { scrollbar: 'hover', orientation: 'vertical', fade: false },
  },
);

export const scrollAreaContentVariants = cva('min-w-0', {
  variants: {
    orientation: { vertical: '', horizontal: 'w-max', both: 'w-max' },
  },
  defaultVariants: { orientation: 'vertical' },
});

export type ScrollAreaVariantProps = VariantProps<typeof scrollAreaVariants>;
