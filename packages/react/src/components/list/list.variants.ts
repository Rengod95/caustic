import { cva, type VariantProps } from 'class-variance-authority';

/** Outer wrapper: stacks an outside heading, lists and a footer note. */
export const listGroupVariants = cva('grid w-full gap-1.5');

/** Caption above a list, outside the surface. */
export const listGroupHeadingVariants = cva('px-3.5 font-ui text-caption uppercase text-text-tertiary');

/** Note below a list, outside the surface. */
export const listGroupFooterVariants = cva('px-3.5 pb-[1px] font-ui text-footnote text-text-tertiary');

/** The frosted inline surface. Translucent, never glass (P1); every list component imports it. */
export const listVariants = cva(
  'frost w-full overflow-hidden rounded-2xl bg-surface-translucent font-ui text-ui text-text-primary shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-1)]',
);

/** Caption inside the surface; a count or action can sit at the end. */
export const listHeadingVariants = cva('flex items-center justify-between px-3.5 pb-1 pt-3 font-ui text-caption uppercase text-text-tertiary');

export const listHeadingEndVariants = cva('');

/** The ul: list style removed, explicit role on the element. */
export const listItemsVariants = cva('m-0 list-none p-0');

/**
 * One row. The separator is the top edge pseudo-element: it starts at the text edge (14 + the leading width + 12),
 * or at 14 when this row or the one above has no leading element (data-lead="none").
 */
export const listRowVariants = cva(
  [
    'relative flex items-center gap-3 px-3.5 py-2 text-ui text-text-primary transition-[background-color] duration-120 ease-out',
    'before:absolute before:right-0 before:top-0 before:h-[1px] before:bg-border-subtle',
    'before:left-[calc(var(--spacing)*3.5+var(--li-lead,0px)+var(--spacing)*3)] first:before:hidden',
    'data-[lead=none]:before:left-3.5 [[data-lead=none]+&]:before:left-3.5',
    'has-[[data-slot=list-trigger]]:hover:bg-fill-hover has-[[data-slot=list-trigger]:active]:bg-fill-pressed',
  ],
  {
    variants: {
      size: { sm: 'min-h-control-xl', md: 'min-h-list-row', lg: 'min-h-16' },
      tone: { default: '', danger: '' },
      status: { idle: '', working: '' },
    },
    defaultVariants: { size: 'md', tone: 'default', status: 'idle' },
  },
);

/** Separator inset per leading kind (data-lead on the row sets the none case). */
export const listLeadVariants = cva('', {
  variants: {
    lead: {
      none: '',
      tile: '[--li-lead:var(--cs-size-list-tile)]',
      avatar: '[--li-lead:var(--cs-size-avatar-lg)]',
      thumb: '[--li-lead:calc(var(--spacing)*16)]',
      check: '[--li-lead:var(--cs-size-check)]',
      grip: '[--li-lead:calc(var(--spacing)*16)]',
    },
  },
  defaultVariants: { lead: 'none' },
});

/** The stretched row action: covers the whole row, controls inside the row sit above it. */
export const listTriggerVariants = cva(
  'absolute inset-1 m-0 block cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 outline-none after:absolute after:-inset-1 focus-visible:shadow-focus',
);

export const listLeadWrapVariants = cva('flex flex-none items-center');

export const listTileVariants = cva(
  'grid size-list-tile flex-none place-items-center rounded-md text-identity-on [&_svg]:size-icon-md',
  {
    variants: {
      tint: {
        coral: 'bg-identity-coral', iris: 'bg-identity-iris', mint: 'bg-identity-mint', amber: 'bg-identity-amber', slate: 'bg-identity-slate',
      },
    },
    defaultVariants: { tint: 'iris' },
  },
);

export const listThumbVariants = cva(
  'relative block h-thumb-h w-16 flex-none overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)] [&>img]:size-full [&>img]:object-cover',
);

export const listDurationVariants = cva(
  'absolute bottom-1 right-1 inline-flex h-4 items-center rounded-xs bg-media-scrim px-1 font-mono text-mono-sm font-semibold text-media-on',
);

export const listTextVariants = cva('grid min-w-0 flex-1 gap-0.25');

export const listTitleVariants = cva('truncate text-ui-md', {
  variants: { tone: { default: 'text-text-primary', danger: 'text-danger-text' } },
  defaultVariants: { tone: 'default' },
});

export const listDescriptionVariants = cva('truncate text-ui-sm font-normal text-text-tertiary');

export const listValueVariants = cva('whitespace-nowrap text-ui text-text-tertiary');

/** Trailing cluster; relative so it paints above the stretched trigger. */
export const listEndVariants = cva('relative flex flex-none items-center gap-1.5 whitespace-nowrap text-ui-dense text-text-tertiary');

/** The spectrum orb exists only while the agent works on the row (status working, P2). */
export const listOrbVariants = cva('', {
  variants: { status: { idle: '', working: 'orb orb-sm' } },
  defaultVariants: { status: 'idle' },
});

export const listChevronVariants = cva('size-icon-md flex-none text-text-disabled');

export type ListVariantProps = VariantProps<typeof listRowVariants>;
export type ListTint = NonNullable<VariantProps<typeof listTileVariants>['tint']>;
