'use client';
import { cloneElement, isValidElement, type ComponentProps, type CSSProperties, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { colorWellPaintVariants, colorWellVariants, type ColorWellVariantProps } from './color-well.variants.ts';

export interface ColorWellProps extends Omit<ComponentProps<'span'>, 'color'>, Omit<ColorWellVariantProps, 'interactive'> {
  /** CSS color or gradient to paint. Runtime data, set as a custom property. */
  color?: string | undefined;
  /** With split: the opaque color of the top-left triangle. */
  solidColor?: string | undefined;
  /** Diagonal split: opaque top-left, translucent bottom-right. Use for colors with alpha below 100%. */
  split?: boolean | undefined;
  /** Multi-selection with differing paints: a hatch instead of a color. */
  mixed?: boolean;
  /** This swatch is the active one. */
  selected?: boolean;
  /** Render the child (a popover trigger) with swatch styling. */
  asChild?: boolean;
}

/** The swatch of a paint: flat color, gradient or alpha over a checkerboard. A button when it has an onClick (or asChild). */
export function ColorWell({ size, appearance, color, solidColor, split = false, mixed = false, selected = false, asChild = false, className, style, children, onClick, ...props }: ColorWellProps) {
  const interactive = asChild || onClick != null;
  const vars = { ...style, ...(color ? { '--well-color': color } : {}), ...(solidColor ? { '--well-solid': solidColor } : {}) } as CSSProperties;
  const inner: ReactNode = (
    <>
      <span data-slot="color-well-paint" aria-hidden className={colorWellPaintVariants({ split: split && !mixed, mixed })} />
      {split && !mixed ? <span data-slot="color-well-solid" aria-hidden className="absolute inset-0 z-10 [background:var(--well-solid,var(--well-color))] [clip-path:polygon(0_0,100%_0,0_100%)]" /> : null}
    </>
  );
  const className2 = cn(colorWellVariants({ size, appearance, interactive }), className);
  const state = { 'data-size': size ?? 'md', 'data-appearance': appearance ?? 'flat', 'data-selected': selected || undefined, 'data-mixed': mixed || undefined };
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    return cloneElement(child, { ...props, ...state, 'data-slot': 'color-well', className: cn(className2, child.props.className as string | undefined), style: vars }, inner);
  }
  const press = onClick
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e: KeyboardEvent<HTMLSpanElement>) => {
          props.onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); }
        },
      }
    : {};
  return <span {...props} {...press} data-slot="color-well" {...state} className={className2} style={vars}>{inner}</span>;
}
