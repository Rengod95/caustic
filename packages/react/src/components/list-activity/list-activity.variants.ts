import { cva } from 'class-variance-authority';

export const listActivityVariants = cva('grid w-full');

export const listActivityItem = cva(
  'relative grid grid-cols-[calc(var(--spacing)*8)_1fr] gap-3 pb-4 not-last:before:absolute not-last:before:bottom-0.5 not-last:before:left-[calc(var(--spacing)*3.875)] not-last:before:top-[calc(var(--spacing)*8.5)] not-last:before:w-[1px] not-last:before:bg-border-default not-last:before:content-[\'\']',
);

export const listActivityMarker = cva('inline-grid size-control-md place-items-center rounded-full');

export const listActivityIcon = cva('grid size-control-md place-items-center rounded-full bg-fill-pressed text-text-secondary [&>svg]:size-icon-md');

export const listActivityBody = cva('min-w-0 pb-[1px] pt-1.5 font-ui text-ui-relaxed text-text-secondary');

export const listActivityStrong = cva('font-medium text-text-primary');

export const listActivityQuote = cva('mt-2 rounded-xl bg-surface-translucent px-3 py-2.5 font-ui text-ui-dense-relaxed text-text-primary shadow-[0_0_0_1px_var(--cs-color-border-subtle)]');

export const listActivityTime = cva('mt-0.5 block font-ui text-hint text-text-tertiary');
