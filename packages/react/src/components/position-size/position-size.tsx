'use client';
import { ChevronDown, FlipHorizontal2, FlipVertical2, Link, Maximize2, Minimize2, MoveHorizontal, MoveVertical, RotateCw, SlidersHorizontal } from 'lucide-react';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContract } from '../../hooks/use-field-contract.ts';
import { Chip } from '../chip/chip.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { IconToggle } from '../icon-toggle/icon-toggle.tsx';
import { Menu, MenuItem } from '../menu/menu.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { Select, SelectOption } from '../select/select.tsx';
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
export type PositionSizeField = 'x' | 'y' | 'width' | 'height' | 'rotation' | 'widthMode' | 'heightMode' | 'lockRatio' | 'flipX' | 'flipY' | 'constraints';
export type PositionSizeFieldFlags = Partial<Record<PositionSizeField, boolean>>;
export type PositionSizeDraftField = 'x' | 'y' | 'width' | 'height' | 'rotation';
export interface PositionSizeDraft extends NumberFieldDraft { field: PositionSizeDraftField }
export type PositionSizeChange =
  | { field: PositionSizeDraftField; value: number }
  | { field: 'widthMode' | 'heightMode'; value: SizingMode }
  | { field: 'lockRatio' | 'flipX' | 'flipY'; value: boolean };
export interface PositionSizeLimit { min?: number | undefined; max?: number | undefined; step?: number | undefined }
export interface PositionSizeLabels {
  x: string;
  y: string;
  width: string;
  height: string;
  rotation: string;
  xShort: string;
  yShort: string;
  widthShort: string;
  heightShort: string;
  lockRatio: string;
  flipX: string;
  flipY: string;
  flipXShort: string;
  flipYShort: string;
  constraints: string;
  mode: Record<SizingMode, string>;
  widthSizing: (mode: SizingMode) => string;
  heightSizing: (mode: SizingMode) => string;
  mixed: string;
}

export interface PositionSizeProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled geometry. null shows the mixed label in that field. */
  value?: Geometry | undefined;
  /** Uncontrolled initial geometry. */
  defaultValue?: Geometry | undefined;
  onValueChange?: ((value: Geometry) => void) | undefined;
  /** Horizontal sizing. hug and fill show the pill and make the field read-only. null is mixed. */
  widthMode?: SizingMode | null | undefined;
  /** Vertical sizing. null is mixed. */
  heightMode?: SizingMode | null | undefined;
  onModeChange?: ((change: { axis: SizeAxis; mode: SizingMode }) => void) | undefined;
  /** A sizing-mode pill was pressed. */
  onModeOpen?: ((axis: SizeAxis) => void) | undefined;
  /** Aspect-ratio lock. null is mixed. */
  lockRatio?: boolean | null | undefined;
  onLockChange?: ((on: boolean) => void) | undefined;
  flipX?: boolean | null | undefined;
  flipY?: boolean | null | undefined;
  onFlipChange?: ((change: { axis: 'x' | 'y'; on: boolean }) => void) | undefined;
  onConstraintsClick?: (() => void) | undefined;
  /** true disables every control; a record disables the named fields. */
  disabled?: boolean | PositionSizeFieldFlags | undefined;
  /** live (default): the behavior before K2d. release: the NumberField value model and one commit per gesture. */
  commitMode?: 'live' | 'release' | undefined;
  /** Fields whose selection values differ; each shows labels.mixed instead of a value. */
  mixed?: PositionSizeFieldFlags | undefined;
  /** Fields being written or held by another window. */
  reserved?: PositionSizeFieldFlags | undefined;
  /** Every text and accessible name; no English default. */
  labels: PositionSizeLabels;
  /** A numeric field text changed. */
  onDraftChange?: ((draft: PositionSizeDraft) => void) | undefined;
  /** release mode: a scrub is in progress with the value being previewed; null when it ends or is cancelled. */
  onPreviewChange?: ((value: Geometry | null) => void) | undefined;
  /** K2e: fields the owner marks invalid. */
  invalid?: PositionSizeFieldFlags | undefined;
  /** K2e: id of the owner error text per field. */
  describedBy?: Partial<Record<PositionSizeField, string>> | undefined;
  /** K2e: per-field range and step. */
  limits?: Partial<Record<PositionSizeDraftField, PositionSizeLimit>> | undefined;
  /** K2e: the sizing modes offered per axis (the current mode is always listed). */
  sizingModes?: Partial<Record<SizeAxis, SizingMode[]>> | undefined;
  /** K2e: pill (default) or a Select under the field. */
  modeControl?: 'pill' | 'select' | undefined;
  /** K2e: hug and fill make the number read-only (default). */
  derivedReadOnly?: boolean | undefined;
  onFieldFocus?: ((event: { field: PositionSizeField }) => void) | undefined;
  onFieldBlur?: ((event: { field: PositionSizeField; dirty: boolean }) => void) | undefined;
  /** K2e: one field commits; return false to reject. */
  onFieldCommit?: ((change: PositionSizeChange) => boolean | void) | undefined;
}

const EMPTY: Geometry = { x: null, y: null, width: null, height: null, rotation: null };

const flagged = (flags: boolean | PositionSizeFieldFlags | undefined, field: PositionSizeField) => flags === true || (typeof flags === 'object' && flags[field] === true);
/** Attributes of a toggle or button whose field is being written elsewhere. */
const busy = { 'aria-busy': true, 'aria-readonly': true, 'data-reserved': true } as const;

/** Geometry block of the inspector: X Y, W H with sizing modes and aspect lock, rotation, flips and constraints. */
export function PositionSize({
  value, defaultValue = EMPTY, onValueChange, widthMode = 'fixed', heightMode = 'fixed', onModeChange, onModeOpen,
  lockRatio, onLockChange, flipX, flipY, onFlipChange, onConstraintsClick, disabled = false, commitMode = 'live', mixed, reserved, labels,
  onDraftChange, onPreviewChange, invalid, describedBy, limits, sizingModes, modeControl = 'pill', derivedReadOnly = true, onFieldFocus, onFieldBlur, onFieldCommit, className, children, ...props
}: PositionSizeProps) {
  const contract = useFieldContract<PositionSizeChange, PositionSizeField>({ invalid, describedBy, onFieldFocus, onFieldBlur, onFieldCommit });
  const [geo, setGeo] = useControllableState<Geometry>({ value, defaultValue, onChange: onValueChange });
  const [lock, setLock] = useControllableState<boolean | null>({ value: lockRatio, defaultValue: false, onChange: on => { if (on !== null) onLockChange?.(on); } });
  const [fx, setFx] = useControllableState<boolean | null>({ value: flipX, defaultValue: false, onChange: on => { if (on !== null) onFlipChange?.({ axis: 'x', on }); } });
  const [fy, setFy] = useControllableState<boolean | null>({ value: flipY, defaultValue: false, onChange: on => { if (on !== null) onFlipChange?.({ axis: 'y', on }); } });
  const [previewing, setPreviewing] = useState<Geometry | null>(null);
  const shown = previewing ?? geo;

  /** The geometry after `key` becomes `n`; with the ratio lock the paired size follows in the same payload. */
  const build = (key: keyof Geometry, n: number): Geometry => {
    const next: Geometry = { ...geo, [key]: n };
    if (lock === true && (key === 'width' || key === 'height') && geo.width && geo.height) {
      if (key === 'width') next.height = Math.round((n * geo.height) / geo.width);
      else next.width = Math.round((n * geo.width) / geo.height);
    }
    return next;
  };
  const field = (key: PositionSizeDraftField, readOnly = false) => ({
    value: shown[key],
    mixed: geo[key] === null || flagged(mixed, key),
    mixedLabel: labels.mixed,
    disabled: flagged(disabled, key),
    reserved: flagged(reserved, key),
    readOnly,
    commitMode,
    ...limits?.[key],
    ...contract.inputProps(key, flagged(reserved, key) || flagged(disabled, key)),
    onValueChange: (n: number) => { contract.commit(key, { field: key, value: n }, () => setGeo(build(key, n))); },
    onDraftChange: (d: NumberFieldDraft) => { contract.draft(key, d); onDraftChange?.({ ...d, field: key }); },
    onPreviewChange: (n: number | null) => { const next = n === null ? null : build(key, n); setPreviewing(next); onPreviewChange?.(next); },
  });

  const mode = (axis: SizeAxis, m: SizingMode | null): ReactNode => {
    const key = axis === 'width' ? 'widthMode' : 'heightMode';
    const isMixed = m === null || flagged(mixed, key);
    const offers = (x: SizingMode) => x === m || (sizingModes?.[axis] ?? ['fixed', 'hug', 'fill']).includes(x);
    if (modeControl === 'select') return undefined;
    if (m === 'fixed' && !isMixed) return undefined;
    const fixedIcon = axis === 'width' ? <MoveHorizontal /> : <MoveVertical />;
    const pick = (next: SizingMode) => () => { contract.commit(key, { field: key, value: next }, () => onModeChange?.({ axis, mode: next })); };
    const sizing = axis === 'width' ? labels.widthSizing : labels.heightSizing;
    const isReserved = flagged(reserved, key);
    const shownMode = isMixed ? 'mixed' : m === 'fill' ? 'fill' : 'hug';
    const pill = (
      <button
        type="button"
        data-slot="position-size-mode"
        data-mode={shownMode}
        aria-label={isMixed || m === null ? labels.mixed : sizing(m)}
        aria-haspopup="menu"
        disabled={flagged(disabled, key)}
        className={positionSizeMode({ mode: shownMode })}
        onClick={() => { if (!isReserved) onModeOpen?.(axis); }}
        {...(isReserved ? busy : {})}
      >
        {shownMode === 'fill' ? <Maximize2 data-slot="position-size-mode-icon" aria-hidden className="size-icon-xs" /> : null}
        {shownMode === 'hug' ? <Minimize2 data-slot="position-size-mode-icon" aria-hidden className="size-icon-xs" /> : null}
        {isMixed || m === null ? labels.mixed : labels.mode[m]}
        <ChevronDown aria-hidden className="size-chevron-xs" />
      </button>
    );
    if (isReserved) return pill;
    return (
      <Menu trigger={pill} aria-label={labels[axis]} align="end">
        {offers('fixed') && <MenuItem icon={fixedIcon} end={<span className="font-mono">{geo[axis]}</span>} onSelect={pick('fixed')}>{labels.mode.fixed}</MenuItem>}
        {offers('hug') && <MenuItem icon={<Minimize2 />} onSelect={pick('hug')}>{labels.mode.hug}</MenuItem>}
        {offers('fill') && <MenuItem icon={<Maximize2 />} onSelect={pick('fill')}>{labels.mode.fill}</MenuItem>}
      </Menu>
    );
  };

  /** K2e: the sizing mode as a Select under the field (role combobox), always rendered. */
  const modeSelect = (axis: SizeAxis, m: SizingMode | null): ReactNode => {
    if (modeControl !== 'select') return null;
    const key = axis === 'width' ? 'widthMode' : 'heightMode';
    const isMixed = m === null || flagged(mixed, key);
    const sizing = axis === 'width' ? labels.widthSizing : labels.heightSizing;
    const allowed = sizingModes?.[axis] ?? ['fixed', 'hug', 'fill'];
    const options = (['fixed', 'hug', 'fill'] as SizingMode[]).filter(x => x === m || allowed.includes(x));
    const isReserved = flagged(reserved, key);
    return (
      <Select
        data-slot="position-size-mode"
        data-mode={isMixed ? 'mixed' : m}
        aria-label={sizing(m ?? 'fixed')}
        value={isMixed || m === null ? '' : m}
        placeholder={labels.mixed}
        disabled={flagged(disabled, key) || options.length < 2}
        onValueChange={next => { if (!isReserved) contract.commit(key, { field: key, value: next as SizingMode }, () => onModeChange?.({ axis, mode: next as SizingMode })); }}
        {...contract.attrs(key)}
        {...(isReserved ? busy : {})}
      >
        {options.map(option => <SelectOption key={option} value={option}>{labels.mode[option]}</SelectOption>)}
      </Select>
    );
  };

  const toggle = (name: 'lockRatio' | 'flipX' | 'flipY', state: boolean | null) => ({
    ...contract.attrs(name),
    onFocus: () => { if (!flagged(reserved, name) && !flagged(disabled, name)) contract.focus(name); },
    onBlur: () => { if (!flagged(reserved, name) && !flagged(disabled, name)) contract.blur(name); },
    pressed: state === true,
    disabled: flagged(disabled, name),
    ...(flagged(mixed, name) || state === null ? { 'aria-pressed': 'mixed' as const } : {}),
    ...(flagged(reserved, name) ? busy : {}),
  });
  /** The slot wrapper of a field being written elsewhere carries the busy state as well. */
  const wrap = (name: PositionSizeDraftField) => ({ ...contract.wrapAttrs(name), ...(flagged(reserved, name) ? { 'aria-busy': true as const, 'data-reserved': true as const } : {}) });
  const guard = (name: 'lockRatio' | 'flipX' | 'flipY', set: (on: boolean) => void) => (on: boolean) => { if (!flagged(reserved, name)) contract.commit(name, { field: name, value: on }, () => set(on)); };

  return (
    <div data-slot="position-size" aria-disabled={disabled === true || undefined} className={cn(positionSizeVariants(), className)} {...props}>
      <div data-slot="position-size-position" className={positionSizeRow({ row: 'position' })}>
        <div data-slot="position-size-x" className="min-w-0" {...wrap('x')}><NumberField aria-label={labels.x} label={labels.xShort} {...field('x')} /></div>
        <div data-slot="position-size-y" className="min-w-0" {...wrap('y')}><NumberField aria-label={labels.y} label={labels.yShort} {...field('y')} /></div>
      </div>
      <div data-slot="position-size-size" className={positionSizeRow({ row: 'size' })}>
        <div data-slot="position-size-width" className={modeControl === 'select' ? 'grid min-w-0 gap-1' : 'min-w-0'} {...wrap('width')}><NumberField aria-label={labels.width} label={labels.widthShort} unit={mode('width', widthMode)} {...field('width', derivedReadOnly && (widthMode === 'hug' || widthMode === 'fill'))} />{modeSelect('width', widthMode)}</div>
        <div data-slot="position-size-height" className={modeControl === 'select' ? 'grid min-w-0 gap-1' : 'min-w-0'} {...wrap('height')}><NumberField aria-label={labels.height} label={labels.heightShort} unit={mode('height', heightMode)} {...field('height', derivedReadOnly && (heightMode === 'hug' || heightMode === 'fill'))} />{modeSelect('height', heightMode)}</div>
        <IconToggle data-slot="position-size-lock" aria-label={labels.lockRatio} onPressedChange={guard('lockRatio', setLock)} {...toggle('lockRatio', lock)}><Link /></IconToggle>
      </div>
      <div data-slot="position-size-turn" className={positionSizeRow({ row: 'size' })}>
        <div data-slot="position-size-rotation" className="min-w-0" {...wrap('rotation')}><NumberField aria-label={labels.rotation} label={<RotateCw />} unit="°" {...field('rotation')} /></div>
        <div data-slot="position-size-flip" className="flex items-center gap-1">
          <Chip data-slot="position-size-flip-x" appearance="outline" size="sm" aria-label={labels.flipX} icon={<FlipHorizontal2 />} onPressedChange={guard('flipX', setFx)} {...toggle('flipX', fx)}>{labels.flipXShort}</Chip>
          <Chip data-slot="position-size-flip-y" appearance="outline" size="sm" aria-label={labels.flipY} icon={<FlipVertical2 />} onPressedChange={guard('flipY', setFy)} {...toggle('flipY', fy)}>{labels.flipYShort}</Chip>
        </div>
        <IconButton
          data-slot="position-size-constraints"
          size="xs"
          label={labels.constraints}
          disabled={flagged(disabled, 'constraints')}
          data-mixed={flagged(mixed, 'constraints') || undefined}
          onClick={() => { if (!flagged(reserved, 'constraints')) onConstraintsClick?.(); }}
          {...(flagged(reserved, 'constraints') ? busy : {})}
        >
          <SlidersHorizontal />
        </IconButton>
      </div>
      {children}
    </div>
  );
}
