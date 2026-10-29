'use client';
import * as Popover from '@radix-ui/react-popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { formatValue, parseIso, type DateValue } from '../../lib/calendar-date.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { usePresence } from '../../hooks/use-presence.ts';
import { Calendar, type CalendarProps, type CalendarShortcut } from '../calendar/calendar.tsx';
import { useFieldContext } from '../field/field-context.ts';
import { PickerTrigger } from '../picker-trigger/picker-trigger.tsx';
import { datePickerLengthVariants, datePickerVariants } from './date-picker.variants.ts';

const defaultRangeLength = (days: number) => `${days} ${days === 1 ? 'day' : 'days'}`;

export interface DatePickerProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'placeholder'> {
  /** One date or a start–end range. */
  mode?: 'single' | 'range';
  /** Controlled value: ISO date (single) or { from, to } (range). */
  value?: DateValue;
  defaultValue?: DateValue;
  /** Controlled panel visibility. */
  open?: boolean;
  defaultOpen?: boolean;
  /** Shown in the trigger until a value exists. */
  placeholder?: ReactNode;
  /** Passed to the Calendar footer. */
  shortcuts?: boolean | CalendarShortcut[];
  /** Override of today (ISO date). */
  today?: string;
  disabled?: boolean;
  invalid?: boolean;
  /**
   * Range length after a complete range in the trigger, in tertiary after a middle dot (“· 7 days”). Receives the day
   * count (both ends included). Default: “N days” (“1 day”); false hides it.
   */
  formatRangeLength?: ((days: number) => ReactNode) | false | undefined;
  /** Form field name (ISO value; a range posts name-from / name-to). */
  name?: string;
  /** Render the Calendar in place under the trigger, open, without portal or positioning. */
  inline?: boolean;
  onValueChange?: (value: DateValue) => void;
  onOpenChange?: (open: boolean) => void;
  /** Colour family of the trigger (PickerTrigger tone). */
  tone?: Tone | undefined;
  /** Emphasis of the trigger (PickerTrigger variant); outline is the field look. */
  variant?: Variant | undefined;
  /** Corner radius of the trigger; unset = xl. */
  radius?: Radius | undefined;
  /** Elevation of the trigger; unset = none. */
  shadow?: Shadow | undefined;
  /** Trigger height step (PickerTrigger size); also the gap to the inline panel (xs 8, sm 12, md and lg 16). */
  size?: Size | undefined;
}

/** Field-looking trigger that opens a Calendar panel. Wrap in Field for the label. */
export function DatePicker({
  mode = 'range', value, defaultValue, open, defaultOpen, placeholder = 'Select a date', shortcuts, today, disabled, invalid, name, inline = false, formatRangeLength = defaultRangeLength,
  onValueChange, onOpenChange, tone, variant, radius, shadow, size, className, onKeyDown, ...props
}: DatePickerProps) {
  const field = useFieldContext();
  const [val, setVal] = useControllableState<DateValue | null>({ value, defaultValue: defaultValue ?? null, onChange: v => { if (v != null) onValueChange?.(v); } });
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen ?? false, onChange: onOpenChange });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Inline: the calendar stays mounted while it exits (data-state closed, inert), then leaves the DOM.
  const presence = usePresence(inline && isOpen ? ['calendar'] : [], key => key);
  const panel = presence.entries[0];

  const text = formatValue(val);
  const complete = (v: DateValue) => mode === 'single' || typeof v === 'string' || v.to !== undefined;
  const choose = (v: DateValue) => {
    setVal(v);
    if (complete(v)) { setOpen(false); if (inline) triggerRef.current?.focus(); }
  };
  const range = val != null && typeof val !== 'string' ? val : null;
  const single = typeof val === 'string' ? val : null;
  const days = range?.to != null && range.to !== range.from ? Math.round((parseIso(range.to).getTime() - parseIso(range.from).getTime()) / 86_400_000) + 1 : null;
  const length = days != null && formatRangeLength ? formatRangeLength(days) : null;

  const trigger = (
    <PickerTrigger
      ref={triggerRef} data-slot="date-picker-trigger" tone={tone} variant={variant} radius={radius} shadow={shadow} size={size} indicator="dropdown" leading={<CalendarIcon />} placeholder={placeholder}
      open={isOpen} invalid={invalid ?? field?.invalid} disabled={disabled ?? field?.disabled} id={field?.id}
      aria-haspopup="dialog" aria-describedby={field?.describedBy}
      aria-labelledby={field ? `${field.id}-label ${field.id}` : undefined}
      onClick={inline ? () => setOpen(!isOpen) : undefined}
    >
      {text ? <>{text}{length != null && <span data-slot="date-picker-length" className={datePickerLengthVariants()}>{' · '}{length}</span>}</> : undefined}
    </PickerTrigger>
  );
  const calendar = (extra: Partial<CalendarProps> & { 'data-state'?: string } = {}) => (
    <Calendar mode={mode} value={val ?? undefined} today={today} shortcuts={shortcuts} onValueChange={choose} {...extra} />
  );
  const label = mode === 'single' ? 'Choose a date' : 'Choose dates';
  const hidden = name && (range
    ? <><input type="hidden" name={`${name}-from`} value={range.from} /><input type="hidden" name={`${name}-to`} value={range.to ?? ''} /></>
    : <input type="hidden" name={name} value={single ?? ''} />);

  const onRootKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (inline && isOpen && e.key === 'Escape') { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
  };

  if (inline) {
    return (
      <div data-slot="date-picker" className={cn(datePickerVariants({ size }), className)} onKeyDown={onRootKeyDown} {...props}>
        {trigger}
        {panel && calendar({
          role: 'dialog', 'aria-label': label,
          className: 'data-[state=open]:animate-enter data-[state=closed]:animate-exit data-[state=closed]:pointer-events-none enter-scale origin-top',
          'data-state': panel.present ? 'open' : 'closed', inert: !panel.present || undefined, 'aria-hidden': !panel.present || undefined,
          onAnimationEnd: e => { if (!panel.present && e.target === e.currentTarget) presence.exited(panel.key); },
        })}
        {hidden}
      </div>
    );
  }
  return (
    <div data-slot="date-picker" className={cn(datePickerVariants({ size }), className)} {...props}>
      <Popover.Root open={isOpen} onOpenChange={setOpen}>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            ref={panelRef} aria-label={label} side="bottom" align="start" sideOffset={6} className="z-60 origin-(--radix-popover-content-transform-origin) outline-none data-[state=open]:animate-enter data-[state=closed]:animate-exit enter-scale enter-from-side"
            onOpenAutoFocus={e => { e.preventDefault(); panelRef.current?.querySelector<HTMLElement>('[data-slot="calendar-day"][tabindex="0"]')?.focus(); }}
          >
            {calendar()}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {hidden}
    </div>
  );
}
