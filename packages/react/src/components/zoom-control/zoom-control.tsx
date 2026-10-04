'use client';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import type { ComponentProps, MouseEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { zoomButtonVariants, zoomControlVariants, zoomReadoutVariants } from './zoom-control.variants.ts';

export interface ZoomControlProps extends Omit<ComponentProps<'div'>, 'aria-label'> {
  /** The formatted zoom level, e.g. "100%". */
  value: string;
  /** glass = floating capsule; bare = no surface, for use inside a FloatingBar. */
  appearance?: 'glass' | 'bare' | undefined;
  /** menu = the value is a button the consumer wires to the zoom menu; static = plain text. */
  readout?: 'menu' | 'static' | undefined;
  /** Item height 28 or 26. */
  size?: 'md' | 'sm' | undefined;
  /** aria-label of the group; supplied by the consumer (no built-in text). */
  label: string;
  /** aria-label of the minus button. */
  zoomOutLabel: string;
  /** aria-label of the plus button. */
  zoomInLabel: string;
  onZoomOut?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
  onZoomIn?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
  onReadoutClick?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
}

/** Zoom out, the current zoom and zoom in in one capsule. */
export function ZoomControl({
  value = '100%', appearance = 'glass', readout = 'menu', size = 'md', label, zoomOutLabel, zoomInLabel, className, onZoomOut, onZoomIn, onReadoutClick, ...props
}: ZoomControlProps) {
  return (
    <div data-slot="zoom-control" data-appearance={appearance} data-size={size} role="group" aria-label={label} className={cn(zoomControlVariants({ appearance }), className)} {...props}>
      <button type="button" data-slot="zoom-control-zoom-out" aria-label={zoomOutLabel} className={zoomButtonVariants({ size })} onClick={onZoomOut}>
        <Minus aria-hidden />
      </button>
      {readout === 'menu' ? (
        <button type="button" data-slot="zoom-control-readout" aria-haspopup="menu" className={zoomReadoutVariants({ readout, size })} onClick={onReadoutClick}>
          {value}
          <ChevronDown data-slot="zoom-control-chevron" aria-hidden className="size-icon-xs text-text-tertiary" />
        </button>
      ) : (
        <span data-slot="zoom-control-readout" className={zoomReadoutVariants({ readout, size })}>{value}</span>
      )}
      <button type="button" data-slot="zoom-control-zoom-in" aria-label={zoomInLabel} className={zoomButtonVariants({ size })} onClick={onZoomIn}>
        <Plus aria-hidden />
      </button>
    </div>
  );
}
