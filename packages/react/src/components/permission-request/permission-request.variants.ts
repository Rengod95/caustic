import { cva, type VariantProps } from 'class-variance-authority';

export const permissionRequestVariants = cva('grid gap-2.5 px-inset-compact-x py-inset-compact-y text-text-primary', {
  variants: {
    status: {
      pending: 'rounded-2xl bg-surface-base shadow-2',
      allowed: 'rounded-2xl bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
    },
  },
  defaultVariants: { status: 'pending' },
});

export const permissionIconVariants = cva('grid size-card-tile shrink-0 place-items-center rounded-lg [&_svg]:size-card-glyph', {
  variants: {
    status: {
      pending: 'bg-warning-soft text-warning-text',
      allowed: 'bg-success-soft text-success-text',
    },
  },
  defaultVariants: { status: 'pending' },
});

export const permissionTitleVariants = cva('text-ui-strong text-text-primary', {
  variants: { status: { pending: 'font-semibold', allowed: 'font-medium' } },
  defaultVariants: { status: 'pending' },
});

export type PermissionRequestVariantProps = VariantProps<typeof permissionRequestVariants>;
