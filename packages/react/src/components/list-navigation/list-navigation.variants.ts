import { cva } from 'class-variance-authority';

export const listNavigationVariants = cva('grid w-full gap-0.5');

export const listNavigationHeading = cva('flex items-center justify-between px-2.5 pb-1 pt-3 font-ui text-caption uppercase text-text-tertiary');

export const listNavigationGroup = cva('m-0 grid list-none gap-0.5 p-0');

export const listNavigationLink = cva(
  [
    'flex h-tab-h w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-left font-ui text-ui text-text-secondary no-underline outline-none',
    'transition-[color,background-color,box-shadow] duration-base ease-out',
    'hover:bg-fill-hover hover:text-text-primary',
    'aria-[current=page]:frost aria-[current=page]:bg-control-raised aria-[current=page]:font-medium aria-[current=page]:text-text-primary',
    'aria-[current=page]:shadow-[0_0_0_1px_var(--cs-color-control-edge),var(--cs-elevation-1)]',
    'aria-[current=page]:hover:bg-control-raised',
    'focus-visible:shadow-focus',
    '[&_svg]:shrink-0 [&_svg]:stroke-[1.75]',
  ],
);

export const listNavigationIcon = cva('inline-grid size-icon-md shrink-0 place-items-center [&_svg]:size-full');

export const listNavigationLabel = cva('min-w-0 truncate');

export const listNavigationCount = cva('ms-auto font-ui text-hint tabular-nums', {
  variants: {
    hot: { true: 'grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent-solid px-1.25 font-semibold text-accent-on', false: 'text-text-tertiary' },
  },
  defaultVariants: { hot: false },
});

export const listNavigationChevron = cva('ms-auto size-icon-sm shrink-0 text-text-disabled transition-transform duration-base ease-out data-[expanded=true]:rotate-90');

export const listNavigationSub = cva('m-0 grid list-none gap-0.5 p-0');

export const listNavigationSubLink = cva(
  [
    'flex h-menu-item w-full cursor-pointer items-center gap-2.5 rounded-lg pe-2.5 ps-nav-indent text-left font-ui text-ui-dense text-text-secondary no-underline outline-none',
    'transition-[color,background-color,box-shadow] duration-base ease-out',
    'hover:bg-fill-hover hover:text-text-primary',
    'aria-[current=page]:frost aria-[current=page]:bg-control-raised aria-[current=page]:font-medium aria-[current=page]:text-text-primary',
    'aria-[current=page]:shadow-[0_0_0_1px_var(--cs-color-control-edge),var(--cs-elevation-1)]',
    'aria-[current=page]:hover:bg-control-raised',
    'focus-visible:shadow-focus',
  ],
);
