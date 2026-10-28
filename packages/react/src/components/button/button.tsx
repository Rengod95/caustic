'use client';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { LoaderCircle } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { buttonFrameVariants, buttonVariants } from './button.variants.ts';

/** The tones before the common props, each a tone + variant pair. */
type LegacyTone = 'ink' | 'secondary' | 'ghost' | 'destructive';
const LEGACY: Record<LegacyTone | 'danger', { tone: Tone; variant: Variant }> = {
  ink: { tone: 'neutral', variant: 'solid' },
  secondary: { tone: 'neutral', variant: 'outline' },
  ghost: { tone: 'neutral', variant: 'ghost' },
  destructive: { tone: 'danger', variant: 'solid' },
  danger: { tone: 'danger', variant: 'soft' },
};

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  /**
   * Colour family. Legacy values still work as tone + variant pairs: ink = neutral solid, secondary = neutral outline,
   * ghost = neutral ghost, destructive = danger solid; danger without a variant keeps the quiet danger soft.
   * @deprecated tone="ink" | "secondary" | "ghost" | "destructive": use tone + variant.
   */
  tone?: Tone | LegacyTone;
  /** Emphasis: solid (default), soft, outline or ghost. */
  variant?: Variant;
  /** Corner radius; unset keeps the size radius (xs sm, sm/md md, lg lg). */
  radius?: Radius;
  /** Elevation; unset keeps the variant's own depth cue (an elevation replaces an edge: both are box-shadow). */
  shadow?: Shadow;
  /** Control height 24 · 28 · 32 · 40. */
  size?: Size;
  /** @deprecated use radius="full" for the pill. */
  shape?: 'rounded' | 'pill';
  /** Shows a spinner, sets aria-busy and blocks activation. */
  loading?: boolean;
  /** Render the child element (e.g. a link) with button styling. */
  asChild?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
}

export function Button({ tone: toneProp, variant: variantProp, radius: radiusProp, shadow, shape, size, loading = false, disabled = false, asChild = false, iconStart, iconEnd, className, children, onClick, ...props }: ButtonProps) {
  // Deprecated aliases: the legacy tones map onto tone + variant (an explicit variant wins); shape pill → radius full.
  const legacy = toneProp && toneProp in LEGACY && (toneProp !== 'danger' || variantProp === undefined) ? LEGACY[toneProp as keyof typeof LEGACY] : undefined;
  const tone: Tone = legacy?.tone ?? (toneProp as Tone | undefined) ?? 'neutral';
  const variant: Variant = variantProp ?? legacy?.variant ?? 'solid';
  // The deprecated pill shape wins over the default radius (md, the size radius) but not over another explicit radius.
  const radius = shape === 'pill' && (radiusProp === undefined || radiusProp === 'md') ? 'full' : radiusProp;
  const Comp = asChild ? Slot : 'button';
  const inert = disabled || loading;
  return (
    <Comp
      data-slot="button"
      data-tone={tone}
      data-variant={variant}
      data-size={size ?? 'md'}
      aria-busy={loading || undefined}
      disabled={asChild ? undefined : disabled}
      aria-disabled={asChild && inert ? true : undefined}
      className={cn(buttonVariants({ tone, variant, size }), buttonFrameVariants({ radius, shadow }), className)}
      onClick={inert ? undefined : onClick}
      {...props}
    >
      {loading ? (
        <span data-slot="button-spinner" className="inline-flex"><LoaderCircle className="animate-spinner" aria-hidden /></span>
      ) : iconStart ? (
        <span data-slot="button-icon" aria-hidden className="inline-flex">{iconStart}</span>
      ) : null}
      <Slottable>{children}</Slottable>
      {iconEnd ? <span data-slot="button-icon" aria-hidden className="inline-flex">{iconEnd}</span> : null}
    </Comp>
  );
}
