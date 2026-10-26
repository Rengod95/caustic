'use client';
import { ArrowDown, ArrowRight, Check, LayoutGrid, Move, MoveHorizontal, MoveVertical, Space } from 'lucide-react';
import { useId, useState, type ComponentProps, type CSSProperties, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContract } from '../../hooks/use-field-contract.ts';
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
  /** K2e: with flow grid and both present, Column gap and Row gap replace the single gap field. */
  columnGap?: number | undefined;
  rowGap?: number | undefined;
  tracks: TrackList;
}

export type AutoLayoutField = 'flow' | 'align' | 'gap' | 'columnGap' | 'rowGap' | 'distribution' | 'wrap' | 'paddingMode' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' | 'clip' | 'tracks';
export type AutoLayoutFieldFlags = Partial<Record<AutoLayoutField, boolean>>;
export type AutoLayoutDraftField = 'gap' | 'columnGap' | 'rowGap' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft';
export interface AutoLayoutDraft extends NumberFieldDraft { field: AutoLayoutDraftField }
export type AutoLayoutChange =
  | { field: 'gap' | 'columnGap' | 'rowGap'; value: number }
  | { field: 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft'; value: number; sides: (keyof Padding)[] }
  | { field: 'flow' | 'align' | 'distribution' | 'paddingMode'; value: string }
  | { field: 'wrap' | 'clip'; value: boolean }
  /** unit is a marker that only exposes the literal union to the spec prop check; it is never set. */
  | { field: 'tracks'; value: { size: number | null; unit: 'fr' | 'px' | 'auto' }[]; unit?: 'fr' | 'px' | 'auto' };
export interface AutoLayoutLimit { min?: number | undefined; max?: number | undefined; step?: number | undefined }
export interface AutoLayoutLabels {
  flowGroup: string;
  flow: Record<LayoutFlow, string>;
  pad: string;
  padCells: AlignmentCellLabels;
  gap: string;
  columnGap?: string | undefined;
  rowGap?: string | undefined;
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

export interface AutoLayoutProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled layout. */
  value?: AutoLayoutValue | undefined;
  /** Uncontrolled initial layout: the specimen state. */
  defaultValue?: AutoLayoutValue | undefined;
  onValueChange?: ((value: AutoLayoutValue) => void) | undefined;
  /** Shows the live preview above the tracks. */
  preview?: boolean | undefined;
  /** true disables every control; a record disables the named fields. */
  disabled?: boolean | Partial<Record<'flow' | 'align' | 'gap' | 'columnGap' | 'rowGap' | 'distribution' | 'wrap' | 'paddingMode' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' | 'clip' | 'tracks', boolean>> | undefined;
  /** live (default): the behavior before K2d. release: the NumberField value model and one commit per gesture. */
  commitMode?: 'live' | 'release' | undefined;
  /** Fields whose selection values differ; each shows labels.mixed instead of a value. */
  mixed?: Partial<Record<'flow' | 'align' | 'gap' | 'columnGap' | 'rowGap' | 'distribution' | 'wrap' | 'paddingMode' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' | 'clip' | 'tracks', boolean>> | undefined;
  /** Fields being written or held by another window. */
  reserved?: Partial<Record<'flow' | 'align' | 'gap' | 'columnGap' | 'rowGap' | 'distribution' | 'wrap' | 'paddingMode' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' | 'clip' | 'tracks', boolean>> | undefined;
  /** Every text and accessible name; no English default. */
  labels: AutoLayoutLabels;
  /** A numeric field text changed. */
  onDraftChange?: ((draft: AutoLayoutDraft) => void) | undefined;
  /** release mode: a scrub is in progress with the value being previewed; null when it ends or is cancelled. */
  onPreviewChange?: ((value: AutoLayoutValue | null) => void) | undefined;
  /** K2e: fields the owner marks invalid. */
  invalid?: AutoLayoutFieldFlags | undefined;
  /** K2e: id of the owner error text per field. */
  describedBy?: Partial<Record<AutoLayoutField, string>> | undefined;
  /** K2e: per-field range and step. */
  limits?: Partial<Record<AutoLayoutDraftField, AutoLayoutLimit>> | undefined;
  onFieldFocus?: ((event: { field: AutoLayoutField }) => void) | undefined;
  onFieldBlur?: ((event: { field: AutoLayoutField; dirty: boolean }) => void) | undefined;
  /** K2e: one field commits; return false to reject. */
  onFieldCommit?: ((change: AutoLayoutChange) => boolean | void) | undefined;
}

/** The auto-layout block of the inspector: flow, alignment pad, gap, distribution, wrap, padding, clip and grid tracks. */
export function AutoLayout({
  value, defaultValue = defaultAutoLayout, onValueChange, preview = false, disabled = false, commitMode = 'live', mixed, reserved, labels,
  onDraftChange, onPreviewChange, invalid, describedBy, limits, onFieldFocus, onFieldBlur, onFieldCommit, className, children, ...props
}: AutoLayoutProps) {
  const contract = useFieldContract<AutoLayoutChange, AutoLayoutField>({ invalid, describedBy, onFieldFocus, onFieldBlur, onFieldCommit });
  const [v, setV] = useControllableState<AutoLayoutValue>({ value, defaultValue, onChange: onValueChange });
  const [previewing, setPreviewing] = useState<AutoLayoutValue | null>(null);
  const shown = previewing ?? v;
  const patch = (next: Partial<AutoLayoutValue>) => setV({ ...v, ...next });
  const padded = (sides: (keyof Padding)[], n: number): AutoLayoutValue => ({ ...v, padding: { ...v.padding, ...Object.fromEntries(sides.map(s => [s, n])) } });

  const isReserved = (f: AutoLayoutField) => flagged(reserved, f);
  const isMixed = (f: AutoLayoutField) => flagged(mixed, f);
  const isDisabled = (f: AutoLayoutField) => flagged(disabled, f);
  /** The slot wrapper of a field being written elsewhere carries the busy state as well. */
  const wrap = (f: AutoLayoutField, report = false) => ({ ...contract.wrapAttrs(f, report), ...(isReserved(f) ? { 'aria-busy': true as const, 'data-reserved': true as const } : {}) });
  /** A discrete field: reserved ones ignore the choice, the others commit through onFieldCommit first. */
  const guard = <T,>(f: AutoLayoutField, set: (next: T) => void) => (next: T) => { if (!isReserved(f)) contract.commit(f, { field: f, value: next } as AutoLayoutChange, () => set(next)); };
  /** Attributes and focus reporting of a discrete control. */
  const disc = (f: AutoLayoutField) => ({ ...contract.attrs(f), onFocus: () => { if (!isReserved(f) && !isDisabled(f)) contract.focus(f); }, onBlur: () => { if (!isReserved(f) && !isDisabled(f)) contract.blur(f); } });

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
    ...limits?.[draft],
    ...contract.inputProps(draft, anyFlagged(reserved, names) || anyFlagged(disabled, names)),
    onValueChange: (n: number) => { contract.commit(draft, { field: draft as 'paddingTop', value: n, sides }, () => setV(padded(sides, n))); },
    onDraftChange: (d: NumberFieldDraft) => { contract.draft(draft, d); onDraftChange?.({ ...d, field: draft }); },
    onPreviewChange: (n: number | null) => { const next = n === null ? null : padded(sides, n); setPreviewing(next); onPreviewChange?.(next); },
  });

  const split = shown.flow === 'grid' && shown.columnGap !== undefined && shown.rowGap !== undefined;
  /** One gap field: the single gap, or the column or row gap of a grid. */
  const gapField = (name: 'gap' | 'columnGap' | 'rowGap', label: string, icon: ReactNode) => (
    <NumberField
      aria-label={label} label={icon} unit="px" min={0} value={shown[name] ?? 0} mixed={isMixed(name)} mixedLabel={labels.mixed}
      disabled={isDisabled(name)} reserved={isReserved(name)} commitMode={commitMode}
      {...limits?.[name]}
      {...contract.inputProps(name, isReserved(name) || isDisabled(name))}
      onValueChange={n => { contract.commit(name, { field: name, value: n }, () => patch({ [name]: n })); }}
      onDraftChange={d => { contract.draft(name, d); onDraftChange?.({ ...d, field: name }); }}
      onPreviewChange={n => { const next = n === null ? null : { ...v, [name]: n }; setPreviewing(next); onPreviewChange?.(next); }}
    />
  );
  const flowIcons = { free: <Move />, row: <ArrowRight />, column: <ArrowDown />, grid: <LayoutGrid /> } as const;
  const padMixed = isMixed('align');
  const padInert = isDisabled('align') || v.flow === 'free';
  const tracksInert = isDisabled('tracks');

  return (
    <div data-slot="auto-layout" aria-disabled={disabled === true || undefined} className={cn(autoLayoutVariants(), className)} {...props}>
      <div data-slot="auto-layout-controls" className="grid gap-3">
        <SegmentedControl
          data-slot="auto-layout-flow" aria-label={labels.flowGroup} content="icon" className="w-full" value={isMixed('flow') ? '' : v.flow} disabled={isDisabled('flow')}
          onValueChange={guard('flow', (flow: string) => patch({ flow: flow as LayoutFlow }))}
          {...disc('flow')}
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
            {...disc('align')}
            {...(isReserved('align') ? busy : {})}
          />
          <div data-slot="auto-layout-options" className="grid min-w-0 flex-1 gap-2">
            {split ? (
              <div data-slot="auto-layout-gap" className="grid min-w-0 grid-cols-2 gap-1.5">
                <div className="min-w-0" {...wrap('columnGap')}>{gapField('columnGap', labels.columnGap ?? labels.gap, <MoveHorizontal />)}</div>
                <div className="min-w-0" {...wrap('rowGap')}>{gapField('rowGap', labels.rowGap ?? labels.gap, <MoveVertical />)}</div>
              </div>
            ) : (
              <div data-slot="auto-layout-gap" className="min-w-0" {...wrap('gap')}>{gapField('gap', labels.gap, <Space />)}</div>
            )}
            <div data-slot="auto-layout-distribution" className="min-w-0">
              <LayoutChoice
                label={labels.distribution}
                options={DISTRIBUTIONS.map(d => [d, labels.distributionOptions[d]] as const)}
                value={v.distribution}
                mixed={isMixed('distribution')}
                mixedLabel={labels.mixed}
                disabled={isDisabled('distribution')}
                reserved={isReserved('distribution')}
                onValueChange={guard('distribution', (distribution: LayoutDistribution) => patch({ distribution }))}
                extra={disc('distribution')}
              />
            </div>
            <div data-slot="auto-layout-wrap" className={autoLayoutRow()} {...wrap('wrap')}>
              <span>{labels.wrap}</span>
              <Switch
                size="sm" aria-label={labels.wrap} checked={isMixed('wrap') ? false : v.wrap} disabled={isDisabled('wrap')}
                onCheckedChange={guard('wrap', (next: boolean) => patch({ wrap: next }))}
                {...disc('wrap')} {...(isMixed('wrap') ? mixedSwitch : {})} {...(isReserved('wrap') ? busy : {})}
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
              {...disc('paddingMode')}
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
            {...disc('clip')} {...(isMixed('clip') ? mixedSwitch : {})} {...(isReserved('clip') ? busy : {})}
          />
        </div>
        {children}
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
        <div data-slot="auto-layout-tracks" data-mixed={isMixed('tracks') || undefined} className="grid gap-1.5" {...wrap('tracks', true)}>
          {isMixed('tracks') && <span className={cn('text-hint italic text-text-secondary group-aria-disabled/auto-layout:text-disabled-text', tracksInert && 'text-disabled-text')}>{labels.mixed}</span>}
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
  /** Attributes and focus handlers of the field. */
  extra?: object | undefined;
}

/** An InspectorSelect with a small in-place listbox; a mixed value shows the mixed label and a reserved one does not open. */
function LayoutChoice<T extends string>({ label, options, value, mixed, mixedLabel, disabled, reserved, onValueChange, extra }: LayoutChoiceProps<T>) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const text = mixed ? mixedLabel : options.find(([v]) => v === value)?.[1] ?? '';
  const isOpen = open && !reserved;
  const blur = (e: FocusEvent<HTMLDivElement>) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); };
  const key = (e: KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Escape') setOpen(false); };
  return (
    <div className="relative" {...extra} onBlur={e => { blur(e); (extra as { onBlur?: () => void } | undefined)?.onBlur?.(); }} onKeyDown={key} {...(reserved ? { 'aria-busy': true, 'data-reserved': true } : {})}>
      <InspectorSelect
        aria-label={`${label}, ${text}`} aria-controls={isOpen ? listId : undefined} open={isOpen} disabled={disabled}
        data-mixed={mixed || undefined}
        onClick={() => { if (!reserved) setOpen(o => !o); }}
        {...(reserved ? busy : {})}
      >
        {text}
      </InspectorSelect>
      {isOpen && (
        <div id={listId} data-slot="auto-layout-listbox" role="listbox" aria-label={label} className="absolute inset-x-0 top-full z-10 mt-1 grid gap-px rounded-lg bg-surface-base p-1 text-ui-sm text-text-primary shadow-2">
          {options.map(([v, name]) => (
            <button
              key={v}
              type="button"
              data-slot="auto-layout-option"
              role="option"
              aria-selected={!mixed && v === value}
              className="flex h-control-sm cursor-pointer items-center justify-between gap-2 rounded-md bg-transparent px-2 text-left outline-none hover:bg-neutral-hover focus-visible:shadow-focus aria-selected:bg-neutral-selected aria-selected:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge)] aria-selected:hover:bg-neutral-selected-hover aria-selected:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge),var(--cs-focus)]"
              onClick={() => { onValueChange(v); setOpen(false); }}
            >
              {name}
              {!mixed && v === value && <Check data-slot="auto-layout-option-check" aria-hidden className="size-icon-xs shrink-0 stroke-[1.75]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
