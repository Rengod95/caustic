'use client';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { clamp, parseHex, rgbToHex, type Rgb } from '../../lib/color-math.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { HexInput } from '../hex-input/hex-input.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Slider } from '../slider/slider.tsx';
import {
  channelSliderChannelVariants, channelSliderReadoutVariants, channelSliderShapeVariants, channelSliderVariants, channelSliderWellVariants,
} from './channel-slider.variants.ts';

export interface OklchValue { l: number; c: number; h: number }
/** The rows the editor shows: OKLCH channels, HSL channels, or one hex field. The value is OKLCH in every space. */
export type ChannelSpace = 'oklch' | 'hsl' | 'hex';

export interface ChannelSliderProps extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'>, CommonProps {
  /** Controlled color: l 0–1, c 0–0.37, h 0–360. */
  value?: OklchValue;
  defaultValue?: OklchValue;
  onValueChange?: (value: OklchValue) => void;
  /** Controlled color space of the rows. */
  space?: ChannelSpace;
  /** Uncontrolled initial color space. Default oklch. */
  defaultSpace?: ChannelSpace;
  onSpaceChange?: (space: ChannelSpace) => void;
  /** The spaces the switch offers, in order. Default oklch, hsl, hex; a single space hides the switch. */
  spaces?: ChannelSpace[];
  /** Accessible name of the space switch. */
  spaceLabel?: string;
  /** Footnote under the rows. */
  note?: ReactNode;
  disabled?: boolean;
}

const DEFAULT: OklchValue = { l: 0.66, c: 0.17, h: 42 };
const MAX_C = 0.37;
const SPACES: ChannelSpace[] = ['oklch', 'hsl', 'hex'];
const SPACE_LABEL: Record<ChannelSpace, string> = { oklch: 'OKLCH', hsl: 'HSL', hex: 'HEX' };

const color = (l: number, c: number, h: number) => `oklch(${l} ${c} ${h})`;
const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;
/** A linear-gradient across one channel, the other two held fixed. */
const ramp = (at: (t: number) => string, n = 8) => `linear-gradient(90deg, ${Array.from({ length: n + 1 }, (_, i) => at(i / n)).join(', ')})`;
const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

// OKLCH <-> sRGB (OKLab matrices). Out-of-gamut colours clamp to the sRGB cube; the HSL and hex rows show that clamp.
const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
function oklchToRgb({ l: L, c, h }: OklchValue): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180), b = c * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const ch = (v: number) => Math.round(clamp(toGamma(v), 0, 1) * 255);
  return {
    r: ch(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: ch(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: ch(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  };
}
function rgbToOklch({ r, g, b }: Rgb): OklchValue {
  const [R, G, B] = [r, g, b].map(v => toLinear(v / 255)) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.hypot(A, Bb);
  return { l: round(L, 4), c: round(c, 4), h: c < 1e-4 ? 0 : round(((Math.atan2(Bb, A) * 180) / Math.PI + 360) % 360, 2) };
}
function rgbToHsl({ r, g, b }: Rgb) {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B), min = Math.min(R, G, B), d = max - min, l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const h = d === 0 ? 0 : max === R ? 60 * (((G - B) / d) % 6) : max === G ? 60 * ((B - R) / d + 2) : 60 * ((R - G) / d + 4);
  return { h: Math.round((h + 360) % 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h: number, s: number, l: number): Rgb {
  const S = s / 100, L = l / 100, a = S * Math.min(L, 1 - L);
  const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round((L - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255); };
  return { r: f(0), g: f(8), b: f(4) };
}

/** Token value editor for one color: swatch, readout, a color-space switch and the rows of that space (OKLCH or HSL channels, or a hex field). */
export function ChannelSlider({
  value, defaultValue = DEFAULT, onValueChange, space, defaultSpace = 'oklch', onSpaceChange, spaces = SPACES, spaceLabel = 'Color space', note, disabled = false,
  tone, variant, radius, shadow, size, className, ...props
}: ChannelSliderProps) {
  const [v, setV] = useControllableState<OklchValue>({ value, defaultValue, onChange: onValueChange });
  const [mode, setMode] = useControllableState<ChannelSpace>({ value: space, defaultValue: defaultSpace, onChange: onSpaceChange });
  const swatch = color(round(v.l, 2), round(v.c, 2), Math.round(v.h));
  const rgb = oklchToRgb(v);
  const hex = rgbToHex(rgb);
  const x = rgbToHsl(rgb);
  const vars = { '--c': swatch } as CSSProperties;
  // The readout names each channel (tertiary letter, primary value): values to read, not a CSS string.
  const readout: [string, string][] = mode === 'hsl'
    ? [['H', `${Math.round(x.h)}°`], ['S', `${Math.round(x.s)}%`], ['L', `${Math.round(x.l)}%`]]
    : mode === 'hex' ? [['#', hex]]
      : [['L', `${round(v.l, 2)}`], ['C', `${round(v.c, 2)}`], ['H', `${Math.round(v.h)}°`]];
  const fromHsl = (h: number, s: number, l: number) => setV(rgbToOklch(hslToRgb(h, s, l)));
  return (
    <div data-slot="channel-slider" data-space={mode} className={cn(channelSliderVariants({ tone, variant, size }), channelSliderShapeVariants({ radius, shadow }), className)} {...props}>
      <div data-slot="channel-slider-header" className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2.5">
          <span data-slot="channel-slider-well" aria-hidden style={vars} className={cn(channelSliderWellVariants({ size }))} />
          <span data-slot="channel-slider-readout" aria-live="polite" className={cn(channelSliderReadoutVariants({ size }))}>
            {readout.map(([k, val]) => (
              <span key={k} data-slot="channel-slider-channel" className="inline-flex items-baseline gap-1">
                <span className={channelSliderChannelVariants()}>{k}</span>{val}
              </span>
            ))}
          </span>
        </span>
        {spaces.length > 1 && (
          <SegmentedControl
            data-slot="channel-slider-mode" aria-label={spaceLabel} size="xs" tone={tone} variant={variant} disabled={disabled}
            value={mode} onValueChange={s => setMode(s as ChannelSpace)} className="shrink-0"
          >
            {spaces.map(s => <SegmentedControlItem key={s} value={s}>{SPACE_LABEL[s]}</SegmentedControlItem>)}
          </SegmentedControl>
        )}
      </div>
      <div key={mode} data-slot="channel-slider-rows" className="grid gap-3 animate-enter">
        {mode === 'oklch' && (
          <>
            <Slider
              field label="L" aria-label="Lightness" unit="%" appearance="gradient" disabled={disabled} thumbColor={swatch}
              gradient={ramp(t => color(t, v.c, v.h))}
              value={round(v.l * 100, 2)} min={0} max={100} onValueChange={n => setV({ ...v, l: n / 100 })}
            />
            <Slider
              field label="C" aria-label="Chroma" appearance="gradient" disabled={disabled} thumbColor={swatch}
              gradient={ramp(t => color(v.l, round(t * MAX_C, 4), v.h))}
              value={round(v.c * 100, 2)} min={0} max={MAX_C * 100} fieldScale={100} onValueChange={n => setV({ ...v, c: n / 100 })}
            />
            <Slider
              field label="H" aria-label="Hue" unit="°" appearance="gradient" disabled={disabled} thumbColor={swatch}
              gradient={ramp(t => color(v.l, v.c, t * 360), 12)}
              value={round(v.h, 2)} min={0} max={360} onValueChange={n => setV({ ...v, h: n })}
            />
          </>
        )}
        {mode === 'hsl' && (
          <>
            <Slider
              field label="H" aria-label="Hue" unit="°" appearance="gradient" disabled={disabled} thumbColor={swatch}
              gradient={ramp(t => hsl(Math.round(t * 360), x.s, x.l), 12)}
              value={x.h} min={0} max={360} onValueChange={n => fromHsl(n, x.s, x.l)}
            />
            <Slider
              field label="S" aria-label="Saturation" unit="%" appearance="gradient" disabled={disabled} thumbColor={swatch}
              gradient={ramp(t => hsl(x.h, Math.round(t * 100), x.l))}
              value={x.s} min={0} max={100} onValueChange={n => fromHsl(x.h, n, x.l)}
            />
            <Slider
              field label="L" aria-label="Lightness" unit="%" appearance="gradient" disabled={disabled} thumbColor={swatch}
              gradient={ramp(t => hsl(x.h, x.s, Math.round(t * 100)))}
              value={x.l} min={0} max={100} onValueChange={n => fromHsl(x.h, x.s, n)}
            />
          </>
        )}
        {mode === 'hex' && (
          <div data-slot="channel-slider-hex" className="flex items-center gap-2.5">
            <span aria-hidden className="w-slider-label-w shrink-0 text-hint text-text-secondary">#</span>
            <HexInput
              aria-label="Hex" disabled={disabled} className="min-w-0 flex-1" value={hex}
              onValueChange={h => { const p = parseHex(h); if (p) setV(rgbToOklch(p)); }}
            />
          </div>
        )}
      </div>
      {note != null && <p data-slot="channel-slider-note" className="m-0 text-hint text-text-tertiary">{note}</p>}
    </div>
  );
}
