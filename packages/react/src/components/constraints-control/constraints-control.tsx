'use client';
import { MoveHorizontal, MoveVertical } from 'lucide-react';
import { useId, useState, type ComponentProps, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { InspectorSelect } from '../inspector-select/inspector-select.tsx';
import { constraintsBoxVariants, constraintsControlVariants, constraintsFrameVariants, constraintsPinVariants } from './constraints-control.variants.ts';

export type HorizontalConstraint = 'left' | 'right' | 'left-right' | 'center' | 'scale';
export type VerticalConstraint = 'top' | 'bottom' | 'top-bottom' | 'center' | 'scale';
export interface Constraints { horizontal: HorizontalConstraint; vertical: VerticalConstraint }

const H_OPTIONS: [HorizontalConstraint, string][] = [['left', 'Left'], ['right', 'Right'], ['left-right', 'Left & right'], ['center', 'Center'], ['scale', 'Scale']];
const V_OPTIONS: [VerticalConstraint, string][] = [['top', 'Top'], ['bottom', 'Bottom'], ['top-bottom', 'Top & bottom'], ['center', 'Center'], ['scale', 'Scale']];

/** Toggle one edge pin of an axis: edges combine, the center pin is exclusive with them. */
function toggleEdge<T extends string>(current: T, start: string, end: string, both: string, edge: 'start' | 'end'): T {
  const has = { start: current === start || current === both, end: current === end || current === both };
  has[edge] = !has[edge];
  return (has.start && has.end ? both : has.start ? start : has.end ? end : 'scale') as T;
}

export interface ConstraintsControlProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Controlled constraints. */
  value?: Constraints;
  /** Uncontrolled initial constraints. */
  defaultValue?: Constraints;
  onValueChange?: (value: Constraints) => void;
  /** Footnote under the selects. */
  note?: ReactNode;
  disabled?: boolean;
}

/** Pins a frame to its parent: six pins in a 96px box plus two selects that name the same choice. */
export function ConstraintsControl({
  value, defaultValue = { horizontal: 'scale', vertical: 'scale' }, onValueChange, note, disabled = false, className, ...props
}: ConstraintsControlProps) {
  const [current, setCurrent] = useControllableState<Constraints>({ value, defaultValue, onChange: onValueChange });
  const { horizontal: h, vertical: v } = current;
  const pins: { pin: 'top' | 'bottom' | 'left' | 'right' | 'center-x' | 'center-y'; label: string; on: boolean; next: Constraints }[] = [
    { pin: 'top', label: 'Top', on: v === 'top' || v === 'top-bottom', next: { horizontal: h, vertical: toggleEdge(v, 'top', 'bottom', 'top-bottom', 'start') } },
    { pin: 'bottom', label: 'Bottom', on: v === 'bottom' || v === 'top-bottom', next: { horizontal: h, vertical: toggleEdge(v, 'top', 'bottom', 'top-bottom', 'end') } },
    { pin: 'left', label: 'Left', on: h === 'left' || h === 'left-right', next: { horizontal: toggleEdge(h, 'left', 'right', 'left-right', 'start'), vertical: v } },
    { pin: 'right', label: 'Right', on: h === 'right' || h === 'left-right', next: { horizontal: toggleEdge(h, 'left', 'right', 'left-right', 'end'), vertical: v } },
    { pin: 'center-x', label: 'Center X', on: h === 'center', next: { horizontal: h === 'center' ? 'scale' : 'center', vertical: v } },
    { pin: 'center-y', label: 'Center Y', on: v === 'center', next: { horizontal: h, vertical: v === 'center' ? 'scale' : 'center' } },
  ];
  return (
    <div data-slot="constraints-control" role="group" aria-label="Constraints" aria-disabled={disabled || undefined} className={cn(constraintsControlVariants(), className)} {...props}>
      <div data-slot="constraints-control-box" className={constraintsBoxVariants()}>
        <span data-slot="constraints-control-frame" aria-hidden className={constraintsFrameVariants()} />
        {pins.map(p => (
          <button
            key={p.pin}
            type="button"
            data-slot="constraints-control-pin"
            data-pin={p.pin}
            aria-label={p.label}
            aria-pressed={p.on}
            disabled={disabled}
            className={constraintsPinVariants({ pin: p.pin })}
            onClick={() => setCurrent(p.next)}
          />
        ))}
      </div>
      <div data-slot="constraints-control-column" className="grid gap-2">
        <ConstraintSelect slot="horizontal" label="Horizontal constraint" icon={<MoveHorizontal />} options={H_OPTIONS} value={h} disabled={disabled} onPick={x => setCurrent({ horizontal: x, vertical: v })} />
        <ConstraintSelect slot="vertical" label="Vertical constraint" icon={<MoveVertical />} options={V_OPTIONS} value={v} disabled={disabled} onPick={x => setCurrent({ horizontal: h, vertical: x })} />
        {note != null && <p data-slot="constraints-control-note" className="-mb-px m-0 text-hint text-text-tertiary">{note}</p>}
      </div>
    </div>
  );
}

interface ConstraintSelectProps<T extends string> {
  slot: 'horizontal' | 'vertical';
  label: string;
  icon: ReactNode;
  options: [T, string][];
  value: T;
  disabled: boolean;
  onPick: (value: T) => void;
}

/** An InspectorSelect with a small in-place listbox. */
function ConstraintSelect<T extends string>({ slot, label, icon, options, value, disabled, onPick }: ConstraintSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const text = options.find(([v]) => v === value)?.[1] ?? '';
  const blur = (e: FocusEvent<HTMLDivElement>) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); };
  const key = (e: KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Escape') setOpen(false); };
  const shell = { className: 'relative', onBlur: blur, onKeyDown: key };
  const body = (
    <>
      <InspectorSelect aria-label={`${label}, ${text}`} aria-controls={open ? listId : undefined} leading={icon} open={open} disabled={disabled} onClick={() => setOpen(o => !o)}>
        {text}
      </InspectorSelect>
      {open && (
        <div id={listId} role="listbox" aria-label={label} className="absolute inset-x-0 top-full z-10 mt-1 grid gap-px rounded-lg bg-surface-base p-1 text-ui-sm text-text-primary shadow-2">
          {options.map(([v, name]) => (
            <button
              key={v}
              type="button"
              role="option"
              aria-selected={v === value}
              className="flex h-control-sm cursor-pointer items-center rounded-md bg-transparent px-2 text-left outline-none hover:bg-fill-pressed focus-visible:shadow-focus aria-selected:bg-accent-soft aria-selected:text-accent-text"
              onClick={() => { onPick(v); setOpen(false); }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </>
  );
  return slot === 'horizontal'
    ? <div data-slot="constraints-control-horizontal" {...shell}>{body}</div>
    : <div data-slot="constraints-control-vertical" {...shell}>{body}</div>;
}
