'use client';
import { useRef, type ComponentProps, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { alignmentPadCell, alignmentPadMark, alignmentPadVariants } from './alignment-pad.variants.ts';

export type AlignmentPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'middle-left' | 'middle-center' | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

const POSITIONS: AlignmentPosition[] = [
  'top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right',
];
const LABELS = ['Top left', 'Top center', 'Top right', 'Middle left', 'Middle center', 'Middle right', 'Bottom left', 'Bottom center', 'Bottom right'];

export interface AlignmentPadProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'dir'> {
  /** Controlled position. */
  value?: AlignmentPosition;
  /** Uncontrolled initial position. */
  defaultValue?: AlignmentPosition;
  onValueChange?: (value: AlignmentPosition) => void;
  /** Direction of the selected glyph: row = vertical bars, column = horizontal bars. */
  orientation?: 'row' | 'column';
  disabled?: boolean;
}

/** 3×3 radio grid that picks where children sit inside an auto-layout frame. */
export function AlignmentPad({
  value, defaultValue = 'middle-left', onValueChange, orientation = 'row', disabled = false, className, onKeyDown, ...props
}: AlignmentPadProps) {
  const [current, setCurrent] = useControllableState<AlignmentPosition>({ value, defaultValue, onChange: onValueChange });
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (disabled || e.defaultPrevented) return;
    const delta = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key];
    if (!delta) return;
    e.preventDefault();
    const at = Math.max(0, POSITIONS.indexOf(current));
    const col = Math.min(2, Math.max(0, (at % 3) + delta[0]!));
    const row = Math.min(2, Math.max(0, Math.floor(at / 3) + delta[1]!));
    const next = row * 3 + col;
    cells.current[next]?.focus();
    setCurrent(POSITIONS[next]!);
  };
  return (
    <div
      data-slot="alignment-pad"
      role="radiogroup"
      aria-label="Alignment"
      aria-disabled={disabled || undefined}
      data-orientation={orientation}
      className={cn(alignmentPadVariants(), className)}
      onKeyDown={move}
      {...props}
    >
      {POSITIONS.map((position, i) => {
        const checked = position === current;
        return (
          <button
            key={position}
            ref={el => { cells.current[i] = el; }}
            type="button"
            role="radio"
            data-slot="alignment-pad-cell"
            data-state={checked ? 'on' : 'off'}
            aria-checked={checked}
            aria-label={LABELS[i]}
            disabled={disabled}
            tabIndex={checked ? 0 : -1}
            className={alignmentPadCell()}
            onClick={() => setCurrent(position)}
          >
            <span data-slot="alignment-pad-mark" aria-hidden className={alignmentPadMark({ checked, orientation })} />
          </button>
        );
      })}
    </div>
  );
}
