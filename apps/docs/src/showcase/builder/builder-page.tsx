// Lab: palette builder. An internal tool for tuning Caustic's colour tokens live; it is not a product page and nothing here ships.
import { useEffect, useMemo, useState } from 'react';
import { Copy, FlaskConical, RotateCcw, Upload } from 'lucide-react';
import { Alert, Badge, Button, Checkbox, SegmentedControl, SegmentedControlItem, Textarea } from '@caustic/react';
import { useSettings } from '../../settings.tsx';
import { label } from '../color.ts';
import { usePalette } from '../palette-state.tsx';
import { NEUTRAL_ROLES, neutralsFor, paletteVars, roleStepOf, type DarkRamp, type Theme } from '../palettes.ts';
import { ColorControl, LchEditor, Swatch } from './controls.tsx';
import { rampChecks } from './language.ts';
import { EmphasisMatrix } from './matrix.tsx';
import { AgentSession, GateDashboard, LibrarySettings, PublishForm, Scenario, StateMatrix } from './scenarios.tsx';
import {
  builderRamps, builderVars, COLORS, derivedHover, exportCss, exportJson, initialState, langInput, load, parse, save, SOLID_OF, toPalette,
  type BuilderState,
} from './state.ts';

const SECTIONS = [
  { id: 'lab-matrix', label: 'Matrix' },
  { id: 'lab-form', label: 'Form' },
  { id: 'lab-agent', label: 'Agent' },
  { id: 'lab-settings', label: 'Settings' },
  { id: 'lab-data', label: 'Data' },
  { id: 'lab-states', label: 'States' },
  { id: 'lab-tokens', label: 'Tokens' },
];

/** Writes the builder's variables on <html> (so portals follow), after the palette provider has written its own. */
function useApplyVars(state: BuilderState, theme: Theme) {
  const { palette } = usePalette();
  useEffect(() => {
    const root = document.documentElement;
    const vars = builderVars(state, theme);
    const raf = requestAnimationFrame(() => { for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v); });
    return () => {
      cancelAnimationFrame(raf);
      for (const k of Object.keys(vars)) root.style.removeProperty(k);
      // hand <html> back to the docs palette
      for (const [k, v] of Object.entries(paletteVars(palette, theme))) root.style.setProperty(k, v);
    };
  }, [state, theme, palette]);
}

const LADDER = ['bg canvas', 'bg app', 'surface base', 'surface raised'] as const;

function NeutralRamps({ theme, state, onDarkRamp }: { theme: Theme; state: BuilderState; onDarkRamp: (v: DarkRamp) => void }) {
  const p = toPalette(state);
  return (
    <section aria-label="Neutrals, locked" className="grid gap-2 border-b border-border-default px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <b className="font-ui text-ui-strong text-text-primary">Neutrals</b>
        <Badge tone="outline">locked · Deep Black</Badge>
      </div>
      <p className="m-0 text-footnote text-text-tertiary">One ramp per mode, step 1 at the background end. Approved; not editable here.</p>
      {(['light', 'dark'] as const).map(t => (
        <div key={t} className="grid gap-1">
          <span className={`font-mono text-mono-sm ${t === theme ? 'text-text-primary' : 'text-text-tertiary'}`}>neutral-{t} 1–11{t === theme ? ' · in use' : ''}</span>
          <div className="grid grid-cols-11 overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]">
            {neutralsFor(p, t).map((c, i) => (
              <span key={i} title={`neutral-${t}-${i + 1} · oklch ${label(c)}`} className="h-6" style={{ background: `oklch(${c[0]} ${c[1]} ${c[2]})` }} />
            ))}
          </div>
          <div className="grid grid-cols-11 font-mono text-mono-micro text-text-tertiary">
            {neutralsFor(p, t).map((c, i) => <span key={i} className="text-center">{c[0].toFixed(3).slice(1)}</span>)}
          </div>
        </div>
      ))}
      <p className="m-0 text-footnote text-text-tertiary">L shown; C 0 and no hue on every step. Roles: {NEUTRAL_ROLES.filter(r => r.light !== r.dark).map(r => `${r.role} ${r.light}/${r.dark}`).join(' · ')} (light/dark); text and borders share steps.</p>
      <div className="grid gap-1.5 pt-1">
        <span className="font-ui text-ui-strong text-text-primary">Dark ramp</span>
        <SegmentedControl size="xs" aria-label="Dark ramp" value={state.darkRamp} onValueChange={v => onDarkRamp(v as DarkRamp)}>
          <SegmentedControlItem value="subtle">Subtle</SegmentedControlItem>
          <SegmentedControlItem value="more">A bit more</SegmentedControlItem>
          <SegmentedControlItem value="previous">Previous</SegmentedControlItem>
        </SegmentedControl>
        <span className="font-mono text-mono-sm text-text-tertiary">
          dark {LADDER.map(r => `${r.replace('surface ', '').replace('bg ', '')} ${roleStepOf(p, 'dark', r)} (${neutralsFor(p, 'dark')[roleStepOf(p, 'dark', r) - 1]![0].toFixed(3).slice(1)})`).join(' · ')}
        </span>
        <p className="m-0 text-footnote text-text-tertiary">Role links stay (canvas 1, app 2, surface 3, raised 4); steps 2–11 get darker. A bit more is the decided default.</p>
      </div>
    </section>
  );
}

function TokenInspector({ state, theme }: { state: BuilderState; theme: Theme }) {
  const [rows, setRows] = useState<{ name: string; value: string }[]>([]);
  const driven = useMemo(() => new Set(Object.keys(builderVars(state, theme))), [state, theme]);
  useEffect(() => {
    // read after the vars land (they are written on the next frame)
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      const cs = getComputedStyle(document.documentElement);
      const names = Array.from(cs).filter(n => n.startsWith('--cs-color-')).sort();
      setRows(names.map(name => ({ name, value: cs.getPropertyValue(name).trim() })));
    }));
    return () => cancelAnimationFrame(raf);
  }, [state, theme]);
  const ours = rows.filter(r => driven.has(r.name)).length;
  return (
    <div className="grid gap-2">
      <p className="m-0 text-ui-sm text-text-secondary">{rows.length} colour variables on this page · {ours} written by the builder · the rest are references (old alias names, focus-offset, required-mark, syntax-comment) that read a written variable.</p>
      <div className="grid gap-x-6 min-[900px]:grid-cols-2 min-[1300px]:grid-cols-3">
        {rows.map(r => (
          <div key={r.name} className="flex min-w-0 items-center gap-2 border-b border-border-subtle py-1">
            <span aria-hidden className="size-4 shrink-0 rounded-xs shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]" style={{ background: `var(${r.name})` }} />
            <span className={`min-w-0 flex-1 truncate font-mono text-mono-sm ${driven.has(r.name) ? 'text-text-primary' : 'text-text-tertiary'}`} title={r.value}>{r.name.replace(/^--cs-color-/, '')}</span>
            {!driven.has(r.name) && <span className="text-mono-micro font-mono text-text-tertiary">shipped</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BuilderPage() {
  const { theme, set } = useSettings();
  const [state, setState] = useState<BuilderState>(load);
  const [io, setIo] = useState<{ mode: 'none' | 'import' | 'copied'; text: string; error?: string }>({ mode: 'none', text: '' });
  useEffect(() => save(state), [state]);
  useApplyVars(state, theme);
  const ramps = useMemo(() => builderRamps(state), [state]);
  const neutral = useMemo(() => langInput(state).neutral, [state]);

  const copy = async (text: string, what: string) => {
    try { await navigator.clipboard.writeText(text); setIo({ mode: 'copied', text: `${what} copied to the clipboard.` }); }
    catch { setIo({ mode: 'copied', text: `Clipboard blocked; select and copy below.\n\n${text}` }); }
  };
  const hover = state.accentHover[theme];

  return (
    <div className="min-w-0 font-ui text-text-primary" data-lab="builder">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border-default bg-bg-inset px-4 py-2.5 min-[900px]:px-5">
        <Badge tone="solid" shape="square" icon={<FlaskConical />}>Lab</Badge>
        <p className="m-0 min-w-0 flex-1 text-ui-sm text-text-secondary">
          <b className="text-text-primary">Internal design lab for tuning Caustic’s colour tokens.</b> Not a product page and not part of the component library; nothing here ships.
          The previews use Caustic’s own domain (token releases, agent sessions, library settings, gate runs).
        </p>
      </div>

      <div className="sticky top-14 z-20 flex flex-wrap items-center gap-2 border-b border-border-subtle bg-surface-base px-4 py-2 min-[900px]:px-5">
        <h1 className="m-0 mr-2 font-ui text-title-4">Palette builder</h1>
        <SegmentedControl size="xs" aria-label="Preview theme" value={theme} onValueChange={v => set({ theme: v as Theme })}>
          <SegmentedControlItem value="light">Light</SegmentedControlItem>
          <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
        </SegmentedControl>
        <nav aria-label="Scenarios" className="flex flex-wrap gap-0.5 max-[1535px]:hidden">
          {SECTIONS.map(s => <a key={s.id} href={`#/lab/builder`} onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ block: 'start' }); }} className="rounded-sm px-2 py-1 text-ui-sm text-text-secondary outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus">{s.label}</a>)}
        </nav>
        <span className="flex-1" />
        <Button tone="ghost" size="xs" iconStart={<RotateCcw />} onClick={() => { setState(initialState()); setIo({ mode: 'none', text: '' }); }}>Reset to shipped</Button>
        <Button tone="secondary" size="xs" iconStart={<Copy />} onClick={() => void copy(exportJson(state), 'JSON')}>Copy JSON</Button>
        <Button tone="secondary" size="xs" iconStart={<Copy />} onClick={() => void copy(exportCss(state), 'CSS variables (light and dark)')}>Copy CSS vars</Button>
        <Button tone="secondary" size="xs" iconStart={<Upload />} onClick={() => setIo({ mode: 'import', text: '' })}>Import JSON</Button>
      </div>

      {io.mode !== 'none' && (
        <div className="grid gap-2 border-b border-border-subtle px-4 py-3 min-[900px]:px-5">
          {io.mode === 'copied' ? (
            <div className="flex items-start gap-3">
              <pre className="m-0 max-h-60 min-w-0 flex-1 overflow-auto whitespace-pre-wrap font-mono text-mono-sm text-text-secondary">{io.text}</pre>
              <Button tone="ghost" size="xs" onClick={() => setIo({ mode: 'none', text: '' })}>Close</Button>
            </div>
          ) : (
            <>
              <Textarea aria-label="Builder JSON" rows={5} placeholder="Paste JSON from Copy JSON" value={io.text} onChange={e => setIo({ mode: 'import', text: e.currentTarget.value })} invalid={Boolean(io.error)} />
              {io.error && <Alert tone="danger">{io.error}</Alert>}
              <div className="flex gap-2">
                <Button size="xs" onClick={() => { try { setState(parse(io.text)); setIo({ mode: 'none', text: '' }); } catch (e) { setIo({ ...io, error: e instanceof Error ? e.message : String(e) }); } }}>Apply</Button>
                <Button tone="ghost" size="xs" onClick={() => setIo({ mode: 'none', text: '' })}>Cancel</Button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid min-[1100px]:grid-cols-[23rem_minmax(0,1fr)]">
        <aside aria-label="Colour controls" className="border-border-default bg-surface-base min-[1100px]:sticky min-[1100px]:top-[6.5rem] min-[1100px]:max-h-[calc(100vh-6.5rem)] min-[1100px]:self-start min-[1100px]:overflow-y-auto min-[1100px]:border-r">
          <div className="border-b border-border-default px-3 py-2 text-footnote text-text-tertiary">
            Editing <b className="text-text-primary">{theme}</b>. Switch the theme above to edit the other mode; each colour keeps separate light and dark values.
          </div>
          <NeutralRamps theme={theme} state={state} onDarkRamp={v => setState(s => ({ ...s, darkRamp: v }))} />
          {(['Accent', 'Status', 'Agent gradient', 'Extra chart / illustration', 'Canvas'] as const).map(g => (
            <div key={g}>
              <h2 className="m-0 border-b border-border-subtle bg-bg-app px-3 py-1.5 text-caption uppercase text-text-tertiary">{g}</h2>
              {COLORS.filter(c => c.group === g).map(def => (
                <div key={def.key}>
                  <ColorControl
                    def={def} state={state.colors[def.key]} theme={theme}
                    onChange={next => setState(s => ({ ...s, colors: { ...s.colors, [def.key]: next } }))}
                    ramp={ramps[SOLID_OF[def.key]]![theme].steps}
                    checks={rampChecks(ramps, neutral, theme, SOLID_OF[def.key])}
                  />
                  {def.key === 'accent' && (
                    <div className="grid gap-2 border-b border-border-subtle px-3 pb-3">
                      <label className="flex items-center gap-1.5 text-footnote text-text-secondary">
                        <Checkbox aria-label={`Override accent hover (${theme})`} checked={hover !== null} onCheckedChange={v => setState(s => ({ ...s, accentHover: { ...s.accentHover, [theme]: v === true ? derivedHover(s, theme) : null } }))} />
                        Override hover ({theme}) {hover === null && <span className="text-text-tertiary">· derived {label(derivedHover(state, theme))}</span>}
                      </label>
                      {hover && (
                        <div className="flex items-start gap-2">
                          <Swatch c={hover} className="mt-1 size-6" />
                          <div className="min-w-0 flex-1"><LchEditor name={`Accent hover ${theme}`} value={hover} onChange={v => setState(s => ({ ...s, accentHover: { ...s.accentHover, [theme]: v } }))} /></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </aside>

        <main className="grid min-w-0 content-start gap-8 bg-bg-app px-4 py-5 min-[900px]:px-6">
          <Scenario id="lab-matrix" title="Emphasis × tone matrix" note="Every tone in every emphasis and state, drawn from the generated ramps. Components below read the same steps through the slot tokens (--cs-color-{tone}-tint … -text, -on).">
            <EmphasisMatrix theme={theme} />
          </Scenario>
          <Scenario id="lab-form" title="Complex form · publish a token release" note="Inputs, combobox, date range, number and slider fields, checkbox tree, radios, segmented, toggle group, switches, required, read-only, disabled and errors.">
            <PublishForm />
          </Scenario>
          <Scenario id="lab-agent" title="Agent session" note="Messages, thinking, proposal, plan, streaming, activity tree, tool calls, diff, permission, toasts, notices, progress, spinner, skeleton, checkpoints, composer.">
            <AgentSession />
          </Scenario>
          <Scenario id="lab-settings" title="Library settings" note="Navigation, tabs, selectable members table with avatars and status badges, usage meters, switches, empty state, danger zone.">
            <LibrarySettings />
          </Scenario>
          <Scenario id="lab-data" title="Gate runs · data" note="Stat tiles with sparklines, six chart series (1–4 from accent and status, 5–6 from the extras), stacked bars, chips, selectable table.">
            <GateDashboard />
          </Scenario>
          <Scenario id="lab-states" title="State matrix" note="Every button tone in default, hover, focus and disabled (hover and focus drawn statically; tab through the page for real focus rings), badges, chips, controls, inputs, avatars, notices.">
            <StateMatrix />
          </Scenario>
          <Scenario id="lab-tokens" title="Token inspector" note="Every colour variable resolved on this page right now. Bright names are written by the builder; dim ones are shipped values.">
            <TokenInspector state={state} theme={theme} />
          </Scenario>
        </main>
      </div>
    </div>
  );
}
