'use client';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import type { ComponentProps, MouseEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { zoomButtonVariants, zoomControlVariants, zoomReadoutVariants } from './zoom-control.variants.ts';

export interface ZoomControlProps extends Omit<ComponentProps<'div'>, 'aria-label'>, Omit<CommonProps, 'variant'> {
  /** The formatted zoom level, e.g. "100%". */
  value: string;
  /** glass (default) = floating capsule; ghost = no surface, for use inside a FloatingBar; solid, soft, outline = plain capsules. */
  variant?: 'glass' | 'solid' | 'soft' | 'outline' | 'ghost' | undefined;
  /** @deprecated use variant: glass = glass, bare = ghost. */
  appearance?: 'glass' | 'bare' | undefined;
  /** menu = the value is a button the consumer wires to the zoom menu; static = plain text. */
  readout?: 'menu' | 'static' | undefined;
  /** The zoom menu is open (the consumer's state): aria-expanded and data-state on the menu readout; its chevron turns. */
  open?: boolean | undefined;
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
  value = '100%', variant, appearance, readout = 'menu', open, tone, radius, shadow, size = 'md', label, zoomOutLabel, zoomInLabel, className, onZoomOut, onZoomIn, onReadoutClick, ...props
}: ZoomControlProps) {
  const look = variant ?? (appearance === 'bare' ? 'ghost' : 'glass');
  return (
    <div data-slot="zoom-control" data-variant={look} data-size={size} role="group" aria-label={label} className={cn(zoomControlVariants({ variant: look, radius, shadow }), className)} {...props}>
      <button type="button" data-slot="zoom-control-zoom-out" aria-label={zoomOutLabel} className={zoomButtonVariants({ size })} onClick={onZoomOut}>
        <Minus aria-hidden />
      </button>
      {readout === 'menu' ? (
        <button
          type="button" data-slot="zoom-control-readout" aria-haspopup="menu" aria-expanded={open} data-state={open === undefined ? undefined : open ? 'open' : 'closed'}
          className={zoomReadoutVariants({ readout, tone, size })} onClick={onReadoutClick}
        >
          {value}
          <ChevronDown data-slot="zoom-control-chevron" aria-hidden className="size-icon-xs text-text-tertiary transition-[rotate] duration-quick ease-out group-data-[state=open]/zoom-readout:rotate-180" />
        </button>
      ) : (
        <span data-slot="zoom-control-readout" className={zoomReadoutVariants({ readout, tone, size })}>{value}</span>
      )}
      <button type="button" data-slot="zoom-control-zoom-in" aria-label={zoomInLabel} className={zoomButtonVariants({ size })} onClick={onZoomIn}>
        <Plus aria-hidden />
      </button>
    </div>
  );
}
