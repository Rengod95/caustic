import { cva, type VariantProps } from 'class-variance-authority';

export const sectionHeaderVariants = cva('flex w-full flex-wrap items-end gap-3', {
  variants: { divided: { true: 'border-b border-border-subtle pb-3', false: '' } },
  defaultVariants: { divided: false },
});

export const sectionHeaderTitle = cva('font-ui text-text-primary text-balance', {
  variants: { size: { sm: 'text-title-3', md: 'text-title-2', lg: 'text-title-1' } },
  defaultVariants: { size: 'md' },
});

export const sectionHeaderDescription = cva('font-ui text-text-secondary', {
  variants: { size: { sm: 'text-ui-dense-relaxed', md: 'text-ui-relaxed', lg: 'text-body' } },
  defaultVariants: { size: 'md' },
});

export type SectionHeaderVariantProps = VariantProps<typeof sectionHeaderTitle>;
