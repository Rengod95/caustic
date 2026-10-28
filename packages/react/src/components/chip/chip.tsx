'use client';
import { Check, X } from 'lucide-react';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { radiusClass, shadowClass, type Radius, type Shadow, type Size, type Tone, type Variant } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { chipCheckVariants, chipCountVariants, chipIconVariants, chipRemoveVariants, chipVariants, type ChipVariantProps } from './chip.variants.ts';

/** The emphasis: the common variants plus the chip's own dashed (add-new) and surface (token form). */
export type ChipVariant = Variant | 'dashed' | 'surface';

export interface ChipProps extends Omit<ComponentProps<'button'>, 'children' | 'onToggle'>, ChipVariantProps {
  /** Hue of the emphasis. */
  tone?: Tone;
  /** Emphasis: soft (default), outline, solid, ghost, dashed or surface. */
  variant?: ChipVariant;
  /** @deprecated use variant */
  appearance?: ChipVariant;
  /** Corner radius token; unset keeps the pill (rounded form: md). */
  radius?: Radius;
  /** Elevation; unset = none. */
  shadow?: Shadow;
  /** Height 18 · 20 · 24 · 28 (pill form). */
  size?: Size;
  /** Leading icon. */
  icon?: ReactNode;
  /** Leading status dot (in the text color). */
  dot?: boolean;
  /** Trailing count. */
  count?: ReactNode;
  /** Controlled on state. Makes the chip a toggle button (aria-pressed). */
  pressed?: boolean;
  /** Uncontrolled initial on state. Also makes the chip a toggle. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Shows the × button. Ignored on toggle chips (pressed/defaultPressed): a chip is a toggle or removable, never both. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** aria-label of the × button; the chip label is appended. */
  removeLabel?: string;
  children: ReactNode;
}

/** The one chip: filter, quick option, toggle or removable reference. A button only when interactive. */
export function Chip({
  variant, appearance, tone, shape, size, radius, shadow, icon, dot = false, count, pressed, defaultPressed, onPressedChange, onRemove,
  removeLabel = 'Remove', className, children, onClick, ...props
}: ChipProps) {
  const toggle = pressed !== undefined || defaultPressed !== undefined;
  const [on, setOn] = useControllableState({ value: pressed, defaultValue: defaultPressed ?? false, onChange: onPressedChange });
  // A chip is a toggle OR removable, never both: a toggle chip ignores onRemove (a button cannot contain the × button).
  const removable = onRemove !== undefined && !toggle;
  const interactive = toggle || onClick !== undefined;
  const v = variant ?? appearance;
  const eff = shape === 'rounded' ? (v ?? 'surface') : v;

  const content = (
    <>
      {/* The on state is carried by aria-pressed and this check, never by the fill alone. */}
      {toggle && on ? <span data-slot="chip-check" aria-hidden className={chipCheckVariants({ shape })}><Check aria-hidden /></span> : null}
      {icon ? <span data-slot="chip-icon" aria-hidden className={chipIconVariants({ shape })}>{icon}</span> : null}
      {dot ? <span data-slot="chip-dot" aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" /> : null}
      <span data-slot="chip-label">{children}</span>
      {count !== undefined && count !== null ? <span data-slot="chip-count" className={chipCountVariants()}>{count}</span> : null}
      {removable ? (
        <button
          type="button"
          data-slot="chip-remove"
          aria-label={typeof children === 'string' ? `${removeLabel} ${children}` : removeLabel}
          className={chipRemoveVariants({ shape })}
          onClick={onRemove}
        >
          <X aria-hidden />
        </button>
      ) : null}
    </>
  );

  const common = {
    'data-variant': eff ?? 'soft',
    'data-tone': tone ?? 'neutral',
    'data-shape': shape ?? 'pill',
    'data-size': size ?? 'md',
    className: cn(chipVariants({ variant: eff, tone, shape, size, interactive }), radius && radius !== 'full' && radiusClass[radius], shadow && shadow !== 'none' && shadowClass[shadow], className),
  };

  if (interactive) {
    return (
      <button
        type="button"
        data-slot="chip"
        {...common}
        aria-pressed={toggle ? on : undefined}
        onClick={(e: MouseEvent<HTMLButtonElement>) => { onClick?.(e); if (toggle) setOn(!on); }}
        {...props}
      >
        {content}
      </button>
    );
  }
  return (
    <span data-slot="chip" {...common} {...(props as ComponentProps<'span'>)} onClick={onClick as ComponentProps<'span'>['onClick']}>
      {content}
    </span>
  );
}
