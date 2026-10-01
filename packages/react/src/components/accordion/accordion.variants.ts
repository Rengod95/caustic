import { cva, type VariantProps } from 'class-variance-authority';

export const accordionVariants = cva('grid w-full', {
  variants: { variant: { flush: '', separated: 'gap-2' } },
  defaultVariants: { variant: 'flush' },
});

export const accordionItemVariants = cva('', {
  variants: {
    variant: {
      flush: 'border-b border-border-subtle',
      separated: 'rounded-xl bg-surface-base px-inset-regular-x shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-1)] data-[state=open]:shadow-[0_0_0_1px_var(--cs-color-border-default),var(--cs-elevation-2)]',
    },
  },
  defaultVariants: { variant: 'flush' },
});

export type AccordionVariantProps = VariantProps<typeof accordionVariants>;
