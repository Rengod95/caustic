'use client';
import { useCallback, useEffect, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode, type Ref, type UIEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { scrollAreaContentVariants, scrollAreaVariants, scrollAreaViewportVariants } from './scroll-area.variants.ts';

export interface ScrollAreaProps extends Omit<ComponentProps<'div'>, 'onScroll' | 'children'> {
  /** Which axes scroll. The others are overflow hidden. */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Scrollbar visibility: on hover, focus and scroll, or always. */
  scrollbar?: 'hover' | 'always';
  /** Fade the content out at the edges where more content continues. With orientation "both" the fade follows the vertical axis. */
  fade?: boolean;
  /** Accessible name of the scrolling region. Applied (as role="region") only while the content overflows. Supplied by the app so it can be translated. */
  label?: string | undefined;
  /** Ref to the scrolling element, for scroll-to-bottom and measuring. */
  viewportRef?: Ref<HTMLDivElement>;
  /** The viewport scrolled (native event, unthrottled). */
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
  children?: ReactNode;
}

interface Overflow { yStart: boolean; yEnd: boolean; xStart: boolean; xEnd: boolean; scrollable: boolean }
const NONE: Overflow = { yStart: false, yEnd: false, xStart: false, xEnd: false, scrollable: false };
const EDGE = 1;
const SCROLLING_MS = 800;
/** Share of the viewport a Page key moves, matching the native step. */
const PAGE_RATIO = 0.875;

function measure(el: HTMLElement, orientation: 'vertical' | 'horizontal' | 'both'): Overflow {
  const y = orientation !== 'horizontal', x = orientation !== 'vertical';
  const yOver = y && el.scrollHeight > el.clientHeight + EDGE;
  const xOver = x && el.scrollWidth > el.clientWidth + EDGE;
  return {
    yStart: yOver && el.scrollTop > EDGE,
    yEnd: yOver && el.scrollTop + el.clientHeight < el.scrollHeight - EDGE,
    xStart: xOver && el.scrollLeft > EDGE,
    xEnd: xOver && el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE,
    scrollable: yOver || xOver,
  };
}

const same = (a: Overflow, b: Overflow) => a.yStart === b.yStart && a.yEnd === b.yEnd && a.xStart === b.xStart && a.xEnd === b.xEnd && a.scrollable === b.scrollable;

function setRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) (ref as { current: T | null }).current = node;
}

/** A native scroller with a token-styled thin scrollbar, optional edge fade and overflow state attributes. */
export function ScrollArea({ orientation = 'vertical', scrollbar, fade = false, label, viewportRef, onScroll, className, children, ...props }: ScrollAreaProps) {
  const [overflow, setOverflow] = useState<Overflow>(NONE);
  const [scrolling, setScrolling] = useState(false);
  const viewport = useRef<HTMLDivElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const update = useCallback(() => {
    const el = viewport.current; if (!el) return;
    const next = measure(el, orientation);
    setOverflow(prev => (same(prev, next) ? prev : next));
  }, [orientation]);

  const attach = useCallback((node: HTMLDivElement | null) => { viewport.current = node; setRef(viewportRef, node); }, [viewportRef]);

  useEffect(() => {
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    if (viewport.current) ro.observe(viewport.current);
    if (content.current) ro.observe(content.current);
    return () => ro.disconnect();
  }, [update]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    onScroll?.(e);
    update();
    setScrolling(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setScrolling(false), SCROLLING_MS);
  };

  // Chromium animates native keyboard scrolling whatever scroll-behavior says. The jump keys are applied directly so the
  // viewport (and its overflow attributes) settle at once; arrows and wheel stay native.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.target !== e.currentTarget || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const el = e.currentTarget;
    const horizontal = orientation === 'horizontal';
    const size = horizontal ? el.clientWidth : el.clientHeight;
    const max = (horizontal ? el.scrollWidth : el.scrollHeight) - size;
    const at = horizontal ? el.scrollLeft : el.scrollTop;
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? max : e.key === 'PageDown' ? at + size * PAGE_RATIO : e.key === 'PageUp' ? at - size * PAGE_RATIO : null;
    if (to === null) return;
    e.preventDefault();
    const next = Math.min(max, Math.max(0, to));
    if (horizontal) el.scrollLeft = next; else el.scrollTop = next;
  };

  const showY = orientation !== 'horizontal', showX = orientation !== 'vertical';

  return (
    <div data-slot="scroll-area" data-scrollbar={scrollbar ?? 'hover'} className={cn('group/scroll-area', scrollAreaVariants({ scrollbar }), className)} {...props}>
      <div
        ref={attach}
        data-slot="scroll-area-viewport"
        data-scrolling={scrolling ? 'true' : undefined}
        data-overflow-y-start={showY ? String(overflow.yStart) : undefined}
        data-overflow-y-end={showY ? String(overflow.yEnd) : undefined}
        data-overflow-x-start={showX ? String(overflow.xStart) : undefined}
        data-overflow-x-end={showX ? String(overflow.xEnd) : undefined}
        role={overflow.scrollable && label ? 'region' : undefined}
        aria-label={overflow.scrollable && label ? label : undefined}
        tabIndex={overflow.scrollable ? 0 : undefined}
        className={scrollAreaViewportVariants({ scrollbar, orientation, fade })}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
      >
        <div ref={content} data-slot="scroll-area-content" className={scrollAreaContentVariants({ orientation })}>{children}</div>
      </div>
    </div>
  );
}
