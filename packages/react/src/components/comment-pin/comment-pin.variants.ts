import { cva, type VariantProps } from 'class-variance-authority';

/** 28px speech-bubble pin: 14 radius on three corners, 4 at the bottom-left (the tail). 2px canvas.handle ring under the elevation. */
export const commentPinVariants = cva(
  [
    'inline-grid size-control-sm shrink-0 cursor-pointer place-items-center rounded-toolbar rounded-bl-xs font-ui text-micro font-semibold select-none',
    'shadow-[0_0_0_2px_var(--cs-color-canvas-handle),var(--cs-elevation-3)]',
    'outline-none focus-visible:shadow-focus',
  ],
  {
    variants: {
      author: {
        human: 'bg-identity-coral text-identity-on',
        agent: 'bg-ink-solid text-ink-on',
      },
      placed: { true: 'absolute top-(--rect-t) left-(--rect-l)', false: '' },
    },
    defaultVariants: { author: 'human', placed: false },
  },
);

/** 10px spectrum orb of the agent pin. */
export const commentPinOrbVariants = cva('', {
  variants: { author: { human: '', agent: 'orb [--orb:var(--cs-size-orb-xs)] [&[data-slot]]:rounded-full' } },
  defaultVariants: { author: 'human' },
});

export type CommentPinVariantProps = VariantProps<typeof commentPinVariants>;
