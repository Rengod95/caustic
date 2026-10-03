'use client';
import { useId, useLayoutEffect, useRef, type ComponentProps, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { ResizeHandle } from '../resize-handle/resize-handle.tsx';
import { ScrollArea } from '../scroll-area/scroll-area.tsx';
import { sidePanelFooterVariants, sidePanelHeaderVariants, sidePanelVariants, type SidePanelVariantProps } from './side-panel.variants.ts';

type Size = 'inspector' | 'pane' | 'wide';

/** Width presets in px: the Foundation shell metrics (studio.inspector-*, studio.pane-*). "wide" is fixed. */
const PRESETS: Record<Size, { width: number; bounds: { min: number; max: number } | null }> = {
  inspector: { width: 272, bounds: { min: 240, max: 360 } },
  pane: { width: 352, bounds: { min: 320, max: 480 } },
  wide: { width: 480, bounds: null },
};

export interface SidePanelProps extends Omit<ComponentProps<'aside'>, 'title' | 'children' | 'style'>, Omit<SidePanelVariantProps, 'size'> {
  /** Accessible name of the landmark, supplied by the app so it can be translated. */
  label: string;
  /** Width preset: inspector 272 (240-360), pane 352 (320-480), wide 480 (fixed). */
  size?: Size;
  /** Controlled width in px, clamped to the preset's bounds. Ignored by the fixed "wide" preset. */
  width?: number;
  /** Uncontrolled initial width in px; the preset width when omitted. */
  defaultWidth?: number;
  /** Show the resize handle (not in the compact layout). Needs resizeLabel; without it no handle is rendered. */
  resizable?: boolean;
  /** Accessible name of the resize handle. */
  resizeLabel?: string;
  /** aria-valuetext builder passed to the handle. */
  formatWidthText?: (width: number) => string;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Uncontrolled initial collapsed state. */
  defaultCollapsed?: boolean;
  /** Render the collapse button. It needs collapseLabel; without it no button is rendered. */
  collapsible?: boolean;
  /** aria-label of the collapse button. */
  collapseLabel?: string;
  /** Key combination that toggles collapse while focus is inside the panel, for example "Alt+[". */
  shortcut?: string;
  /** Header title. Use header instead for tabs. */
  title?: ReactNode;
  /** Header content in place of title (panel tabs, a segmented control). */
  header?: ReactNode;
  /** Header actions. */
  actions?: ReactNode;
  /** Footer content. */
  footer?: ReactNode;
  /** Hairlines under the header and above the footer. */
  dividers?: boolean;
  /** Region label for the body scroller when it is a primary reading surface. */
  scrollLabel?: string;
  /** Collapse was requested (button, shortcut): true to collapse, false to expand. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** The resize handle changed the width (clamped px). */
  onWidthChange?: (width: number) => void;
  children?: ReactNode;
}

/** True when a KeyboardEvent matches a "Mod+Mod+Key" combination exactly. */
function matchesShortcut(e: KeyboardEvent, shortcut: string) {
  const parts = shortcut.split('+');
  const key = parts.pop() ?? '';
  const mods = new Set(parts.map(m => m.toLowerCase()));
  const same = (a: string, b: string) => (a.length === 1 && b.length === 1 ? a.toLowerCase() === b.toLowerCase() : a === b);
  return e.altKey === mods.has('alt') && e.ctrlKey === mods.has('ctrl') && e.metaKey === mods.has('meta') && e.shiftKey === mods.has('shift') && same(e.key, key);
}

/** Frame of a studio side region: labelled landmark, header, scrolling body, optional footer, resize and collapse. Holds no content logic. */
export function SidePanel({
  label, side, appearance, size = 'pane', width, defaultWidth, resizable = false, resizeLabel, formatWidthText,
  collapsed, defaultCollapsed = false, collapsible = true, collapseLabel, shortcut, title, header, actions, footer, dividers = true, scrollLabel,
  onCollapsedChange, onWidthChange, id, className, children, onKeyDown, ...props
}: SidePanelProps) {
  const generated = useId();
  const panelId = id ?? generated;
  const edge = side ?? 'start';
  const preset = PRESETS[size];
  const ref = useRef<HTMLElement | null>(null);

  const [isCollapsed, setCollapsed] = useControllableState({ value: collapsed, defaultValue: defaultCollapsed, onChange: onCollapsedChange });
  const [raw, setWidth] = useControllableState({ value: preset.bounds ? width : undefined, defaultValue: defaultWidth ?? preset.width, onChange: onWidthChange });
  const bounds = preset.bounds;
  const current = bounds ? Math.round(Math.min(bounds.max, Math.max(bounds.min, raw))) : preset.width;

  // Collapsing makes the content inert; hand focus to the external toggle (or the body) before it is lost.
  useLayoutEffect(() => {
    const panel = ref.current;
    if (!isCollapsed || !panel || !panel.contains(document.activeElement)) return;
    const toggle = Array.from(document.querySelectorAll<HTMLElement>('[aria-controls]')).find(el => !panel.contains(el) && el.getAttribute('aria-controls')?.split(' ').includes(panelId));
    if (toggle) toggle.focus(); else (document.activeElement as HTMLElement).blur();
  }, [isCollapsed, panelId]);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !shortcut || !matchesShortcut(e, shortcut)) return;
    e.preventDefault();
    setCollapsed(!isCollapsed);
  };

  // The preset's token supplies the width until the panel is resized or given a custom width.
  const customWidth = current !== preset.width ? `${current}px` : undefined;
  const hasHeader = title != null || header != null;

  return (
    <aside
      ref={ref}
      id={panelId}
      data-slot="side-panel"
      data-side={edge}
      data-appearance={appearance ?? 'floating'}
      data-size={size}
      data-state={isCollapsed ? 'collapsed' : 'expanded'}
      aria-label={label}
      inert={isCollapsed}
      style={{ '--side-panel-w': customWidth } as CSSProperties}
      className={cn(
        sidePanelVariants({ side, appearance, size }),
        isCollapsed ? 'invisible w-0 overflow-hidden' : 'w-(--side-panel-w) group-data-[layout=compact]/app-shell:w-full',
        className,
      )}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div data-slot="side-panel-header" className={sidePanelHeaderVariants({ dividers })}>
        {header != null && <div className="min-w-0 flex-1">{header}</div>}
        {header == null && title != null && <h2 data-slot="side-panel-title" className="min-w-0 flex-1 truncate font-ui text-title-4 text-text-primary">{title}</h2>}
        {!hasHeader && <span aria-hidden className="flex-1" />}
        {actions != null && <div data-slot="side-panel-actions" className="flex flex-none items-center gap-0.5">{actions}</div>}
        {collapsible && collapseLabel !== undefined && (
          <IconButton
            data-slot="side-panel-collapse"
            size="xs"
            label={collapseLabel}
            aria-expanded={!isCollapsed}
            aria-controls={panelId}
            onClick={() => setCollapsed(true)}
          >
            {edge === 'end' ? <PanelRight /> : <PanelLeft />}
          </IconButton>
        )}
      </div>
      <ScrollArea data-slot="side-panel-body" label={scrollLabel} className={cn('flex-1 rounded-t-none', footer != null && 'rounded-b-none')}>{children}</ScrollArea>
      {footer != null && <div data-slot="side-panel-footer" className={sidePanelFooterVariants({ dividers })}>{footer}</div>}
      {resizable && bounds && resizeLabel !== undefined && (
        <ResizeHandle
          data-slot="side-panel-handle"
          label={resizeLabel}
          min={bounds.min}
          max={bounds.max}
          value={current}
          resetValue={preset.width}
          reverse={edge === 'end'}
          formatValueText={formatWidthText}
          controls={panelId}
          onValueChange={setWidth}
          className={cn('absolute inset-y-0 z-10 group-data-[layout=compact]/app-shell:hidden', edge === 'end' ? '-left-1' : '-right-1')}
        />
      )}
    </aside>
  );
}
