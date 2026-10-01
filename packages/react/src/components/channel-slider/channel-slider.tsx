'use client';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Badge } from '../badge/badge.tsx';
import { SliderField } from '../slider-field/slider-field.tsx';

export interface OklchValue { l: number; c: number; h: number }

export interface ChannelSliderProps extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** Controlled color: l 0–1, c 0–0.37, h 0–360. */
  value?: OklchValue;
  defaultValue?: OklchValue;
  onValueChange?: (value: OklchValue) => void;
  /** Footnote under the rows. */
  note?: ReactNode;
  disabled?: boolean;
}

const DEFAULT: OklchValue = { l: 0.66, c: 0.17, h: 42 };
const MAX_C = 0.37;

const color = (l: number, c: number, h: number) => `oklch(${l} ${c} ${h})`;
/** A linear-gradient across one channel, the other two held fixed. */
const ramp = (at: (t: number) => string, n = 8) => `linear-gradient(90deg, ${Array.from({ length: n + 1 }, (_, i) => at(i / n)).join(', ')})`;
const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

/** Token value editor for one OKLCH color: swatch, readout and L / C / H rows that paint their real range. */
export function ChannelSlider({ value, defaultValue = DEFAULT, onValueChange, note, disabled = false, className, ...props }: ChannelSliderProps) {
  const [v, setV] = useControllableState<OklchValue>({ value, defaultValue, onChange: onValueChange });
  const swatch = color(round(v.l, 2), round(v.c, 2), Math.round(v.h));
  const vars = { '--c': swatch } as CSSProperties;
  return (
    <div data-slot="channel-slider" className={cn('grid gap-3', className)} {...props}>
      <div data-slot="channel-slider-header" className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span data-slot="channel-slider-well" aria-hidden style={vars} className="size-control-md shrink-0 rounded-md bg-(color:--c) shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]" />
          <span data-slot="channel-slider-readout" aria-live="polite" className="font-mono text-mono text-text-primary">{swatch}</span>
        </span>
        <Badge data-slot="channel-slider-mode" tone="outline" shape="square">OKLCH</Badge>
      </div>
      <div data-slot="channel-slider-rows" className="grid gap-3">
        <SliderField
          label="L" aria-label="Lightness" unit="%" appearance="gradient" disabled={disabled} thumbColor={swatch}
          gradient={ramp(t => color(t, v.c, v.h))}
          value={round(v.l * 100, 2)} min={0} max={100} onValueChange={x => setV({ ...v, l: x / 100 })}
        />
        <SliderField
          label="C" aria-label="Chroma" appearance="gradient" disabled={disabled} thumbColor={swatch}
          gradient={ramp(t => color(v.l, round(t * MAX_C, 4), v.h))}
          value={round(v.c * 100, 2)} min={0} max={MAX_C * 100} fieldScale={100} onValueChange={x => setV({ ...v, c: x / 100 })}
        />
        <SliderField
          label="H" aria-label="Hue" unit="°" appearance="gradient" disabled={disabled} thumbColor={swatch}
          gradient={ramp(t => color(v.l, v.c, t * 360), 12)}
          value={round(v.h, 2)} min={0} max={360} onValueChange={x => setV({ ...v, h: x })}
        />
      </div>
      {note != null && <p data-slot="channel-slider-note" className="m-0 text-hint text-text-tertiary">{note}</p>}
    </div>
  );
}
