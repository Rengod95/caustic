import { cva, type VariantProps } from 'class-variance-authority';

export const avatarVariants = cva('relative inline-grid shrink-0 select-none place-items-center rounded-full font-ui text-identity-on shadow-[0_0_0_2px_var(--cs-color-surface-base)]', {
  variants: {
    kind: { person: '', agent: 'bg-surface-base' },
    color: { coral: 'bg-identity-coral', iris: 'bg-identity-iris', mint: 'bg-identity-mint', amber: 'bg-identity-amber', slate: 'bg-identity-slate' },
    size: { xs: 'size-avatar-xs text-micro shadow-none', sm: 'size-avatar-sm text-micro', md: 'size-avatar-md text-ui-sm', lg: 'size-avatar-lg text-ui-strong' },
  },
  compoundVariants: [{ kind: 'agent', className: 'bg-surface-base' }],
  defaultVariants: { kind: 'person', color: 'coral', size: 'sm' },
});

/** The agent's spectrum core; only the agent kind renders it (P2). */
export const avatarCore = cva('absolute inset-1 rounded-full', {
  variants: { kind: { person: 'hidden', agent: 'spectrum-fill' } },
  defaultVariants: { kind: 'person' },
});
export type AvatarVariantProps = VariantProps<typeof avatarVariants>;
