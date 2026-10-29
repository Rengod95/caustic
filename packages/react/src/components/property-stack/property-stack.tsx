'use client';
import { Grid2x2, Plus, X } from 'lucide-react';
import { Fragment, useId, useLayoutEffect, useRef, useState, type ComponentProps, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContract } from '../../hooks/use-field-contract.ts';
import { useFlip } from '../../hooks/use-flip.ts';
import { usePresence } from '../../hooks/use-presence.ts';
import { Button } from '../button/button.tsx';
import { ColorWell } from '../color-well/color-well.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { InspectorSection } from '../inspector-panel/inspector-panel.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { Popover } from '../popover/popover.tsx';
import { StackRow } from '../stack-row/stack-row.tsx';
import {
  propertyStackBareVariants, propertyStackDetailVariants, propertyStackListVariants, propertyStackRowMotionVariants, propertyStackRowSelectedVariants,
  propertyStackTitleVariants, propertyStackVariants,
} from './property-stack.variants.ts';

export type PropertyStackKind = 'paint' | 'effect';

export interface PropertyItem {
  id: string;
  label: ReactNode;
  /** Plain text of the row name for the action labels when label is not a string. */
  name?: string | undefined;
  meta?: ReactNode;
  /** Draw the label as a token or hex name. */
  mono?: boolean;
  hidden?: boolean;
  /** effect: the icon in the 20px tile. paint (K2e): replaces the swatch (an upload glyph for an image fill). */
  icon?: ReactNode;
  /** paint: any CSS color or gradient (data) drawn in the swatch. */
  color?: string;
  /** paint: diagonal split for a translucent color. */
  split?: boolean;
  /** paint: checkerboard under translucent colors. */
  checker?: boolean;
  /** paint: 0-100, the row opacity field; null is mixed (a section that lists merged layers). Omitted: no field. */
  opacity?: number | null;
  /** K2e: the editor of the item, shown in a popover or inline panel (see detailMode). */
  detail?: ReactNode;
  /** K2e: accessible name of the detail panel; required with detail. */
  detailLabel?: string;
}

/** A row action label: a stem the row name is appended to ("Hide" → "Hide Linear") or a builder (n => `Hide ${n}`). */
export type PropertyStackActionLabel = string | ((name: string) => string);

/** Every accessible name and text of the part; no built-in English. */
export interface PropertyStackLabels {
  /** Names the row list ("Fill layers", "Effects"). */
  list: string;
  hide: PropertyStackActionLabel;
  show: PropertyStackActionLabel;
  remove: PropertyStackActionLabel;
  moveUp: PropertyStackActionLabel;
  moveDown: PropertyStackActionLabel;
  /** The styles button ("Styles"); used with onStylesClick. */
  styles?: string | undefined;
  /** The add button ("Add fill"); a titled stack draws the add button while it is set. */
  add?: string | undefined;
  /** Text of the mixed summary ("Mixed paints"). */
  mixedPaints?: ReactNode;
  /** The replace-all button of the mixed summary. */
  replaceAll?: string | undefined;
  /** aria-label of the row opacity field. */
  opacity?: string | undefined;
  /** Placeholder of a mixed opacity. */
  mixed?: string | undefined;
  /** K2e: name of the close button of a detail popover. */
  detailClose?: string | undefined;
}

/** What the owner is told about the opacity text of a layer. */
export interface PropertyStackDraft extends NumberFieldDraft { field: 'opacity'; id: string }
export type PropertyStackChange = { field: 'opacity'; id: string; value: number } | { field: 'visibility'; id: string; value: boolean };

export interface PropertyStackProps extends Omit<ComponentProps<'section'>, 'title' | 'children' | 'onSelect'>, CommonProps {
  /** paint: swatch lead, opacity field, actions on hover, rows 8px apart. effect: icon lead, no field, actions always, rows 4px apart. */
  kind?: PropertyStackKind | undefined;
  /** Section title ("Fill", "Fill · 3 selected"). Omitted: the bare list without a section or header. */
  title?: ReactNode;
  /** The items, top first. */
  items?: PropertyItem[] | undefined;
  /** Show the mixed summary instead of the rows. */
  mixed?: boolean | undefined;
  /** true disables every control; a record keyed by item id disables that item actions. */
  disabled?: boolean | Record<string, boolean> | undefined;
  /** live (default): the behavior before K2d. release: NumberField value model for the opacity fields. */
  commitMode?: 'live' | 'release' | undefined;
  /** true reserves the whole stack; a record keyed by item id reserves that row. */
  reserved?: boolean | Record<string, boolean> | undefined;
  labels: PropertyStackLabels;
  /** Id of the item being edited: that row is marked aria-current and drawn selected (ink inversion). */
  selected?: string | undefined;
  /** The editor of an item when items[].detail is not set. */
  detail?: ((item: PropertyItem) => ReactNode) | undefined;
  onAdd?: (() => void) | undefined;
  onStylesClick?: (() => void) | undefined;
  /** An item opacity is committed or its visibility toggled. */
  onItemChange?: ((change: { id: string; opacity?: number; hidden?: boolean }) => void) | undefined;
  onRemove?: ((id: string) => void) | undefined;
  onItemOpen?: ((id: string) => void) | undefined;
  /** A row is pressed (or Enter / Space on a focused row); the row is a tab stop while this is set. */
  onSelect?: ((id: string) => void) | undefined;
  onReplaceAll?: (() => void) | undefined;
  /** Shows the move actions; the first row cannot move up and the last cannot move down. */
  onMove?: ((move: { id: string; direction: 'up' | 'down' }) => void) | undefined;
  onDraftChange?: ((draft: PropertyStackDraft) => void) | undefined;
  onPreviewChange?: ((preview: { id: string; opacity: number } | null) => void) | undefined;
  /** K2e: item ids whose opacity field the owner marks invalid. */
  invalid?: Record<string, boolean> | undefined;
  /** K2e: item id to the id of the owner error text. */
  describedBy?: Record<string, string> | undefined;
  /** K2e: range and step of the opacity field. */
  limits?: { opacity?: { min?: number | undefined; max?: number | undefined; step?: number | undefined } | undefined } | undefined;
  /** K2e: disables the add button. */
  addDisabled?: boolean | undefined;
  /** K2e: how the detail opens (paint). An effect detail always opens inline under its row. */
  detailMode?: 'popover' | 'inline' | undefined;
  openItem?: string | null | undefined;
  defaultOpenItem?: string | null | undefined;
  onOpenItemChange?: ((id: string | null) => void) | undefined;
  /** K2e: text under the mixed summary. */
  summaryNote?: ReactNode;
  onFieldFocus?: ((event: { field: 'opacity'; id: string }) => void) | undefined;
  onFieldBlur?: ((event: { field: 'opacity'; id: string; dirty: boolean }) => void) | undefined;
  /** K2e: one item field commits, before onItemChange; return false to reject. */
  onFieldCommit?: ((change: PropertyStackChange) => boolean | void) | undefined;
}

const flagged = (flags: boolean | Record<string, boolean> | undefined, id: string) => flags === true || (typeof flags === 'object' && flags[id] === true);
const say = (label: PropertyStackActionLabel, name: string) => (typeof label === 'function' ? label(name) : name ? `${label} ${name}` : label);

/** The open inline editor under its row. It is mounted only while open (the spec's contract) and rises once when a pointer opens it. */
function InlineDetail({ id, label, instant, children }: { id: string; label?: string | undefined; instant: boolean; children: ReactNode }) {
  const [enter] = useState(() => !instant);
  return (
    <div data-slot="property-stack-detail" role="listitem" aria-label={label} data-flip-id={`detail:${id}`} className={propertyStackDetailVariants({ enter })}>
      {children}
    </div>
  );
}

/** A titled stack of inspector properties (paint layers or effects) built from StackRows, or the bare list when untitled. */
export function PropertyStack({
  kind = 'paint', title, items = [], mixed = false, disabled = false, commitMode = 'live', reserved, labels, selected, detail,
  onAdd, onStylesClick, onItemChange, onRemove, onItemOpen, onSelect, onReplaceAll,
  onMove, onDraftChange, onPreviewChange, invalid, describedBy, limits, addDisabled = false, detailMode = 'popover', openItem, defaultOpenItem = null, onOpenItemChange, summaryNote, onFieldFocus, onFieldBlur, onFieldCommit,
  tone, variant, radius, shadow, size, className, ...props
}: PropertyStackProps) {
  const contract = useFieldContract<PropertyStackChange>({ onFieldCommit });
  const [open, setOpen] = useControllableState<string | null>({ value: openItem, defaultValue: defaultOpenItem, onChange: onOpenItemChange });
  const titleId = useId();
  const bare = title === undefined || title === null;
  const effect = kind === 'effect';
  const mode = effect ? 'inline' : detailMode;
  const all = reserved === true;
  const busy = { 'aria-busy': all || undefined, 'data-reserved': all || undefined };
  // A bare stack has no box to style: tone, variant and size go to the rows (StackRow owns the row look).
  const rowLook = bare ? { tone, variant, size } : {};
  // Rows present at first render stay still; a row added later rises, and a removed one plays its exit (usePresence) before it
  // goes. The rows below an added, removed or moved row slide to their place (useFlip). A keyboard open of an effect detail is
  // instant: the keyboard sets `keys` for its commit.
  const initial = useRef<Set<string> | null>(null);
  if (initial.current === null) initial.current = new Set(items.map(item => item.id));
  const { entries: stackRows, exited } = usePresence(items, item => item.id);
  const listRef = useRef<HTMLDivElement>(null);
  const [keys, setKeys] = useState(false);
  useFlip(listRef, '[data-slot="property-stack-row"], [data-slot="property-stack-detail"]', 'flipId', !keys);
  useLayoutEffect(() => { if (keys) setKeys(false); }, [keys]);

  const list = stackRows.length > 0 ? (
    <div ref={listRef} data-slot="property-stack-list" role="list" aria-label={labels.list} className={cn(propertyStackListVariants({ kind, bare, size }))}>
      {stackRows.map(({ key, item, present }) => {
        // A leaving row keeps its last look and takes no input: it is inert and hidden from the accessibility tree while it exits.
        const index = present ? items.indexOf(item) : -1;
        const name = item.name ?? (typeof item.label === 'string' ? item.label : '');
        const off = flagged(disabled, item.id);
        const held = flagged(reserved, item.id);
        const opacityKey = `opacity:${item.id}`;
        const bad = invalid?.[item.id] === true || contract.isInvalid(opacityKey);
        const body = item.detail ?? detail?.(item);
        const opened = present && open === item.id && body != null;
        const current = selected === item.id || (effect && opened);
        // An effect row opens its editor when pressed; a paint layer opens it from the swatch.
        const choose = () => { onSelect?.(item.id); if (effect && body != null && !off) setOpen(opened ? null : item.id); };
        const interactive = onSelect != null || (effect && body != null);
        const press = () => { if (!off && !held) onItemOpen?.(item.id); };
        const well = effect ? item.icon : item.icon != null ? (
          <IconButton size="xs" label={`${name || 'Paint'} color`} onClick={press}>{item.icon}</IconButton>
        ) : (
          <ColorWell
            size="sm" color={item.color} split={item.split} appearance={item.checker ? 'checker' : 'flat'}
            aria-label={`${name || 'Paint'} color`} onClick={press}
          />
        );
        const row = (
          <StackRow
            data-slot="property-stack-row" data-flip-id={`row:${item.id}`} role="listitem" {...rowLook}
            data-state={present ? undefined : 'closed'} inert={!present || undefined} aria-hidden={!present || undefined}
            onAnimationEnd={e => { if (!present && e.target === e.currentTarget) exited(key); }}
            data-invalid={bad || undefined} data-field={effect ? undefined : 'opacity'}
            lead={effect ? 'icon' : 'swatch'} actions={effect ? 'always' : 'hover'}
            mono={item.mono} title={item.label} meta={item.meta} hidden={item.hidden} disabled={off} reserved={held}
            hideLabel={say(labels.hide, name)} showLabel={say(labels.show, name)} removeLabel={say(labels.remove, name)}
            {...(onMove ? {
              moveUpLabel: say(labels.moveUp, name), moveDownLabel: say(labels.moveDown, name),
              onMoveUp: () => onMove({ id: item.id, direction: 'up' }), onMoveDown: () => onMove({ id: item.id, direction: 'down' }),
              moveUpDisabled: index === 0, moveDownDisabled: index === items.length - 1,
            } : {})}
            leading={!effect && body != null && mode === 'popover' ? (
              <Popover
                open={opened} onOpenChange={next => { if (!off && !held) setOpen(next ? item.id : null); }} side="left" align="center" aria-label={item.detailLabel}
                anchor={well}
              >
                <div className="flex justify-end">
                  <IconButton size="xs" label={labels.detailClose ?? ''} onClick={() => setOpen(null)}><X /></IconButton>
                </div>
                {body}
              </Popover>
            ) : !effect && body != null && mode === 'inline' ? (
              <span className="contents" onClickCapture={() => { if (!off && !held) setOpen(opened ? null : item.id); }}>{well}</span>
            ) : well}
            control={!effect && item.opacity !== undefined ? (
              <NumberField
                aria-label={labels.opacity} unit="%" min={0} max={100} disabled={off} reserved={held} commitMode={commitMode}
                {...limits?.opacity}
                value={item.opacity} mixed={item.opacity === null} mixedLabel={labels.mixed} containerClassName="w-field-alpha-w"
                invalid={bad} aria-describedby={describedBy?.[item.id]} data-field="opacity" data-dirty={contract.isDirty(opacityKey) || undefined}
                onFocus={() => { if (!off && !held) onFieldFocus?.({ field: 'opacity', id: item.id }); }}
                onScrubStart={() => { if (!off && !held) onFieldFocus?.({ field: 'opacity', id: item.id }); }}
                onBlur={() => { if (!off && !held) queueMicrotask(() => onFieldBlur?.({ field: 'opacity', id: item.id, dirty: contract.dirtyNow(opacityKey) })); }}
                onValueChange={opacity => { contract.commit(opacityKey, { field: 'opacity', id: item.id, value: opacity }, () => onItemChange?.({ id: item.id, opacity })); }}
                onDraftChange={d => { contract.draft(opacityKey, d); onDraftChange?.({ ...d, field: 'opacity', id: item.id }); }}
                onPreviewChange={v => onPreviewChange?.(v === null ? null : { id: item.id, opacity: v })}
              />
            ) : undefined}
            onHiddenChange={hidden => { contract.commit(`visibility:${item.id}`, { field: 'visibility', id: item.id, value: hidden }, () => onItemChange?.({ id: item.id, hidden })); }}
            onRemove={() => onRemove?.(item.id)}
            aria-current={current || undefined}
            onClick={(e: MouseEvent<HTMLDivElement>) => { if (!(e.target as HTMLElement).closest('button, input')) choose(); }}
            className={cn(interactive && 'outline-none focus-visible:shadow-focus', current && propertyStackRowSelectedVariants(), propertyStackRowMotionVariants({ enter: initial.current?.has(item.id) !== true, leaving: !present }))}
            {...(interactive ? {
              tabIndex: 0,
              onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
                if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
                e.preventDefault();
                if (effect && body != null) setKeys(true);
                choose();
              },
            } : {})}
          />
        );
        // The row and its detail share one keyed fragment, so opening a detail does not remount the row (focus stays on it).
        return (
          <Fragment key={key}>
            {row}
            {mode === 'inline' && opened ? <InlineDetail id={item.id} label={item.detailLabel} instant={keys}>{body}</InlineDetail> : null}
          </Fragment>
        );
      })}
    </div>
  ) : null;

  const summary = mixed ? (
    <>
      <div data-slot="property-stack-summary" className="flex items-center justify-between gap-2 rounded-md bg-bg-inset px-2 py-1.5 text-ui-sm font-normal text-text-primary">
        <span data-slot="property-stack-summary-label" className="flex items-center gap-2">
          <ColorWell size="sm" mixed />
          {labels.mixedPaints}
        </span>
        <Button data-slot="property-stack-replace" tone="ghost" size="xs" disabled={disabled === true} {...busy} onClick={() => { if (!all) onReplaceAll?.(); }}>{labels.replaceAll}</Button>
      </div>
      {summaryNote != null && <p data-slot="property-stack-note" className="m-0 text-hint text-text-tertiary">{summaryNote}</p>}
    </>
  ) : null;

  if (bare) {
    return (
      <div data-slot="property-stack" data-kind={kind} className={cn(propertyStackBareVariants({ radius, shadow }), className)} {...busy} {...(props as ComponentProps<'div'>)}>
        {summary ?? list}
      </div>
    );
  }
  return (
    <InspectorSection
      data-slot="property-stack" data-kind={kind} role="group" aria-labelledby={titleId}
      className={cn(propertyStackVariants({ tone, variant, radius, shadow, size }), className)} {...busy} {...props}
    >
      <div data-slot="property-stack-header" className="flex items-center justify-between text-hint font-semibold text-text-secondary">
        <span data-slot="property-stack-title" id={titleId} className={propertyStackTitleVariants()}>{title}</span>
        {mixed || (onStylesClick == null && labels.add == null) ? null : (
          <span data-slot="property-stack-actions" className="flex items-center gap-0.5">
            {onStylesClick && <IconButton data-slot="property-stack-styles" size="xs" label={labels.styles ?? ''} disabled={disabled === true} {...busy} onClick={() => { if (!all) onStylesClick(); }}><Grid2x2 /></IconButton>}
            {labels.add != null && <IconButton data-slot="property-stack-add" size="xs" label={labels.add} disabled={disabled === true || addDisabled} {...busy} onClick={() => { if (!all) onAdd?.(); }}><Plus /></IconButton>}
          </span>
        )}
      </div>
      {summary ?? list}
    </InspectorSection>
  );
}
