'use client';
import { Check } from 'lucide-react';
import { createContext, useContext, useId, useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { shadowClass, type CommonProps, type Tone } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { CardChoice, CardIndicator } from '../card/card.tsx';
import {
  choiceGroupAnswerDescriptionVariants, choiceGroupAnswerIndicatorVariants, choiceGroupAnswerVariants, choiceGroupCardDescriptionVariants,
  choiceGroupCardIndicatorVariants, choiceGroupCardTitleVariants, choiceGroupCardVariants, choiceGroupCheckVariants, choiceGroupPriceUnitVariants,
  choiceGroupPriceVariants, choiceGroupQuestionVariants, choiceGroupTileDescriptionVariants, choiceGroupTileIconVariants, choiceGroupTileVariants,
  choiceGroupVariants,
} from './choice-group.variants.ts';

type Appearance = 'card' | 'tile' | 'answer';
type ChoiceType = 'single' | 'multiple';
type Layout = 'caption' | 'icon';
type Columns = 'auto' | '1' | '2' | '3' | '4' | '5';
type SelectedFill = 'ink' | 'solid';

interface Ctx extends CommonProps {
  appearance: Appearance;
  type: ChoiceType;
  value: string | string[];
  select: (v: string) => void;
  disabled: boolean;
  layout: Layout;
  check: boolean;
  selectedFill: SelectedFill;
}
const GroupCtx = createContext<Ctx>({ appearance: 'card', type: 'single', value: '', select: () => {}, disabled: false, layout: 'caption', check: false, selectedFill: 'ink' });

/**
 * Common props (lib/common-props.ts) style every item, unset = the appearance's own default:
 * variant = the item emphasis (outline in every appearance), tone = card / answer: the checked indicator (accent);
 * tile: the colour family of the tile emphasis (neutral), size = padding / height and type (md), radius = item corners
 * (card xl, tile and answer lg), shadow = item elevation (none; an elevation replaces the hairline).
 */
export interface ChoiceGroupProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'dir'>, CommonProps {
  /** card = whole-card options with a title, description and price · tile = a grid of equal tiles that invert when chosen · answer = rows of an indicator, a label and a hint under a question. */
  appearance?: Appearance;
  /** single = a radiogroup (one value) · multiple = a group of checkboxes (a list of values). */
  type?: ChoiceType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Disables every item. */
  disabled?: boolean;
  /** Equal columns. auto = the appearance's own: card auto-fit at a 180px minimum, tile 4, answer 1. */
  columns?: Columns;
  /** Tile layout: caption = name over a description (54px tiles) · icon = glyph over a name (62px tiles). */
  layout?: Layout;
  /** Tile: corner check on the chosen tile. false (default): the inversion alone marks it; a chosen disabled tile always shows it. */
  check?: boolean;
  /** Card: the selected card's fill. ink (default) = the ink hover step (selection.fill-hover), the full ink on hover · solid = neutral.solid, lighter still (light-theme oriented). */
  selectedFill?: SelectedFill;
  /** Labels the group and renders above the items in the voice serif (the agent's question). */
  question?: ReactNode;
}

const ARROWS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/** One or several choices from a set, as cards, tiles or answer rows. One radiogroup (or checkbox group) with roving focus. */
export function ChoiceGroup({
  appearance = 'card', type = 'single', value, defaultValue, onValueChange, disabled = false, columns, layout = 'caption', check = false, selectedFill = 'ink', question,
  tone, variant, radius, shadow, size, className, onKeyDown, children, ...props
}: ChoiceGroupProps) {
  const [current, setCurrent] = useControllableState<string | string[]>({ value, defaultValue: defaultValue ?? (type === 'single' ? '' : []), onChange: onValueChange });
  const ref = useRef<HTMLDivElement>(null);
  const questionId = useId();
  const select = (v: string) => {
    if (type === 'single') setCurrent(v);
    else { const list = Array.isArray(current) ? current : []; setCurrent(list.includes(v) ? list.filter(x => x !== v) : [...list, v]); }
  };
  // Single: arrow keys choose the item they move to, so the selection never lags behind roving focus. Multiple: every
  // checkbox is its own tab stop and Space toggles it.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || type !== 'single' || disabled) return;
    const step = ARROWS[e.key];
    if (!step) return;
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [])];
    if (!items.length) return;
    const i = items.findIndex(el => el === document.activeElement);
    const next = items[(i + step + items.length) % items.length];
    e.preventDefault();
    next?.focus();
    if (next?.dataset.value !== undefined) setCurrent(next.dataset.value);
  };
  const cols = columns ?? (appearance === 'tile' ? '4' : 'auto');
  const named = question != null && props['aria-label'] == null && props['aria-labelledby'] == null;
  return (
    <GroupCtx.Provider value={{ appearance, type, value: current, select, disabled, layout, check, selectedFill, tone, variant, radius, shadow, size }}>
      <div
        ref={ref} role={type === 'single' ? 'radiogroup' : 'group'} aria-disabled={disabled || undefined} aria-labelledby={named ? questionId : undefined}
        data-slot="choice-group" data-appearance={appearance} data-type={type} data-columns={cols} data-layout={appearance === 'tile' ? layout : undefined}
        className={cn(choiceGroupVariants({ appearance, columns: cols }), className)} onKeyDown={handleKeyDown} {...props}
      >
        {question != null && <span id={questionId} data-slot="choice-group-question" className={choiceGroupQuestionVariants()}>{question}</span>}
        {children}
      </div>
    </GroupCtx.Provider>
  );
}

export interface ChoiceGroupItemProps extends Omit<ComponentProps<'button'>, 'value' | 'title' | 'children' | 'type'> {
  /** Identity of the option (the radio or checkbox value). */
  value: string;
  /** Option name: card title, tile name, answer label. */
  title: ReactNode;
  /** Card: one line under the title · tile: the caption under the name · answer: the hint under the label. */
  description?: ReactNode;
  /** Glyph: above the name on a tile, before the title on a card. Decorative. */
  icon?: ReactNode;
  /** Card: large figure on its own row. */
  price?: ReactNode;
  /** Card: unit after the figure, e.g. " / month". */
  priceUnit?: ReactNode;
}

export function ChoiceGroupItem({ value, title, description, icon, price, priceUnit, disabled, className, onClick, ...props }: ChoiceGroupItemProps) {
  const ctx = useContext(GroupCtx);
  const multiple = ctx.type === 'multiple';
  const checked = multiple ? Array.isArray(ctx.value) && ctx.value.includes(value) : ctx.value === value;
  const off = disabled || ctx.disabled;
  const role = multiple ? 'checkbox' : 'radio';
  // Roving focus (single): the chosen item is the tab stop; with nothing chosen every item is.
  const tabIndex = multiple || checked || !ctx.value ? 0 : -1;
  const choose = (e: Parameters<NonNullable<ComponentProps<'button'>['onClick']>>[0]) => { onClick?.(e); if (!e.defaultPrevented) ctx.select(value); };
  const tone: Tone = ctx.tone ?? (ctx.appearance === 'tile' ? 'neutral' : 'accent');
  const common = { 'data-appearance': ctx.appearance, 'data-value': value, disabled: off, tabIndex } as const;

  if (ctx.appearance === 'card') {
    return (
      <CardChoice
        data-slot="choice-group-item" {...common} type={role} checked={checked} variant="plain" radius={ctx.radius ?? 'xl'} data-variant={ctx.variant ?? 'outline'}
        className={cn(choiceGroupCardVariants({ variant: ctx.variant, size: ctx.size, selectedFill: ctx.selectedFill }), ctx.shadow && ctx.shadow !== 'none' && shadowClass[ctx.shadow], className)}
        onClick={choose} {...props}
      >
        <b data-slot="choice-group-title" className={cn(choiceGroupCardTitleVariants({ size: ctx.size }), icon != null && 'flex items-center gap-2')}>
          {icon != null && <span data-slot="choice-group-icon" aria-hidden="true" className={choiceGroupTileIconVariants()}>{icon}</span>}
          {title}
        </b>
        <CardIndicator data-slot="choice-group-indicator" className={choiceGroupCardIndicatorVariants({ tone, selectedFill: ctx.selectedFill })} />
        {description != null && <span data-slot="choice-group-description" className={choiceGroupCardDescriptionVariants()}>{description}</span>}
        {price != null && (
          <span data-slot="choice-group-price" className={choiceGroupPriceVariants()}>
            {price}
            {priceUnit != null && <small data-slot="choice-group-price-unit" className={choiceGroupPriceUnitVariants()}>{priceUnit}</small>}
          </span>
        )}
      </CardChoice>
    );
  }

  const state = { role, 'aria-checked': checked, 'data-state': checked ? 'checked' : 'unchecked' } as const;

  if (ctx.appearance === 'tile') {
    return (
      <button
        type="button" data-slot="choice-group-item" {...common} {...state}
        className={cn(choiceGroupTileVariants({ layout: ctx.layout, tone, variant: ctx.variant, radius: ctx.radius, shadow: ctx.shadow, size: ctx.size }), className)}
        onClick={choose} {...props}
      >
        {icon != null && <span data-slot="choice-group-icon" aria-hidden="true" className={choiceGroupTileIconVariants()}>{icon}</span>}
        <span data-slot="choice-group-title">{title}</span>
        {description != null && <span data-slot="choice-group-description" className={choiceGroupTileDescriptionVariants()}>{description}</span>}
        {/* The inversion marks an enabled choice; a disabled tile drops it, so the check is its mark. */}
        {checked && (off || ctx.check) && <span data-slot="choice-group-check" aria-hidden="true" className={choiceGroupCheckVariants()}><Check /></span>}
      </button>
    );
  }

  return (
    <button
      type="button" data-slot="choice-group-item" {...common} {...state}
      className={cn(choiceGroupAnswerVariants({ variant: ctx.variant, size: ctx.size, radius: ctx.radius, shadow: ctx.shadow }), className)}
      onClick={choose} {...props}
    >
      <span data-slot="choice-group-indicator" aria-hidden="true" className={choiceGroupAnswerIndicatorVariants({ type: ctx.type, tone })}>
        {checked && (multiple ? <Check aria-hidden className="size-icon-sm stroke-3 animate-pop" /> : <span className="size-radio-dot rounded-full bg-current animate-pop" />)}
      </span>
      <span data-slot="choice-group-title" className="block">
        {title}
        {description != null && <span data-slot="choice-group-description" className={choiceGroupAnswerDescriptionVariants()}>{description}</span>}
      </span>
    </button>
  );
}
