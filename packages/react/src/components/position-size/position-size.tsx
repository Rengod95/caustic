'use client';
import { Check, ChevronDown, FlipHorizontal2, FlipVertical2, Link, Minimize2, MoveHorizontal, MoveVertical, Plus, RotateCw, SlidersHorizontal } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Chip } from '../chip/chip.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { IconToggle } from '../icon-toggle/icon-toggle.tsx';
import { Menu, MenuItem, MenuSeparator } from '../menu/menu.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { positionSizeMode, positionSizeRow, positionSizeVariants } from './position-size.variants.ts';

export interface Geometry {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
  rotation: number | null;
}
export type SizingMode = 'fixed' | 'hug' | 'fill';
export type SizeAxis = 'width' | 'height';

export interface PositionSizeProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Controlled geometry. null shows Mixed in that field. */
  value?: Geometry;
  /** Uncontrolled initial geometry. */
  defaultValue?: Geometry;
  onValueChange?: (value: Geometry) => void;
  /** Horizontal sizing. hug and fill show the pill and make the field read-only. */
  widthMode?: SizingMode;
  /** Vertical sizing. */
  heightMode?: SizingMode;
  onModeChange?: (change: { axis: SizeAxis; mode: SizingMode }) => void;
  /** A sizing-mode pill was pressed. */
  onModeOpen?: (axis: SizeAxis) => void;
  /** Aspect-ratio lock. */
  lockRatio?: boolean;
  onLockChange?: (on: boolean) => void;
  flipX?: boolean;
  flipY?: boolean;
  onFlipChange?: (change: { axis: 'x' | 'y'; on: boolean }) => void;
  onConstraintsClick?: () => void;
  disabled?: boolean;
}

const EMPTY: Geometry = { x: null, y: null, width: null, height: null, rotation: null };

/** Geometry block of the inspector: X Y, W H with sizing modes and aspect lock, rotation, flips and constraints. */
export function PositionSize({
  value, defaultValue = EMPTY, onValueChange, widthMode = 'fixed', heightMode = 'fixed', onModeChange, onModeOpen,
  lockRatio, onLockChange, flipX, flipY, onFlipChange, onConstraintsClick, disabled = false, className, ...props
}: PositionSizeProps) {
  const [geo, setGeo] = useControllableState<Geometry>({ value, defaultValue, onChange: onValueChange });
  const [lock, setLock] = useControllableState<boolean>({ value: lockRatio, defaultValue: false, onChange: onLockChange });
  const [fx, setFx] = useControllableState<boolean>({ value: flipX, defaultValue: false, onChange: on => onFlipChange?.({ axis: 'x', on }) });
  const [fy, setFy] = useControllableState<boolean>({ value: flipY, defaultValue: false, onChange: on => onFlipChange?.({ axis: 'y', on }) });

  const set = (key: keyof Geometry) => (n: number) => {
    const next: Geometry = { ...geo, [key]: n };
    if (lock && (key === 'width' || key === 'height') && geo.width && geo.height) {
      if (key === 'width') next.height = Math.round((n * geo.height) / geo.width);
      else next.width = Math.round((n * geo.width) / geo.height);
    }
    setGeo(next);
  };
  const field = (key: keyof Geometry, readOnly = false) => ({
    value: geo[key], mixed: geo[key] === null, disabled, readOnly, onValueChange: set(key),
  });

  const mode = (axis: SizeAxis, m: SizingMode): ReactNode => {
    if (m === 'fixed') return undefined;
    const name = axis === 'width' ? 'Width' : 'Height';
    const fixedIcon = axis === 'width' ? <MoveHorizontal /> : <MoveVertical />;
    const pick = (next: SizingMode) => () => onModeChange?.({ axis, mode: next });
    const pill = (
      <button
        type="button"
        data-slot="position-size-mode"
        data-mode={m}
        aria-label={`${name} sizing, ${m === 'fill' ? 'Fill' : 'Hug'}`}
        aria-haspopup="menu"
        disabled={disabled}
        className={positionSizeMode({ mode: m })}
        onClick={() => onModeOpen?.(axis)}
      >
        {m === 'fill' ? 'Fill' : 'Hug'}
        <ChevronDown aria-hidden className="size-chevron-xs" />
      </button>
    );
    return (
      <Menu trigger={pill} aria-label={`${name} sizing`} align="end">
        <MenuItem icon={fixedIcon} end={<span className="font-mono">{geo[axis]}</span>} onSelect={pick('fixed')}>{axis === 'width' ? 'Fixed width' : 'Fixed height'}</MenuItem>
        <MenuItem icon={<Minimize2 />} onSelect={pick('hug')}>Hug contents</MenuItem>
        <MenuItem icon={<Check />} onSelect={pick('fill')}>Fill container</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Plus />}>{axis === 'width' ? 'Add min width…' : 'Add min height…'}</MenuItem>
      </Menu>
    );
  };

  return (
    <div data-slot="position-size" aria-disabled={disabled || undefined} className={cn(positionSizeVariants(), className)} {...props}>
      <div data-slot="position-size-position" className={positionSizeRow({ row: 'position' })}>
        <div data-slot="position-size-x" className="min-w-0"><NumberField aria-label="X" label="X" {...field('x')} /></div>
        <div data-slot="position-size-y" className="min-w-0"><NumberField aria-label="Y" label="Y" {...field('y')} /></div>
      </div>
      <div data-slot="position-size-size" className={positionSizeRow({ row: 'size' })}>
        <div data-slot="position-size-width" className="min-w-0"><NumberField aria-label="Width" label="W" unit={mode('width', widthMode)} {...field('width', widthMode !== 'fixed')} /></div>
        <div data-slot="position-size-height" className="min-w-0"><NumberField aria-label="Height" label="H" unit={mode('height', heightMode)} {...field('height', heightMode !== 'fixed')} /></div>
        <span data-slot="position-size-lock" className="inline-flex">
          <IconToggle aria-label="Lock aspect ratio" pressed={lock} onPressedChange={setLock} disabled={disabled}><Link /></IconToggle>
        </span>
      </div>
      <div data-slot="position-size-turn" className={positionSizeRow({ row: 'size' })}>
        <div data-slot="position-size-rotation" className="min-w-0"><NumberField aria-label="Rotation" label={<RotateCw />} unit="°" {...field('rotation')} /></div>
        <div data-slot="position-size-flip" className="flex items-center gap-1">
          <Chip data-slot="position-size-flip-x" appearance="outline" size="sm" aria-label="Flip horizontal" icon={<FlipHorizontal2 />} pressed={fx} onPressedChange={setFx} disabled={disabled}>H</Chip>
          <Chip data-slot="position-size-flip-y" appearance="outline" size="sm" aria-label="Flip vertical" icon={<FlipVertical2 />} pressed={fy} onPressedChange={setFy} disabled={disabled}>V</Chip>
        </div>
        <IconButton data-slot="position-size-constraints" size="xs" label="Constraints" disabled={disabled} onClick={() => onConstraintsClick?.()}><SlidersHorizontal /></IconButton>
      </div>
    </div>
  );
}
