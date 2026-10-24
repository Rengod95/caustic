import { cva, type VariantProps } from 'class-variance-authority';

export const toolCallVariants = cva('relative overflow-hidden rounded-xl bg-surface-base text-text-primary', {
  variants: {
    status: {
      running: 'agent-rim overflow-visible shadow-1',
      done: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
      failed: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
    },
  },
  defaultVariants: { status: 'done' },
});

export const toolStatus = cva('ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap text-hint [&_svg]:size-icon-sm', {
  variants: { status: { running: 'shimmer', done: 'text-text-tertiary', failed: 'text-danger-text' } },
  defaultVariants: { status: 'done' },
});

export const toolBody = cva('grid gap-0.5 border-t border-border-subtle px-2.5 py-2', {
  variants: { status: { running: 'bg-surface-raised', done: 'bg-surface-raised', failed: 'bg-danger-soft text-ui-sm text-text-primary' } },
  defaultVariants: { status: 'done' },
});
export type ToolCallVariantProps = VariantProps<typeof toolCallVariants>;
