'use client';
import { createContext, useContext, useRef, type ComponentProps, type CSSProperties, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import {
  themeGalleryActionsVariants, themeGalleryActionVariants, themeGalleryCaptionVariants, themeGalleryHeadingBarVariants,
  themeGalleryItemVariants, themeGalleryMainVariants, themeGalleryMetaVariants, themeGalleryNameVariants,
  themeGalleryPanelLineVariants, themeGalleryPanelVariants, themeGalleryPreviewVariants, themeGallerySidebarItemVariants,
  themeGallerySidebarVariants, themeGallerySwatchesVariants, themeGallerySwatchVariants, themeGalleryVariants,
} from './theme-gallery.variants.ts';

interface Ctx { value: string; select: (id: string) => void }
const GalleryCtx = createContext<Ctx | null>(null);

export interface ThemeGalleryProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  /** Called when a different theme is picked. It previews; the consumer applies. */
  onValueChange?: (value: string) => void;
}

/** A radiogroup of theme cards: each is a miniature app drawn from the theme's own colors and radius. */
export function ThemeGallery({ value, defaultValue = '', onValueChange, onKeyDown, className, ...props }: ThemeGalleryProps) {
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const ref = useRef<HTMLDivElement>(null);
  // Arrow keys and Home/End select synchronously and move focus, so selection never lags behind roving focus.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step && e.key !== 'Home' && e.key !== 'End') return;
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [])];
    if (!items.length) return;
    const i = items.findIndex(el => el === document.activeElement);
    const next = e.key === 'Home' ? items[0] : e.key === 'End' ? items[items.length - 1] : items[(i + (step ?? 0) + items.length) % items.length];
    e.preventDefault();
    next?.focus();
    if (next?.dataset.value !== undefined) setCurrent(next.dataset.value);
  };
  return (
    <GalleryCtx.Provider value={{ value: current, select: setCurrent }}>
      <div ref={ref} role="radiogroup" data-slot="theme-gallery" className={cn(themeGalleryVariants(), className)} onKeyDown={handleKeyDown} {...props} />
    </GalleryCtx.Provider>
  );
}

export interface ThemeGalleryPreview {
  background: string;
  surface: string;
  accent: string;
  ink: string;
  muted: string;
  /** Button radius as a CSS length. */
  radius: string;
}

export interface ThemeGalleryItemProps extends Omit<ComponentProps<'button'>, 'value' | 'children' | 'style'> {
  /** Identity of the theme (the radio value). */
  themeId: string;
  /** Theme name. */
  name: string;
  /** One-line description. */
  description?: string;
  preview: ThemeGalleryPreview;
  /** State hook for fixtures; normally derived from the group's value. */
  checked?: boolean;
}

export function ThemeGalleryItem({ themeId, name, description, preview, checked, disabled, className, onClick, ...props }: ThemeGalleryItemProps) {
  const ctx = useContext(GalleryCtx);
  const selected = checked ?? ctx?.value === themeId;
  return (
    <button
      type="button" role="radio" data-slot="theme-gallery-item" data-value={themeId} data-state={selected ? 'checked' : 'unchecked'}
      aria-checked={selected} tabIndex={selected || !ctx?.value ? 0 : -1} disabled={disabled}
      className={cn(themeGalleryItemVariants(), className)} style={{ '--m-bg': preview.background, '--m-surf': preview.surface, '--m-acc': preview.accent, '--m-ink': preview.ink, '--m-muted': preview.muted, '--m-r': preview.radius } as CSSProperties}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) ctx?.select(themeId); }}
      {...props}
    >
      <div data-slot="theme-gallery-preview" aria-hidden="true" className={themeGalleryPreviewVariants()}>
        <div data-slot="theme-gallery-sidebar" className={themeGallerySidebarVariants()}>
          {[0, 1, 2, 3].map(n => <i key={n} data-slot="theme-gallery-sidebar-item" className={themeGallerySidebarItemVariants()} />)}
        </div>
        <div data-slot="theme-gallery-main" className={themeGalleryMainVariants()}>
          <span data-slot="theme-gallery-heading-bar" className={themeGalleryHeadingBarVariants()} />
          <div data-slot="theme-gallery-panel" className={themeGalleryPanelVariants()}>
            <i data-slot="theme-gallery-panel-line" className={themeGalleryPanelLineVariants()} />
            <i data-slot="theme-gallery-panel-line" className={themeGalleryPanelLineVariants()} />
          </div>
          <div data-slot="theme-gallery-actions" className={themeGalleryActionsVariants()}>
            <b data-slot="theme-gallery-action" className={themeGalleryActionVariants()} />
            <b data-slot="theme-gallery-action" className={themeGalleryActionVariants()} />
          </div>
        </div>
      </div>
      <div data-slot="theme-gallery-meta" className={themeGalleryMetaVariants()}>
        <div className="grid flex-1">
          <b data-slot="theme-gallery-name" className={themeGalleryNameVariants()}>{name}</b>
          {description != null && <span data-slot="theme-gallery-caption" className={themeGalleryCaptionVariants()}>{description}</span>}
        </div>
        <span data-slot="theme-gallery-swatches" aria-hidden="true" className={themeGallerySwatchesVariants()}>
          <i data-slot="theme-gallery-swatch" className={cn(themeGallerySwatchVariants(), 'bg-(--m-acc)')} />
          <i data-slot="theme-gallery-swatch" className={cn(themeGallerySwatchVariants(), 'bg-(--m-ink)')} />
          <i data-slot="theme-gallery-swatch" className={cn(themeGallerySwatchVariants(), 'bg-(--m-bg)')} />
        </span>
      </div>
    </button>
  );
}
