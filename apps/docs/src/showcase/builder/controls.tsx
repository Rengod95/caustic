import { TriangleAlert } from 'lucide-react';
import { Badge, NumberField, SegmentedControl, SegmentedControlItem, Slider } from '@caustic/react';
import { contrast, gamutMap, hex, isInGamut, label, type LCH } from '../color.ts';
import type { Theme } from '../palette.ts';
import { SHIPPED } from '../shipped.ts';
import { isDerived, round, setLink, setValue, valueOf, type ColorDef, type ColorState, type LinkMode } from './state.ts';

const ok = (c: LCH) => `oklch(${c[0]} ${c[1]} ${c[2]})`;

/** Slider tracks drawn in the colour's own space, so each knob shows where it leads. */
function tracks([L, C, H]: LCH) {
  // a near-grey or near-black colour would draw a flat hue track, so the hue track borrows a visible L and C
  const hl = Math.min(0.85, Math.max(0.5, L)), hc = Math.max(C, 0.08);
  const hs = [0, 60, 120, 180, 240, 300, 360].map(h => ok([hl, hc, h])).join(', ');
  return {
    L: `linear-gradient(90deg, ${ok([0, C, H])}, ${ok([0.5, C, H])}, ${ok([1, C, H])})`,
    C: `linear-gradient(90deg, ${ok([L, 0, H])}, ${ok([L, 0.2, H])}, ${ok([L, 0.37, H])})`,
    H: `linear-gradient(90deg, ${hs})`,
  };
}

const AXES = [
  { i: 0, label: 'L', min: 0, max: 1, step: 0.005 },
  { i: 1, label: 'C', min: 0, max: 0.37, step: 0.001 },
  { i: 2, label: 'H', min: 0, max: 360, step: 1 },
] as const;

/** One L/C/H editor: scrub-able number field plus a gradient slider per axis. */
export function LchEditor({ value, onChange, disabled = false, name }: { value: LCH; onChange: (v: LCH) => void; disabled?: boolean; name: string }) {
  const tr = tracks(gamutMap(value));
  return (
    <div className="grid gap-1.5">
      {AXES.map(a => (
        <div key={a.label} className="grid grid-cols-[4.75rem_1fr] items-center gap-2">
          <NumberField
            aria-label={`${name} ${a.label}`} label={a.label} value={value[a.i]} step={a.step} min={a.min} max={a.max} disabled={disabled}
            onValueChange={n => { const next = [...value] as [number, number, number]; next[a.i] = a.i === 2 ? round(n, 1) : round(n); onChange(next); }}
          />
          <Slider
            aria-label={`${name} ${a.label} slider`} size="sm" appearance="gradient" gradient={tr[a.label]} thumbColor={ok(gamutMap(value))}
            value={value[a.i]} min={a.min} max={a.max} step={a.step} disabled={disabled}
            onValueChange={n => { const next = [...value] as [number, number, number]; next[a.i] = a.i === 2 ? round(n, 1) : round(n); onChange(next); }}
          />
        </div>
      ))}
    </div>
  );
}

export interface Check { label: string; ratio: number; need: number | null }

export function Checks({ checks }: { checks: Check[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {checks.map(c => {
        const pass = c.need === null || c.ratio >= c.need - 1e-9;
        return (
          <Badge key={c.label} size="md" tone={pass ? 'success' : 'danger'} lead={c.need === null ? 'info' : c.need >= 4.5 ? 'AA' : 'UI'} title={c.need === null ? 'Decorative: no minimum' : `Needs ${c.need}:1`}>
            {c.label} {c.ratio.toFixed(1)}{pass ? '' : ' · fails'}
          </Badge>
        );
      })}
    </div>
  );
}

export function Swatch({ c, className = 'size-8' }: { c: LCH; className?: string }) {
  return <span aria-hidden className={`${className} shrink-0 rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]`} style={{ background: ok(gamutMap(c)) }} />;
}

/** Slot name per step (tokens.mjs slotSteps); step 1 is the background end and has no slot. */
const STEP_ROLE = Array.from({ length: 11 }, (_, i) => Object.entries(SHIPPED.slotSteps).find(([, n]) => n === i + 1)?.[0] ?? 'background end');

/** The generated 1–11 ramp, step 9 (the pick) marked. */
export function RampStrip({ ramp, name }: { ramp: readonly LCH[]; name: string }) {
  return (
    <div className="grid gap-0.5" aria-label={`${name} ramp 1–11`} role="group">
      <div className="grid grid-cols-11 overflow-hidden rounded-sm shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]">
        {ramp.map((c, i) => (
          <span key={i} title={`${i + 1} · ${STEP_ROLE[i]} · oklch ${label(c)}`} className="relative h-5" style={{ background: ok(c) }}>
            {i === 8 && <span aria-hidden className="absolute inset-x-1 bottom-0.5 h-0.5 rounded-full" style={{ background: ok(contrast([0.15, 0, 0], c) > contrast([0.99, 0, 0], c) ? [0.15, 0, 0] : [0.99, 0, 0]) }} />}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-11 font-mono text-mono-micro text-text-tertiary">
        {ramp.map((c, i) => <span key={i} className={`text-center ${i === 8 ? 'text-text-primary' : ''}`}>{i + 1}</span>)}
      </div>
    </div>
  );
}

const LINK_LABEL: Record<LinkMode, string> = { off: 'Separate', same: 'Same', light: 'Light → dark', dark: 'Dark → light' };

/**
 * How this colour's light and dark values relate, with the rule written out and editable.
 * The solid (step 9) is the only value that crosses modes; steps 1–8, 10 and 11 are always rebuilt per mode
 * from that mode's solid and neutrals (see the ramp strip).
 */
function LinkControl({ name, state, theme, onChange }: { name: string; state: ColorState; theme: Theme; onChange: (next: ColorState) => void }) {
  const derived = state.link === 'light' || state.link === 'dark';
  const rule = state.link === 'off' ? 'Light and dark are edited separately.'
    : state.link === 'same' ? 'One value for both modes: editing either mode changes both.'
    : state.link === 'light' ? `dark = light · L ${state.shift >= 0 ? '+' : '−'} ${Math.abs(state.shift).toFixed(3)} · C × ${state.chroma.toFixed(2)} · H ${state.hue >= 0 ? '+' : '−'} ${Math.abs(state.hue).toFixed(1)}°`
    : `light = dark · L ${state.shift >= 0 ? '−' : '+'} ${Math.abs(state.shift).toFixed(3)} · C ÷ ${state.chroma.toFixed(2)} · H ${state.hue >= 0 ? '−' : '+'} ${Math.abs(state.hue).toFixed(1)}°`;
  return (
    <div className="grid gap-2 rounded-lg bg-surface-raised p-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-footnote text-text-secondary">Light ↔ dark</span>
        <SegmentedControl size="xs" aria-label={`${name}: how light and dark relate`} value={state.link} onValueChange={v => onChange(setLink(state, v as LinkMode, theme))}>
          {(Object.keys(LINK_LABEL) as LinkMode[]).map(m => <SegmentedControlItem key={m} value={m}>{LINK_LABEL[m]}</SegmentedControlItem>)}
        </SegmentedControl>
      </div>
      <p className="m-0 font-mono text-mono-sm text-text-tertiary">{rule}</p>
      {derived && (
        <div className="grid grid-cols-3 gap-2">
          <NumberField aria-label={`${name} lightness shift`} label="ΔL" value={state.shift} step={0.005} min={-1} max={1} onValueChange={n => onChange({ ...state, shift: round(n) })} />
          <NumberField aria-label={`${name} chroma ratio`} label="C×" value={state.chroma} step={0.05} min={0.05} max={4} onValueChange={n => onChange({ ...state, chroma: round(n, 2) })} />
          <NumberField aria-label={`${name} hue offset`} label="ΔH" value={state.hue} step={1} min={-180} max={180} onValueChange={n => onChange({ ...state, hue: round(n, 1) })} />
        </div>
      )}
    </div>
  );
}

/** One editable colour for the active theme. */
export function ColorControl({ def, state, theme, onChange, ramp, checks }: {
  def: ColorDef; state: ColorState; theme: Theme; onChange: (next: ColorState) => void;
  /** The generated ramp for this theme, and the contrast of the slots it feeds. */
  ramp: readonly LCH[]; checks: Check[];
}) {
  const value = valueOf(state, theme);
  const linkedHere = isDerived(state, theme);
  const inGamut = isInGamut(value);
  return (
    <section aria-label={def.name} className="grid gap-2 border-b border-border-subtle px-3 py-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <Swatch c={value} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <b className="truncate font-ui text-ui-strong text-text-primary">{def.name}</b>
            <span className="font-mono text-mono-sm text-text-tertiary">{hex(value)}</span>
          </div>
          <p className="m-0 truncate text-footnote text-text-tertiary" title={def.uses}>{def.uses}</p>
        </div>
      </div>
      {!inGamut && (
        <p className="m-0 flex items-center gap-1.5 text-footnote text-warning-text">
          <TriangleAlert aria-hidden className="size-icon-sm" /> Outside sRGB: chroma is clipped to {gamutMap(value)[1].toFixed(3)} on screen.
        </p>
      )}
      <LchEditor name={`${def.name} ${theme}`} value={value} disabled={linkedHere} onChange={v => onChange(setValue(state, theme, v))} />
      <RampStrip ramp={ramp} name={`${def.name} ${theme}`} />
      <LinkControl name={def.name} state={state} theme={theme} onChange={onChange} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Checks checks={checks} />
      </div>
    </section>
  );
}

