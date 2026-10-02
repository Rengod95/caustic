'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ComponentProps, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import {
  addDays, addMonths, daysInMonth, firstOfMonth, formatLongDate, formatMonthTitle, lastOfMonth, monthOf, normalizeRange,
  shiftMonth, todayIso, weekday, weekdayNames, type DateRange, type DateValue,
} from '../../lib/calendar-date.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Chip } from '../chip/chip.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import {
  calendarDayVariants, calendarFooterVariants, calendarGridVariants, calendarHeaderVariants, calendarTodayMarkVariants, calendarVariants, calendarWeekdayVariants,
} from './calendar.variants.ts';

export interface CalendarShortcut { label: string; value: DateValue }

export interface CalendarProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** One date or a start–end range. */
  mode?: 'single' | 'range';
  /** Controlled selection: an ISO date in single mode, { from, to } in range mode. */
  value?: DateValue | undefined;
  defaultValue?: DateValue;
  /** Controlled shown month, YYYY-MM. */
  month?: string;
  /** Initial shown month; defaults to the month of the selection, else of today. */
  defaultMonth?: string;
  /** Override of “today” (ISO date). Defaults to the current date. */
  today?: string | undefined;
  /** true = Today, Next 7 days, This month. false hides the footer. In single mode `true` shows Today only. */
  shortcuts?: boolean | CalendarShortcut[] | undefined;
  /** Render in place; the calendar is itself the panel, so this only matters inside DatePicker. */
  inline?: boolean;
  onValueChange?: (value: DateValue) => void;
  onMonthChange?: (month: string) => void;
}

const asRange = (v: DateValue | null): DateRange | null => (v == null ? null : typeof v === 'string' ? { from: v } : v);

/** Month grid for one date or a date range. Dates are ISO strings; no Date objects cross the API. */
export function Calendar({
  mode = 'range', value, defaultValue, month: monthProp, defaultMonth, today: todayProp, shortcuts = true, inline: _inline,
  onValueChange, onMonthChange, className, ...props
}: CalendarProps) {
  const today = todayProp ?? todayIso();
  const [selection, setSelection] = useControllableState<DateValue | null>({ value, defaultValue: defaultValue ?? null, onChange: v => { if (v != null) onValueChange?.(v); } });
  const sel = asRange(selection);
  const [month, setMonth] = useControllableState<string>({ value: monthProp, defaultValue: defaultMonth ?? monthOf(sel?.from ?? today), onChange: onMonthChange });
  const [hover, setHover] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!pendingFocus.current) return;
    root.current?.querySelector<HTMLElement>(`[data-date="${pendingFocus.current}"]`)?.focus();
    pendingFocus.current = null;
  });

  const first = firstOfMonth(month);
  const lead = weekday(first);
  const count = Math.ceil((lead + daysInMonth(month)) / 7) * 7;
  const cells = Array.from({ length: count }, (_, i) => addDays(first, i - lead));
  const rows = Array.from({ length: count / 7 }, (_, r) => cells.slice(r * 7, r * 7 + 7));

  const pending = mode === 'range' && sel != null && sel.to === undefined;
  const end = sel?.to ?? (pending ? hover : null);
  const lo = sel ? (end && end < sel.from ? end : sel.from) : null;
  const hi = sel ? (end && end > sel.from ? end : sel.from) : null;
  const complete = mode === 'range' && sel?.to != null && sel.to !== sel.from;

  const tabDate = (() => {
    const inMonth = (d: string | null | undefined) => (d && monthOf(d) === month ? d : null);
    return inMonth(focused) ?? inMonth(sel?.from) ?? inMonth(today) ?? first;
  })();

  const pick = (d: string) => {
    if (mode === 'single') setSelection(d);
    else if (sel && sel.to === undefined) setSelection(normalizeRange(sel.from, d));
    else setSelection({ from: d });
    setHover(null);
  };

  const apply = (v: DateValue) => {
    const next = mode === 'single' ? (typeof v === 'string' ? v : v.from) : (typeof v === 'string' ? { from: v, to: v } : v);
    setSelection(next);
    setMonth(monthOf(typeof next === 'string' ? next : next.from));
  };

  const list: CalendarShortcut[] = shortcuts === false ? [] : Array.isArray(shortcuts) ? shortcuts : [
    { label: 'Today', value: today },
    ...(mode === 'range' ? [{ label: 'Next 7 days', value: { from: today, to: addDays(today, 6) } }, { label: 'This month', value: { from: firstOfMonth(monthOf(today)), to: lastOfMonth(monthOf(today)) } }] : []),
  ];

  const move = (to: string) => {
    pendingFocus.current = to;
    if (monthOf(to) !== month) setMonth(monthOf(to)); else setFocused(to);
  };
  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = (e.target as HTMLElement).closest<HTMLElement>('[data-date]')?.dataset.date;
    if (!d) return;
    const w = weekday(d);
    const target: Record<string, string> = {
      ArrowLeft: addDays(d, -1), ArrowRight: addDays(d, 1), ArrowUp: addDays(d, -7), ArrowDown: addDays(d, 7),
      Home: addDays(d, -w), End: addDays(d, 6 - w),
      PageUp: shiftMonth(d, e.shiftKey ? -12 : -1), PageDown: shiftMonth(d, e.shiftKey ? 12 : 1),
    };
    const next = target[e.key];
    if (next) { e.preventDefault(); move(next); }
  };

  return (
    <div ref={root} data-slot="calendar" data-mode={mode} className={cn(calendarVariants(), className)} {...props}>
      <div data-slot="calendar-header" className={calendarHeaderVariants()}>
        <IconButton data-slot="calendar-prev" size="xs" label="Previous month" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeft /></IconButton>
        <b id={titleId} data-slot="calendar-title" aria-live="polite" className="text-ui-md font-semibold text-text-primary">{formatMonthTitle(month)}</b>
        <IconButton data-slot="calendar-next" size="xs" label="Next month" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight /></IconButton>
      </div>
      <div role="grid" aria-labelledby={titleId} data-slot="calendar-grid" className={calendarGridVariants()} onKeyDown={onGridKeyDown} onMouseLeave={() => setHover(null)}>
        <div role="row" className="contents">
          {weekdayNames().map(name => (
            <span key={name} role="columnheader" data-slot="calendar-weekday" className={calendarWeekdayVariants()}><abbr title={name} className="no-underline">{name[0]}</abbr></span>
          ))}
        </div>
        {rows.map(row => (
          <div role="row" key={row[0]} className="contents">
            {row.map(d => {
              const outside = monthOf(d) !== month;
              if (outside) {
                return <button key={d} type="button" role="gridcell" disabled tabIndex={-1} data-slot="calendar-outside-day" data-date={d} aria-label={formatLongDate(d)} className={calendarDayVariants()}><span>{Number(d.slice(8))}</span></button>;
              }
              const isEnd = sel != null && (d === sel.from || d === sel.to);
              const selected = mode === 'single' ? d === sel?.from : isEnd;
              const inRange = mode === 'range' && lo != null && hi != null && d > lo && d < hi;
              return (
                <button
                  key={d} type="button" role="gridcell" data-slot="calendar-day" data-date={d}
                  tabIndex={d === tabDate ? 0 : -1}
                  aria-selected={selected || inRange} aria-current={d === today ? 'date' : undefined} aria-label={formatLongDate(d)}
                  data-selected={selected ? '' : undefined} data-in-range={inRange ? '' : undefined}
                  data-range-start={complete && d === sel?.from ? '' : undefined} data-range-end={complete && d === sel?.to ? '' : undefined}
                  data-today={d === today ? '' : undefined}
                  className={calendarDayVariants()}
                  onClick={() => pick(d)}
                  onFocus={() => setFocused(d)}
                  onMouseEnter={() => { if (pending) setHover(d); }}
                >
                  <span>{Number(d.slice(8))}</span>
                  {d === today && <span data-slot="calendar-today-mark" aria-hidden="true" className={calendarTodayMarkVariants()} />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {list.length > 0 && (
        <div data-slot="calendar-footer" className={calendarFooterVariants()}>
          {list.map(s => (
            <Chip key={s.label} data-slot="calendar-shortcut" size="sm" appearance="soft" onClick={() => apply(s.value)}>{s.label}</Chip>
          ))}
        </div>
      )}
    </div>
  );
}
