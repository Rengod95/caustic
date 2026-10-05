'use client';
import { Grid2x2, Plus, X } from 'lucide-react';
import { Fragment, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContract } from '../../hooks/use-field-contract.ts';
import { Button } from '../button/button.tsx';
import { ColorWell } from '../color-well/color-well.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { InspectorSection } from '../inspector-panel/inspector-panel.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { Popover } from '../popover/popover.tsx';
import { StackRow } from '../stack-row/stack-row.tsx';

export interface PaintItem {
  id: string;
  /** Any CSS color or gradient (data). */
  color: string;
  /** Diagonal split for a translucent color. */
  split?: boolean;
  label: ReactNode;
  meta?: ReactNode;
  /** Draw the label as a token or hex name. */
  mono?: boolean;
  /** 0-100. null is mixed (a section that lists merged layers). */
  opacity: number | null;
  hidden?: boolean;
  /** Checkerboard under translucent colors. */
  checker?: boolean;
  /** K2e: replaces the swatch (an upload glyph for an image fill). */
  icon?: ReactNode;
  /** K2e: the editor of the layer, shown in a popover or inline panel (see detailMode). */
  detail?: ReactNode;
  /** K2e: accessible name of the detail panel; required with detail. */
  detailLabel?: string;
}

/** Every accessible name and text of the part; no built-in English. */
export interface PaintStackLabels {
  /** Names the layer list ("Fill layers"). */
  list: string;
  /** The styles button ("Styles"). */
  styles: string;
  /** The add button ("Add fill"). */
  add: string;
  /** Text of the mixed summary ("Mixed paints"). */
  mixedPaints: ReactNode;
  /** The replace-all button of the mixed summary. */
  replaceAll: string;
  /** Stems of the row actions; the row name is appended. */
  hide: string;
  show: string;
  remove: string;
  moveUp: string;
  moveDown: string;
  /** aria-label of the row opacity field. */
  opacity: string;
  /** K2e: name of the close button of a detail popover. */
  detailClose?: string | undefined;
  /** Placeholder of a mixed opacity. */
  mixed: string;
}

/** What the owner is told about the opacity text of a layer. */
export interface PaintStackDraft extends NumberFieldDraft { field: 'opacity'; id: string }
export type PaintStackChange = { field: 'opacity'; id: string; value: number } | { field: 'visibility'; id: string; value: boolean };

export interface PaintStackProps extends Omit<ComponentProps<'section'>, 'title' | 'children'> {
  /** Section title ("Fill", "Fill · 3 selected"). */
  title: ReactNode;
  /** The layers, top first. */
  items?: PaintItem[] | undefined;
  /** Show the mixed summary instead of the rows. */
  mixed?: boolean | undefined;
  /** true disables every control; a record keyed by layer id disables that layer actions. */
  disabled?: boolean | Record<string, boolean> | undefined;
  /** live (default): the behavior before K2d. release: NumberField value model for the opacity fields. */
  commitMode?: 'live' | 'release' | undefined;
  /** true reserves the whole stack; a record keyed by layer id reserves that row. */
  reserved?: boolean | Record<string, boolean> | undefined;
  labels: PaintStackLabels;
  onAdd?: (() => void) | undefined;
  onStylesClick?: (() => void) | undefined;
  /** A layer opacity is committed or its visibility toggled. */
  onItemChange?: ((change: { id: string; opacity?: number; hidden?: boolean }) => void) | undefined;
  onRemove?: ((id: string) => void) | undefined;
  onItemOpen?: ((id: string) => void) | undefined;
  onReplaceAll?: (() => void) | undefined;
  /** Shows the move actions; the first row cannot move up and the last cannot move down. */
  onMove?: ((move: { id: string; direction: 'up' | 'down' }) => void) | undefined;
  onDraftChange?: ((draft: PaintStackDraft) => void) | undefined;
  onPreviewChange?: ((preview: { id: string; opacity: number } | null) => void) | undefined;
  /** K2e: layer ids whose opacity field the owner marks invalid. */
  invalid?: Record<string, boolean> | undefined;
  /** K2e: layer id to the id of the owner error text. */
  describedBy?: Record<string, string> | undefined;
  /** K2e: range and step of the opacity field. */
  limits?: { opacity?: { min?: number | undefined; max?: number | undefined; step?: number | undefined } | undefined } | undefined;
  /** K2e: disables the add button. */
  addDisabled?: boolean | undefined;
  /** K2e: how items[].detail opens. */
  detailMode?: 'popover' | 'inline' | undefined;
  openItem?: string | null | undefined;
  defaultOpenItem?: string | null | undefined;
  onOpenItemChange?: ((id: string | null) => void) | undefined;
  /** K2e: text under the mixed summary. */
  summaryNote?: ReactNode;
  onFieldFocus?: ((event: { field: 'opacity'; id: string }) => void) | undefined;
  onFieldBlur?: ((event: { field: 'opacity'; id: string; dirty: boolean }) => void) | undefined;
  /** K2e: one layer field commits, before onItemChange; return false to reject. */
  onFieldCommit?: ((change: PaintStackChange) => boolean | void) | undefined;
}

const text = (n: ReactNode, fallback: string) => (typeof n === 'string' ? n : fallback);
const flagged = (flags: boolean | Record<string, boolean> | undefined, id: string) => flags === true || (typeof flags === 'object' && flags[id] === true);

/** The Fill section of the inspector: a titled stack of paint layers with opacity and visibility. */
export function PaintStack({
  title, items = [], mixed = false, disabled = false, commitMode = 'live', reserved, labels, onAdd, onStylesClick, onItemChange, onRemove, onItemOpen, onReplaceAll,
  onMove, onDraftChange, onPreviewChange, invalid, describedBy, limits, addDisabled = false, detailMode = 'popover', openItem, defaultOpenItem = null, onOpenItemChange, summaryNote, onFieldFocus, onFieldBlur, onFieldCommit, className, ...props
}: PaintStackProps) {
  const contract = useFieldContract<PaintStackChange>({ onFieldCommit });
  const [open, setOpen] = useControllableState<string | null>({ value: openItem, defaultValue: defaultOpenItem, onChange: onOpenItemChange });
  const titleId = useId();
  const all = reserved === true;
  const busy = { 'aria-busy': all || undefined, 'data-reserved': all || undefined };
  return (
    <InspectorSection data-slot="paint-stack" role="group" aria-labelledby={titleId} className={cn(className)} {...busy} {...props}>
      <div data-slot="paint-stack-header" className="flex items-center justify-between text-hint font-semibold text-text-secondary">
        <span data-slot="paint-stack-title" id={titleId} className="text-hint font-semibold text-text-secondary">{title}</span>
        {mixed ? null : (
          <span data-slot="paint-stack-actions" className="flex items-center gap-0.5">
            {onStylesClick && <IconButton data-slot="paint-stack-styles" size="xs" label={labels.styles} disabled={disabled === true} {...busy} onClick={() => { if (!all) onStylesClick(); }}><Grid2x2 /></IconButton>}
            <IconButton data-slot="paint-stack-add" size="xs" label={labels.add} disabled={disabled === true || addDisabled} {...busy} onClick={() => { if (!all) onAdd?.(); }}><Plus /></IconButton>
          </span>
        )}
      </div>
      {mixed ? (
        <>
        <div data-slot="paint-stack-summary" className="flex items-center justify-between gap-2 rounded-md bg-bg-inset px-2 py-1.5 text-ui-sm font-normal text-text-primary">
          <span data-slot="paint-stack-summary-label" className="flex items-center gap-2">
            <ColorWell size="sm" mixed />
            {labels.mixedPaints}
          </span>
          <Button data-slot="paint-stack-replace" tone="ghost" size="xs" disabled={disabled === true} {...busy} onClick={() => { if (!all) onReplaceAll?.(); }}>{labels.replaceAll}</Button>
        </div>
        {summaryNote != null && <p className="m-0 text-hint text-text-tertiary">{summaryNote}</p>}
        </>
      ) : items.length > 0 ? (
        <div role="list" aria-label={labels.list} className="grid gap-2">
          {items.map((item, index) => {
            const off = flagged(disabled, item.id);
            const held = flagged(reserved, item.id);
            const opacityKey = `opacity:${item.id}`;
            const bad = invalid?.[item.id] === true || contract.isInvalid(opacityKey);
            const opened = open === item.id && item.detail != null;
            const press = () => { if (!off && !held) onItemOpen?.(item.id); };
            const well = item.icon != null ? (
              <IconButton size="xs" label={`${text(item.label, 'Paint')} color`} onClick={press}>{item.icon}</IconButton>
            ) : (
              <ColorWell
                size="sm" color={item.color} split={item.split} appearance={item.checker ? 'checker' : 'flat'}
                aria-label={`${text(item.label, 'Paint')} color`} onClick={press}
              />
            );
            const row = (
              <StackRow
                key={item.id} data-slot="paint-stack-row" role="listitem"
                data-invalid={bad || undefined} data-field="opacity"
                lead="swatch" mono={item.mono} title={item.label} meta={item.meta} hidden={item.hidden} disabled={off} reserved={held}
                actionLabel={typeof item.label === 'string' ? item.label : undefined}
                hideLabel={labels.hide} showLabel={labels.show} removeLabel={labels.remove}
                moveUpLabel={onMove ? labels.moveUp : undefined} moveDownLabel={onMove ? labels.moveDown : undefined}
                onMoveUp={onMove ? () => onMove({ id: item.id, direction: 'up' }) : undefined}
                onMoveDown={onMove ? () => onMove({ id: item.id, direction: 'down' }) : undefined}
                moveUpDisabled={index === 0} moveDownDisabled={index === items.length - 1}
                leading={item.detail != null && detailMode === 'popover' ? (
                  <Popover
                    open={opened} onOpenChange={next => { if (!off && !held) setOpen(next ? item.id : null); }} side="left" align="center" aria-label={item.detailLabel}
                    anchor={well}
                  >
                    <div className="flex justify-end">
                      <IconButton size="xs" label={labels.detailClose ?? ''} onClick={() => setOpen(null)}><X /></IconButton>
                    </div>
                    {item.detail}
                  </Popover>
                ) : item.detail != null && detailMode === 'inline' ? (
                  <span className="contents" onClickCapture={() => { if (!off && !held) setOpen(opened ? null : item.id); }}>{well}</span>
                ) : well}
                control={(
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
                )}
                onHiddenChange={hidden => { contract.commit(`visibility:${item.id}`, { field: 'visibility', id: item.id, value: hidden }, () => onItemChange?.({ id: item.id, hidden })); }}
                onRemove={() => onRemove?.(item.id)}
              />
            );
            return detailMode === 'inline' && opened ? (
              <Fragment key={item.id}>
                {row}
                <div data-slot="paint-stack-detail" role="listitem" aria-label={item.detailLabel} className="grid gap-2">{item.detail}</div>
              </Fragment>
            ) : row;
          })}
        </div>
      ) : null}
    </InspectorSection>
  );
}
