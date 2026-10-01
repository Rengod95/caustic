'use client';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { tokenChipSwatchVariants, tokenChipVariants, type TokenChipVariantProps } from './token-chip.variants.ts';

export interface TokenChipProps extends Omit<ComponentProps<'span'>, 'children'>, TokenChipVariantProps {
  /** Swatch fill for color tokens: a CSS color string, or an element rendered inside the swatch. */
  swatch?: ReactNode;
  /** Kind icon for non-color tokens. */
  icon?: ReactNode;
  /** Token path or name; omit for a swatch-only chip. */
  children?: ReactNode;
}

/** Names a design token: a color swatch or kind icon plus the token path in mono. Read-only. */
export function TokenChip({ tone, size, swatch, icon, className, children, ...props }: TokenChipProps) {
  const color = typeof swatch === 'string' ? swatch : undefined;
  return (
    <span data-slot="token-chip" data-tone={tone ?? 'neutral'} data-size={size ?? 'md'} className={cn(tokenChipVariants({ tone, size }), className)} {...props}>
      {swatch != null && swatch !== false ? (
        <span
          data-slot="token-chip-swatch"
          aria-hidden
          className={tokenChipSwatchVariants({ size })}
          style={color ? ({ '--swatch': color } as CSSProperties) : undefined}
        >
          {color ? null : swatch}
        </span>
      ) : null}
      {icon ? <span data-slot="token-chip-icon" aria-hidden className="inline-flex size-icon-xs shrink-0 text-text-tertiary [&_svg]:size-full [&_svg]:stroke-[1.75]">{icon}</span> : null}
      {children != null && children !== false ? <span data-slot="token-chip-label">{children}</span> : null}
    </span>
  );
}
