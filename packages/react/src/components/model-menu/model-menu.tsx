'use client';
import { ArrowUpRight, Check, Search } from 'lucide-react';
import {
  Children, cloneElement, Fragment, isValidElement, useEffect, useId, useRef, useState,
  type ComponentProps, type KeyboardEvent, type MouseEvent, type ReactElement, type ReactNode,
} from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Input } from '../input/input.tsx';
import { menuHeadingVariants, menuSeparatorVariants, menuSurfaceVariants } from '../menu/menu.variants.ts';
import {
  modelMenuAnchorVariants, modelMenuConnectEndVariants, modelMenuConnectProviderVariants, modelMenuConnectVariants,
  modelMenuDescriptionVariants, modelMenuEndVariants, modelMenuFloatVariants, modelMenuItemVariants, modelMenuListVariants,
  modelMenuNameVariants, modelMenuProviderVariants, modelMenuSearchVariants, modelMenuTextVariants, modelMenuWidthVariants,
} from './model-menu.variants.ts';

export interface ModelMenuItemProps {
  /** Opaque id of the model; reported by onValueChange. */
  value: string;
  /** The letter in the provider tile. */
  initial?: string;
  /** Model name. */
  name: ReactNode;
  /** One-line summary. */
  description?: ReactNode;
  /** Marks the chosen model: accent.soft fill, check at the end, aria-selected. */
  selected?: boolean;
  /** Not choosable, 0.42 opacity. */
  disabled?: boolean;
}

export interface ModelMenuConnectProps {
  /** The letter in the provider tile. */
  initial?: string;
  /** A connect row is activated. */
  onConnect?: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

export interface ModelMenuGroupProps {
  /** Provider name for the heading. */
  provider: string;
  /** Appends "connected" or "not connected" to the heading. A not-connected group lists only its connect row. */
  connected?: boolean;
  children?: ReactNode;
}

/** Declarative: ModelMenu reads these props so it can filter, highlight and order the models. They render nothing themselves. */
export function ModelMenuItem(_props: ModelMenuItemProps): null { return null; }
export function ModelMenuConnect(_props: ModelMenuConnectProps): null { return null; }
export function ModelMenuGroup(_props: ModelMenuGroupProps): null { return null; }

export interface ModelMenuProps extends Omit<ComponentProps<'div'>, 'children' | 'defaultValue' | 'onChange'> {
  /** Controlled id of the chosen model. */
  value?: string;
  /** Uncontrolled initial model id. */
  defaultValue?: string;
  /** Render the surface in place, open, without positioning. */
  inline?: boolean;
  /** Controlled open state (floating mode). */
  open?: boolean;
  defaultOpen?: boolean;
  /** Element that opens the surface (floating mode). */
  trigger?: ReactNode;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  /** The search text changes. */
  onQueryChange?: (query: string) => void;
  /** ModelMenuGroup elements. */
  children?: ReactNode;
}

interface GroupData { provider: string; connected: boolean; items: ModelMenuItemProps[]; connects: ModelMenuConnectProps[] }

function flatten(children: ReactNode): ReactElement[] {
  return Children.toArray(children).flatMap(c => {
    if (!isValidElement<{ children?: ReactNode }>(c)) return [];
    return c.type === Fragment ? flatten(c.props.children) : [c];
  });
}

function readGroups(children: ReactNode): GroupData[] {
  return flatten(children).filter(c => c.type === ModelMenuGroup).map(g => {
    const p = g.props as ModelMenuGroupProps;
    const parts = flatten(p.children);
    return {
      provider: p.provider,
      connected: p.connected ?? true,
      items: parts.filter(x => x.type === ModelMenuItem).map(x => x.props as ModelMenuItemProps),
      connects: parts.filter(x => x.type === ModelMenuConnect).map(x => x.props as ModelMenuConnectProps),
    };
  });
}

const text = (n: ReactNode) => (typeof n === 'string' || typeof n === 'number' ? String(n) : '');

/** The agent model chooser: a search field over models grouped by provider, with a connect row for providers that are not connected. */
export function ModelMenu({
  value, defaultValue, inline = false, open, defaultOpen, trigger, onValueChange, onOpenChange, onQueryChange,
  className, children, onKeyDown, ...props
}: ModelMenuProps) {
  const [chosen, setChosen] = useControllableState<string>({ value, defaultValue: defaultValue ?? '', onChange: onValueChange });
  const [isOpen, setOpen] = useControllableState<boolean>({ value: inline ? undefined : open, defaultValue: defaultOpen ?? false, onChange: onOpenChange });
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const base = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);

  // Floating: an outside press closes the surface.
  useEffect(() => {
    if (inline || !isOpen) return;
    const onDown = (e: PointerEvent) => { if (!anchorRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [inline, isOpen, setOpen]);

  const q = query.trim().toLowerCase();
  const groups = readGroups(children).map(g => ({
    ...g,
    items: g.items.filter(i => !q || `${text(i.name)} ${text(i.description)}`.toLowerCase().includes(q)),
  })).filter(g => (g.connected ? g.items.length > 0 : !q || g.provider.toLowerCase().includes(q)));
  const flat = groups.flatMap(g => g.items);
  const optionId = (i: number) => `${base}-o${i}`;
  const listId = `${base}-list`;
  const close = () => { setOpen(false); anchorRef.current?.querySelector<HTMLElement>('[data-model-menu-trigger]')?.focus(); };

  const choose = (item: ModelMenuItemProps) => {
    if (item.disabled) return;
    setChosen(item.value);
    if (!inline) close();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const n = flat.length;
    if (e.key === 'ArrowDown' && n) { e.preventDefault(); setActive(a => (a + 1) % n); }
    else if (e.key === 'ArrowUp' && n) { e.preventDefault(); setActive(a => (a <= 0 ? n - 1 : a - 1)); }
    else if (e.key === 'Home' && n && e.target instanceof HTMLInputElement) { e.preventDefault(); setActive(0); }
    else if (e.key === 'End' && n && e.target instanceof HTMLInputElement) { e.preventDefault(); setActive(n - 1); }
    else if (e.key === 'Enter' && active >= 0 && flat[active] && e.target instanceof HTMLInputElement) { e.preventDefault(); choose(flat[active]); }
    else if (e.key === 'Escape' && !inline) { e.preventDefault(); close(); }
  };

  let index = -1;
  const surface = (
    <div
      data-slot="model-menu" role="dialog" aria-label="Models"
      className={cn(menuSurfaceVariants(), modelMenuWidthVariants({ inline }), className)}
      {...props}
      onKeyDown={handleKeyDown}
    >
      <div
        data-slot="model-menu-search" tabIndex={-1} className={modelMenuSearchVariants()}
        onFocus={e => { if (e.target === e.currentTarget) e.currentTarget.querySelector<HTMLInputElement>('input')?.focus(); }}
      >
        <Input
          appearance="sunken" prefix={<Search aria-hidden="true" className="size-icon-sm" />} placeholder="Search models" aria-label="Search models" autoComplete="off"
          autoFocus={!inline}
          role="combobox" aria-expanded="true" aria-controls={listId} aria-autocomplete="list"
          aria-activedescendant={active >= 0 && flat[active] ? optionId(active) : undefined}
          value={query}
          onValueChange={v => { setQuery(v); setActive(-1); onQueryChange?.(v); }}
        />
      </div>
      <div id={listId} data-slot="model-menu-list" role="listbox" aria-label="Models" className={modelMenuListVariants()}>
        {groups.map((g, gi) => {
          const headingId = `${base}-g${gi}`;
          return (
            <Fragment key={g.provider}>
              {gi > 0 && <div role="presentation" data-slot="model-menu-separator" className={menuSeparatorVariants()} />}
              <div role="group" aria-labelledby={headingId} className="grid">
                <div id={headingId} data-slot="model-menu-heading" className={menuHeadingVariants()}>{g.provider} · {g.connected ? 'connected' : 'not connected'}</div>
                {g.items.map(item => {
                  index += 1;
                  const i = index;
                  const selected = value !== undefined || chosen !== '' ? item.value === chosen : item.selected === true;
                  return (
                    <button
                      key={item.value} id={optionId(i)} type="button" role="option" tabIndex={-1}
                      aria-selected={selected} aria-disabled={item.disabled || undefined}
                      data-slot="model-menu-item" data-selected={selected ? '' : undefined}
                      data-highlighted={active === i ? '' : undefined} data-disabled={item.disabled ? '' : undefined}
                      className={modelMenuItemVariants()}
                      onMouseDown={e => e.preventDefault()}
                      onMouseMove={() => { if (!item.disabled) setActive(i); }}
                      onClick={() => choose(item)}
                    >
                      <span data-slot="model-menu-provider" aria-hidden="true" className={modelMenuProviderVariants()}>{item.initial ?? g.provider.charAt(0)}</span>
                      <span data-slot="model-menu-text" className={modelMenuTextVariants()}>
                        <span data-slot="model-menu-name" className={modelMenuNameVariants()}>{item.name}</span>
                        {item.description != null && <span data-slot="model-menu-description" className={modelMenuDescriptionVariants()}>{item.description}</span>}
                      </span>
                      <span data-slot="model-menu-end" aria-hidden="true" className={modelMenuEndVariants()}>{selected && <Check />}</span>
                    </button>
                  );
                })}
              </div>
            </Fragment>
          );
        })}
      </div>
      {groups.flatMap(g => g.connects.map((c, ci) => (
        <button
          key={`${g.provider}-${ci}`} type="button" data-slot="model-menu-connect" className={modelMenuConnectVariants()}
          onClick={c.onConnect}
        >
          <span data-slot="model-menu-connect-provider" aria-hidden="true" className={modelMenuConnectProviderVariants()}>{c.initial ?? g.provider.charAt(0)}</span>
          <span className="min-w-0 truncate">{c.children ?? 'Connect provider…'}</span>
          <span data-slot="model-menu-connect-end" aria-hidden="true" className={modelMenuConnectEndVariants()}><ArrowUpRight /></span>
        </button>
      )))}
    </div>
  );

  if (inline) return surface;
  return (
    <span ref={anchorRef} className={modelMenuAnchorVariants()}>
      {isValidElement<ComponentProps<'button'>>(trigger) && cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        'data-model-menu-trigger': '', 'aria-haspopup': 'dialog', 'aria-expanded': isOpen,
        onClick: (e: MouseEvent<HTMLElement>) => { (trigger.props as ComponentProps<'button'>).onClick?.(e as MouseEvent<HTMLButtonElement>); setOpen(!isOpen); },
      })}
      {isOpen && <div className={modelMenuFloatVariants()}>{surface}</div>}
    </span>
  );
}
