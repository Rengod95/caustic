import { cva } from 'class-variance-authority';

/**
 * Floating thick-glass panel. The glass utility gives its days' focus gap the panel material, not surface.base.
 * Common props (lib/common-props.ts); each axis' default is the own look and adds no class:
 *   variant  the panel: solid = thick glass (own); soft = the tint (neutral.tint or the tone tint); outline = no fill and a
 *            1px tone border; ghost = no panel (inline in a host surface).
 *   tone     the selected endpoints (tone solid with on text; accent is the own look); the panel
 *            colour family outside the own solid.
 *   radius / shadow the panel (2xl, elevation 4). size: the day cells, xs 28 · sm 32 · md 36 (own) · lg 40.
 */
export const calendarVariants = cva('relative grid w-calendar max-w-full gap-2 rounded-2xl p-3 text-text-primary', {
  variants: {
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': '', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: 'shadow-none [--cs-shadow:none]', '1': 'glass-shadow-1 shadow-1', '2': 'glass-shadow-2 shadow-2', '3': 'glass-shadow-3 shadow-3', '4': 'glass-shadow-4 shadow-4', '5': 'glass-shadow-5 shadow-5' },
  },
  compoundVariants: [
    // The own look is the thick glass; every other variant and tone is a plain opaque fill (no glass, so no ordering
    // fight between the glass utility and the fill or edge utilities).
    { variant: 'solid', tone: 'neutral', className: 'glass glass-thick' },
    { variant: 'solid', tone: 'accent', className: 'glass glass-thick' },
    { variant: 'solid', tone: 'success', className: 'bg-success-soft' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'solid', tone: 'info', className: 'bg-info-soft' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-tint' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
    { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
    { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'neutral', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent shadow-none' },
  ],
  defaultVariants: { variant: 'solid', tone: 'accent', radius: '2xl', shadow: '4' },
});

export const calendarHeaderVariants = cva('flex items-center justify-between px-0.5');

/** The title is a button that opens the month/year picker: the month title plus a small chevron, neutral.hover on hover. */
export const calendarTitleVariants = cva(
  'group inline-flex h-control-xs items-center gap-1 rounded-md px-1.5 text-ui-md text-text-primary outline-none transition-control hover:bg-neutral-hover focus-visible:focus-ring data-[state=open]:bg-neutral-hover',
);

/** No column gap: the range span is one continuous box per week. The rows keep a 2px gap. */
export const calendarGridVariants = cva('grid grid-cols-7 gap-x-0 gap-y-0.5 text-center');

export const calendarWeekdayVariants = cva('grid h-control-xs place-items-center text-label text-text-tertiary');

/**
 * A day cell. Selected endpoints fill with the tone solid (accent by default: the on state; hover moves to solid-hover); the days
 * between invert (selected utility: ink fill, paper text, no edge; hover selection.fill-hover). The span (endpoints and the
 * days between) is one continuous box per week (owner 2026-10-27): cells touch (no column gap) and the corners round only
 * at a segment's start and end (week, month or range edge). Today is a grey fill (neutral.track, hover neutral.selected)
 * while it is not selected or in range; the dot is gone.
 * Focus is the focus-ring utility, raised above the neighbours, so its gap follows the panel or, on an in-range day, the
 * ink fill (--cs-focus-offset).
 */
export const calendarDayVariants = cva(
  [
    'group relative rounded-md tabular-nums text-text-primary outline-none transition-control',
    'not-data-[today]:hover:bg-neutral-hover focus-visible:z-10 focus-visible:focus-ring',
    'data-[today]:not-data-[selected]:not-data-[in-range]:bg-neutral-track data-[today]:not-data-[selected]:not-data-[in-range]:hover:bg-neutral-selected',
    'data-[in-range]:not-disabled:selected data-[in-range]:hover:bg-selection-fill-hover',
    'data-[span]:not-data-[segment-start]:rounded-l-none data-[span]:not-data-[segment-end]:rounded-r-none',
    'data-[selected]:font-semibold',
    'disabled:pointer-events-none disabled:text-disabled-text',
  ],
  {
    variants: {
      // The selected endpoints: the tone solid (accent = own; neutral = ink), hover solid-hover.
      tone: {
        neutral: 'data-[selected]:bg-ink-solid data-[selected]:text-ink-on data-[selected]:hover:bg-ink-solid-hover',
        accent: 'data-[selected]:bg-accent-solid data-[selected]:text-accent-on data-[selected]:hover:bg-accent-solid-hover',
        success: 'data-[selected]:bg-success-solid data-[selected]:text-success-on data-[selected]:hover:bg-success-solid-hover',
        warning: 'data-[selected]:bg-warning-solid data-[selected]:text-warning-on data-[selected]:hover:bg-warning-solid-hover',
        danger: 'data-[selected]:bg-danger-solid data-[selected]:text-danger-on data-[selected]:hover:bg-danger-solid-hover',
        info: 'data-[selected]:bg-info-solid data-[selected]:text-info-on data-[selected]:hover:bg-info-solid-hover',
        agent: 'data-[selected]:bg-agent-solid data-[selected]:text-agent-on data-[selected]:hover:bg-agent-solid-hover',
      },
      size: { xs: 'h-control-sm text-ui-sm', sm: 'h-control-md text-ui-sm', md: 'h-calendar-day text-ui', lg: 'h-control-lg text-ui-lg' },
    },
    defaultVariants: { tone: 'accent', size: 'md' },
  },
);

/** Shortcut row: hairline on top, 12px above the chips = the panel's 12px below them. */
export const calendarFooterVariants = cva('flex flex-wrap gap-1.5 border-t border-border-subtle pt-3');

/** Month/year picker (inside a Popover size xs): two scrolling columns side by side. */
export const calendarPickerVariants = cva('grid grid-cols-2 gap-1');

/** One column: a listbox that scrolls (max 220px); 4px padding keeps the option focus ring inside the scroll clip. */
export const calendarPickerColumnVariants = cva('relative grid max-h-listbox-max content-start gap-0.5 overflow-y-auto overscroll-contain p-1 outline-none');

/** A month or year row: 32px, md radius, neutral.hover on hover; the shown month and year use the selected utility. */
export const calendarPickerOptionVariants = cva(
  'flex h-control-md shrink-0 cursor-default select-none items-center rounded-md px-2.5 text-ui tabular-nums text-text-primary outline-none transition-control hover:bg-neutral-hover focus-visible:focus-ring data-[selected]:selected data-[selected]:hover:bg-selection-fill-hover',
);
