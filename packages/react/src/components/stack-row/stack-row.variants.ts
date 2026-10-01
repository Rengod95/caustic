import { cn } from '../../lib/cn.ts';
import { cva, type VariantProps } from 'class-variance-authority';

export const stackRowVariants = cva(
  'group/stack-row grid h-field-compact-md grid-cols-[auto_1fr_auto_auto] items-center gap-1.5 rounded-md pl-1 pr-0.5 font-ui hover:bg-fill-hover',
  {
    variants: {
      hidden: { true: 'opacity-64', false: '' },
    },
    defaultVariants: { hidden: false },
  },
);

export const stackRowLeadVariants = cva('inline-flex shrink-0', {
  variants: {
    lead: {
      swatch: '',
      icon: 'size-control-2xs place-items-center rounded-xs bg-fill-pressed text-text-secondary [&_svg]:size-icon-sm [&_svg]:stroke-[1.75]',
    },
  },
  defaultVariants: { lead: 'swatch' },
});

export const stackRowLabelVariants = cva('flex min-w-0 items-baseline gap-1.5 overflow-hidden whitespace-nowrap text-ui-sm font-normal text-text-primary');

export const stackRowTitleVariants = cva('truncate font-normal text-text-primary', {
  variants: { mono: { true: 'font-mono text-mono-md', false: 'text-ui-sm' } },
  defaultVariants: { mono: false },
});

export const stackRowMetaVariants = cva('shrink-0 text-hint text-text-tertiary group-data-[state=hidden]/stack-row:text-text-primary');

const actionsCva = cva('flex transition-opacity duration-quick ease-out motion-reduce:transition-none', {
  variants: {
    actions: {
      hover: 'opacity-0 group-hover/stack-row:opacity-100 group-focus-within/stack-row:opacity-100',
      always: 'opacity-100',
    },
    pinned: { true: 'opacity-100', false: '' },
  },
  defaultVariants: { actions: 'hover', pinned: false },
});

export const stackRowActionsVariants = (o: VariantProps<typeof actionsCva>) => cn(actionsCva(o), o.pinned && 'group-hover/stack-row:opacity-100');

export type StackRowVariantProps = VariantProps<typeof stackRowVariants>;
