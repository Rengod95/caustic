'use client';
import * as P from '@radix-ui/react-popover';
import { ChevronDown, Image as ImageIcon, Pipette, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { defined } from '../../lib/defined.ts';
import { cssColor, hsvToHex, parseHex, rgbToHsv } from '../../lib/color-math.ts';
import { resolveCssColor } from '../../lib/color-resolve.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { ColorPlane } from '../color-plane/color-plane.tsx';
import { HexInput } from '../hex-input/hex-input.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Slider } from '../slider/slider.tsx';
import { SwatchStrip, type SwatchItem } from '../swatch-strip/swatch-strip.tsx';
import {
  colorPickerBodyVariants, colorPickerFieldsVariants, colorPickerFootVariants, colorPickerFormatVariants, colorPickerGlyphVariants, colorPickerHeaderVariants,
  colorPickerPreviewVariants, colorPickerSlidersVariants, colorPickerTracksVariants, colorPickerTypesVariants, colorPickerTypeVariants, colorPickerVariants,
} from './color-picker.variants.ts';

export interface ColorValue { h: number; s: number; v: number; a: number }
export type PaintType = 'solid' | 'linear' | 'radial' | 'angular' | 'diamond' | 'image';
export type PickerMode = 'custom' | 'tokens';

export interface ColorPickerProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Controlled color: hue 0-360, saturation and brightness 0-1, alpha 0-1. */
  value?: ColorValue;
  defaultValue?: ColorValue;
  /** Selected paint type. When omitted no type is selected. */
  paintType?: PaintType;
  /** Colors used on the page, shown in the footer strip. */
  swatches?: SwatchItem[];
  /** Header tab. */
  mode?: PickerMode;
  onValueChange?: (value: ColorValue) => void;
  onPaintTypeChange?: (type: PaintType) => void;
  onModeChange?: (mode: PickerMode) => void;
  /** The close button is pressed, or Escape. */
  onClose?: () => void;
}

const fallback: ColorValue = { h: 22, s: 0.72, v: 0.89, a: 1 };
const paintTypes: { id: PaintType; label: string }[] = [
  { id: 'solid', label: 'Solid' }, { id: 'linear', label: 'Linear' }, { id: 'radial', label: 'Radial' },
  { id: 'angular', label: 'Angular' }, { id: 'diamond', label: 'Diamond' }, { id: 'image', label: 'Image' },
];
const hueStops = [0, 60, 120, 180, 240, 300, 360];
const hueRamp = `linear-gradient(90deg, ${hueStops.map(h => `hsl(${h} 100% 50%)`).join(', ')})`;

interface EyeDropperApi { new (): { open: () => Promise<{ sRGBHex: string }> } }

/** The popover that edits one paint: type row, plane, hue and alpha, hex and alpha fields and page swatches. */
export function ColorPicker({
  value, defaultValue = fallback, paintType, swatches = [], mode, onValueChange, onPaintTypeChange, onModeChange, onClose, className, onKeyDown, ...props
}: ColorPickerProps) {
  const [color, setColor] = useControllableState<ColorValue>({ value, defaultValue, onChange: v => onValueChange?.(v) });
  const [type, setType] = useControllableState<PaintType | undefined>({ value: paintType, defaultValue: undefined, onChange: t => { if (t) onPaintTypeChange?.(t); } });
  const [tab, setTab] = useControllableState<PickerMode>({ value: mode, defaultValue: 'custom', onChange: onModeChange });
  const [added, setAdded] = useState<SwatchItem[]>([]);
  const [canPick, setCanPick] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setCanPick('EyeDropper' in window); }, []);

  const hex = hsvToHex(color);
  const opaque = `#${hex}`;
  const alphaPct = Math.round(color.a * 100);
  const items = [...swatches, ...added];
  const picked = items.find(i => /^#[0-9a-fA-F]{6}$/.test(i.color) && i.color.slice(1).toUpperCase() === hex && color.a === 1)?.id ?? '';

  const setHex = (digits: string) => {
    const rgb = parseHex(digits);
    if (!rgb) return;
    const hsv = rgbToHsv(rgb);
    setColor({ h: hsv.s === 0 || hsv.v === 0 ? color.h : hsv.h, s: hsv.s, v: hsv.v, a: digits.length === 8 ? rgb.a / 100 : color.a });
  };
  const pickSwatch = (id: string) => {
    const item = items.find(i => i.id === id);
    const rgb = item ? resolveCssColor(item.color, rootRef.current) : null;
    if (!rgb) return;
    const hsv = rgbToHsv(rgb);
    setColor({ h: hsv.s === 0 || hsv.v === 0 ? color.h : hsv.h, s: hsv.s, v: hsv.v, a: rgb.a / 100 });
  };
  const eyedrop = async () => {
    const Api = (window as unknown as { EyeDropper?: EyeDropperApi }).EyeDropper;
    if (!Api) return;
    try { setHex((await new Api().open()).sRGBHex.slice(1)); } catch { /* cancelled */ }
  };
  const typeKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    const nodes = [...(typesRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [])];
    const at = nodes.findIndex(n => n === document.activeElement);
    const next = nodes[(Math.max(at, 0) + step + nodes.length) % nodes.length];
    if (!next) return;
    e.preventDefault();
    next.focus();
    setType(next.dataset.type as PaintType);
  };
  const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.key === 'Escape' && !e.defaultPrevented) onClose?.();
  };
  const tabbable = type ?? 'solid';

  return (
    <div ref={rootRef} data-slot="color-picker" role="dialog" aria-label="Color picker" tabIndex={-1} onKeyDown={keyDown} className={cn(colorPickerVariants(), className)} {...props}>
      <div data-slot="color-picker-header" className={colorPickerHeaderVariants()}>
        <div data-slot="color-picker-tabs" className="inline-flex">
          <SegmentedControl aria-label="Color source" size="xs" value={tab} onValueChange={v => setTab(v as PickerMode)}>
            <SegmentedControlItem value="custom">Custom</SegmentedControlItem>
            <SegmentedControlItem value="tokens">Tokens</SegmentedControlItem>
          </SegmentedControl>
        </div>
        <div data-slot="color-picker-close" className="ml-auto inline-flex">
          <IconButton label="Close" size="xs" onClick={() => onClose?.()}><X /></IconButton>
        </div>
      </div>
      {tab === 'custom' ? (
        <>
          <div ref={typesRef} data-slot="color-picker-types" role="radiogroup" aria-label="Paint type" onKeyDown={typeKeys} className={colorPickerTypesVariants()}>
            {paintTypes.map(t => (
              <button
                key={t.id} type="button" role="radio" data-slot="color-picker-type" data-type={t.id}
                aria-checked={type === t.id} aria-label={t.label} tabIndex={t.id === tabbable ? 0 : -1}
                onClick={() => setType(t.id)}
                className={colorPickerTypeVariants()}
              >
                {t.id === 'image' ? <ImageIcon aria-hidden /> : <span data-slot="color-picker-glyph" aria-hidden className={colorPickerGlyphVariants({ kind: t.id })} />}
              </button>
            ))}
          </div>
          <div data-slot="color-picker-body" className={colorPickerBodyVariants()}>
            <div data-slot="color-picker-plane">
              <ColorPlane hue={color.h} value={{ s: color.s, v: color.v }} pickedColor={opaque} onValueChange={sv => setColor({ ...color, ...sv })} />
            </div>
            <div data-slot="color-picker-sliders" className={colorPickerSlidersVariants()}>
              <div data-slot="color-picker-eyedropper" className="inline-flex">
                <IconButton label="Eyedropper" size="sm" disabled={!canPick} onClick={eyedrop}><Pipette /></IconButton>
              </div>
              <div data-slot="color-picker-tracks" className={colorPickerTracksVariants()}>
                <div data-slot="color-picker-hue" className="flex">
                  <Slider aria-label="Hue" appearance="gradient" size="sm" min={0} max={360} value={color.h} gradient={hueRamp} thumbColor={`hsl(${Math.round(color.h)} 100% 50%)`} onValueChange={h => setColor({ ...color, h })} />
                </div>
                <div data-slot="color-picker-alpha" className="flex">
                  <Slider aria-label="Alpha" appearance="alpha" size="sm" min={0} max={100} value={alphaPct} gradient={`linear-gradient(90deg, transparent, ${opaque})`} thumbColor={cssColor(hex, alphaPct)} onValueChange={a => setColor({ ...color, a: a / 100 })} />
                </div>
              </div>
              <span data-slot="color-picker-preview" aria-hidden className={colorPickerPreviewVariants()}>
                <span className="absolute inset-0 bg-(--picked)" style={{ '--picked': cssColor(hex, alphaPct) } as CSSProperties} />
              </span>
            </div>
            <div data-slot="color-picker-fields" className={colorPickerFieldsVariants()}>
              <button data-slot="color-picker-format" type="button" aria-label="Color format" className={colorPickerFormatVariants()}>Hex<ChevronDown aria-hidden /></button>
              <div data-slot="color-picker-hex" className="min-w-0">
                <HexInput aria-label="Hex" value={hex} onValueChange={setHex} />
              </div>
              <div data-slot="color-picker-alpha-field" className="w-picker-alpha-w">
                <NumberField aria-label="Alpha" unit="%" min={0} max={100} value={alphaPct} onValueChange={a => setColor({ ...color, a: a / 100 })} />
              </div>
            </div>
          </div>
          <div data-slot="color-picker-foot" className={colorPickerFootVariants()}>
            <div data-slot="color-picker-foot-head" className="flex items-center justify-between gap-2">
              <span data-slot="color-picker-foot-title" className="text-ui-xs font-semibold text-text-tertiary">On this page</span>
              <div data-slot="color-picker-add" className="inline-flex">
                <IconButton label="Add swatch" size="xs" onClick={() => setAdded(a => [...a, { id: `added-${a.length + 1}`, color: opaque, label: `Color ${hex}` }])}><Plus /></IconButton>
              </div>
            </div>
            <div data-slot="color-picker-swatches">
              <SwatchStrip items={items} columns={9} value={picked} onValueChange={pickSwatch} aria-label="Colors on this page" />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export interface ColorPickerPopoverProps extends ColorPickerProps {
  /** The element the picker hangs from, usually a ColorWell (rendered with asChild). */
  anchor: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

/** ColorPicker anchored to an element: opens on press, closes on Escape or outside press. */
export function ColorPickerPopover({ anchor, open, defaultOpen, onOpenChange, side = 'bottom', align = 'start', onClose, ...props }: ColorPickerPopoverProps) {
  return (
    <P.Root {...defined({ open, defaultOpen, onOpenChange })}>
      <P.Trigger asChild>{anchor}</P.Trigger>
      <P.Portal>
        <P.Content asChild side={side} align={align} sideOffset={10}>
          <ColorPicker {...props} onClose={() => { onClose?.(); onOpenChange?.(false); }} />
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
