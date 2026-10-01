'use client';
import { createContext, useContext, useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { optionTilesCaptionVariants, optionTilesIconVariants, optionTilesItemVariants, optionTilesVariants } from './option-tiles.variants.ts';

type Layout = 'caption' | 'icon';
type Columns = '3' | '4' | '5';

interface Ctx { value: string; select: (id: string) => void; layout: Layout }
const TilesCtx = createContext<Ctx | null>(null);

export interface OptionTilesProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Accessible name of the group. */
  'aria-label': string;
  value?: string;
  defaultValue?: string;
  /** A different option is chosen. */
  onValueChange?: (id: string) => void;
  /** caption = name over a caption (54px tiles); icon = glyph over a name (62px tiles). */
  layout?: Layout;
  columns?: Columns;
}

/** Picks one option from a small grid of equal tiles. A radio group of buttons with roving tabindex. */
export function OptionTiles({ value, defaultValue = '', onValueChange, layout = 'caption', columns = '4', className, onKeyDown, ...props }: OptionTilesProps) {
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const ref = useRef<HTMLDivElement>(null);
  // Arrow keys choose the tile they move to, so the selection never lags behind roving focus.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [])];
    if (!items.length) return;
    const i = items.findIndex(el => el === document.activeElement);
    const next = items[(i + step + items.length) % items.length];
    e.preventDefault();
    next?.focus();
    if (next?.dataset.itemId !== undefined) setCurrent(next.dataset.itemId);
  };
  return (
    <TilesCtx.Provider value={{ value: current, select: setCurrent, layout }}>
      <div
        ref={ref} role="radiogroup" data-slot="option-tiles" data-layout={layout} data-columns={columns}
        className={cn(optionTilesVariants({ columns }), className)} onKeyDown={handleKeyDown} {...props}
      />
    </TilesCtx.Provider>
  );
}

export interface OptionTilesItemProps extends Omit<ComponentProps<'button'>, 'value' | 'children'> {
  /** Identity of the option (the radio value). */
  itemId: string;
  /** Option name. */
  label: ReactNode;
  /** Short qualifier (caption layout). */
  caption?: ReactNode;
  /** Glyph (icon layout). */
  icon?: ReactNode;
  /** State hook for fixtures; normally derived from value. */
  checked?: boolean;
}

export function OptionTilesItem({ itemId, label, caption, icon, checked, disabled, className, onClick, ...props }: OptionTilesItemProps) {
  const ctx = useContext(TilesCtx);
  const selected = checked ?? ctx?.value === itemId;
  return (
    <button
      type="button" role="radio" data-slot="option-tiles-item" data-item-id={itemId} data-state={selected ? 'checked' : 'unchecked'}
      aria-checked={selected} tabIndex={selected || !ctx?.value ? 0 : -1} disabled={disabled}
      className={cn(optionTilesItemVariants({ layout: ctx?.layout }), className)}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) ctx?.select(itemId); }}
      {...props}
    >
      {icon != null && <span data-slot="option-tiles-icon" aria-hidden="true" className={optionTilesIconVariants()}>{icon}</span>}
      <span data-slot="option-tiles-label">{label}</span>
      {caption != null && <span data-slot="option-tiles-caption" className={optionTilesCaptionVariants()}>{caption}</span>}
    </button>
  );
}
