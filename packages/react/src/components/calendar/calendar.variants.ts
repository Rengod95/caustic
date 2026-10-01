import { cva } from 'class-variance-authority';

/** Floating thick-glass panel. */
export const calendarVariants = cva('glass glass-thick glass-shadow-4 grid w-calendar max-w-full gap-2 rounded-2xl p-3 text-text-primary');

export const calendarHeaderVariants = cva('flex items-center justify-between px-0.5');

export const calendarGridVariants = cva('grid grid-cols-7 gap-0.5 text-center');

export const calendarWeekdayVariants = cva('grid h-control-xs place-items-center text-label text-text-tertiary');

/**
 * A day cell. Selected endpoints fill with accent.solid; the days between fill with accent.soft and are
 * square; the endpoints of a complete range are square on the inner side.
 */
export const calendarDayVariants = cva([
  'group relative h-calendar-day rounded-md text-ui tabular-nums text-text-primary outline-none',
  'hover:bg-fill-hover focus-visible:shadow-focus',
  'data-[in-range]:rounded-none data-[in-range]:bg-accent-soft',
  'data-[selected]:bg-accent-solid data-[selected]:font-semibold data-[selected]:text-accent-on',
  'data-[range-start]:rounded-r-none data-[range-end]:rounded-l-none',
  'disabled:pointer-events-none disabled:text-text-disabled',
]);

export const calendarTodayMarkVariants = cva('pointer-events-none absolute bottom-1.25 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent-solid group-data-[selected]:bg-accent-on');

/** Shortcut row: hairline on top. The extra bottom padding is cancelled by a negative margin so the panel keeps the specimen height. */
export const calendarFooterVariants = cva('-mb-1 flex flex-wrap gap-1.5 border-t border-border-subtle py-1');
