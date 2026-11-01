'use client';
import * as P from '@radix-ui/react-popover';
import { ChevronDown, Image as ImageIcon, Pipette, Plus, X } from '../../icons/index.ts';
import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject, type SyntheticEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { radiusClass, shadowClass, type CommonProps } from '../../lib/common-props.ts';
import { defined } from '../../lib/defined.ts';
import { cssColor, hsvToHex, parseHex, rgbToHsv } from '../../lib/color-math.ts';
import { resolveCssColor } from '../../lib/color-resolve.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContract } from '../../hooks/use-field-contract.ts';
import { HexInput } from '../hex-input/hex-input.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Slider } from '../slider/slider.tsx';
import {
  colorPickerBodyVariants, colorPickerFieldsVariants, colorPickerFootVariants, colorPickerFormatVariants, colorPickerGlyphVariants, colorPickerHeaderVariants,
  colorPickerPreviewFillVariants, colorPickerPreviewVariants, colorPickerSlidersVariants, colorPickerTracksVariants, colorPickerTypesVariants, colorPickerTypeVariants,
  colorPickerVariants,
} from './color-picker.variants.ts';
import { ColorPickerPlane } from './color-picker-plane.tsx';
import { ColorPickerSwatches, type SwatchItem } from './color-picker-swatches.tsx';

export { ColorPickerPlane, type ColorPickerPlaneProps, type PlaneValue } from './color-picker-plane.tsx';
export { ColorPickerSwatches, type ColorPickerSwatchesProps, type SwatchItem } from './color-picker-swatches.tsx';

export interface ColorValue { h: number; s: number; v: number; a: number }
export type PaintType = 'solid' | 'linear' | 'radial' | 'angular' | 'diamond' | 'image';
export type PickerMode = 'custom' | 'tokens';
export type ColorPickerField = 'plane' | 'hue' | 'alpha' | 'hex' | 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV' | 'paintType' | 'mode' | 'eyedropper' | 'swatches';
export type ColorPickerSection = 'types' | 'plane' | 'hue' | 'alpha' | 'eyedropper' | 'fields' | 'hsv' | 'swatches';
export type ColorPickerChange =
  | { field: 'plane'; value: { s: number; v: number } }
  | { field: 'hue' | 'alpha'; value: number }
  | { field: 'hex'; value: string }
  | { field: 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV'; value: number }
  | { field: 'paintType'; value: string }
  | { field: 'swatches'; value: string };
export type ColorPickerFieldFlags = Partial<Record<ColorPickerField, boolean>>;
/** What the owner is told about the text of the hex or alpha field. */
export interface ColorPickerDraft {
  field: 'hex' | 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV';
  text: string;
  /** Uppercase digits for hex, the number for the alpha field, or null when the text is not usable. */
  value: string | number | null;
  error: 'empty' | 'syntax' | 'range' | null;
  dirty: boolean;
}
export interface ColorPickerLabels {
  /** aria-label of the dialog. */
  dialog: string;
  tabsGroup: string;
  tabs: Record<PickerMode, string>;
  close: string;
  typesGroup: string;
  types: Record<PaintType, string>;
  /** aria-label of the plane thumb. */
  plane: string;
  planeValueText: (saturation: number, brightness: number) => string;
  eyedropper: string;
  hue: string;
  alpha: string;
  /** aria-label of the format button; its visible text is labels.hex. */
  format: string;
  hex: string;
  alphaField: string;
  swatchesTitle: string;
  addSwatch: string;
  /** K2e: names of the H, S and V fields (aria-label and visible letter); required with the hsv section. */
  hsv?: { h: string; s: string; v: string; hShort: string; sShort: string; vShort: string } | undefined;
  mixed: string;
}

/**
 * Common props (lib/common-props.ts): variant = the surface (default solid = the thick floating material; embedded
 * pickers default to ghost), tone = the paint-type glyphs at rest (default neutral = tertiary), size = the body padding
 * and gaps (xs 6 · sm 8 · md 10 · lg 12; the width stays 268), radius = the corners (default 2xl), shadow = the
 * elevation (default 4).
 */
export interface ColorPickerProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'>, CommonProps {
  /** Controlled color: hue 0-360, saturation and brightness 0-1, alpha 0-1. null is a mixed selection. */
  value?: ColorValue | null | undefined;
  defaultValue?: ColorValue | undefined;
  /** Selected paint type. When omitted no type is selected. */
  paintType?: PaintType | undefined;
  /** Colors used on the page, shown in the footer strip. */
  swatches?: SwatchItem[] | undefined;
  /** Header tab. */
  mode?: PickerMode | undefined;
  /** true disables every control; a record disables the named parts. */
  disabled?: boolean | Partial<Record<'plane' | 'hue' | 'alpha' | 'hex' | 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV' | 'paintType' | 'mode' | 'eyedropper' | 'swatches', boolean>> | undefined;
  /** live (default): the behavior before K2d. release: the NumberField value model and one commit per gesture. */
  commitMode?: 'live' | 'release' | undefined;
  /** Parts whose selection values differ; each shows labels.mixed instead of a value. */
  mixed?: Partial<Record<'plane' | 'hue' | 'alpha' | 'hex' | 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV' | 'paintType' | 'mode' | 'eyedropper' | 'swatches', boolean>> | undefined;
  /** Parts being written or held by another window. */
  reserved?: Partial<Record<'plane' | 'hue' | 'alpha' | 'hex' | 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV' | 'paintType' | 'mode' | 'eyedropper' | 'swatches', boolean>> | undefined;
  /** Every text and accessible name; no English default. */
  labels: ColorPickerLabels;
  onValueChange?: ((value: ColorValue) => void) | undefined;
  onPaintTypeChange?: ((type: PaintType) => void) | undefined;
  onModeChange?: ((mode: PickerMode) => void) | undefined;
  /** A numeric field text changed. */
  onDraftChange?: ((draft: ColorPickerDraft) => void) | undefined;
  /** release mode: a drag is in progress with the color being previewed; null when it ends. */
  onPreviewChange?: ((value: ColorValue | null) => void) | undefined;
  /** The close button is pressed, or Escape. */
  onClose?: (() => void) | undefined;
  /** K2e: render in the flow of an owner surface instead of as a floating dialog. */
  embedded?: boolean | undefined;
  /** K2e: which blocks render. */
  sections?: ColorPickerSection[] | undefined;
  /** K2e: fields the owner marks invalid. */
  invalid?: Partial<Record<'hex' | 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV', boolean>> | undefined;
  /** K2e: id of the owner error text per field. */
  describedBy?: Partial<Record<'hex' | 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV', string>> | undefined;
  onFieldFocus?: ((event: { field: 'hex' | 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV' }) => void) | undefined;
  onFieldBlur?: ((event: { field: 'hex' | 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV'; dirty: boolean }) => void) | undefined;
  /** K2e: one field commits; return false to reject. */
  onFieldCommit?: ((change: ColorPickerChange) => boolean | void) | undefined;
}

const fallback: ColorValue = { h: 22, s: 0.72, v: 0.89, a: 1 };
const paintTypes: PaintType[] = ['solid', 'linear', 'radial', 'angular', 'diamond', 'image'];
const hueStops = [0, 60, 120, 180, 240, 300, 360];
const hueRamp = `linear-gradient(90deg, ${hueStops.map(h => `hsl(${h} 100% 50%)`).join(', ')})`;
const DIALOG_SECTIONS: ColorPickerSection[] = ['types', 'plane', 'hue', 'alpha', 'eyedropper', 'fields', 'swatches'];
const EMBEDDED_SECTIONS: ColorPickerSection[] = ['plane', 'hue', 'alpha', 'fields'];
const gestureKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];

const flagged = (flags: boolean | ColorPickerFieldFlags | undefined, field: ColorPickerField) => flags === true || (typeof flags === 'object' && flags[field] === true);
/** Attributes of a control whose part is being written elsewhere. */
const busy = { 'aria-busy': true, 'aria-readonly': true, 'data-reserved': true } as const;

interface EyeDropperApi { new (): { open: () => Promise<{ sRGBHex: string }> } }

/** Gives the thumb of the slider inside `ref` the mixed text as its value text while the selection is mixed. */
function useMixedValueText(ref: RefObject<HTMLElement | null>, mixed: boolean, text: string) {
  useEffect(() => {
    const thumb = ref.current?.querySelector('[role="slider"]');
    if (!thumb) return;
    if (mixed) thumb.setAttribute('aria-valuetext', text); else thumb.removeAttribute('aria-valuetext');
  }, [ref, mixed, text]);
}

/**
 * The popover that edits one paint: type row, plane, hue and alpha, hex and alpha fields and page swatches. The plane
 * and the swatches are its parts, ColorPicker.Plane and ColorPicker.Swatches (also exported as ColorPickerPlane and
 * ColorPickerSwatches); `sections` decides which parts render.
 */
export function ColorPicker({
  value, defaultValue = fallback, paintType, swatches = [], mode, disabled = false, commitMode = 'live', mixed, reserved, labels,
  onValueChange, onPaintTypeChange, onModeChange, onDraftChange, onPreviewChange, onClose, embedded = false, sections, invalid, describedBy, onFieldFocus, onFieldBlur, onFieldCommit,
  tone, variant, radius, shadow, size, className, onKeyDown, ...props
}: ColorPickerProps) {
  const contract = useFieldContract<ColorPickerChange, 'hex' | 'alphaField' | 'hsvH' | 'hsvS' | 'hsvV'>({ invalid, describedBy, onFieldFocus, onFieldBlur, onFieldCommit });
  const has = (s: ColorPickerSection) => (sections ?? (embedded ? EMBEDDED_SECTIONS : DIALOG_SECTIONS)).includes(s);
  const [current, setCurrent] = useControllableState<ColorValue | null>({ value, defaultValue, onChange: v => { if (v) onValueChange?.(v); } });
  const [type, setType] = useControllableState<PaintType | undefined>({ value: paintType, defaultValue: undefined, onChange: t => { if (t) onPaintTypeChange?.(t); } });
  const [tab, setTab] = useControllableState<PickerMode>({ value: mode, defaultValue: 'custom', onChange: onModeChange });
  const [added, setAdded] = useState<SwatchItem[]>([]);
  const [canPick, setCanPick] = useState(true);
  const [previewing, setPreviewing] = useState<ColorValue | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setCanPick('EyeDropper' in window); }, []);

  const release = commitMode === 'release';
  /** A null value is a mixed selection: the plane, hex and alpha show no value. */
  const wholeMixed = current === null;
  const color = current ?? defaultValue;
  const shown = previewing ?? color;
  const isMixed = (f: ColorPickerField) => flagged(mixed, f) || (wholeMixed && (f === 'plane' || f === 'hex' || f === 'alpha'));
  const isReserved = (f: ColorPickerField) => flagged(reserved, f);
  const isDisabled = (f: ColorPickerField) => flagged(disabled, f);
  /** The slot wrapper of a part being written elsewhere carries the busy state as well. */
  const wrap = (f: ColorPickerField) => (isReserved(f) ? { 'aria-busy': true as const, 'data-reserved': true as const } : {});
  /** A reserved gesture control never receives the pointer or the keys that move it. */
  const block = (f: ColorPickerField) => (isReserved(f)
    ? {
        onPointerDownCapture: (e: SyntheticEvent) => e.stopPropagation(),
        onKeyDownCapture: (e: KeyboardEvent) => { if (gestureKeys.includes(e.key)) e.stopPropagation(); },
      }
    : {});

  const hex = hsvToHex(shown);
  const opaque = `#${hex}`;
  const alphaPct = Math.round(shown.a * 100);
  const items = [...swatches, ...added];
  const picked = isMixed('swatches') ? '' : items.find(i => /^#[0-9a-fA-F]{6}$/.test(i.color) && i.color.slice(1).toUpperCase() === hex && color.a === 1 && !wholeMixed)?.id ?? '';
  useMixedValueText(hueRef, isMixed('hue'), labels.mixed);
  useMixedValueText(alphaRef, isMixed('alpha'), labels.mixed);

  /** A drag step: previewed in release mode, committed at once in live mode. */
  const change = (field: 'plane' | 'hue' | 'alpha', next: ColorValue): ColorPickerChange => (field === 'plane' ? { field, value: { s: next.s, v: next.v } } : { field, value: field === 'hue' ? next.h : next.a });
  const commitTo = (key: string, c: ColorPickerChange, next: ColorValue) => { contract.commit(key, c, () => setCurrent(next)); };
  const step = (field: 'plane' | 'hue' | 'alpha', next: ColorValue) => {
    if (isReserved(field)) return;
    if (release) { setPreviewing(next); onPreviewChange?.(next); } else commitTo(field, change(field, next), next);
  };
  /** The end of a drag: one commit in release mode. */
  const finish = (field: 'plane' | 'hue' | 'alpha', next: ColorValue) => {
    if (isReserved(field) || !release) return;
    setPreviewing(null);
    commitTo(field, change(field, next), next);
    onPreviewChange?.(null);
  };

  const setHex = (digits: string) => {
    if (isReserved('hex')) return;
    const rgb = parseHex(digits);
    if (!rgb) return;
    const hsv = rgbToHsv(rgb);
    commitTo('hex', { field: 'hex', value: digits.toUpperCase() }, { h: hsv.s === 0 || hsv.v === 0 ? color.h : hsv.h, s: hsv.s, v: hsv.v, a: digits.length === 8 ? rgb.a / 100 : color.a });
  };
  const pickSwatch = (id: string) => {
    if (isReserved('swatches')) return;
    const item = items.find(i => i.id === id);
    const rgb = item ? resolveCssColor(item.color, rootRef.current) : null;
    if (!rgb) return;
    const hsv = rgbToHsv(rgb);
    commitTo('swatches', { field: 'swatches', value: id }, { h: hsv.s === 0 || hsv.v === 0 ? color.h : hsv.h, s: hsv.s, v: hsv.v, a: rgb.a / 100 });
  };
  const eyedrop = async () => {
    if (isReserved('eyedropper')) return;
    const Api = (window as unknown as { EyeDropper?: EyeDropperApi }).EyeDropper;
    if (!Api) return;
    try {
      const rgb = parseHex((await new Api().open()).sRGBHex.slice(1));
      if (!rgb || isReserved('eyedropper')) return;
      const hsv = rgbToHsv(rgb);
      setCurrent({ h: hsv.s === 0 || hsv.v === 0 ? color.h : hsv.h, s: hsv.s, v: hsv.v, a: color.a });
    } catch { /* cancelled */ }
  };
  const typeKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isDisabled('paintType') || isReserved('paintType')) return;
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!delta) return;
    const nodes = [...(typesRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [])];
    const at = nodes.findIndex(n => n === document.activeElement);
    const next = nodes[(Math.max(at, 0) + delta + nodes.length) % nodes.length];
    if (!next) return;
    e.preventDefault();
    next.focus();
    const chosen = next.dataset.type as PaintType;
    contract.commit('paintType', { field: 'paintType', value: chosen }, () => setType(chosen));
  };
  const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.key === 'Escape' && !e.defaultPrevented) onClose?.();
  };
  const withDropper = has('eyedropper');
  const showSliders = has('hue') || has('alpha') || withDropper;
  const typeMixed = isMixed('paintType');
  const previewMixed = isMixed('plane') || isMixed('hex');
  const tabbable = typeMixed ? 'solid' : type ?? 'solid';
  const surface = variant ?? (embedded ? 'ghost' : 'solid');
  const rootClass = cn(
    colorPickerVariants({ embedded, variant: surface, shadow, size }),
    surface !== 'solid' && shadow && shadow !== '4' && shadowClass[shadow], radius && radius !== '2xl' && radiusClass[radius], className,
  );

  return (
    <div
      ref={rootRef} data-slot="color-picker" role={embedded ? 'group' : 'dialog'} aria-label={labels.dialog} data-embedded={embedded || undefined}
      {...(embedded ? {} : { tabIndex: -1, onKeyDown: keyDown })} className={rootClass} {...props}
    >
      {!embedded && (
      <div data-slot="color-picker-header" className={colorPickerHeaderVariants()}>
        <div data-slot="color-picker-tabs" className="inline-flex" {...wrap('mode')}>
          <SegmentedControl
            aria-label={labels.tabsGroup} size="xs" value={isMixed('mode') ? '' : tab} disabled={isDisabled('mode')}
            onValueChange={v => { if (!isReserved('mode')) setTab(v as PickerMode); }}
            {...(isReserved('mode') ? busy : {})}
          >
            <SegmentedControlItem value="custom">{labels.tabs.custom}</SegmentedControlItem>
            <SegmentedControlItem value="tokens">{labels.tabs.tokens}</SegmentedControlItem>
          </SegmentedControl>
        </div>
        <div data-slot="color-picker-close" className="ml-auto inline-flex">
          <IconButton label={labels.close} size="xs" onClick={() => onClose?.()}><X /></IconButton>
        </div>
      </div>
      )}
      {tab === 'custom' || embedded ? (
        <>
          {has('types') && <div
            ref={typesRef} data-slot="color-picker-types" role="radiogroup" aria-label={labels.typesGroup} onKeyDown={typeKeys} className={colorPickerTypesVariants()}
            data-mixed={typeMixed || undefined} {...wrap('paintType')}
          >
            {paintTypes.map(t => (
              <button
                key={t} type="button" role="radio" data-slot="color-picker-type" data-type={t}
                aria-checked={!typeMixed && type === t} aria-label={labels.types[t]} tabIndex={t === tabbable ? 0 : -1}
                disabled={isDisabled('paintType')}
                onClick={() => { if (!isReserved('paintType')) contract.commit('paintType', { field: 'paintType', value: t }, () => setType(t)); }}
                className={colorPickerTypeVariants({ typeTone: tone })}
                {...(isReserved('paintType') ? busy : {})}
              >
                {t === 'image' ? <ImageIcon aria-hidden /> : <span data-slot="color-picker-glyph" aria-hidden className={colorPickerGlyphVariants({ kind: t })} />}
              </button>
            ))}
          </div>}
          <div data-slot="color-picker-body" className={colorPickerBodyVariants({ embedded, bodySize: size })}>
            {has('plane') && (
              <ColorPickerPlane
                data-mixed={isMixed('plane') || undefined}
                className="data-[mixed]:[&_[role=slider]]:opacity-0 data-[mixed]:[&_[role=slider]:focus-visible]:opacity-100"
                {...wrap('plane')} {...block('plane')}
                label={labels.plane}
                valueText={isMixed('plane') ? () => labels.mixed : labels.planeValueText}
                hue={shown.h} value={{ s: shown.s, v: shown.v }} pickedColor={opaque} disabled={isDisabled('plane')}
                onValueChange={sv => step('plane', { ...color, ...sv })}
                onValueCommit={sv => finish('plane', { ...color, ...sv })}
              />
            )}
            {showSliders && <div data-slot="color-picker-sliders" className={colorPickerSlidersVariants({ picker: withDropper })}>
              {withDropper && <div data-slot="color-picker-eyedropper" className="inline-flex" {...wrap('eyedropper')}>
                <IconButton
                  label={labels.eyedropper} size="sm" disabled={!canPick || isDisabled('eyedropper')} data-mixed={isMixed('eyedropper') || undefined}
                  onClick={eyedrop} {...(isReserved('eyedropper') ? busy : {})}
                >
                  <Pipette />
                </IconButton>
              </div>}
              <div data-slot="color-picker-tracks" className={colorPickerTracksVariants()}>
                {has('hue') && <div ref={hueRef} data-slot="color-picker-hue" data-mixed={isMixed('hue') || undefined} className="flex" {...wrap('hue')} {...block('hue')}>
                  <Slider
                    aria-label={labels.hue} appearance="gradient" size="sm" min={0} max={360} value={isMixed('hue') ? 0 : shown.h} disabled={isDisabled('hue')}
                    gradient={hueRamp} thumbColor={`hsl(${Math.round(shown.h)} 100% 50%)`}
                    onValueChange={h => step('hue', { ...color, h })}
                    onValueCommit={h => finish('hue', { ...color, h })}
                  />
                </div>}
                {has('alpha') && <div ref={alphaRef} data-slot="color-picker-alpha" data-mixed={isMixed('alpha') || undefined} className="flex" {...wrap('alpha')} {...block('alpha')}>
                  <Slider
                    aria-label={labels.alpha} appearance="alpha" size="sm" min={0} max={100} value={isMixed('alpha') ? 0 : alphaPct} disabled={isDisabled('alpha')}
                    gradient={`linear-gradient(90deg, transparent, ${opaque})`} thumbColor={cssColor(hex, alphaPct)}
                    onValueChange={a => step('alpha', { ...color, a: a / 100 })}
                    onValueCommit={a => finish('alpha', { ...color, a: a / 100 })}
                  />
                </div>}
              </div>
              <span data-slot="color-picker-preview" aria-hidden data-mixed={previewMixed || undefined} className={colorPickerPreviewVariants()}>
                <span className={colorPickerPreviewFillVariants({ mixed: previewMixed })} style={{ '--picked': cssColor(hex, alphaPct) } as CSSProperties} />
              </span>
            </div>}
            {has('fields') && <div data-slot="color-picker-fields" className={colorPickerFieldsVariants()}>
              <button data-slot="color-picker-format" type="button" aria-label={labels.format} className={colorPickerFormatVariants()}>{labels.hex}<ChevronDown aria-hidden /></button>
              <div data-slot="color-picker-hex" className="min-w-0" {...wrap('hex')} {...contract.wrapAttrs('hex')}>
                <HexInput
                  aria-label={labels.hex} value={hex} mixed={isMixed('hex')} mixedLabel={labels.mixed} disabled={isDisabled('hex')} reserved={isReserved('hex')} commitMode={commitMode}
                  invalid={contract.isInvalid('hex')} aria-describedby={contract.describedBy('hex')} data-field="hex" data-dirty={contract.isDirty('hex') || undefined}
                  onFocus={() => { if (!isReserved('hex') && !isDisabled('hex')) contract.focus('hex'); }}
                  onBlur={() => { if (!isReserved('hex') && !isDisabled('hex')) contract.blur('hex'); }}
                  onValueChange={setHex}
                  onDraftChange={d => { contract.draft('hex', d); onDraftChange?.({ field: 'hex', text: d.text, value: d.value, error: d.error, dirty: d.dirty }); }}
                />
              </div>
              <div data-slot="color-picker-alpha-field" className="w-picker-alpha-w" {...wrap('alpha')} {...contract.wrapAttrs('alphaField')}>
                <NumberField
                  aria-label={labels.alphaField} unit="%" min={0} max={100} value={alphaPct} mixed={isMixed('alpha')} mixedLabel={labels.mixed}
                  disabled={isDisabled('alpha')} reserved={isReserved('alpha')} commitMode={commitMode}
                  {...contract.inputProps('alphaField', isReserved('alpha') || isDisabled('alpha'))}
                  onValueChange={a => { commitTo('alphaField', { field: 'alphaField', value: a }, { ...color, a: a / 100 }); }}
                  onDraftChange={d => { contract.draft('alphaField', d); onDraftChange?.({ field: 'alphaField', text: d.text, value: d.value, error: d.error, dirty: d.dirty }); }}
                  onPreviewChange={a => { const next = a === null ? null : { ...color, a: a / 100 }; setPreviewing(next); onPreviewChange?.(next); }}
                />
              </div>
            </div>}
            {has('hsv') && labels.hsv !== undefined && (
              <div data-slot="color-picker-hsv" className="grid grid-cols-3 gap-1">
                {([
                  ['hsvH', labels.hsv.h, labels.hsv.hShort, shown.h, 360, '°', (n: number) => ({ ...color, h: n })],
                  ['hsvS', labels.hsv.s, labels.hsv.sShort, shown.s * 100, 100, '%', (n: number) => ({ ...color, s: n / 100 })],
                  ['hsvV', labels.hsv.v, labels.hsv.vShort, shown.v * 100, 100, '%', (n: number) => ({ ...color, v: n / 100 })],
                ] as const).map(([key, name, letter, current, max, unit, build]) => (
                  <div key={key} className="min-w-0" {...contract.wrapAttrs(key)}>
                    <NumberField
                      aria-label={name} label={letter} unit={unit} min={0} max={max} value={Math.round(current)} mixed={wholeMixed} mixedLabel={labels.mixed}
                      disabled={isDisabled('plane')} reserved={isReserved('plane')} commitMode={commitMode}
                      {...contract.inputProps(key, isReserved('plane') || isDisabled('plane'))}
                      onValueChange={n => { commitTo(key, { field: key, value: n }, build(n)); }}
                      onDraftChange={d => { contract.draft(key, d); onDraftChange?.({ field: key, text: d.text, value: d.value, error: d.error, dirty: d.dirty }); }}
                      onPreviewChange={n => { const next = n === null ? null : build(n); setPreviewing(next); onPreviewChange?.(next); }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {has('swatches') && <div data-slot="color-picker-foot" className={colorPickerFootVariants()}>
            <div data-slot="color-picker-foot-head" className="flex items-center justify-between gap-2">
              <span data-slot="color-picker-foot-title" className="text-ui-xs font-semibold text-text-tertiary">{labels.swatchesTitle}</span>
              <div data-slot="color-picker-add" className="inline-flex">
                <IconButton
                  label={labels.addSwatch} size="xs" disabled={isDisabled('swatches')}
                  onClick={() => { if (!isReserved('swatches')) setAdded(a => [...a, { id: `added-${a.length + 1}`, color: opaque, label: opaque }]); }}
                  {...(isReserved('swatches') ? busy : {})}
                >
                  <Plus />
                </IconButton>
              </div>
            </div>
            <ColorPickerSwatches
              data-mixed={isMixed('swatches') || undefined} data-disabled={isDisabled('swatches') || undefined}
              className="data-[disabled]:pointer-events-none data-[disabled]:[&_[role=radio]]:shadow-[inset_0_0_0_0.5px_var(--cs-color-disabled-border)] data-[disabled]:[&_[data-slot=color-picker-swatch-dot]]:bg-disabled-text" inert={isDisabled('swatches') || undefined} {...wrap('swatches')}
              items={items} columns={9} value={picked} onValueChange={pickSwatch} aria-label={labels.swatchesTitle}
            />
          </div>}
        </>
      ) : null}
    </div>
  );
}

ColorPicker.Plane = ColorPickerPlane;
ColorPicker.Swatches = ColorPickerSwatches;

export interface ColorPickerPopoverProps extends ColorPickerProps {
  /** The element the picker hangs from, usually a ColorWell (rendered with asChild). */
  anchor: ReactNode;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  side?: 'top' | 'bottom' | 'left' | 'right' | undefined;
  align?: 'start' | 'center' | 'end' | undefined;
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
