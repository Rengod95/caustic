'use client';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type FocusEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Combobox, type ComboboxOptionData } from '../combobox/combobox.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import {
  foundationToolbarActionsVariants, foundationToolbarBarVariants, foundationToolbarDomainIconVariants, foundationToolbarDomainsVariants,
  foundationToolbarDomainVariants, foundationToolbarPickerVariants, foundationToolbarVariants,
} from './foundation-toolbar.variants.ts';

export interface FoundationToolbarFamily { value: string; label: string }
export interface FoundationToolbarDomain { value: string; label: string; icon?: ReactNode }

const DOMAIN = '[data-slot="foundation-toolbar-domain"]:not(:disabled)';

export interface FoundationToolbarProps extends Omit<ComponentProps<'div'>, 'aria-label' | 'children' | 'defaultValue'> {
  /** Accessible name of the capsule. */
  label: string;
  layout?: 'row' | 'compact' | undefined;
  /** Capsule padding and gap, and the domain tile size: xs 2 / 32, sm 4 / 40, md 6 / 48 (default), lg 8 / 48. */
  size?: Size | undefined;
  /** Colour family of the capsule material (solid: the tone tint; soft: the soft fill; outline: the edge). */
  tone?: Tone | undefined;
  /** solid (default) = regular glass; soft = soft fill; outline = glass with a 1px edge; ghost = no fill. */
  variant?: Variant | undefined;
  /** Corner radius of the capsule; unset = the toolbar radius. */
  radius?: Radius | 'toolbar' | undefined;
  /** Elevation of the capsule; unset = 4. */
  shadow?: Shadow | undefined;
  families: FoundationToolbarFamily[];
  /** Controlled family value; "" or an unknown value selects none. */
  family?: string | undefined;
  defaultFamily?: string | undefined;
  /** aria-label of the family switch; required when families is not empty. */
  familyLabel?: string | undefined;
  domains: FoundationToolbarDomain[];
  /** Controlled domain value; "" selects none. */
  domain?: string | undefined;
  defaultDomain?: string | undefined;
  /** aria-label of the domain row; required when domains is not empty in the row layout. */
  domainsLabel?: string | undefined;
  /** aria-label of the compact search field; required in the compact layout. */
  searchLabel?: string | undefined;
  searchPlaceholder?: string | undefined;
  /** aria-label of the add button; required with onAdd. */
  addLabel?: string | undefined;
  /** The host's own actions, after the add button. */
  actions?: ReactNode;
  disabled?: boolean | undefined;
  /** Extra controls on the first line, after the family switch. */
  children?: ReactNode;
  onFamilyChange?: ((family: string) => void) | undefined;
  onDomainChange?: ((domain: string) => void) | undefined;
  onAdd?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
}

/** The dock of a token workspace: family switch, domain row (or compact search), add and host actions on one glass capsule. */
export function FoundationToolbar({
  label, layout = 'row', size, tone, variant, radius, shadow, families, family, defaultFamily, familyLabel, domains, domain, defaultDomain, domainsLabel, searchLabel, searchPlaceholder,
  addLabel, actions, disabled = false, children, onFamilyChange, onDomainChange, onAdd, className, ...props
}: FoundationToolbarProps) {
  const [currentFamily, setFamily] = useControllableState<string>({ value: family, defaultValue: defaultFamily ?? '', onChange: onFamilyChange });
  const [chosen, setChosen] = useControllableState<string>({ value: domain, defaultValue: defaultDomain ?? '', onChange: onDomainChange });
  const [focused, setFocused] = useState<string | undefined>();
  const known = (v: string | undefined) => v !== undefined && domains.some(d => d.value === v);
  const stop = known(focused) ? focused : known(chosen) ? chosen : domains[0]?.value;

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    const value = (e.target as HTMLElement).closest<HTMLElement>(DOMAIN)?.dataset.value;
    if (value !== undefined) setFocused(value);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(DOMAIN));
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    e.preventDefault();
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (at + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    items[to]?.focus();
  };

  // Which edges of the domain row have more domains beyond them (drives the edge fade).
  const row = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<'start' | 'end' | 'both' | undefined>();
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      const left = Math.abs(el.scrollLeft);
      const start = left > 1;
      const end = max - left > 1;
      setOverflow(start && end ? 'both' : start ? 'start' : end ? 'end' : undefined);
    };
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    ro?.observe(el);
    return () => { el.removeEventListener('scroll', measure); ro?.disconnect(); };
  }, [layout, domains.length]);

  const options: ComboboxOptionData[] = domains.map(d => ({ value: d.value, label: d.label, leading: d.icon }));

  return (
    <div data-slot="foundation-toolbar" data-layout={layout} role="group" aria-label={label} className={cn(foundationToolbarVariants({ layout, size, tone, variant, radius, shadow }), className)} {...props}>
      <div data-slot="foundation-toolbar-bar" className={foundationToolbarBarVariants()}>
        {families.length > 0 && (
          <SegmentedControl data-slot="foundation-toolbar-family" size="xs" aria-label={familyLabel} value={currentFamily} onValueChange={setFamily} disabled={disabled}>
            {families.map(f => <SegmentedControlItem key={f.value} value={f.value}>{f.label}</SegmentedControlItem>)}
          </SegmentedControl>
        )}
        {children}
        <span data-slot="foundation-toolbar-actions" className={foundationToolbarActionsVariants()}>
          {onAdd !== undefined && <IconButton data-slot="foundation-toolbar-add" size="xs" radius="sm" label={addLabel ?? ''} disabled={disabled} onClick={onAdd}><Plus /></IconButton>}
          {actions}
        </span>
      </div>
      {layout === 'row' && domains.length > 0 && (
        <div
          ref={row} data-slot="foundation-toolbar-domains" data-overflow={overflow} role="toolbar" aria-label={domainsLabel} className={foundationToolbarDomainsVariants()}
          onKeyDown={handleKeyDown} onFocus={handleFocus}
        >
          {domains.map(d => (
            <button
              key={d.value} type="button" data-slot="foundation-toolbar-domain" data-value={d.value} aria-pressed={chosen === d.value}
              tabIndex={stop === d.value ? 0 : -1} disabled={disabled} className={cn(foundationToolbarDomainVariants({ size }))} onClick={() => setChosen(d.value)}
            >
              {d.icon != null && <span data-slot="foundation-toolbar-domain-icon" aria-hidden className={cn(foundationToolbarDomainIconVariants({ size }))}>{d.icon}</span>}
              <span data-slot="foundation-toolbar-domain-label">{d.label}</span>
            </button>
          ))}
        </div>
      )}
      {layout === 'compact' && domains.length > 0 && (
        <div data-slot="foundation-toolbar-picker" className={foundationToolbarPickerVariants()}>
          <Combobox aria-label={searchLabel} placeholder={searchPlaceholder} disabled={disabled} options={options} value={chosen} onValueChange={setChosen} />
        </div>
      )}
    </div>
  );
}
