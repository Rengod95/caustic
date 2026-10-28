'use client';
import { Check } from 'lucide-react';
import { useRef, type ComponentProps, type CSSProperties, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { colorPickerSwatchCheckVariants, colorPickerSwatchDotVariants, colorPickerSwatchVariants, colorPickerSwatchesVariants } from './color-picker-swatches.variants.ts';

export interface SwatchItem {
  id: string;
  /** Any CSS color: a hex or a var(--cs-...) token color. */
  color: string;
  /** Accessible name; token labels should say so ("accent token"). */
  label: string;
  /** Token swatch: carries the accent dot. */
  token?: boolean;
}

export interface ColorPickerSwatchesProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'>, CommonProps {
  items: SwatchItem[];
  /** Controlled id of the picked swatch. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Grid columns: 9 in the full picker, 8 in the compact one. */
  columns?: number;
}

/**
 * ColorPicker.Swatches: a radio group of equal palette swatches; the checked one carries a bare check over the colour
 * (no ring), token swatches carry an accent dot. ColorPicker renders it in the swatches section; it also works on its own.
 */
export function ColorPickerSwatches({ items, value, defaultValue = '', onValueChange, columns = 9, tone, variant, radius, shadow, size, className, style, onKeyDown, ...props }: ColorPickerSwatchesProps) {
  const [current, setCurrent] = useControllableState<string>({ value, defaultValue, onChange: onValueChange });
  const ref = useRef<HTMLDivElement>(null);
  const tabbable = items.some(i => i.id === current) ? current : items[0]?.id;
  const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    const nodes = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [])];
    const i = nodes.findIndex(n => n === document.activeElement);
    const next = nodes[(Math.max(i, 0) + step + nodes.length) % nodes.length];
    if (!next) return;
    e.preventDefault();
    next.focus();
    setCurrent(next.dataset.id ?? '');
  };
  return (
    <div
      ref={ref} role="radiogroup" data-slot="color-picker-swatches" onKeyDown={keyDown}
      className={cn(colorPickerSwatchesVariants({ swatchTone: tone, swatchVariant: variant, swatchGap: size, swatchShadow: shadow }), className)}
      style={{ ...style, '--swatch-cols': `repeat(${columns}, minmax(0, 1fr))` } as CSSProperties}
      {...props}
    >
      {items.map(item => {
        const checked = item.id === current;
        return (
          <button
            key={item.id} type="button" role="radio" data-slot="color-picker-swatch" data-id={item.id} data-token={item.token || undefined}
            aria-checked={checked} aria-label={item.label} tabIndex={item.id === tabbable ? 0 : -1}
            onClick={() => setCurrent(item.id)}
            className={colorPickerSwatchVariants({ swatchVariant: variant, swatchRadius: radius })}
            style={{ '--swatch': item.color } as CSSProperties}
          >
            {checked ? <span data-slot="color-picker-swatch-check" aria-hidden className={colorPickerSwatchCheckVariants()}><Check /></span> : null}
            {item.token ? <span data-slot="color-picker-swatch-dot" aria-hidden className={colorPickerSwatchDotVariants()} /> : null}
          </button>
        );
      })}
    </div>
  );
}
