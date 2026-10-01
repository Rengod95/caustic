import { cva } from 'class-variance-authority';

/** Thick-glass speech bubble: 14 radius on three corners, 4 at the bottom-left where it points back at the pin. */
export const commentBubbleVariants = cva(
  'glass glass-thick glass-shadow-3 max-w-comment-max rounded-toolbar rounded-bl-xs px-2.5 py-2 font-ui text-footnote text-text-primary',
  {
    variants: {
      placed: { true: 'absolute top-(--rect-t) left-(--rect-l)', false: '' },
    },
    defaultVariants: { placed: false },
  },
);
