import { TriangleAlert } from 'lucide-react';
import { Checkbox, ContrastChip, NumberField, Slider } from '@caustic/react';
import { contrast, gamutMap, hex, isInGamut, label, type LCH } from '../color.ts';
import { report, surfaceFor, type Palette, type Theme } from '../palettes.ts';
import { linkedDark, round, valueOf, type ColorDef, type ColorState } from './state.ts';

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

/** Contrast pairs for one colour in one theme, with report()'s thresholds. */
export function checksFor(key: ColorDef['key'], p: Palette, t: Theme): Check[] {
  const roleName = { accent: 'Accent', success: 'Success', warning: 'Warning', danger: 'Danger', info: 'Info' } as const;
  if (key in roleName) {
    const n = roleName[key as keyof typeof roleName];
    const short: Record<string, string> = { 'label on solid fill': 'label on fill', 'text on surface': 'text on surface', 'text on its soft badge': 'text on soft', 'solid vs surface (graphic)': 'fill vs surface' };
    return report(p, t).filter(r => r.label.startsWith(`${n}:`)).map(r => {
      const k = r.label.slice(n.length + 2);
      return { label: short[k] ?? k, ratio: r.ratio, need: r.need };
    });
  }
  const surface = surfaceFor(p, t);
  const c = key === 'agent1' ? p.spectrum[0] : key === 'agent2' ? p.spectrum[1] : key === 'agent3' ? p.spectrum[2] : key === 'extra1' ? p.extras[0] : p.extras[1];
  const ratio = contrast(c[t], surface);
  // the agent gradient is a rim around labelled content; the extras draw chart lines and marks
  return [{ label: 'vs surface', ratio, need: key.startsWith('extra') ? 3 : null }];
}

export function Checks({ checks }: { checks: Check[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {checks.map(c => {
        const pass = c.need === null || c.ratio >= c.need - 1e-9;
        return (
          <ContrastChip key={c.label} result={pass ? 'pass' : 'fail'} level={c.need === null ? 'info' : c.need >= 4.5 ? 'AA' : 'UI'} title={c.need === null ? 'Decorative: no minimum' : `Needs ${c.need}:1`}>
            {c.label} {c.ratio.toFixed(1)}{pass ? '' : ' · fails'}
          </ContrastChip>
        );
      })}
    </div>
  );
}

export function Swatch({ c, className = 'size-8' }: { c: LCH; className?: string }) {
  return <span aria-hidden className={`${className} shrink-0 rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]`} style={{ background: ok(gamutMap(c)) }} />;
}

const STEP_ROLE = ['tint', 'tint', 'soft', 'soft hover', 'pressed', 'border', 'border strong', 'graphic', 'solid', 'solid hover', 'text'];

/** The generated 1–11 ramp of the proposed language, step 9 (the pick) marked. */
export function RampStrip({ ramp, name }: { ramp: LCH[]; name: string }) {
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

/** One editable colour for the active theme. */
export function ColorControl({ def, state, theme, palette, onChange, ramp, rampChecks }: {
  def: ColorDef; state: ColorState; theme: Theme; palette: Palette; onChange: (next: ColorState) => void;
  /** Proposed language: the generated ramp for this theme, and its slot checks (replace the current checks). */
  ramp?: LCH[]; rampChecks?: Check[];
}) {
  const value = valueOf(state, theme);
  const linkedHere = theme === 'dark' && state.link;
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
      <LchEditor name={`${def.name} ${theme}`} value={value} disabled={linkedHere} onChange={v => onChange({ ...state, [theme]: v })} />
      {ramp && <RampStrip ramp={ramp} name={`${def.name} ${theme}`} />}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Checks checks={rampChecks ?? checksFor(def.key, palette, theme)} />
        <label className="flex items-center gap-1.5 text-footnote text-text-secondary">
          <Checkbox
            aria-label={`${def.name}: dark follows light`} checked={state.link}
            onCheckedChange={v => {
              const link = v === true;
              // freeze the current dark when unlinking, so nothing jumps
              onChange(link ? { ...state, link, shift: round(state.dark[0] - state.light[0]) } : { ...state, link, dark: linkedDark(state) });
            }}
          />
          dark follows light
          {state.link && <span className="font-mono text-mono-sm text-text-tertiary">L{state.shift >= 0 ? '+' : ''}{state.shift.toFixed(2)}</span>}
        </label>
      </div>
    </section>
  );
}

