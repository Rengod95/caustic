'use client';
import * as Popover from '@radix-ui/react-popover';
import { Check, Search } from 'lucide-react';
import {
  Children, Fragment, isValidElement, useId, useRef, useState,
  type ComponentProps, type KeyboardEvent, type MouseEvent, type ReactElement, type ReactNode,
} from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Input, type InputProps } from '../input/input.tsx';
import { menuHeadingVariants, menuItemVariants, menuSeparatorVariants, menuSurfaceVariants } from '../menu/menu.variants.ts';
import { PickerTrigger } from '../picker-trigger/picker-trigger.tsx';
import {
  comboboxBadgeVariants, comboboxCheckVariants, comboboxDescriptionVariants, comboboxEmptyVariants, comboboxFooterVariants, comboboxGroupVariants,
  comboboxLabelVariants, comboboxLeadingVariants, comboboxListboxVariants, comboboxMetaVariants, comboboxOptionVariants, comboboxPanelVariants,
  comboboxRowLabelVariants, comboboxRowVariants, comboboxSearchVariants, comboboxSizerVariants, comboboxTextVariants, comboboxTileVariants,
  comboboxTriggerVariants, comboboxVariants,
} from './combobox.variants.ts';

export interface ComboboxOptionData {
  value: string;
  label: string;
  /** A 16px swatch, icon or ComboboxTile before the label. */
  leading?: ReactNode;
  /** One-line summary on the label's baseline; filtered with the label. */
  description?: ReactNode;
  /** Right-aligned type or hint (color, dimension). */
  meta?: ReactNode;
  /** Trailing badge (a Badge: Project, Missing) while the option is not chosen; the check takes its place when it is. */
  badge?: ReactNode;
  disabled?: boolean;
}
export interface ComboboxOptionProps extends ComboboxOptionData {}

/** A heading with its options. */
export interface ComboboxGroupData { label: ReactNode; options: ComboboxOptionData[] }

/** What renderOption knows about the option it draws. */
export interface ComboboxOptionState { selected: boolean; highlighted: boolean; disabled: boolean; query: string }

/** Declarative option. It renders nothing itself: Combobox reads its props, so it can filter and highlight. */
export function ComboboxOption(_props: ComboboxOptionProps): null { return null; }

/**
 * Common props (lib/common-props.ts) style the field the user sees. inline mode: the search Input (tone, variant outline
 * default, size md, radius xl = the field radius, shadow none). popup mode: the PickerTrigger (variant soft = the
 * inspector well).
 */
export interface ComboboxProps
  extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'onValueChange' | 'children' | 'size' | 'appearance' | 'prefix' | 'suffix' | 'tone' | 'variant' | 'radius' | 'shadow' | 'width'>, CommonProps {
  /** inline: the search Input is the field. popup: a PickerTrigger opens a panel with the search inside. */
  mode?: 'inline' | 'popup';
  /** Controlled chosen option value. */
  value?: string;
  defaultValue?: string;
  /** Controlled text of the search input. */
  inputValue?: string;
  defaultInputValue?: string;
  /** Controlled list visibility. inline mode: defaults to open while the input is focused and the text is not empty. */
  open?: boolean;
  defaultOpen?: boolean;
  /** Data-driven options; or pass ComboboxOption children. */
  options?: ComboboxOptionData[];
  /** Options under headings, a separator between groups. */
  groups?: ComboboxGroupData[];
  /** Draws the label part of an option (the leading, meta, badge and check stay). */
  renderOption?: (option: ComboboxOptionData, state: ComboboxOptionState) => ReactNode;
  /** Rows after the listbox that are not options (ComboboxRow), e.g. "Connect provider…". */
  footer?: ReactNode;
  /** popup mode: the trigger element (a Radix trigger child). Unset = a PickerTrigger; null = no trigger (in place: the panel alone, always open). */
  trigger?: ReactElement | null;
  /** popup mode: content of the default trigger, from the chosen option (undefined when none or mixed). Defaults to its label. */
  triggerContent?: ReactNode | ((option: ComboboxOptionData | undefined, state: { mixed: boolean }) => ReactNode);
  /** popup mode: accessible name of the default trigger from the chosen label (the mixed label while mixed). */
  triggerLabel?: (label: string | undefined) => string;
  /** popup mode: aria-label of the search field; defaults to aria-label. */
  searchLabel?: string | undefined;
  /** popup mode: aria-label of the panel; defaults to aria-label. */
  popupLabel?: string | undefined;
  /** popup mode: panel width: md 280 (default), lg 300, trigger = the trigger width. */
  popupWidth?: 'trigger' | 'md' | 'lg';
  /** popup mode: the selection holds several values; the trigger shows mixedLabel and no option is chosen. */
  mixed?: boolean | undefined;
  mixedLabel?: string | undefined;
  /** popup mode: a write is in flight; the trigger stays focusable (aria-busy) but does not open. */
  reserved?: boolean | undefined;
  /** Defaults to a case-insensitive substring match of the label (and a text description). */
  filter?: (label: string, query: string) => boolean;
  /** Shown when nothing matches. */
  emptyMessage?: ReactNode;
  /** aria-label of the listbox; defaults to aria-label. */
  listLabel?: string | undefined;
  /** Polite announcement of the result count while open. */
  resultsLabel?: ((count: number) => string) | undefined;
  /** Render in place (in flow), without portal or positioning. */
  inline?: boolean;
  /** Fixtures: the first option is the chosen one. */
  selected?: boolean;
  onValueChange?: (value: string) => void;
  onInputValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export interface ComboboxRowProps extends Omit<ComponentProps<'button'>, 'onSelect'> {
  /** A tile or icon before the label (ComboboxTile tint="neutral" with a + for a connect row). */
  leading?: ReactNode;
  /** The agent shimmer sweeps the label (an action that starts an agent flow). */
  shimmer?: boolean;
  /** The row is activated. The panel stays open. */
  onSelect?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** A footer row: an action after the options, not an option (Tab stop, button). */
export function ComboboxRow({ leading, shimmer = false, onSelect, onClick, className, children, type, ...props }: ComboboxRowProps) {
  return (
    <button type={type ?? 'button'} data-slot="combobox-row" className={cn(comboboxRowVariants(), className)} onClick={e => { onClick?.(e); onSelect?.(e); }} {...props}>
      {leading != null && <span data-slot="combobox-row-leading" aria-hidden="true" className="inline-flex shrink-0 items-center">{leading}</span>}
      {children != null && <span data-slot="combobox-row-label" className={comboboxRowLabelVariants({ shimmer })}>{children}</span>}
    </button>
  );
}

export interface ComboboxTileProps extends ComponentProps<'span'> {
  /** An identity colour (a provider), or neutral for the muted + tile. */
  tint?: 'neutral' | 'coral' | 'iris' | 'mint' | 'amber' | 'slate';
}

/** 18px leading tile: one capital or a small glyph. aria-hidden. */
export function ComboboxTile({ tint, className, ...props }: ComboboxTileProps) {
  return <span data-slot="combobox-tile" aria-hidden="true" className={cn(comboboxTileVariants({ tint }), className)} {...props} />;
}

const plain = (n: ReactNode) => (typeof n === 'string' || typeof n === 'number' ? String(n) : '');
const defaultFilter = (label: string, query: string) => label.toLowerCase().includes(query.trim().toLowerCase());

function highlight(label: string, query: string) {
  const q = query.trim();
  const at = q ? label.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (at < 0) return label;
  return (
    <>
      {label.slice(0, at)}
      <mark data-slot="combobox-match" className="bg-transparent font-semibold text-accent-text">{label.slice(at, at + q.length)}</mark>
      {label.slice(at + q.length)}
    </>
  );
}

/** Chooses from a long list by typing. A search Input filters a thick-glass listbox, in place of the field (inline) or in a panel a trigger opens (popup). */
export function Combobox({
  mode = 'inline', value, defaultValue, inputValue, defaultInputValue, open, defaultOpen, options, groups, renderOption, footer, trigger, triggerContent, triggerLabel,
  searchLabel, popupLabel, popupWidth = 'md', mixed = false, mixedLabel, reserved = false, filter, emptyMessage, listLabel, resultsLabel, inline = false, selected,
  onValueChange, onInputValueChange, onOpenChange, tone, variant, radius, shadow, size, disabled, placeholder, className, children, onKeyDown, onFocus, onBlur,
  'aria-label': ariaLabel, ...props
}: ComboboxProps) {
  const popup = mode === 'popup';
  const [val, setVal] = useControllableState<string>({ value, defaultValue: defaultValue ?? '', onChange: onValueChange });
  const [text, setText] = useControllableState<string>({ value: inputValue, defaultValue: defaultInputValue ?? '', onChange: onInputValueChange });
  // inline mode: null = automatic (open while the input is focused and has text; always while it has text when in place).
  const [manual, setManual] = useState<boolean | null>(defaultOpen ?? null);
  // popup mode: the panel state.
  const [panelOpen, setPanelOpen] = useControllableState<boolean>({ value: popup ? open : undefined, defaultValue: defaultOpen ?? false, onChange: popup ? onOpenChange : undefined });
  const [focused, setFocused] = useState(false);
  // inline search: the list's enter plays on the first opening of a focus session; a reopen while typing does not replay it.
  const [entering, setEntering] = useState(true);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const declared: ComboboxOptionData[] = [
    ...(options ?? []),
    ...Children.toArray(children).flatMap(c => (isValidElement(c) && c.type === ComboboxOption ? [c.props as ComboboxOptionProps] : [])),
  ];
  const matchOf = (o: ComboboxOptionData) => (filter ? filter(o.label, text) : defaultFilter(o.label, text) || (plain(o.description) !== '' && defaultFilter(plain(o.description), text)));
  // Sections: the ungrouped options first, then each group with its matches. A group left empty by the search hides.
  const sections = [
    ...(declared.length ? [{ label: null as ReactNode, options: declared.filter(matchOf) }] : []),
    ...(groups ?? []).map(g => ({ label: g.label, options: g.options.filter(matchOf) })).filter((g, i) => g.options.length > 0 || (text.trim() === '' && (groups ?? [])[i]!.options.length === 0)),
  ];
  const matches = sections.flatMap(s => s.options);
  const all = [...declared, ...(groups ?? []).flatMap(g => g.options)];
  const chosenOption = mixed ? undefined : all.find(o => o.value === val && val !== '');
  const blocked = disabled === true || reserved;
  const panelOnly = popup && trigger === null;

  const auto = (inline || focused) && text !== '';
  const wanted = popup ? (panelOnly || (panelOpen && !blocked)) : (open ?? manual ?? auto);
  const showList = popup ? wanted : wanted && (matches.length > 0 || emptyMessage != null);
  const focusInput = () => rootRef.current?.querySelector<HTMLInputElement>('input')?.focus();
  const optionId = (i: number) => `${listId}-${i}`;

  const setOpen = (next: boolean) => {
    if (popup) { if (!(blocked && next) && !panelOnly) setPanelOpen(next); return; }
    if (next !== wanted) onOpenChange?.(next);
    setManual(next);
  };
  const choose = (o: ComboboxOptionData) => {
    if (o.disabled) return;
    setVal(o.value);
    setActive(-1);
    if (popup) {
      if (!panelOnly) { setOpen(false); triggerRef.current?.focus(); }
      return;
    }
    setText(o.label);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const n = matches.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (n === 0) return;
      e.preventDefault();
      if (!showList) setOpen(true);
      setActive(a => (e.key === 'ArrowDown' ? (a + 1) % n : (a <= 0 ? n - 1 : a - 1)));
    } else if (popup && (e.key === 'Home' || e.key === 'End') && n) {
      e.preventDefault();
      setActive(e.key === 'Home' ? 0 : n - 1);
    } else if (e.key === 'Enter') {
      const o = showList ? matches[active] : undefined;
      if (o) { e.preventDefault(); choose(o); }
    } else if (e.key === 'Escape') {
      if (popup) { if (!panelOnly) { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); } } else if (showList) { e.preventDefault(); setOpen(false); } else if (text !== '') { e.preventDefault(); setText(''); }
    } else if (e.key === 'Tab') {
      if (showList && !popup) setOpen(false);
    }
  };

  let index = -1;
  const optionRow = (o: ComboboxOptionData) => {
    index += 1;
    const i = index;
    const chosen = !mixed && (o.value === val && val !== '' ? true : (selected === true && i === 0 && val === ''));
    const off = o.disabled === true;
    const state: ComboboxOptionState = { selected: chosen, highlighted: active === i, disabled: off, query: text };
    return (
      <button
        key={o.value} id={optionId(i)} type="button" role="option" tabIndex={-1} aria-selected={chosen} aria-disabled={off || undefined}
        data-slot="combobox-option" data-selected={chosen ? '' : undefined} data-highlighted={active === i ? '' : undefined} data-disabled={off ? '' : undefined}
        className={cn('group', menuItemVariants(), comboboxOptionVariants())}
        onMouseDown={e => e.preventDefault()}
        onMouseMove={() => { if (!off) setActive(i); }}
        onClick={() => { if (!off) { choose(o); if (!popup) focusInput(); } }}
      >
        {o.leading != null && <span data-slot="combobox-leading" aria-hidden="true" className={comboboxLeadingVariants()}>{o.leading}</span>}
        <span data-slot="combobox-text" className={comboboxTextVariants()}>
          {renderOption ? renderOption(o, state) : (
            <>
              <span data-slot="combobox-label" className={comboboxLabelVariants()}>{highlight(o.label, text)}</span>
              {o.description != null && <span data-slot="combobox-description" className={comboboxDescriptionVariants()}>{o.description}</span>}
            </>
          )}
        </span>
        {o.meta != null && <span data-slot="combobox-meta" className={comboboxMetaVariants()}>{o.meta}</span>}
        {!chosen && o.badge != null && <span data-slot="combobox-badge" className={comboboxBadgeVariants()}>{o.badge}</span>}
        {chosen && <span data-slot="combobox-check" aria-hidden="true" className={comboboxCheckVariants({ end: o.meta == null })}><Check /></span>}
      </button>
    );
  };

  const grouped = (groups?.length ?? 0) > 0;
  // The list itself. In place it is gated by showList (listbox). Inside a Radix content it is not gated: the content stays
  // mounted while it exits, and the exit has to show the rows it had.
  const listNode = (
    <div
      id={listId} role="listbox" aria-label={listLabel ?? ariaLabel} data-slot="combobox-listbox"
      className={cn(!popup && menuSurfaceVariants(), comboboxListboxVariants({ mode, grouped }))}
    >
      {matches.length === 0 && emptyMessage != null
        ? <div role="option" aria-disabled="true" aria-selected="false" data-slot="combobox-empty" className={comboboxEmptyVariants()}>{emptyMessage}</div>
        : sections.map((s, si) => {
          if (s.label == null) return <Fragment key="options">{s.options.map(optionRow)}</Fragment>;
          const headingId = `${listId}-g${si}`;
          return (
            <Fragment key={headingId}>
              {si > 0 && <div role="presentation" data-slot="combobox-separator" className={menuSeparatorVariants()} />}
              <div role="group" aria-labelledby={headingId} data-slot="combobox-group" className={comboboxGroupVariants()}>
                <div id={headingId} data-slot="combobox-heading" className={menuHeadingVariants({ caps: true })}>{s.label}</div>
                {s.options.map(optionRow)}
              </div>
            </Fragment>
          );
        })}
    </div>
  );
  const listbox = showList && listNode;
  // An empty list has no surface of its own: a content that has nothing to show exits invisibly.
  const listVisible = matches.length > 0 || emptyMessage != null;
  const status = <span role="status" aria-live="polite" className="sr-only">{showList ? resultsLabel?.(matches.length) : ''}</span>;

  if (!popup) {
    return (
      <div
        ref={rootRef} data-slot="combobox" data-mode="inline" tabIndex={-1}
        className={cn(comboboxVariants({ mode }), className)}
        onFocus={e => { if (e.target === e.currentTarget) focusInput(); }}
      >
        <Popover.Root open={!inline && showList} onOpenChange={next => { if (!next) setOpen(false); }}>
          <Popover.Anchor asChild>
            <div>
              <Input
                prefix={<Search aria-hidden className="size-icon-sm" />} autoComplete="off" aria-label={ariaLabel}
                tone={tone} variant={variant} size={size} disabled={disabled} placeholder={placeholder}
                // The defaults (xl, none) are the field's own: forwarded only when they change something.
                {...(radius && radius !== 'xl' ? { radius } : {})} {...(shadow && shadow !== 'none' ? { shadow } : {})}
                role="combobox" aria-expanded={showList} aria-controls={showList ? listId : undefined} aria-autocomplete="list"
                aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
                value={text}
                onValueChange={v => { setText(v); setActive(-1); setManual(true); }}
                onKeyDown={handleKeyDown}
                onFocus={e => { setFocused(true); setEntering(true); onFocus?.(e); }}
                onBlur={e => { setFocused(false); if (!inline) setManual(null); onBlur?.(e); }}
                {...props}
              />
            </div>
          </Popover.Anchor>
          {inline ? listbox : (
            <Popover.Portal>
              <Popover.Content
                side="bottom" align="start" sideOffset={6} data-enter={entering || undefined} inert={!showList || undefined}
                className="z-60 w-[var(--radix-popover-trigger-width)] origin-(--radix-popover-content-transform-origin) outline-none data-[state=open]:data-[enter]:animate-enter data-[state=closed]:animate-exit enter-scale enter-from-side"
                onAnimationEnd={e => { if (e.target === e.currentTarget) setEntering(false); }}
                onOpenAutoFocus={e => e.preventDefault()} onCloseAutoFocus={e => e.preventDefault()}
                onEscapeKeyDown={e => e.preventDefault()}
                onInteractOutside={e => { if (rootRef.current?.contains(e.target as Node)) e.preventDefault(); }}
              >
                {listVisible && listNode}
              </Popover.Content>
            </Popover.Portal>
          )}
        </Popover.Root>
        {status}
      </div>
    );
  }

  // popup mode
  const shownLabel = mixed ? mixedLabel : chosenOption?.label;
  const content = typeof triggerContent === 'function' ? triggerContent(chosenOption, { mixed }) : triggerContent;
  const triggerEl = trigger === undefined ? (
    <PickerTrigger
      ref={triggerRef} data-slot="combobox-trigger" indicator="dropdown" aria-haspopup="dialog"
      aria-label={triggerLabel ? triggerLabel(shownLabel) : ariaLabel} aria-controls={wanted ? `${listId}-panel` : undefined}
      tone={tone} variant={variant} radius={radius} shadow={shadow} size={size}
      open={wanted} disabled={disabled} data-mixed={mixed || undefined} data-reserved={reserved || undefined} aria-busy={reserved || undefined}
      className={comboboxTriggerVariants()}
      onClick={inline ? () => setOpen(!wanted) : undefined}
      onKeyDown={e => { if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !wanted && !blocked) { e.preventDefault(); setOpen(true); } }}
    >
      {content ?? (mixed ? <span data-slot="combobox-mixed" className="italic text-text-secondary in-disabled:text-disabled-text">{mixedLabel}</span> : shownLabel)}
    </PickerTrigger>
  ) : trigger;

  const panelBody = (
    <>
      <div
        data-slot="combobox-search" tabIndex={-1} className={comboboxSearchVariants()}
        onFocus={e => { if (e.target === e.currentTarget) focusInput(); }}
      >
        <Input
          variant="sunken" prefix={<Search aria-hidden="true" className="size-icon-sm" />} placeholder={placeholder} aria-label={searchLabel ?? ariaLabel} autoComplete="off"
          autoFocus={!inline}
          role="combobox" aria-expanded="true" aria-controls={listId} aria-autocomplete="list"
          aria-activedescendant={active >= 0 && matches[active] ? optionId(active) : undefined}
          value={text}
          onValueChange={v => { setText(v); setActive(-1); }}
          onKeyDown={handleKeyDown}
          onFocus={onFocus} onBlur={onBlur}
          {...props}
        />
      </div>
      {listNode}
      {footer != null && <div data-slot="combobox-footer" className={comboboxFooterVariants()}>{footer}</div>}
      {status}
    </>
  );
  const panelProps = { id: `${listId}-panel`, role: 'dialog', 'aria-label': popupLabel ?? ariaLabel };

  if (inline) {
    return (
      <div
        ref={rootRef} data-slot="combobox" data-mode="popup" data-state={wanted ? 'open' : 'closed'}
        className={cn(comboboxVariants({ mode, size }), className)}
        onKeyDown={e => { if (e.key === 'Escape' && wanted && !panelOnly) { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); } }}
      >
        {triggerEl}
        {wanted
          ? <div {...panelProps} data-slot="combobox-panel" className={cn(menuSurfaceVariants(), comboboxPanelVariants({ width: popupWidth, inline: true }))}>{panelBody}</div>
          : !panelOnly && <span aria-hidden="true" className={comboboxSizerVariants({ width: popupWidth })} />}
      </div>
    );
  }
  return (
    <div ref={rootRef} data-slot="combobox" data-mode="popup" data-state={wanted ? 'open' : 'closed'} className={cn(comboboxVariants({ mode, size }), className)}>
      <Popover.Root open={wanted} onOpenChange={setOpen}>
        {triggerEl && <Popover.Trigger asChild>{triggerEl}</Popover.Trigger>}
        <Popover.Portal>
          <Popover.Content
            {...panelProps} data-slot="combobox-panel" side="bottom" align="start" sideOffset={6} inert={!wanted || undefined}
            className={cn(menuSurfaceVariants(), 'origin-(--radix-popover-content-transform-origin)', comboboxPanelVariants({ width: popupWidth, inline: false }))}
          >
            {panelBody}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
