import { cva } from 'class-variance-authority';

export const listNavigationVariants = cva('grid w-full gap-0.5');

export const listNavigationHeading = cva('flex items-center justify-between px-2.5 pb-1 pt-3 font-ui text-caption uppercase text-text-tertiary');

export const listNavigationGroup = cva('m-0 grid list-none gap-0.5 p-0');

/**
 * One link. The current page is the segment thumb (PROPOSAL §4 B2, owner 2026-10-25): the raised control fill and the
 * control edge, as the selected segment of a segmented control; control-raised-hover under the pointer; focus keeps the edge.
 */
export const listNavigationLink = cva(
  [
    'flex h-tab-h w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-left font-ui text-ui text-text-secondary no-underline outline-none',
    'transition-[color,background-color,box-shadow] duration-base ease-out',
    'hover:bg-neutral-hover hover:text-text-primary',
    'aria-[current=page]:bg-control-raised aria-[current=page]:font-medium aria-[current=page]:text-text-primary',
    'aria-[current=page]:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)]',
    'aria-[current=page]:hover:bg-control-raised-hover',
    'focus-visible:shadow-focus aria-[current=page]:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge),var(--cs-focus)]',
    '[&_svg]:shrink-0 [&_svg]:stroke-[1.75]',
  ],
);

export const listNavigationIcon = cva('inline-grid size-icon-md shrink-0 place-items-center [&_svg]:size-full');

export const listNavigationLabel = cva('min-w-0 truncate');

export const listNavigationCount = cva('ms-auto font-ui text-hint tabular-nums', {
  variants: {
    hot: { true: 'grid h-control-compact-2xs min-w-control-compact-2xs place-items-center rounded-full bg-accent-solid px-1.25 font-semibold text-accent-on', false: 'text-text-tertiary' },
  },
  defaultVariants: { hot: false },
});

export const listNavigationChevron = cva('ms-auto size-icon-sm shrink-0 text-neutral-graphic transition-transform duration-base ease-out data-[expanded=true]:rotate-90');

export const listNavigationSub = cva('m-0 grid list-none gap-0.5 p-0');

export const listNavigationSubLink = cva(
  [
    'flex h-menu-item w-full cursor-pointer items-center gap-2.5 rounded-lg pe-2.5 ps-nav-indent text-left font-ui text-ui-dense text-text-secondary no-underline outline-none',
    'transition-[color,background-color,box-shadow] duration-base ease-out',
    'hover:bg-neutral-hover hover:text-text-primary',
    'aria-[current=page]:bg-control-raised aria-[current=page]:font-medium aria-[current=page]:text-text-primary',
    'aria-[current=page]:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)]',
    'aria-[current=page]:hover:bg-control-raised-hover',
    'focus-visible:shadow-focus aria-[current=page]:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge),var(--cs-focus)]',
  ],
);
