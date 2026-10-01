import { useRef, type KeyboardEvent } from 'react';

interface RovingOptions {
  /** CSS selector of the focusable items inside the container. */
  selector: string;
  onEscape?: () => void;
  onTab?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * Keyboard navigation for an in-place list whose items take focus: arrows (wrapping), Home, End,
 * typeahead on the label text, Escape and Tab. Returns the onKeyDown handler for the list container.
 */
export function useRovingItems({ selector, onEscape, onTab, onKeyDown }: RovingOptions) {
  const typed = useRef({ text: '', timer: 0 });
  return (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(selector));
    const at = items.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => { e.preventDefault(); items[(i + items.length) % items.length]?.focus(); };
    if (e.key === 'ArrowDown') go(at < 0 ? 0 : at + 1);
    else if (e.key === 'ArrowUp') go(at < 0 ? items.length - 1 : at - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if (e.key === 'Escape') { e.preventDefault(); onEscape?.(); }
    else if (e.key === 'Tab') onTab?.();
    else if (e.key.length === 1 && e.key !== ' ' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      window.clearTimeout(typed.current.timer);
      typed.current.text += e.key.toLowerCase();
      typed.current.timer = window.setTimeout(() => { typed.current.text = ''; }, 600);
      [...items.slice(at + 1), ...items.slice(0, at + 1)].find(i => i.textContent?.trim().toLowerCase().startsWith(typed.current.text))?.focus();
    }
  };
}
