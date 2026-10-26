'use client';
import * as R from '@radix-ui/react-radio-group';
import { Check } from 'lucide-react';
import { createContext, useContext, useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { choiceCardIndicator, choiceCardItem, choiceCardsRoot } from './choice-cards.variants.ts';

type CardType = 'single' | 'multiple';
interface Ctx { type: CardType; value: string | string[]; select: (v: string) => void; disabled: boolean }
const CardsCtx = createContext<Ctx>({ type: 'single', value: '', select: () => {}, disabled: false });

export interface ChoiceCardsProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** single = radio cards; multiple = checkbox cards. */
  type?: CardType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
}

/** Whole-card options that behave as a radio group (single) or a checkbox group (multiple). */
export function ChoiceCards({ type = 'single', value, defaultValue, onValueChange, disabled = false, className, onKeyDown, children, ...props }: ChoiceCardsProps) {
  const [current, setCurrent] = useControllableState<string | string[]>({ value, defaultValue: defaultValue ?? (type === 'single' ? '' : []), onChange: onValueChange });
  const ref = useRef<HTMLDivElement>(null);
  const select = (v: string) => {
    if (type === 'single') setCurrent(v);
    else { const list = Array.isArray(current) ? current : []; setCurrent(list.includes(v) ? list.filter(x => x !== v) : [...list, v]); }
  };
  const ctx = { type, value: current, select, disabled };
  const root = cn(choiceCardsRoot(), className);
  if (type === 'multiple') {
    return (
      <CardsCtx.Provider value={ctx}>
        <div data-slot="choice-cards" data-type="multiple" role="group" aria-disabled={disabled || undefined} className={root} onKeyDown={onKeyDown} {...props}>{children}</div>
      </CardsCtx.Provider>
    );
  }
  // Arrow keys select synchronously so the selection never lags behind roving focus.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step || disabled) return;
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [])];
    if (!items.length) return;
    const i = items.findIndex(el => el === document.activeElement);
    const next = items[(i + step + items.length) % items.length];
    e.preventDefault();
    next?.focus();
    if (next?.dataset.value !== undefined) setCurrent(next.dataset.value);
  };
  return (
    <CardsCtx.Provider value={ctx}>
      <R.Root ref={ref} data-slot="choice-cards" data-type="single" value={current as string} onValueChange={v => setCurrent(v)} disabled={disabled} className={root} onKeyDown={handleKeyDown} {...(props as ComponentProps<typeof R.Root>)}>
        {children}
      </R.Root>
    </CardsCtx.Provider>
  );
}

export interface ChoiceCardsItemProps extends Omit<ComponentProps<'button'>, 'value' | 'title' | 'children'> {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  /** Large figure on its own row. */
  price?: ReactNode;
  /** Unit after the figure, e.g. " / month". */
  priceUnit?: ReactNode;
}

export function ChoiceCardsItem({ value, title, description, price, priceUnit, disabled, className, onClick, ...props }: ChoiceCardsItemProps) {
  const ctx = useContext(CardsCtx);
  const multiple = ctx.type === 'multiple';
  const checked = multiple ? Array.isArray(ctx.value) && ctx.value.includes(value) : ctx.value === value;
  const off = disabled || ctx.disabled;
  const body = (
    <>
      <b data-slot="choice-cards-title" className="col-start-1 row-start-1 text-ui-md font-semibold text-text-primary">{title}</b>
      <span data-slot="choice-cards-indicator" aria-hidden="true" className={choiceCardIndicator({ type: ctx.type })}>
        {multiple
          ? checked && <Check className="size-icon-sm stroke-3" />
          : checked && <span className="size-radio-dot rounded-full bg-accent-on group-disabled:bg-disabled-text" />}
      </span>
      {description != null && <span data-slot="choice-cards-description" className="col-start-1 text-ui-sm font-normal text-text-tertiary group-data-[state=checked]:text-text-secondary">{description}</span>}
      {price != null && (
        <span data-slot="choice-cards-price" className="col-span-full mt-1.5 text-figure text-text-primary">
          {price}
          {priceUnit != null && <small data-slot="choice-cards-price-unit" className="text-ui-sm font-normal text-text-tertiary group-data-[state=checked]:text-text-secondary">{priceUnit}</small>}
        </span>
      )}
    </>
  );
  const cls = cn(choiceCardItem(), className);
  if (multiple) {
    return (
      <button
        type="button" role="checkbox" data-slot="choice-cards-item" data-value={value} data-state={checked ? 'checked' : 'unchecked'}
        aria-checked={checked} disabled={off} className={cls}
        onClick={e => { onClick?.(e); if (!e.defaultPrevented) ctx.select(value); }}
        {...props}
      >
        {body}
      </button>
    );
  }
  return (
    <R.Item data-slot="choice-cards-item" {...(props as ComponentProps<typeof R.Item>)} data-value={value} value={value} disabled={off} className={cls}>
      {body}
    </R.Item>
  );
}
