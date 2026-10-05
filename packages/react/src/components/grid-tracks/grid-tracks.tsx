'use client';
import { Minus, Plus } from 'lucide-react';
import { useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { gridTracksAdd, gridTracksHeading, gridTracksIndex, gridTracksRow, gridTracksUnit, gridTracksUnitItem, gridTracksVariants } from './grid-tracks.variants.ts';

export type TrackUnit = 'fr' | 'px' | 'auto';
export interface Track { size: number | null; unit: TrackUnit }
/** An array of tracks. The optional `unit` marker only exposes the literal union to the spec prop check; arrays never carry it. */
export type TrackList = Track[];

const UNITS: TrackUnit[] = ['fr', 'px', 'auto'];
const DEFAULT_TRACKS: Track[] = [{ size: 1, unit: 'fr' }, { size: 240, unit: 'px' }, { size: null, unit: 'auto' }];

export interface GridTracksProps extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** Controlled tracks. size is null for auto. */
  tracks?: TrackList;
  /** Uncontrolled initial tracks: 1fr, 240px, Auto. */
  defaultTracks?: TrackList;
  onTracksChange?: (tracks: TrackList) => void;
  /** Optional heading above the list. */
  heading?: ReactNode;
  /** Label of the add button ("Add column", "Add row"). Required; no built-in default. */
  addLabel: ReactNode;
  /** aria-label of the size field of track index (1-based). Required; no built-in default. */
  trackLabel: (index: number) => string;
  /** aria-label of the unit switch of track index (1-based). Required; no built-in default. */
  unitLabel: (index: number) => string;
  /** aria-label of the remove button of track index (1-based). Required; no built-in default. */
  removeLabel: (index: number) => string;
  /** Text of the Auto unit item and the placeholder of an auto track. Required; no built-in default. */
  autoLabel: string;
  disabled?: boolean;
}

/** Columns (or rows) of a grid layout: index, size, unit switch and remove button per track, plus add. */
export function GridTracks({
  tracks, defaultTracks = DEFAULT_TRACKS, onTracksChange, heading, addLabel, trackLabel, unitLabel, removeLabel, autoLabel, disabled = false, className, ...props
}: GridTracksProps) {
  const [list, setList] = useControllableState<Track[]>({ value: tracks, defaultValue: defaultTracks, onChange: onTracksChange });
  const update = (i: number, next: Track) => setList(list.map((t, at) => (at === i ? next : t)));
  const chooseUnit = (i: number, unit: TrackUnit) => update(i, { unit, size: unit === 'auto' ? null : (list[i]!.size ?? (unit === 'fr' ? 1 : 240)) });
  return (
    <div data-slot="grid-tracks" role="group" aria-label="Grid tracks" aria-disabled={disabled || undefined} className={cn(gridTracksVariants(), className)} {...props}>
      {heading != null && <div data-slot="grid-tracks-heading" className={gridTracksHeading()}>{heading}</div>}
      <div data-slot="grid-tracks-list" className="grid gap-1">
        {list.map((track, i) => (
          <div key={i} data-slot="grid-tracks-row" className={gridTracksRow()}>
            <span data-slot="grid-tracks-index" aria-hidden className={gridTracksIndex()}>{i + 1}</span>
            <div data-slot="grid-tracks-field" className="min-w-0 flex-1">
              <NumberField
                aria-label={trackLabel(i + 1)}
                placeholder={track.unit === 'auto' ? autoLabel : undefined}
                value={track.size}
                readOnly={track.unit === 'auto'}
                disabled={disabled}
                min={0}
                onValueChange={size => update(i, { ...track, size })}
              />
            </div>
            <UnitSwitch label={unitLabel(i + 1)} autoLabel={autoLabel} unit={track.unit} disabled={disabled} onChoose={unit => chooseUnit(i, unit)} />
            <IconButton data-slot="grid-tracks-remove" size="xs" label={removeLabel(i + 1)} disabled={disabled} onClick={() => setList(list.filter((_, at) => at !== i))}>
              <Minus />
            </IconButton>
          </div>
        ))}
        <button
          type="button"
          data-slot="grid-tracks-add"
          disabled={disabled}
          className={gridTracksAdd()}
          onClick={() => setList([...list, { size: 1, unit: 'fr' }])}
        >
          <Plus aria-hidden className="size-icon-sm" />
          {addLabel}
        </button>
      </div>
    </div>
  );
}

function UnitSwitch({ label, autoLabel, unit, disabled, onChoose }: { label: string; autoLabel: string; unit: TrackUnit; disabled: boolean; onChoose: (unit: TrackUnit) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step || disabled) return;
    e.preventDefault();
    const at = UNITS.indexOf(unit);
    const next = (at + step + UNITS.length) % UNITS.length;
    ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
    onChoose(UNITS[next]!);
  };
  return (
    <div ref={ref} data-slot="grid-tracks-unit" role="radiogroup" aria-label={label} className={gridTracksUnit()} onKeyDown={key}>
      {UNITS.map(u => (
        <button
          key={u}
          type="button"
          role="radio"
          data-slot="grid-tracks-unit-item"
          aria-checked={u === unit}
          tabIndex={u === unit ? 0 : -1}
          disabled={disabled}
          className={gridTracksUnitItem()}
          onClick={() => onChoose(u)}
        >
          {u === 'auto' ? autoLabel : u}
        </button>
      ))}
    </div>
  );
}
