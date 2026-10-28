'use client';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import {
  badgeDotVariants, badgeIconVariants, badgeLeadVariants, badgeMonoLabelClass, badgeMonoVariants, badgeOrbVariants, badgeSwatchVariants,
  badgeVariants,
} from './badge.variants.ts';

export interface BadgeProps extends ComponentProps<'span'> {
  /**
   * Colour family. The legacy values still work: "solid" = variant solid and "outline" = variant outline (tone neutral).
   * @deprecated tone="solid" and tone="outline": use variant.
   */
  tone?: Tone | 'solid' | 'outline';
  /** Emphasis: soft (default) tinted fill, solid fill, outline edge or ghost text. */
  variant?: Variant;
  /** Corner radius; unset keeps the pill (full), or md with mono or lead. */
  radius?: Radius;
  /** Elevation; unset keeps flat. */
  shadow?: Shadow;
  /** Height and type: xs 18 · sm 20 (default) · md 24 · lg 28. */
  size?: Size;
  /** @deprecated use radius: pill = full (default), square = xs. */
  shape?: 'pill' | 'square';
  /** Leading icon (with mono: the token kind icon, 12px tertiary). */
  icon?: ReactNode;
  /** Leading status dot in the tone graphic colour (the on colour on a solid badge). */
  dot?: boolean;
  /** Leading colour square: a CSS colour string, or an element rendered inside it. Ringed in border.default. */
  swatch?: ReactNode;
  /** Token form: mono type on the well (or the tone soft fill) with an edge, md radius; the label truncates from the start. */
  mono?: boolean;
  /** Leading grade badge ("AA"): the tone solid with its on colour, inverted on a solid badge. Gives the contrast shape. */
  lead?: ReactNode;
  /** Label or count. */
  children?: ReactNode;
}

const present = (n: ReactNode) => n != null && n !== false;

/** Small read-only status or count label, token name (mono, swatch) or graded result (lead). Use Chip for removable tokens and Kbd for keys. */
export function Badge({
  tone: toneProp, variant: variantProp, radius: radiusProp, shadow, size, shape, icon, dot = false, swatch, mono = false, lead, className, children, ...props
}: BadgeProps) {
  // Deprecated aliases: tone solid / outline → variant solid / outline in the neutral tone; shape square → radius xs.
  const legacy = toneProp === 'solid' || toneProp === 'outline' ? toneProp : undefined;
  const tone: Tone = legacy ? 'neutral' : (toneProp as Tone | undefined) ?? 'neutral';
  const variant: Variant = variantProp ?? legacy ?? 'soft';
  const sz: Size = size ?? 'sm';
  const hasLead = present(lead);
  // The deprecated square shape wins over the default radius (full) but not over another explicit radius. The mono and
  // lead forms keep their own md corner unless a radius is given.
  const shaped = shape === 'square' && (radiusProp === undefined || radiusProp === 'full') ? 'xs' : radiusProp;
  const radius: Radius | undefined = shaped ?? (mono || hasLead ? 'md' : undefined);
  const root = mono
    ? badgeMonoVariants({ tone, variant, radius: radius ?? 'md', shadow: shadow ?? 'none', size: sz })
    : badgeVariants({ tone, variant, radius, shadow, size: sz, lead: hasLead });
  const color = typeof swatch === 'string' ? swatch : undefined;
  return (
    <span data-slot="badge" data-tone={tone} data-variant={variant} data-mono={mono || undefined} className={cn(root, className)} {...props}>
      {tone === 'agent' ? <span data-slot="badge-orb" aria-hidden className={badgeOrbVariants({ tone })} /> : null}
      {present(swatch) ? (
        <span data-slot="badge-swatch" aria-hidden className={badgeSwatchVariants({ size: sz })} style={color ? ({ '--swatch': color } as CSSProperties) : undefined}>
          {color ? null : swatch}
        </span>
      ) : null}
      {icon ? <span data-slot="badge-icon" aria-hidden className={badgeIconVariants({ size: sz, mono })}>{icon}</span> : null}
      {dot ? <span data-slot="badge-dot" aria-hidden className={cn(badgeDotVariants({ tone, variant }))} /> : null}
      {hasLead ? <span data-slot="badge-lead" className={badgeLeadVariants({ tone, on: variant, size: sz })}>{lead}</span> : null}
      {mono && present(children) ? (
        // A long path truncates from the front so the useful end (".solid") stays visible: the label runs rtl (ellipsis at
        // the start) and the text sits in an ltr isolate so the dots keep their order. title carries the full path.
        <span data-slot="badge-label" title={typeof children === 'string' ? children : undefined} className={badgeMonoLabelClass}>
          <bdi dir="ltr">{children}</bdi>
        </span>
      ) : hasLead && present(children) ? (
        <span data-slot="badge-label">{children}</span>
      ) : children}
    </span>
  );
}
