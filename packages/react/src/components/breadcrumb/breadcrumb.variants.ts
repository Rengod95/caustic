import { cva } from 'class-variance-authority';

export const breadcrumbVariants = cva('flex flex-wrap items-center gap-1 font-ui text-ui');

export const breadcrumbItem = cva(
  'inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.75 text-text-tertiary no-underline outline-none transition-[background-color,color] duration-120 ease-out hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
);

export const breadcrumbIcon = cva('inline-flex size-icon-sm flex-none items-center justify-center [&_svg]:size-full');

export const breadcrumbSeparator = cva('inline-flex size-icon-sm flex-none items-center justify-center text-neutral-graphic [&_svg]:size-full');

export const breadcrumbCurrent = cva('px-1.5 py-0.75 font-medium text-text-primary');
