import { cva, type VariantProps } from 'class-variance-authority';

export const modalVariants = cva(
  'glass glass-thick glass-shadow-5 grid w-full overflow-hidden rounded-panel text-text-primary outline-none',
  {
    variants: {
      kind: { dialog: '', alert: '' },
      size: { sm: 'max-w-modal-sm', md: 'max-w-dialog-md', lg: 'max-w-dialog-lg' } },
    defaultVariants: { kind: 'dialog', size: 'md' },
  },
);
export type ModalVariantProps = VariantProps<typeof modalVariants>;

/** Scrim that centres the surface (portal mode). */
export const modalOverlayClass = 'fixed inset-0 z-60 grid place-items-center bg-bg-scrim p-4';
