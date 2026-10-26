'use client';
import { Check, MoveHorizontal, MoveVertical } from 'lucide-react';
import { useId, useState, type ComponentProps, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { InspectorSelect } from '../inspector-select/inspector-select.tsx';
import { constraintsBoxVariants, constraintsControlVariants, constraintsFrameVariants, constraintsPinVariants } from './constraints-control.variants.ts';

export type HorizontalConstraint = 'left' | 'right' | 'left-right' | 'center' | 'scale';
export type VerticalConstraint = 'top' | 'bottom' | 'top-bottom' | 'center' | 'scale';
/** One constraint per axis; null is a mixed axis (the selection has several values). */
export interface Constraints { horizontal: HorizontalConstraint | null; vertical: VerticalConstraint | null }
export type ConstraintsAxis = 'horizontal' | 'vertical';
export type ConstraintsAxisFlags = Partial<Record<ConstraintsAxis, boolean>>;
export interface ConstraintsControlLabels {
  /** aria-label of the group. */
  group: string;
  pins: Record<'top' | 'bottom' | 'left' | 'right' | 'centerX' | 'centerY', string>;
  /** aria-label of the horizontal select. */
  horizontal: string;
  /** aria-label of the vertical select. */
  vertical: string;
  horizontalOptions: Record<HorizontalConstraint, string>;
  verticalOptions: Record<VerticalConstraint, string>;
  mixed: string;
}

/** Toggle one edge pin of an axis: edges combine, the center pin is exclusive with them. A mixed axis starts from scale. */
function toggleEdge<T extends string>(current: T | null, start: string, end: string, both: string, edge: 'start' | 'end'): T {
  const has = { start: current === start || current === both, end: current === end || current === both };
  has[edge] = !has[edge];
  return (has.start && has.end ? both : has.start ? start : has.end ? end : 'scale') as T;
}

const flagged = (flags: boolean | ConstraintsAxisFlags | undefined, axis: ConstraintsAxis) => flags === true || (typeof flags === 'object' && flags[axis] === true);
/** Attributes of a control whose axis is being written elsewhere. */
const busy = { 'aria-busy': true, 'aria-readonly': true, 'data-reserved': true } as const;

export interface ConstraintsControlProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Controlled constraints. */
  value?: Constraints | undefined;
  /** Uncontrolled initial constraints. */
  defaultValue?: Constraints | undefined;
  onValueChange?: ((value: Constraints) => void) | undefined;
  /** Footnote under the selects. */
  note?: ReactNode;
  /** true disables pins and selects; a record disables one axis. */
  disabled?: boolean | ConstraintsAxisFlags | undefined;
  /** Axes whose selection values differ: pins are aria-pressed "mixed" and the select shows labels.mixed. */
  mixed?: ConstraintsAxisFlags | undefined;
  /** Axes being written or held by another window. */
  reserved?: ConstraintsAxisFlags | undefined;
  /** Every text and accessible name; no English default. */
  labels: ConstraintsControlLabels;
}

/** Pins a frame to its parent: six pins in a 96px box plus two selects that name the same choice. */
export function ConstraintsControl({
  value, defaultValue = { horizontal: 'scale', vertical: 'scale' }, onValueChange, note, disabled = false, mixed, reserved, labels, className, ...props
}: ConstraintsControlProps) {
  const [current, setCurrent] = useControllableState<Constraints>({ value, defaultValue, onChange: onValueChange });
  const { horizontal: h, vertical: v } = current;
  const hMixed = h === null || flagged(mixed, 'horizontal');
  const vMixed = v === null || flagged(mixed, 'vertical');
  const pins: { pin: 'top' | 'bottom' | 'left' | 'right' | 'center-x' | 'center-y'; label: string; axis: ConstraintsAxis; on: boolean; next: Constraints }[] = [
    { pin: 'top', label: labels.pins.top, axis: 'vertical', on: v === 'top' || v === 'top-bottom', next: { horizontal: h, vertical: toggleEdge(v, 'top', 'bottom', 'top-bottom', 'start') } },
    { pin: 'bottom', label: labels.pins.bottom, axis: 'vertical', on: v === 'bottom' || v === 'top-bottom', next: { horizontal: h, vertical: toggleEdge(v, 'top', 'bottom', 'top-bottom', 'end') } },
    { pin: 'left', label: labels.pins.left, axis: 'horizontal', on: h === 'left' || h === 'left-right', next: { horizontal: toggleEdge(h, 'left', 'right', 'left-right', 'start'), vertical: v } },
    { pin: 'right', label: labels.pins.right, axis: 'horizontal', on: h === 'right' || h === 'left-right', next: { horizontal: toggleEdge(h, 'left', 'right', 'left-right', 'end'), vertical: v } },
    { pin: 'center-x', label: labels.pins.centerX, axis: 'horizontal', on: h === 'center', next: { horizontal: h === 'center' ? 'scale' : 'center', vertical: v } },
    { pin: 'center-y', label: labels.pins.centerY, axis: 'vertical', on: v === 'center', next: { horizontal: h, vertical: v === 'center' ? 'scale' : 'center' } },
  ];
  const hOptions = Object.entries(labels.horizontalOptions) as [HorizontalConstraint, string][];
  const vOptions = Object.entries(labels.verticalOptions) as [VerticalConstraint, string][];
  return (
    <div data-slot="constraints-control" role="group" aria-label={labels.group} aria-disabled={disabled === true || undefined} className={cn(constraintsControlVariants(), className)} {...props}>
      <div data-slot="constraints-control-box" className={constraintsBoxVariants()}>
        <span data-slot="constraints-control-frame" aria-hidden className={constraintsFrameVariants()} />
        {pins.map(p => {
          const isReserved = flagged(reserved, p.axis);
          return (
            <button
              key={p.pin}
              type="button"
              data-slot="constraints-control-pin"
              data-pin={p.pin}
              aria-label={p.label}
              aria-pressed={(p.axis === 'horizontal' ? hMixed : vMixed) ? 'mixed' : p.on}
              disabled={flagged(disabled, p.axis)}
              className={constraintsPinVariants({ pin: p.pin })}
              onClick={() => { if (!isReserved) setCurrent(p.next); }}
              {...(isReserved ? busy : {})}
            />
          );
        })}
      </div>
      <div data-slot="constraints-control-column" className="grid gap-2">
        <ConstraintSelect
          slot="horizontal" label={labels.horizontal} icon={<MoveHorizontal />} options={hOptions} value={h} mixed={hMixed} mixedLabel={labels.mixed}
          disabled={flagged(disabled, 'horizontal')} reserved={flagged(reserved, 'horizontal')} onPick={x => setCurrent({ horizontal: x, vertical: v })}
        />
        <ConstraintSelect
          slot="vertical" label={labels.vertical} icon={<MoveVertical />} options={vOptions} value={v} mixed={vMixed} mixedLabel={labels.mixed}
          disabled={flagged(disabled, 'vertical')} reserved={flagged(reserved, 'vertical')} onPick={x => setCurrent({ horizontal: h, vertical: x })}
        />
        {note != null && <p data-slot="constraints-control-note" className="-mb-px m-0 text-hint text-text-tertiary group-aria-disabled/constraints:text-disabled-text">{note}</p>}
      </div>
    </div>
  );
}

interface ConstraintSelectProps<T extends string> {
  slot: ConstraintsAxis;
  label: string;
  icon: ReactNode;
  options: [T, string][];
  value: T | null;
  mixed: boolean;
  mixedLabel: string;
  disabled: boolean;
  reserved: boolean;
  onPick: (value: T) => void;
}

/** An InspectorSelect with a small in-place listbox. */
function ConstraintSelect<T extends string>({ slot, label, icon, options, value, mixed, mixedLabel, disabled, reserved, onPick }: ConstraintSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const text = mixed ? mixedLabel : options.find(([v]) => v === value)?.[1] ?? '';
  const isOpen = open && !reserved;
  const blur = (e: FocusEvent<HTMLDivElement>) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); };
  const key = (e: KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Escape') setOpen(false); };
  const shell = { className: 'relative', onBlur: blur, onKeyDown: key, ...(reserved ? busy : {}) };
  const body = (
    <>
      <InspectorSelect
        aria-label={`${label}, ${text}`} aria-controls={isOpen ? listId : undefined} leading={icon} open={isOpen} disabled={disabled}
        onClick={() => { if (!reserved) setOpen(o => !o); }}
      >
        {text}
      </InspectorSelect>
      {isOpen && (
        <div id={listId} data-slot="constraints-control-listbox" role="listbox" aria-label={label} className="absolute inset-x-0 top-full z-10 mt-1 grid gap-px rounded-lg bg-surface-base p-1 text-ui-sm text-text-primary shadow-2">
          {options.map(([v, name]) => (
            <button
              key={v}
              type="button"
              data-slot="constraints-control-option"
              role="option"
              aria-selected={!mixed && v === value}
              className="flex h-control-sm cursor-pointer items-center justify-between gap-2 rounded-md bg-transparent px-2 text-left outline-none hover:bg-neutral-hover focus-visible:shadow-focus aria-selected:bg-neutral-selected aria-selected:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge)] aria-selected:hover:bg-neutral-selected-hover aria-selected:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge),var(--cs-focus)]"
              onClick={() => { onPick(v); setOpen(false); }}
            >
              {name}
              {!mixed && v === value && <Check data-slot="constraints-control-option-check" aria-hidden className="size-icon-xs shrink-0 stroke-[1.75]" />}
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
