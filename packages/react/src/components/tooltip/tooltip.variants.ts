import { cva } from 'class-variance-authority';

export const tooltipVariants = cva(
  'group z-60 inline-flex min-h-control-sm items-center gap-2 whitespace-nowrap rounded-md bg-ink-solid px-2 py-1.25 font-ui text-ui-sm text-ink-on shadow-3 select-none',
);

export const tooltipArrow = cva(
  'block size-2 rotate-45 rounded-br-xs bg-ink-solid group-data-[side=top]:-translate-y-1/2 group-data-[side=bottom]:translate-y-1/2 group-data-[side=left]:-translate-x-1/2 group-data-[side=right]:translate-x-1/2',
);
