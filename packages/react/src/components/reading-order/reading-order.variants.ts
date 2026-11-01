import { cva } from 'class-variance-authority';

/** The sequence: an ordered list with a 2px gap and no list styling. */
export const readingOrderVariants = cva('m-0 grid list-none gap-0.5 p-0 font-ui');

/** The li wrapper carries no styling. */
export const readingOrderItemVariants = cva('');

/**
 * The control: a row of 20px / 1fr / auto with an 8px gap, a grab cursor and no text selection.
 * data-dragging dims it on a pressed fill; data-drop="above" or "below" draws the 2px landing line in the tone solid
 * (accent by default; canvas.selection is reserved for the canvas).
 * Common props (owner 2026-10-26), set on the list and read by every row: variant is the row emphasis (ghost = today:
 * no fill until hover; soft = tone soft rows; outline = a 1px tone border edge; solid = raised control rows with the
 * control edge); tone colours the soft / outline rows and the landing line; radius / shadow shape the rows (null when
 * unset keeps rounded-md and no shadow); size steps the row height and type (md = menu-item 30 / ui-dense, today).
 */
export const readingOrderRowVariants = cva(
  [
    'group grid w-full cursor-grab touch-none select-none grid-cols-[var(--cs-icon-lg)_1fr_auto] items-center gap-2 rounded-md border-0 px-2 text-left font-ui text-text-primary outline-none',
    'transition-[background-color,opacity] duration-quick ease-out focus-visible:shadow-focus',
    'data-[dragging]:bg-neutral-pressed data-[dragging]:opacity-64',
  ],
  {
    variants: {
      tone: {
        neutral: 'data-[drop=above]:shadow-[inset_0_2px_0_var(--cs-color-neutral-solid)] data-[drop=below]:shadow-[inset_0_-2px_0_var(--cs-color-neutral-solid)]',
        accent: 'data-[drop=above]:shadow-[inset_0_2px_0_var(--cs-color-accent-solid)] data-[drop=below]:shadow-[inset_0_-2px_0_var(--cs-color-accent-solid)]',
        success: 'data-[drop=above]:shadow-[inset_0_2px_0_var(--cs-color-success-solid)] data-[drop=below]:shadow-[inset_0_-2px_0_var(--cs-color-success-solid)]',
        warning: 'data-[drop=above]:shadow-[inset_0_2px_0_var(--cs-color-warning-solid)] data-[drop=below]:shadow-[inset_0_-2px_0_var(--cs-color-warning-solid)]',
        danger: 'data-[drop=above]:shadow-[inset_0_2px_0_var(--cs-color-danger-solid)] data-[drop=below]:shadow-[inset_0_-2px_0_var(--cs-color-danger-solid)]',
        info: 'data-[drop=above]:shadow-[inset_0_2px_0_var(--cs-color-info-solid)] data-[drop=below]:shadow-[inset_0_-2px_0_var(--cs-color-info-solid)]',
        agent: 'data-[drop=above]:shadow-[inset_0_2px_0_var(--cs-color-agent-solid)] data-[drop=below]:shadow-[inset_0_-2px_0_var(--cs-color-agent-solid)]',
      },
      variant: {
        solid: 'bg-control-raised shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2)] hover:bg-control-raised-hover',
        soft: '',
        outline: 'bg-transparent hover:bg-neutral-hover',
        ghost: 'bg-transparent hover:bg-neutral-hover',
      },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: 'h-control-xs text-ui-xs', sm: 'h-control-sm text-ui-dense', md: 'h-menu-item text-ui-dense', lg: 'h-control-lg text-ui' },
    },
    compoundVariants: [
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft hover:bg-neutral-soft-hover' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft hover:bg-accent-soft-hover' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft hover:bg-success-soft-hover' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft hover:bg-warning-soft-hover' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft hover:bg-danger-soft-hover' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft hover:bg-info-soft-hover' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft hover:bg-agent-soft-hover' },
      { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
      { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    ],
    defaultVariants: { tone: 'accent', variant: 'ghost', radius: 'md', shadow: 'none', size: 'md' },
  },
);

/** Position badge: an 18px circle in mono; the warning tint flags a row that reads out of visual order. */
export const readingOrderIndexVariants = cva(
  'grid size-4.5 place-items-center rounded-full bg-neutral-track font-mono text-mono-sm font-semibold text-text-primary group-data-[warning]:bg-warning-soft group-data-[warning]:text-warning-text',
);

export const readingOrderLabelVariants = cva('min-w-0 truncate text-text-primary');

/** Grip glyph: 14px, tertiary, decorative. */
export const readingOrderHandleVariants = cva('size-icon-sm flex-none justify-self-end stroke-[1.75] text-text-tertiary');
