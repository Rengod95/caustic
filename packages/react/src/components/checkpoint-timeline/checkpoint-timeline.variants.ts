import { cva } from 'class-variance-authority';

export const checkpointTimelineVariants = cva('m-0 grid list-none gap-0 p-0');

/** One checkpoint: grid 18px / 1fr / auto. The spine is the connector span; the 14px row spacing sits on the body so the item has no padding. */
export const checkpointTimelineItem = cva('group relative grid grid-cols-[var(--cs-size-check)_1fr_auto] items-start gap-2.5');

/** The spine: 1px line from below the node to the row bottom; hidden on the last item. */
export const checkpointTimelineConnector = cva('absolute bottom-0 left-[calc(var(--spacing)*2.125)] top-check w-[1px] bg-border-default group-last:hidden');

export const checkpointTimelineNode = cva(
  'grid size-check place-items-center rounded-full bg-surface-base',
  {
    variants: {
      selected: {
        true: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid)]',
        false: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]',
      },
    },
    defaultVariants: { selected: false },
  },
);

/** The node dot. An agent checkpoint shows the spectrum, rotating only while it is running; a selected checkpoint shows the accent dot (selected wins). */
export const checkpointTimelineDot = cva('size-1.5 rounded-full motion-reduce:animate-none', {
  variants: {
    author: { human: '', agent: 'size-2 spectrum-fill' },
    selected: { true: 'bg-accent-solid', false: '' },
    running: { true: '', false: 'animate-none' },
  },
  compoundVariants: [{ author: 'human', selected: false, class: 'bg-text-tertiary' }],
  defaultVariants: { author: 'human', selected: false, running: false },
});

/** The restore confirm step: spans the body and action columns under the row, on the inset fill. */
export const checkpointTimelineConfirm = cva('col-span-2 col-start-2 mb-3.5 grid gap-2 rounded-lg bg-bg-inset px-2.5 py-2');

export const checkpointTimelineBody = cva('min-w-0 pb-3.5');

export const checkpointTimelineTitle = cva('block font-ui text-ui-dense font-medium text-text-primary');

export const checkpointTimelineDetail = cva('block font-ui text-hint text-text-tertiary');

export const checkpointTimelineTime = cva('font-ui text-hint text-text-tertiary');
