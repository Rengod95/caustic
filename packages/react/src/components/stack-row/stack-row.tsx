'use client';
import { ChevronDown, ChevronUp, Eye, EyeOff, Minus } from '../../icons/index.ts';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import {
  stackRowActionsVariants, stackRowLeadVariants, stackRowLabelVariants, stackRowMetaVariants, stackRowTitleVariants, stackRowVariants,
} from './stack-row.variants.ts';

export interface StackRowProps extends Omit<ComponentProps<'div'>, 'title' | 'hidden'>, CommonProps {
  /** When the actions are visible. */
  actions?: 'hover' | 'always';
  /** Kind of the leading element. */
  lead?: 'swatch' | 'icon';
  /** lead swatch: a ColorWell sm. lead icon: the icon drawn inside the tile. */
  leading?: ReactNode;
  /** Row name. */
  title: ReactNode;
  /** Draw the title in mono (token paths and hex). */
  mono?: boolean | undefined;
  /** Quiet detail after the title. */
  meta?: ReactNode;
  /** Compact field in the third column. */
  control?: ReactNode;
  /** The layer is hidden: name, detail and icon take the disabled colour, and the visibility action shows eye-off. */
  hidden?: boolean | undefined;
  /** Accessible-name suffix for the actions ("Hide" + suffix), e.g. the row name as text. */
  actionLabel?: string | undefined;
  disabled?: boolean;
  /** aria-label stem of the visibility action while visible (e.g. "Hide"). */
  hideLabel: string;
  /** aria-label stem while hidden (e.g. "Show"). */
  showLabel: string;
  /** aria-label stem of the remove action (e.g. "Remove"). */
  removeLabel: string;
  /** aria-label stem of the move-up action; required whenever onMoveUp is given. */
  moveUpLabel?: string | undefined;
  /** aria-label stem of the move-down action; required whenever onMoveDown is given. */
  moveDownLabel?: string | undefined;
  /** Shows the move-up action before the visibility action. */
  onMoveUp?: (() => void) | undefined;
  /** Shows the move-down action after the move-up action. */
  onMoveDown?: (() => void) | undefined;
  /** The row is the first one: move-up is disabled, not removed. */
  moveUpDisabled?: boolean | undefined;
  /** The row is the last one: move-down is disabled. */
  moveDownDisabled?: boolean | undefined;
  /** The row is being written or held elsewhere: every action is inert and aria-busy. */
  reserved?: boolean | undefined;
  onHiddenChange?: (hidden: boolean) => void;
  onRemove?: () => void;
}

/** One line of a paint or effect stack: leading swatch or icon, name and detail, optional compact field, visibility and remove. */
export function StackRow({
  actions = 'hover', lead = 'swatch', leading, title, mono = false, meta, control, hidden = false, actionLabel, disabled = false,
  hideLabel, showLabel, removeLabel, moveUpLabel, moveDownLabel, onMoveUp, onMoveDown, moveUpDisabled = false, moveDownDisabled = false, reserved = false,
  onHiddenChange, onRemove, tone, variant, radius, shadow, size, className, ...props
}: StackRowProps) {
  const suffix = actionLabel ? ` ${actionLabel}` : '';
  const busy = { 'aria-busy': reserved || undefined, 'data-reserved': reserved || undefined };
  const pressable = props.onClick !== undefined && !disabled && !reserved;
  return (
    <div
      data-slot="stack-row"
      data-lead={lead}
      data-actions={actions}
      data-state={hidden ? 'hidden' : undefined}
      aria-busy={reserved || undefined}
      data-reserved={reserved || undefined}
      className={cn(stackRowVariants({ tone, variant, size, radius: radius ?? null, shadow: shadow ?? null, pressable }), className)}
      {...props}
    >
      {lead === 'icon' ? (
        <span data-slot="stack-row-icon" aria-hidden className={stackRowLeadVariants({ lead })}>{leading}</span>
      ) : leading !== undefined && leading !== null ? (
        <span data-slot="stack-row-leading" className={stackRowLeadVariants({ lead })}>{leading}</span>
      ) : <span aria-hidden />}
      <span data-slot="stack-row-label" className={stackRowLabelVariants({ size })}>
        <span data-slot="stack-row-title" className={stackRowTitleVariants({ mono, size })}>{title}</span>
        {meta !== undefined && meta !== null ? <span data-slot="stack-row-meta" className={stackRowMetaVariants()}>{meta}</span> : null}
      </span>
      {control !== undefined && control !== null ? <span data-slot="stack-row-control" className="inline-flex">{control}</span> : <span aria-hidden />}
      <span data-slot="stack-row-actions" className={cn(stackRowActionsVariants({ actions, pinned: hidden }))}>
        {onMoveUp ? (
          <IconButton
            data-slot="stack-row-move-up" size="xs" disabled={disabled} label={`${moveUpLabel ?? ''}${suffix}`}
            aria-disabled={moveUpDisabled || undefined} className="aria-disabled:pointer-events-none aria-disabled:text-disabled-text" {...busy}
            onClick={() => { if (!moveUpDisabled && !reserved) onMoveUp(); }}
          >
            <ChevronUp />
          </IconButton>
        ) : null}
        {onMoveDown ? (
          <IconButton
            data-slot="stack-row-move-down" size="xs" disabled={disabled} label={`${moveDownLabel ?? ''}${suffix}`}
            aria-disabled={moveDownDisabled || undefined} className="aria-disabled:pointer-events-none aria-disabled:text-disabled-text" {...busy}
            onClick={() => { if (!moveDownDisabled && !reserved) onMoveDown(); }}
          >
            <ChevronDown />
          </IconButton>
        ) : null}
        <IconButton
          data-slot="stack-row-visibility" size="xs" disabled={disabled} {...busy}
          label={`${hidden ? showLabel : hideLabel}${suffix}`}
          onClick={() => { if (!reserved) onHiddenChange?.(!hidden); }}
        >
          {hidden ? <EyeOff /> : <Eye />}
        </IconButton>
        <IconButton data-slot="stack-row-remove" size="xs" disabled={disabled} {...busy} label={`${removeLabel}${suffix}`} onClick={() => { if (!reserved) onRemove?.(); }}>
          <Minus />
        </IconButton>
      </span>
    </div>
  );
}
