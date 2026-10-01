'use client';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
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

export interface ColorTileProps extends Omit<ComponentProps<'div'>, 'children' | 'color'> {
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
export function ColorTile({ name, color, onColor, value, audit, className, style, ...props }: ColorTileProps) {
  return (
    <div role="group" aria-label={name} data-slot="color-tile" className={cn(colorTileVariants(), className)} style={style} {...props}>
      <div data-slot="color-tile-swatch" className={colorTileSwatchVariants()} style={{ '--tile-bg': color, '--tile-fg': onColor } as CSSProperties}>
        <span data-slot="color-tile-sample" className={colorTileSampleVariants()}>Aa</span>
        <span data-slot="color-tile-value" className={colorTileValueVariants()}>{value}</span>
      </div>
      <div data-slot="color-tile-body" className={colorTileBodyVariants()}>
        <b data-slot="color-tile-name" className={colorTileNameVariants()}>{name}</b>
        <div data-slot="color-tile-audit" className={colorTileAuditVariants()}>
          {audit.map(a => {
            const result = a.pass ? 'pass' : 'fail';
            return (
              <span key={a.against} data-slot="color-tile-audit-item">
                {a.against}{' '}
                <span data-slot="color-tile-mark" data-result={result} className={colorTileMarkVariants({ result })}>
                  {a.pass ? '✓' : '✗'} {a.ratio.toFixed(1)}<span className="sr-only"> {a.pass ? 'passes' : 'fails'}</span>
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
