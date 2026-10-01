'use client';
import * as Popover from '@radix-ui/react-popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { formatValue, type DateValue } from '../../lib/calendar-date.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Calendar, type CalendarProps, type CalendarShortcut } from '../calendar/calendar.tsx';
import { useFieldContext } from '../field/field-context.ts';
import { PickerTrigger } from '../picker-trigger/picker-trigger.tsx';

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
  /** Form field name (ISO value; a range posts name-from / name-to). */
  name?: string;
  /** Render the Calendar in place under the trigger, open, without portal or positioning. */
  inline?: boolean;
  onValueChange?: (value: DateValue) => void;
  onOpenChange?: (open: boolean) => void;
}

/** Field-looking trigger that opens a Calendar panel. Wrap in Field for the label. */
export function DatePicker({
  mode = 'range', value, defaultValue, open, defaultOpen, placeholder = 'Select a date', shortcuts, today, disabled, invalid, name, inline = false,
  onValueChange, onOpenChange, className, onKeyDown, ...props
}: DatePickerProps) {
  const field = useFieldContext();
  const [val, setVal] = useControllableState<DateValue | null>({ value, defaultValue: defaultValue ?? null, onChange: v => { if (v != null) onValueChange?.(v); } });
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen ?? false, onChange: onOpenChange });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const text = formatValue(val);
  const complete = (v: DateValue) => mode === 'single' || typeof v === 'string' || v.to !== undefined;
  const choose = (v: DateValue) => {
    setVal(v);
    if (complete(v)) { setOpen(false); if (inline) triggerRef.current?.focus(); }
  };
  const range = val != null && typeof val !== 'string' ? val : null;
  const single = typeof val === 'string' ? val : null;

  const trigger = (
    <PickerTrigger
      ref={triggerRef} data-slot="date-picker-trigger" indicator="dropdown" leading={<CalendarIcon />} placeholder={placeholder}
      open={isOpen} invalid={invalid ?? field?.invalid} disabled={disabled ?? field?.disabled} id={field?.id}
      aria-haspopup="dialog" aria-describedby={field?.describedBy}
      aria-labelledby={field ? `${field.id}-label ${field.id}` : undefined}
      onClick={inline ? () => setOpen(!isOpen) : undefined}
    >
      {text || undefined}
    </PickerTrigger>
  );
  const calendar = (extra: Partial<CalendarProps> = {}) => (
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
      <div data-slot="date-picker" className={cn('grid gap-4', className)} onKeyDown={onRootKeyDown} {...props}>
        {trigger}
        {isOpen && calendar({ role: 'dialog', 'aria-label': label })}
        {hidden}
      </div>
    );
  }
  return (
    <div data-slot="date-picker" className={cn('grid gap-4', className)} {...props}>
      <Popover.Root open={isOpen} onOpenChange={setOpen}>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            ref={panelRef} aria-label={label} side="bottom" align="start" sideOffset={6} className="z-60 outline-none"
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
