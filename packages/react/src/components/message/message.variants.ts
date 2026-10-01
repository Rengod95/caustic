import { cva, type VariantProps } from 'class-variance-authority';

export const messageVariants = cva('', {
  variants: {
    author: {
      user: 'max-w-[88%] self-end justify-self-end rounded-2xl rounded-br-sm bg-fill-pressed px-3 py-2 text-ui-relaxed text-text-primary shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]',
      agent: 'grid gap-3',
    },
  },
  defaultVariants: { author: 'agent' },
});

export type MessageVariantProps = VariantProps<typeof messageVariants>;

/** The agent spectrum orb dot; rendered only for the agent author. */
export const messageOrbVariants = cva('', {
  variants: { author: { user: '', agent: 'orb orb-dot [&[data-slot]]:rounded-full' } },
  defaultVariants: { author: 'agent' },
});
