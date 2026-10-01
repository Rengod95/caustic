import { cva, type VariantProps } from 'class-variance-authority';

export const switchVariants = cva(
  [
    'group relative inline-flex shrink-0 items-center rounded-full bg-control-off p-0.5 transition-[background-color] duration-200 ease-out',
    'outline-none focus-visible:shadow-focus data-[state=checked]:bg-accent-solid disabled:pointer-events-none disabled:opacity-42',
  ],
  {
    variants: { size: { sm: 'h-switch-sm-h w-switch-sm-w', md: 'h-switch-md-h w-switch-md-w' } },
    defaultVariants: { size: 'md' },
  },
);

export const switchThumb = cva(
  [
    'block rounded-full bg-control-thumb transition-[transform,width] duration-320 ease-spring',
    'shadow-[0_0_0_0.5px_var(--cs-color-border-subtle),var(--cs-elevation-2)]',
  ],
  {
    variants: {
      size: {
        sm: 'h-switch-sm-thumb w-switch-sm-thumb data-[state=checked]:translate-x-switch-sm-travel group-active:w-switch-sm-press group-active:data-[state=checked]:translate-x-2.5',
        md: 'h-switch-md-thumb w-switch-md-thumb data-[state=checked]:translate-x-switch-md-travel group-active:w-switch-md-press group-active:data-[state=checked]:translate-x-3',
      },
    },
    defaultVariants: { size: 'md' },
  },
);
export type SwitchVariantProps = VariantProps<typeof switchVariants>;
