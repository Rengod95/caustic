'use client';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ComponentProps, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import {
  addDays, addMonths, daysInMonth, firstOfMonth, formatLongDate, formatMonthTitle, lastOfMonth, monthOf, normalizeRange,
  shiftMonth, todayIso, weekday, weekdayNames, type DateRange, type DateValue,
} from '../../lib/calendar-date.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Chip } from '../chip/chip.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Popover } from '../popover/popover.tsx';
import {
  calendarDayVariants, calendarFooterVariants, calendarGridVariants, calendarHeaderVariants, calendarPickerColumnVariants, calendarPickerOptionVariants,
  calendarPickerVariants, calendarTitleVariants, calendarVariants, calendarWeekdayVariants,
} from './calendar.variants.ts';

export interface CalendarShortcut { label: string; value: DateValue }

/** Common props: variant / radius / shadow style the panel, tone the selected endpoints and today mark (and the panel colour), size the day cells. */
export interface CalendarProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'>, CommonProps {
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
  /** First and last year offered by the month/year picker (opened from the title). Default: today's year − 100 … + 20. */
  yearRange?: [number, number] | undefined;
  /** Open the month/year picker on mount (docs and fixtures). */
  defaultMonthPickerOpen?: boolean | undefined;
  onMonthChange?: (month: string) => void;
}

const asRange = (v: DateValue | null): DateRange | null => (v == null ? null : typeof v === 'string' ? { from: v } : v);

/** Month grid for one date or a date range. Dates are ISO strings; no Date objects cross the API. */
export function Calendar({
  mode = 'range', value, defaultValue, month: monthProp, defaultMonth, today: todayProp, shortcuts = true, inline: _inline, yearRange, defaultMonthPickerOpen,
  onValueChange, onMonthChange, tone, variant, radius, shadow, size, className, ...props
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
  // The range span (endpoints and the days between, also while previewing): one continuous box per week. Corners round
  // only where a week's run of span days starts or ends (week edge, month edge or the range end).
  const spanning = mode === 'range' && lo != null && hi != null && lo !== hi;
  const inSpan = (d: string) => spanning && monthOf(d) === month && d >= lo! && d <= hi!;

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
    <div ref={root} data-slot="calendar" data-mode={mode} className={cn(calendarVariants({ tone, variant, radius, shadow }), className)} {...props}>
      <div data-slot="calendar-header" className={calendarHeaderVariants()}>
        <IconButton data-slot="calendar-prev" size="xs" label="Previous month" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeft /></IconButton>
        <MonthYearPicker defaultOpen={defaultMonthPickerOpen ?? false} month={month} today={today} yearRange={yearRange} titleId={titleId} onMonth={setMonth} />
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
                return <button key={d} type="button" role="gridcell" disabled tabIndex={-1} data-slot="calendar-outside-day" data-date={d} aria-label={formatLongDate(d)} className={cn(calendarDayVariants({ tone, size }))}><span>{Number(d.slice(8))}</span></button>;
              }
              const isEnd = sel != null && (d === sel.from || d === sel.to);
              const selected = mode === 'single' ? d === sel?.from : isEnd;
              const inRange = mode === 'range' && lo != null && hi != null && d > lo && d < hi;
              const span = inSpan(d);
              const w = weekday(d);
              return (
                <button
                  key={d} type="button" role="gridcell" data-slot="calendar-day" data-date={d}
                  tabIndex={d === tabDate ? 0 : -1}
                  aria-selected={selected || inRange} aria-current={d === today ? 'date' : undefined} aria-label={formatLongDate(d)}
                  data-selected={selected ? '' : undefined} data-in-range={inRange ? '' : undefined}
                  data-range-start={complete && d === sel?.from ? '' : undefined} data-range-end={complete && d === sel?.to ? '' : undefined}
                  data-span={span ? '' : undefined}
                  data-segment-start={span && (w === 0 || !inSpan(addDays(d, -1))) ? '' : undefined}
                  data-segment-end={span && (w === 6 || !inSpan(addDays(d, 1))) ? '' : undefined}
                  data-today={d === today ? '' : undefined}
                  className={cn(calendarDayVariants({ tone, size }))}
                  onClick={() => pick(d)}
                  onFocus={() => setFocused(d)}
                  onMouseEnter={() => { if (pending) setHover(d); }}
                >
                  <span>{Number(d.slice(8))}</span>
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

const MONTHS = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, i, 1))));

interface MonthYearPickerProps { defaultOpen: boolean; month: string; today: string; yearRange: [number, number] | undefined; titleId: string; onMonth: (month: string) => void }

/** The title as a button that opens a Popover with two scrolling listboxes: month and year. Picking a month closes it. */
function MonthYearPicker({ defaultOpen, month, today, yearRange, titleId, onMonth }: MonthYearPickerProps) {
  const [open, setOpen] = useState(defaultOpen);
  const y = Number(month.slice(0, 4));
  const m = Number(month.slice(5, 7));
  const base = Number(today.slice(0, 4));
  const [from, to] = yearRange ?? [base - 100, base + 20];
  const years = Array.from({ length: Math.max(to, y) - Math.min(from, y) + 1 }, (_, i) => Math.min(from, y) + i);
  const set = (year: number, mon: number) => onMonth(`${String(year).padStart(4, '0')}-${String(mon).padStart(2, '0')}`);

  return (
    <Popover
      open={open} onOpenChange={setOpen} side="bottom" align="center" size="xs" aria-label="Choose month and year"
      anchor={(
        <button type="button" data-slot="calendar-title-button" className={calendarTitleVariants()}>
          <b id={titleId} data-slot="calendar-title" aria-live="polite" className="font-semibold">{formatMonthTitle(month)}</b>
          <ChevronDown aria-hidden className="size-icon-xs text-text-tertiary transition-[rotate] duration-snappy ease-snappy group-data-[state=open]:rotate-180" />
        </button>
      )}
    >
      <div data-slot="calendar-picker" className={calendarPickerVariants()}>
        <PickerColumn
          label="Month" items={MONTHS.map((name, i) => ({ key: i + 1, text: name }))} value={m}
          onChange={v => set(y, v)} onCommit={() => setOpen(false)}
        />
        <PickerColumn
          label="Year" items={years.map(v => ({ key: v, text: String(v) }))} value={y}
          onChange={v => set(v, m)} onCommit={() => setOpen(false)} commitOnClick={false}
        />
      </div>
    </Popover>
  );
}

interface PickerColumnProps {
  label: string; items: Array<{ key: number; text: string }>; value: number;
  onChange: (v: number) => void; onCommit: () => void; commitOnClick?: boolean;
}

/**
 * One scrolling listbox. Roving tabindex on the chosen option, so Tab moves between the two columns and the popover's
 * auto focus lands on the month. Arrows, Home/End and PageUp/PageDown move and apply at once; Enter or Space closes.
 */
function PickerColumn({ label, items, value, onChange, onCommit, commitOnClick = true }: PickerColumnProps) {
  const list = useRef<HTMLDivElement>(null);
  const focusNext = useRef(false);
  // Scroll inside the column only (scrollIntoView would also scroll the page): centre the chosen option on open, then keep
  // it in view as the arrows move it.
  const reveal = (center: boolean) => {
    const box = list.current;
    const el = box?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!box || !el) return;
    if (center) box.scrollTop = el.offsetTop - (box.clientHeight - el.offsetHeight) / 2;
    else if (el.offsetTop < box.scrollTop) box.scrollTop = el.offsetTop;
    else if (el.offsetTop + el.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = el.offsetTop + el.offsetHeight - box.clientHeight;
    if (focusNext.current) { el.focus({ preventScroll: true }); focusNext.current = false; }
  };
  useEffect(() => reveal(false), [value]);
  useEffect(() => reveal(true), []);

  const index = Math.max(0, items.findIndex(i => i.key === value));
  const go = (i: number) => { focusNext.current = true; onChange(items[Math.min(items.length - 1, Math.max(0, i))]!.key); };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = { ArrowUp: index - 1, ArrowDown: index + 1, Home: 0, End: items.length - 1, PageUp: index - 5, PageDown: index + 5 };
    if (e.key in steps) { e.preventDefault(); go(steps[e.key]!); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCommit(); }
  };

  return (
    <div ref={list} role="listbox" aria-label={label} data-slot="calendar-picker-column" className={calendarPickerColumnVariants()} onKeyDown={onKeyDown}>
      {items.map(item => (
        <div
          key={item.key} role="option" aria-selected={item.key === value} tabIndex={item.key === value ? 0 : -1}
          data-slot="calendar-picker-option" data-selected={item.key === value ? '' : undefined}
          className={calendarPickerOptionVariants()}
          onClick={() => { onChange(item.key); if (commitOnClick) onCommit(); }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
