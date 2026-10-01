'use client';
import { Grid2x2, Plus } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import { ColorWell } from '../color-well/color-well.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { InspectorSection } from '../inspector-panel/inspector-panel.tsx';
import { NumberField } from '../number-field/number-field.tsx';
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
  /** 0-100. */
  opacity: number;
  hidden?: boolean;
  /** Checkerboard under translucent colors. */
  checker?: boolean;
}

export interface PaintStackProps extends Omit<ComponentProps<'section'>, 'title' | 'children'> {
  title?: ReactNode;
  /** The layers, top first. */
  items?: PaintItem[];
  /** Show the mixed summary instead of the rows. */
  mixed?: boolean;
  disabled?: boolean;
  onAdd?: () => void;
  onStylesClick?: () => void;
  onItemChange?: (change: { id: string; opacity?: number; hidden?: boolean }) => void;
  onRemove?: (id: string) => void;
  onItemOpen?: (id: string) => void;
  onReplaceAll?: () => void;
}

const text = (n: ReactNode, fallback: string) => (typeof n === 'string' ? n : fallback);

/** The Fill section of the inspector: a titled stack of paint layers with opacity and visibility. */
export function PaintStack({
  title = 'Fill', items = [], mixed = false, disabled = false, onAdd, onStylesClick, onItemChange, onRemove, onItemOpen, onReplaceAll, className, ...props
}: PaintStackProps) {
  const titleId = useId();
  return (
    <InspectorSection data-slot="paint-stack" role="group" aria-labelledby={titleId} className={cn(className)} {...props}>
      <div data-slot="paint-stack-header" className="flex items-center justify-between text-hint font-semibold text-text-secondary">
        <span data-slot="paint-stack-title" id={titleId} className="text-hint font-semibold text-text-secondary">{title}</span>
        {mixed ? null : (
          <span data-slot="paint-stack-actions" className="flex items-center gap-0.5">
            <IconButton data-slot="paint-stack-styles" size="xs" label="Styles" disabled={disabled} onClick={() => onStylesClick?.()}><Grid2x2 /></IconButton>
            <IconButton data-slot="paint-stack-add" size="xs" label="Add fill" disabled={disabled} onClick={() => onAdd?.()}><Plus /></IconButton>
          </span>
        )}
      </div>
      {mixed ? (
        <div data-slot="paint-stack-summary" className="flex items-center justify-between gap-2 rounded-md bg-bg-inset px-2 py-1.5 text-ui-sm font-normal text-text-primary">
          <span data-slot="paint-stack-summary-label" className="flex items-center gap-2">
            <ColorWell size="sm" mixed />
            Mixed paints
          </span>
          <Button data-slot="paint-stack-replace" tone="ghost" size="xs" disabled={disabled} onClick={() => onReplaceAll?.()}>Replace all</Button>
        </div>
      ) : items.length > 0 ? (
        <div role="list" className="grid gap-2">
          {items.map(item => (
            <StackRow
              key={item.id} data-slot="paint-stack-row" role="listitem"
              lead="swatch" mono={item.mono} title={item.label} meta={item.meta} hidden={item.hidden} disabled={disabled}
              actionLabel={typeof item.label === 'string' ? item.label : undefined}
              leading={(
                <ColorWell
                  size="sm" color={item.color} split={item.split} appearance={item.checker ? 'checker' : 'flat'}
                  aria-label={`${text(item.label, 'Paint')} color`} onClick={() => { if (!disabled) onItemOpen?.(item.id); }}
                />
              )}
              control={(
                <NumberField
                  aria-label="Opacity" unit="%" min={0} max={100} locked={disabled} value={item.opacity} containerClassName="w-field-alpha-w"
                  onValueChange={opacity => onItemChange?.({ id: item.id, opacity })}
                />
              )}
              onHiddenChange={hidden => onItemChange?.({ id: item.id, hidden })}
              onRemove={() => onRemove?.(item.id)}
            />
          ))}
        </div>
      ) : null}
    </InspectorSection>
  );
}
