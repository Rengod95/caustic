'use client';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { radiusClass, shadowClass, type CommonProps } from '../../lib/common-props.ts';
import {
  colorTileAuditVariants, colorTileBodyVariants, colorTileMarkVariants, colorTileNameVariants,
  colorTileSampleVariants, colorTileSwatchVariants, colorTileValueVariants, colorTileVariants,
} from './color-tile.variants.ts';

export interface ColorTileAudit {
  /** Label of the background tested against ("White"). */
  against: string;
  ratio: number;
  /** ratio >= 4.5 */
  pass: boolean;
}

/**
 * Common props (lib/common-props.ts): variant = tile emphasis (default ghost: no box, the swatch is the card and the text sits under it), tone =
 * hairline (outline) or body tint (soft) colour (default neutral), size = swatch height, paddings and sample (xs 48 · sm 64 ·
 * md 74 · lg 74 with a larger sample), radius = corners (default xl), shadow = elevation (default none).
 */
export interface ColorTileProps extends Omit<ComponentProps<'div'>, 'children' | 'color'>, CommonProps {
  /** Token name. */
  name: string;
  /** CSS color of the swatch; set as --tile-bg. */
  color: string;
  /** Text color on the swatch; set as --tile-fg. */
  onColor: string;
  /** Value text shown on the swatch. */
  value: string;
  audit: ColorTileAudit[];
}

/** Read-only color token tile with a contrast audit against white and black. */
export function ColorTile({ name, color, onColor, value, audit, tone, variant, radius, shadow, size, className, ...props }: ColorTileProps) {
  // ghost (the default) has no tile box: the swatch carries the radius and the elevation, the body is plain text.
  const bare = (variant ?? 'ghost') === 'ghost';
  const frame = cn(radius && radius !== 'xl' && radiusClass[radius], shadow && shadow !== 'none' && shadowClass[shadow]);
  const cls = cn(colorTileVariants({ variant, tone, size }), !bare && frame, className);
  return (
    <div role="group" aria-label={name} data-slot="color-tile" className={cls} {...props}>
      <div data-slot="color-tile-swatch" className={cn(colorTileSwatchVariants({ swatchSize: size, bare }), bare && frame)} style={{ '--tile-bg': color, '--tile-fg': onColor } as CSSProperties}>
        <span data-slot="color-tile-sample" className={colorTileSampleVariants({ sampleSize: size })}>Aa</span>
        <span data-slot="color-tile-value" className={colorTileValueVariants()}>{value}</span>
      </div>
      <div data-slot="color-tile-body" className={colorTileBodyVariants({ bodySize: size, bare })}>
        <b data-slot="color-tile-name" className={colorTileNameVariants()}>{name}</b>
        <div data-slot="color-tile-audit" className={colorTileAuditVariants()}>
          {audit.map(a => {
            const result = a.pass ? 'pass' : 'fail';
            return (
              <span key={a.against} data-slot="color-tile-audit-item">
                {a.against}{' '}
                <span data-slot="color-tile-mark" data-result={result} className={colorTileMarkVariants({ result })}>
                  {/* The glyph is decorative: the hidden word carries the result. */}
                  <span aria-hidden="true">{a.pass ? '✓' : '✗'}</span> {a.ratio.toFixed(1)}<span className="sr-only"> {a.pass ? 'passes' : 'fails'}</span>
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
