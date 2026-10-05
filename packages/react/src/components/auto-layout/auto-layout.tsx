'use client';
import { ArrowDown, ArrowRight, LayoutGrid, Move, MoveHorizontal, MoveVertical, Space } from 'lucide-react';
import { useId, useState, type ComponentProps, type CSSProperties, type FocusEvent, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { AlignmentPad, type AlignmentCellLabels, type AlignmentPosition } from '../alignment-pad/alignment-pad.tsx';
import { GridTracks, type TrackList } from '../grid-tracks/grid-tracks.tsx';
import { InspectorSelect } from '../inspector-select/inspector-select.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Switch } from '../switch/switch.tsx';
import { autoLayoutHeading, autoLayoutPreview, autoLayoutPreviewItem, autoLayoutRow, autoLayoutVariants } from './auto-layout.variants.ts';

export type LayoutFlow = 'free' | 'row' | 'column' | 'grid';
export type PaddingMode = 'all' | 'axes' | 'sides';
export type LayoutDistribution = 'packed' | 'space-between';
export interface Padding { top: number; right: number; bottom: number; left: number }
export interface AutoLayoutValue {
  flow: LayoutFlow;
  /** An AlignmentPad value such as "middle-left". */
  align: string;
  gap: number;
  distribution: LayoutDistribution;
  wrap: boolean;
  paddingMode: PaddingMode;
  padding: Padding;
  clip: boolean;
  tracks: TrackList;
}

export type AutoLayoutField = 'flow' | 'align' | 'gap' | 'distribution' | 'wrap' | 'paddingMode' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' | 'clip' | 'tracks';
export type AutoLayoutFieldFlags = Partial<Record<AutoLayoutField, boolean>>;
export type AutoLayoutDraftField = 'gap' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft';
export interface AutoLayoutDraft extends NumberFieldDraft { field: AutoLayoutDraftField }
export interface AutoLayoutLabels {
  flowGroup: string;
  flow: Record<LayoutFlow, string>;
  pad: string;
  padCells: AlignmentCellLabels;
  gap: string;
  distribution: string;
  distributionOptions: Record<LayoutDistribution, string>;
  wrap: string;
  paddingTitle: string;
  paddingModeGroup: string;
  paddingMode: Record<PaddingMode, string>;
  paddingAll: string;
  paddingHorizontal: string;
  paddingVertical: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  clip: string;
  tracksHeading: string;
  addTrack: string;
  track: (index: number) => string;
  trackUnit: (index: number) => string;
  trackRemove: (index: number) => string;
  trackAuto: string;
  mixed: string;
}

export const defaultAutoLayout: AutoLayoutValue = {
  flow: 'row', align: 'middle-left', gap: 8, distribution: 'packed', wrap: false, paddingMode: 'axes',
  padding: { top: 12, right: 16, bottom: 12, left: 16 }, clip: true,
  tracks: [{ size: 1, unit: 'fr' }, { size: 240, unit: 'px' }, { size: null, unit: 'auto' }],
};

const FLOWS = ['free', 'row', 'column', 'grid'] as const;
const PADDING_MODES = ['all', 'axes', 'sides'] as const;
const DISTRIBUTIONS = ['packed', 'space-between'] as const;
const FREE_POSITIONS = [['14px', '10px'], ['70px', '40px'], ['130px', '20px']] as const;

const flagged = (flags: boolean | AutoLayoutFieldFlags | undefined, field: AutoLayoutField) => flags === true || (typeof flags === 'object' && flags[field] === true);
const anyFlagged = (flags: boolean | AutoLayoutFieldFlags | undefined, fields: AutoLayoutField[]) => fields.some(f => flagged(flags, f));
/** Attributes of a control whose field is being written elsewhere. */
const busy = { 'aria-busy': true, 'aria-readonly': true, 'data-reserved': true } as const;
/** Attributes of a switch that shows a mixed selection: a pressed-state button, since a switch has no mixed state. */
const mixedSwitch = { role: 'button', 'aria-pressed': 'mixed', 'aria-checked': undefined } as const;

export interface AutoLayoutProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Controlled layout. */
  value?: AutoLayoutValue | undefined;
  /** Uncontrolled initial layout: the specimen state. */
  defaultValue?: AutoLayoutValue | undefined;
  onValueChange?: ((value: AutoLayoutValue) => void) | undefined;
  /** Shows the live preview above the tracks. */
  preview?: boolean | undefined;
  /** true disables every control; a record disables the named fields. */
  disabled?: boolean | Partial<Record<'flow' | 'align' | 'gap' | 'distribution' | 'wrap' | 'paddingMode' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' | 'clip' | 'tracks', boolean>> | undefined;
  /** live (default): the behavior before K2d. release: the NumberField value model and one commit per gesture. */
  commitMode?: 'live' | 'release' | undefined;
  /** Fields whose selection values differ; each shows labels.mixed instead of a value. */
  mixed?: Partial<Record<'flow' | 'align' | 'gap' | 'distribution' | 'wrap' | 'paddingMode' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' | 'clip' | 'tracks', boolean>> | undefined;
  /** Fields being written or held by another window. */
  reserved?: Partial<Record<'flow' | 'align' | 'gap' | 'distribution' | 'wrap' | 'paddingMode' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' | 'clip' | 'tracks', boolean>> | undefined;
  /** Every text and accessible name; no English default. */
  labels: AutoLayoutLabels;
  /** A numeric field text changed. */
  onDraftChange?: ((draft: AutoLayoutDraft) => void) | undefined;
  /** release mode: a scrub is in progress with the value being previewed; null when it ends or is cancelled. */
  onPreviewChange?: ((value: AutoLayoutValue | null) => void) | undefined;
}

/** The auto-layout block of the inspector: flow, alignment pad, gap, distribution, wrap, padding, clip and grid tracks. */
export function AutoLayout({
  value, defaultValue = defaultAutoLayout, onValueChange, preview = false, disabled = false, commitMode = 'live', mixed, reserved, labels,
  onDraftChange, onPreviewChange, className, ...props
}: AutoLayoutProps) {
  const [v, setV] = useControllableState<AutoLayoutValue>({ value, defaultValue, onChange: onValueChange });
  const [previewing, setPreviewing] = useState<AutoLayoutValue | null>(null);
  const shown = previewing ?? v;
  const patch = (next: Partial<AutoLayoutValue>) => setV({ ...v, ...next });
  const padded = (sides: (keyof Padding)[], n: number): AutoLayoutValue => ({ ...v, padding: { ...v.padding, ...Object.fromEntries(sides.map(s => [s, n])) } });

  const isReserved = (f: AutoLayoutField) => flagged(reserved, f);
  const isMixed = (f: AutoLayoutField) => flagged(mixed, f);
  const isDisabled = (f: AutoLayoutField) => flagged(disabled, f);
  /** The slot wrapper of a field being written elsewhere carries the busy state as well. */
  const wrap = (f: AutoLayoutField) => (isReserved(f) ? { 'aria-busy': true as const, 'data-reserved': true as const } : {});
  const guard = <T,>(f: AutoLayoutField, set: (next: T) => void) => (next: T) => { if (!isReserved(f)) set(next); };

  const [row = 'middle', col = 'left'] = shown.align.split('-');
  const column = shown.flow === 'column';
  const main = column ? row : col;
  const cross = column ? col : row;
  const edge = { top: 'start', left: 'start', middle: 'center', center: 'center', bottom: 'end', right: 'end' } as const;
  const justify = shown.distribution === 'space-between' ? 'between' : (edge[main as keyof typeof edge] ?? 'start');
  const align = edge[cross as keyof typeof edge] ?? 'center';

  const modeMixed = isMixed('paddingMode');
  /** The props of one numeric padding field. A field that edits several sides is flagged when any of them is. */
  const padField = (names: AutoLayoutField[], sides: (keyof Padding)[], draft: AutoLayoutDraftField) => ({
    min: 0,
    value: shown.padding[sides[0]!],
    mixed: modeMixed || anyFlagged(mixed, names),
    mixedLabel: labels.mixed,
    disabled: anyFlagged(disabled, names),
    reserved: anyFlagged(reserved, names),
    commitMode,
    onValueChange: (n: number) => setV(padded(sides, n)),
    onDraftChange: (d: NumberFieldDraft) => onDraftChange?.({ ...d, field: draft }),
    onPreviewChange: (n: number | null) => { const next = n === null ? null : padded(sides, n); setPreviewing(next); onPreviewChange?.(next); },
  });

  const flowIcons = { free: <Move />, row: <ArrowRight />, column: <ArrowDown />, grid: <LayoutGrid /> } as const;
  const padMixed = isMixed('align');
  const padInert = isDisabled('align') || v.flow === 'free';

  return (
    <div data-slot="auto-layout" aria-disabled={disabled === true || undefined} className={cn(autoLayoutVariants(), className)} {...props}>
      <div data-slot="auto-layout-controls" className="grid gap-3">
        <SegmentedControl
          data-slot="auto-layout-flow" aria-label={labels.flowGroup} content="icon" className="w-full" value={isMixed('flow') ? '' : v.flow} disabled={isDisabled('flow')}
          onValueChange={guard('flow', (flow: string) => patch({ flow: flow as LayoutFlow }))}
          {...(isReserved('flow') ? busy : {})}
        >
          {FLOWS.map(f => <SegmentedControlItem key={f} value={f} aria-label={labels.flow[f]} icon={flowIcons[f]} className="flex-1" />)}
        </SegmentedControl>
        <div data-slot="auto-layout-arrange" className="flex items-start gap-2.5">
          <AlignmentPad
            data-slot="auto-layout-pad"
            label={labels.pad}
            cellLabels={labels.padCells}
            orientation={v.flow === 'row' ? 'row' : 'column'}
            value={(padMixed ? '' : v.align) as AlignmentPosition}
            disabled={padInert}
            onValueChange={guard('align', (next: string) => patch({ align: next }))}
            {...(padMixed && !padInert ? { tabIndex: 0 } : {})}
            {...(padMixed ? { 'data-mixed': true } : {})}
            {...(isReserved('align') ? busy : {})}
          />
          <div data-slot="auto-layout-options" className="grid min-w-0 flex-1 gap-2">
            <div data-slot="auto-layout-gap" className="min-w-0" {...wrap('gap')}>
              <NumberField
                aria-label={labels.gap} label={<Space />} unit="px" min={0} value={shown.gap} mixed={isMixed('gap')} mixedLabel={labels.mixed}
                disabled={isDisabled('gap')} reserved={isReserved('gap')} commitMode={commitMode}
                onValueChange={gap => patch({ gap })}
                onDraftChange={d => onDraftChange?.({ ...d, field: 'gap' })}
                onPreviewChange={n => { const next = n === null ? null : { ...v, gap: n }; setPreviewing(next); onPreviewChange?.(next); }}
              />
            </div>
            <div data-slot="auto-layout-distribution" className="min-w-0">
              <LayoutChoice
                label={labels.distribution}
                options={DISTRIBUTIONS.map(d => [d, labels.distributionOptions[d]] as const)}
                value={v.distribution}
                mixed={isMixed('distribution')}
                mixedLabel={labels.mixed}
                disabled={isDisabled('distribution')}
                reserved={isReserved('distribution')}
                onValueChange={distribution => patch({ distribution })}
              />
            </div>
            <div data-slot="auto-layout-wrap" className={autoLayoutRow()} {...wrap('wrap')}>
              <span>{labels.wrap}</span>
              <Switch
                size="sm" aria-label={labels.wrap} checked={isMixed('wrap') ? false : v.wrap} disabled={isDisabled('wrap')}
                onCheckedChange={guard('wrap', (next: boolean) => patch({ wrap: next }))}
                {...(isMixed('wrap') ? mixedSwitch : {})} {...(isReserved('wrap') ? busy : {})}
              />
            </div>
          </div>
        </div>
        <div data-slot="auto-layout-padding" className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <span data-slot="auto-layout-padding-title" className={autoLayoutHeading()}>{labels.paddingTitle}</span>
            <SegmentedControl
              data-slot="auto-layout-padding-mode" aria-label={labels.paddingModeGroup} size="xs" value={modeMixed ? '' : v.paddingMode} disabled={isDisabled('paddingMode')}
              onValueChange={guard('paddingMode', (mode: string) => patch({ paddingMode: mode as PaddingMode }))}
              {...(isReserved('paddingMode') ? busy : {})}
            >
              {PADDING_MODES.map(m => <SegmentedControlItem key={m} value={m}>{labels.paddingMode[m]}</SegmentedControlItem>)}
            </SegmentedControl>
          </div>
          <div data-slot="auto-layout-padding-fields" className="grid grid-cols-2 gap-1.5">
            {v.paddingMode === 'all' && (
              <NumberField aria-label={labels.paddingAll} label={<Space />} {...padField(['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'], ['top', 'right', 'bottom', 'left'], 'paddingTop')} />
            )}
            {v.paddingMode === 'axes' && (
              <>
                <NumberField aria-label={labels.paddingHorizontal} label={<MoveHorizontal />} {...padField(['paddingLeft', 'paddingRight'], ['left', 'right'], 'paddingLeft')} />
                <NumberField aria-label={labels.paddingVertical} label={<MoveVertical />} {...padField(['paddingTop', 'paddingBottom'], ['top', 'bottom'], 'paddingTop')} />
              </>
            )}
            {v.paddingMode === 'sides' && (
              <>
                <NumberField aria-label={labels.paddingTop} label="T" {...padField(['paddingTop'], ['top'], 'paddingTop')} />
                <NumberField aria-label={labels.paddingRight} label="R" {...padField(['paddingRight'], ['right'], 'paddingRight')} />
                <NumberField aria-label={labels.paddingBottom} label="B" {...padField(['paddingBottom'], ['bottom'], 'paddingBottom')} />
                <NumberField aria-label={labels.paddingLeft} label="L" {...padField(['paddingLeft'], ['left'], 'paddingLeft')} />
              </>
            )}
          </div>
        </div>
        <div data-slot="auto-layout-clip" className={autoLayoutRow()} {...wrap('clip')}>
          <span>{labels.clip}</span>
          <Switch
            size="sm" aria-label={labels.clip} checked={isMixed('clip') ? false : v.clip} disabled={isDisabled('clip')}
            onCheckedChange={guard('clip', (next: boolean) => patch({ clip: next }))}
            {...(isMixed('clip') ? mixedSwitch : {})} {...(isReserved('clip') ? busy : {})}
          />
        </div>
      </div>
      <div data-slot="auto-layout-side" className="grid content-start gap-3">
        {preview && (
          <div
            data-slot="auto-layout-preview"
            aria-hidden
            className={autoLayoutPreview({ flow: shown.flow, justify, align })}
            style={{ '--gap': `${shown.gap}px` } as CSSProperties}
          >
            {(['a', 'b', 'c'] as const).map((size, i) => (
              <span
                key={size}
                data-slot="auto-layout-preview-item"
                className={autoLayoutPreviewItem({ size, free: shown.flow === 'free' })}
                style={{ '--x': FREE_POSITIONS[i]![0], '--y': FREE_POSITIONS[i]![1] } as CSSProperties}
              />
            ))}
          </div>
        )}
        <div data-slot="auto-layout-tracks" data-mixed={isMixed('tracks') || undefined} className="grid gap-1.5" {...wrap('tracks')}>
          {isMixed('tracks') && <span className="text-hint italic text-text-secondary">{labels.mixed}</span>}
          <GridTracks
            heading={labels.tracksHeading}
            addLabel={labels.addTrack}
            trackLabel={labels.track}
            unitLabel={labels.trackUnit}
            removeLabel={labels.trackRemove}
            autoLabel={labels.trackAuto}
            tracks={isMixed('tracks') ? [] : v.tracks}
            disabled={isDisabled('tracks')}
            onTracksChange={guard('tracks', (tracks: TrackList) => patch({ tracks }))}
          />
        </div>
      </div>
    </div>
  );
}

interface LayoutChoiceProps<T extends string> {
  label: string;
  options: readonly (readonly [T, string])[];
  value: T;
  mixed: boolean;
  mixedLabel: string;
  disabled: boolean;
  reserved: boolean;
  onValueChange: (value: T) => void;
}

/** An InspectorSelect with a small in-place listbox; a mixed value shows the mixed label and a reserved one does not open. */
function LayoutChoice<T extends string>({ label, options, value, mixed, mixedLabel, disabled, reserved, onValueChange }: LayoutChoiceProps<T>) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const text = mixed ? mixedLabel : options.find(([v]) => v === value)?.[1] ?? '';
  const isOpen = open && !reserved;
  const blur = (e: FocusEvent<HTMLDivElement>) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); };
  const key = (e: KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Escape') setOpen(false); };
  return (
    <div className="relative" onBlur={blur} onKeyDown={key} {...(reserved ? { 'aria-busy': true, 'data-reserved': true } : {})}>
      <InspectorSelect
        aria-label={`${label}, ${text}`} aria-controls={isOpen ? listId : undefined} open={isOpen} disabled={disabled}
        data-mixed={mixed || undefined}
        onClick={() => { if (!reserved) setOpen(o => !o); }}
        {...(reserved ? busy : {})}
      >
        {text}
      </InspectorSelect>
      {isOpen && (
        <div id={listId} role="listbox" aria-label={label} className="absolute inset-x-0 top-full z-10 mt-1 grid gap-px rounded-lg bg-surface-base p-1 text-ui-sm text-text-primary shadow-2">
          {options.map(([v, name]) => (
            <button
              key={v}
              type="button"
              role="option"
              aria-selected={!mixed && v === value}
              className="flex h-control-sm cursor-pointer items-center rounded-md bg-transparent px-2 text-left outline-none hover:bg-fill-pressed focus-visible:shadow-focus aria-selected:bg-accent-soft aria-selected:text-accent-text"
              onClick={() => { onValueChange(v); setOpen(false); }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
