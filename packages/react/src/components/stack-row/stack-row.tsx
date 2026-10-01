'use client';
import { Eye, EyeOff, Minus } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import {
  stackRowActionsVariants, stackRowLeadVariants, stackRowLabelVariants, stackRowMetaVariants, stackRowTitleVariants, stackRowVariants,
} from './stack-row.variants.ts';

export interface StackRowProps extends Omit<ComponentProps<'div'>, 'title' | 'hidden'> {
  /** When the actions are visible. */
  actions?: 'hover' | 'always';
  /** Kind of the leading element. */
  lead?: 'swatch' | 'icon';
  /** lead swatch: a ColorWell sm. lead icon: the lucide icon drawn inside the tile. */
  leading?: ReactNode;
  /** Row name. */
  title: ReactNode;
  /** Draw the title in mono (token paths and hex). */
  mono?: boolean;
  /** Quiet detail after the title. */
  meta?: ReactNode;
  /** Compact field in the third column. */
  control?: ReactNode;
  /** The layer is hidden: dimmed, and the visibility action shows eye-off. */
  hidden?: boolean;
  /** Accessible-name suffix for the actions ("Hide" + suffix), e.g. the row name as text. */
  actionLabel?: string;
  disabled?: boolean;
  onHiddenChange?: (hidden: boolean) => void;
  onRemove?: () => void;
}

/** One line of a paint or effect stack: leading swatch or icon, name and detail, optional compact field, visibility and remove. */
export function StackRow({
  actions = 'hover', lead = 'swatch', leading, title, mono = false, meta, control, hidden = false, actionLabel, disabled = false,
  onHiddenChange, onRemove, className, ...props
}: StackRowProps) {
  const suffix = actionLabel ? ` ${actionLabel}` : '';
  return (
    <div
      data-slot="stack-row"
      data-lead={lead}
      data-actions={actions}
      data-state={hidden ? 'hidden' : undefined}
      className={cn(stackRowVariants({ hidden }), className)}
      {...props}
    >
      {lead === 'icon' ? (
        <span data-slot="stack-row-icon" aria-hidden className={stackRowLeadVariants({ lead })}>{leading}</span>
      ) : leading !== undefined && leading !== null ? (
        <span data-slot="stack-row-leading" className={stackRowLeadVariants({ lead })}>{leading}</span>
      ) : <span aria-hidden />}
      <span data-slot="stack-row-label" className={stackRowLabelVariants()}>
        <span data-slot="stack-row-title" className={stackRowTitleVariants({ mono })}>{title}</span>
        {meta !== undefined && meta !== null ? <span data-slot="stack-row-meta" className={stackRowMetaVariants()}>{meta}</span> : null}
      </span>
      {control !== undefined && control !== null ? <span data-slot="stack-row-control" className="inline-flex">{control}</span> : <span aria-hidden />}
      <span data-slot="stack-row-actions" className={stackRowActionsVariants({ actions, pinned: hidden })}>
        <IconButton
          data-slot="stack-row-visibility" size="xs" disabled={disabled}
          label={`${hidden ? 'Show' : 'Hide'}${suffix}`}
          onClick={() => onHiddenChange?.(!hidden)}
        >
          {hidden ? <EyeOff /> : <Eye />}
        </IconButton>
        <IconButton data-slot="stack-row-remove" size="xs" disabled={disabled} label={`Remove${suffix}`} onClick={() => onRemove?.()}>
          <Minus />
        </IconButton>
      </span>
    </div>
  );
}
