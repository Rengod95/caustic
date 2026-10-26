import { useLayoutEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Bell, Check, Sparkles, X } from 'lucide-react';
import {
  Alert, Badge, Button, Checkbox, Input, ListSelection, ListSelectionItem, Menu, MenuGroup, MenuHeading, MenuItem,
  Progress, RadioGroup, RadioGroupItem, SegmentedControl, SegmentedControlItem, Switch, Tabs, TabsList, TabsTrigger, Toast,
} from '@caustic/react';
import { useSettings } from '../settings.tsx';
import { contrast, gamutMap, hex, isInGamut, label, css, type LCH } from './color.ts';
import {
  bestOn, extrasReport, NEUTRAL_BGS, NEUTRAL_FGS, NEUTRAL_ROLES, neutralReport, neutralsFor, palettes, paletteVars, report, resolve, scopeVars,
  type Palette, type Swatch, type Theme,
} from './palettes.ts';
import { readBaseline, usePalette } from './palette-state.tsx';

const mono = 'font-mono text-mono-sm';
const BASELINE_KEYS = Object.keys(paletteVars(palettes[1]!, 'light'));

const peakChroma = (p: Palette) => Math.max(...[p.accent, p.success, p.warning, p.danger, p.info].map(s => s.light[1]));

function PalettePoster({ id, name }: { id: string; name: string }) {
  const INK = 'var(--cs-color-accent-solid)', X1 = 'var(--cs-color-chart-5)';
  const W = 'var(--cs-color-warning-solid)', S = 'var(--cs-color-success-solid)', D = 'var(--cs-color-danger-solid)', I = 'var(--cs-color-info-solid)';
  const bg = 'var(--cs-color-bg-canvas)', line = 'var(--cs-color-border-strong)';
  const sp = ['var(--cs-color-agent-stop-1)', 'var(--cs-color-agent-stop-2)', 'var(--cs-color-agent-stop-3)'];
  const common = { viewBox: '0 0 720 150', preserveAspectRatio: 'xMidYMid meet', className: 'block h-[120px] w-full rounded-xl bg-bg-canvas min-[700px]:h-[150px]', role: 'img', 'aria-label': `${name}: palette in an illustration` } as const;
  if (id !== 'current') {
    const X2 = 'var(--cs-color-chart-6)';
    const pads = [sp[0], 'var(--cs-color-neutral-pressed)', W, 'var(--cs-color-neutral-pressed)', sp[1], X1, 'var(--cs-color-neutral-pressed)', sp[2], 'var(--cs-color-neutral-pressed)', X2, S, 'var(--cs-color-neutral-pressed)'];
    return (
      <svg {...common}>
        {[0, 1, 2, 3].map(i => <g key={i}><circle cx={90 + i * 100} cy="75" r="36" fill="var(--cs-color-surface-base)" stroke={INK} strokeWidth="2" /><line x1={90 + i * 100} y1="75" x2={90 + i * 100 + 20 * Math.cos(i * 1.4 - 1)} y2={75 + 20 * Math.sin(i * 1.4 - 1)} stroke={INK} strokeWidth="4" strokeLinecap="round" /></g>)}
        {pads.map((c, i) => <rect key={i} x={500 + (i % 4) * 46} y={26 + Math.floor(i / 4) * 38} width="40" height="32" rx="5" fill={c} />)}
        <line x1="40" x2="440" y1="131" y2="131" stroke={line} strokeWidth="2" /><circle cx="440" cy="131" r="4" fill={D} /><circle cx="456" cy="131" r="4" fill={I} />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="140" cy="75" r="48" fill="var(--cs-color-agent-stop-1)" /><circle cx="230" cy="75" r="48" fill="var(--cs-color-agent-stop-2)" /><circle cx="320" cy="75" r="48" fill="var(--cs-color-agent-stop-3)" />
      <rect x="420" y="40" width="240" height="14" rx="7" fill="var(--cs-color-accent-solid)" /><rect x="420" y="66" width="190" height="14" rx="7" fill={S} /><rect x="420" y="92" width="140" height="14" rx="7" fill={W} />
    </svg>
  );
}

function SwatchCard({ name, role, c, p }: { name: string; role: string; c: LCH; p: Palette }) {
  const mapped = gamutMap(c);
  const on = bestOn(c, p);
  const clipped = !isInGamut(c);
  return (
    <div className="grid min-w-0 content-start gap-1.5">
      <div className="flex h-16 flex-col justify-between rounded-lg p-2 shadow-[inset_0_0_0_1px_oklch(0_0_0/0.06)]" style={{ background: css(c), color: css(on) }}>
        <span className="text-ui-strong">{name}</span>
        <span className={`${mono} tabular-nums`}>Aa {contrast(on, c).toFixed(1)}:1</span>
      </div>
      <div className="grid gap-px px-0.5">
        <span className="text-label text-text-tertiary">{role}</span>
        <span className={`${mono} text-text-primary`}>oklch({label(c)})</span>
        <span className={`${mono} text-text-tertiary`}>{hex(c)}{clipped ? ` · sRGB C ${mapped[1].toFixed(2)}` : ''}</span>
      </div>
    </div>
  );
}

function Tick({ ok }: { ok: boolean }) {
  return ok ? <Check role="img" aria-label="passes" className="size-3.5 text-success-text" /> : <X role="img" aria-label="fails" className="size-3.5 text-danger-text" />;
}

/** A contrast ratio in a table cell: passes read as plain numbers, only failures carry a mark and colour. */
function Ratio({ value, pass, mark }: { value: number; pass: boolean; mark?: ReactNode }) {
  return (
    <span className={`inline-flex items-center justify-end gap-1 ${mono} tabular-nums ${pass ? 'text-text-primary' : 'text-danger-text'}`}>
      {mark ?? (pass ? null : <X role="img" aria-label="fails" className="size-3.5" />)}
      {value.toFixed(1)}
    </span>
  );
}

const table = 'w-full border-collapse text-ui';
const th = 'whitespace-nowrap px-2 py-1.5 text-left text-label font-medium text-text-tertiary';
const thNum = 'whitespace-nowrap px-2 py-1.5 text-right text-label font-medium text-text-tertiary';
const row = 'border-t border-border-subtle';

function ContrastMatrix({ p, theme }: { p: Palette; theme: Theme }) {
  const rows = useMemo(() => report(p, theme), [p, theme]);
  const anyFillOnly = rows.some(x => !x.pass && Boolean(x.note));
  const roles = ['Accent', 'Success', 'Warning', 'Danger', 'Info'];
  const metrics = [
    { k: 'label on solid fill', title: 'Label on solid', need: '4.5' },
    { k: 'text on surface', title: 'Text on surface', need: '4.5' },
    { k: 'text on its soft badge', title: 'Text on soft badge', need: '4.5' },
    { k: 'solid vs surface (graphic)', title: 'Solid vs surface (UI)', need: '3' },
  ];
  return (
    <div className="grid content-start gap-1.5">
      <div className="overflow-x-auto">
        <table className={`${table} min-w-[30rem]`}>
          <thead>
            <tr>
              <th className={th}>Pair <span className="font-normal">(need)</span></th>
              {roles.map(r => <th key={r} className={thNum}>{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {metrics.map(m => (
              <tr key={m.k} className={row}>
                <td className="px-2 py-1.5 text-text-secondary">{m.title} <span className="text-text-tertiary">≥ {m.need}</span></td>
                {roles.map(r => {
                  const x = rows.find(y => y.label === `${r}: ${m.k}`)!;
                  const fillOnly = !x.pass && Boolean(x.note);
                  return (
                    <td key={r} className="px-2 py-1.5 text-right">
                      <Ratio value={x.ratio} pass={x.pass || fillOnly} mark={fillOnly ? <span aria-label="fill plus ink" className="inline-block size-3.5 rounded-full bg-neutral-pressed text-center font-ui text-[9px] leading-[14px] text-text-secondary">i</span> : undefined} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {anyFillOnly && <p className="m-0 max-w-[72ch] px-2 text-footnote text-text-tertiary">
        (i) = vivid fill that cannot hold a 3:1 edge on its own. It is always paired with ink text (row 1) and a text or border cue, and never used as a thin line or small glyph.
      </p>}
    </div>
  );
}

function SwatchGroup({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-2.5">
      <div className="grid gap-0.5">
        <h3 className="m-0 text-title-4 text-text-primary">{title}</h3>
        <p className="m-0 text-footnote text-text-secondary">{caption}</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] gap-x-2 gap-y-3">{children}</div>
    </div>
  );
}

const roleAt = (t: Theme, n: number) => NEUTRAL_ROLES.filter(r => r[t] === n).map(r => r.role).join(' · ');

function NeutralRamp({ p, t }: { p: Palette; t: Theme }) {
  const r = neutralsFor(p, t);
  return (
    <div className="grid gap-1.5">
      <span className={`${mono} text-text-secondary`}>neutral-{t} 1-11</span>
      <div className="grid grid-cols-[repeat(11,minmax(0,1fr))] overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] max-[700px]:grid-cols-[repeat(6,minmax(0,1fr))]">
        {r.map((c, i) => {
          const role = roleAt(t, i + 1);
          return (
            <div key={i} title={role || undefined} className="grid min-h-[76px] content-between gap-1 p-1.5" style={{ background: css(c), color: css(bestOn(c, p)) }}>
              <span className="text-ui-strong">{i + 1}</span>
              <span className="grid font-mono text-[10px] leading-[1.25] tabular-nums"><span>L {c[0].toFixed(3)}</span><span>C {c[1].toFixed(3)}</span><span>H {c[1] ? c[2] : '-'}</span></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NeutralRamps({ p }: { p: Palette }) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-0.5">
        <h3 className="m-0 text-title-4 text-text-primary">Neutrals, one ramp per mode</h3>
        <p className="m-0 max-w-[80ch] text-footnote text-text-secondary">Step 1 is the background end in both ramps and step 11 the strongest text. Text and control roles read the same step in both modes; the dark ramp is spaced for the dark ladder instead of mirroring the light one.</p>
      </div>
      <NeutralRamp p={p} t="light" />
      <NeutralRamp p={p} t="dark" />
    </div>
  );
}

/** The role-to-step mapping is one constant for every Signal Grey variant, so it is shown once above the sections. */
function NeutralRoles() {
  return (
    <div className="grid content-start gap-1.5">
      <table className={`${table} max-w-[32rem]`}>
        <thead><tr><th className={th}>Role</th><th className={thNum}>Light step</th><th className={thNum}>Dark step</th></tr></thead>
        <tbody>
          {NEUTRAL_ROLES.map(r => (
            <tr key={r.role} className={row}>
              <td className="px-2 py-1 text-text-secondary">{r.role}</td>
              <td className={`px-2 py-1 text-right ${mono} tabular-nums`}>{r.light}</td>
              <td className={`px-2 py-1 text-right ${mono} tabular-nums ${r.light === r.dark ? 'text-text-secondary' : 'text-text-primary'}`}>{r.light === r.dark ? '' : '* '}{r.dark}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="m-0 max-w-[72ch] px-2 text-footnote text-text-tertiary">* Light puts white surfaces above a darker canvas; dark lifts surfaces away from the darkest canvas, so the background roles sit on different steps.</p>
    </div>
  );
}

function NeutralMatrix({ p, theme }: { p: Palette; theme: Theme }) {
  const rows = useMemo(() => [...neutralReport(p, theme), ...extrasReport(p, theme)], [p, theme]);
  const extras = rows.filter(r => r.label.startsWith('Extra'));
  return (
    <div className="grid content-start gap-1.5">
      <div className="overflow-x-auto">
        <table className={`${table} min-w-[30rem]`}>
          <thead>
            <tr>
              <th className={th}>Neutral step <span className="font-normal">(need)</span></th>
              {NEUTRAL_BGS.map(b => <th key={b} className={thNum}>on {b}</th>)}
            </tr>
          </thead>
          <tbody>
            {NEUTRAL_FGS.map(([name, , need]) => (
              <tr key={name} className={row}>
                <td className="px-2 py-1.5 text-text-secondary">{name} <span className="text-text-tertiary">≥ {need}</span></td>
                {NEUTRAL_BGS.map(b => {
                  const x = rows.find(y => y.label === `${name} on ${b}`)!;
                  return <td key={b} className="px-2 py-1.5 text-right"><Ratio value={x.ratio} pass={x.pass} /></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="m-0 px-2 text-footnote text-text-secondary">
        Extra colours vs surface (lines and small marks, ≥ 3): {extras.map(r => <span key={r.label} className="mr-3 inline-flex items-center gap-1"><Tick ok={r.pass} /><span className={`${mono} tabular-nums`}>{r.label.replace(' vs surface', '')} {r.ratio.toFixed(1)}</span></span>)}
      </p>
    </div>
  );
}

function Cell({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`grid min-w-0 content-start gap-2.5 rounded-xl bg-surface-base p-3.5 shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] ${className}`}>
      <h4 className="m-0 text-label text-text-tertiary">{title}</h4>
      {children}
    </div>
  );
}

function ChartDemo() {
  const cols = [[40, 28, 18, 10], [52, 30, 22, 12], [46, 36, 20, 16], [64, 34, 26, 14], [58, 42, 30, 20], [74, 40, 28, 22]];
  const fills = ['var(--cs-color-chart-1)', 'var(--cs-color-chart-2)', 'var(--cs-color-chart-3)', 'var(--cs-color-chart-4)'];
  const X1 = 'var(--cs-color-chart-5)', X2 = 'var(--cs-color-chart-6)';
  const total = (c: number[]) => c.reduce((a, b) => a + b, 0);
  return (
    <div className="grid max-w-[36rem] grid-cols-[minmax(0,1fr)_96px] items-end gap-6">
      <svg viewBox="0 0 240 120" className="block max-h-44 w-full" role="img" aria-label="Stacked column chart">
        {[0, 1, 2, 3].map(i => <line key={i} x1="0" x2="240" y1={10 + i * 32} y2={10 + i * 32} stroke="var(--cs-color-border-default)" />)}
        {cols.map((c, i) => {
          let y = 106;
          return (
            <g key={i}>
              {c.map((v, j) => { y -= v * 0.5; return <rect key={j} x={14 + i * 38} y={y} width="26" height={v * 0.5 - 1.5} rx="2" fill={fills[j]} />; })}
            </g>
          );
        })}
        <polyline points={cols.map((c, i) => `${27 + i * 38},${100 - total(c) * 0.42}`).join(' ')} fill="none" stroke={X1} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {cols.map((c, i) => <circle key={i} cx={27 + i * 38} cy={100 - total(c) * 0.42} r="3.5" fill="var(--cs-color-surface-base)" stroke={X1} strokeWidth="2" />)}
      </svg>
      <svg viewBox="0 0 96 96" className="block w-24" role="img" aria-label="Donut chart">
        {([[0, 0.38, 'var(--cs-color-chart-1)'], [0.38, 0.62, X1], [0.62, 0.84, X2], [0.84, 1, 'var(--cs-color-chart-4)']] as const).map(([a, b, c], i) => {
          const r = 34, C = 2 * Math.PI * r, len = (b - a) * C - 2;
          return <circle key={i} cx="48" cy="48" r={r} fill="none" stroke={c} strokeWidth="14" strokeDasharray={`${len} ${C}`} strokeDashoffset={-a * C} transform="rotate(-90 48 48)" />;
        })}
      </svg>
    </div>
  );
}

function InComponents({ p }: { p: Palette }) {
  const [sel, setSel] = useState('b');
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,19rem),1fr))] items-start gap-3">
      <Cell title="Buttons">
        <div className="flex flex-wrap gap-2">
          <Button tone="accent">Start building</Button>
          <Button tone="secondary">Secondary</Button>
          <Button tone="destructive">Delete</Button>
          <Button tone="danger">Discard</Button>
          <Button tone="ink">Ink</Button>
          <Button tone="ghost">Ghost</Button>
          <Button tone="agent" iconStart={<Sparkles />}>Ask agent</Button>
        </div>
        <div className="flex flex-wrap gap-2"><Button tone="accent" shape="pill" size="sm">Pill</Button><Button tone="accent" size="xs">Small</Button><Button tone="accent" disabled>Disabled</Button></div>
      </Cell>
      <Cell title="Badges">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="accent">Accent</Badge><Badge tone="success">Passing</Badge><Badge tone="warning">Review</Badge><Badge tone="danger">Failed</Badge>
          <Badge tone="info">Beta</Badge><Badge tone="solid">New</Badge><Badge tone="outline">Draft</Badge><Badge tone="agent">Agent</Badge><Badge tone="neutral">Neutral</Badge>
        </div>
      </Cell>
      <Cell title="Switch, checkbox, radio">
        <div className="flex flex-wrap items-center gap-4">
          <Switch defaultChecked aria-label="On" /><Switch aria-label="Off" />
          <Checkbox defaultChecked aria-label="Checked" /><Checkbox defaultChecked="indeterminate" aria-label="Mixed" /><Checkbox aria-label="Empty" />
        </div>
        <RadioGroup aria-label="Density" defaultValue="cozy" className="flex flex-wrap gap-x-4 gap-y-1">
          <RadioGroupItem value="tight">Tight</RadioGroupItem><RadioGroupItem value="cozy">Cozy</RadioGroupItem><RadioGroupItem value="loose">Loose</RadioGroupItem>
        </RadioGroup>
      </Cell>
      <Cell title="Tabs, segmented">
        <Tabs defaultValue="b">
          <TabsList aria-label="Section"><TabsTrigger value="a">Tokens</TabsTrigger><TabsTrigger value="b" count="12">Components</TabsTrigger><TabsTrigger value="c">Assets</TabsTrigger></TabsList>
        </Tabs>
        <SegmentedControl aria-label="Mode" shape="pill" defaultValue="build">
          <SegmentedControlItem value="ask">Ask</SegmentedControlItem><SegmentedControlItem value="plan">Plan</SegmentedControlItem><SegmentedControlItem value="build">Build</SegmentedControlItem>
        </SegmentedControl>
      </Cell>
      <Cell title="Alerts, toasts" className="min-[1100px]:col-span-2">
        <div className="grid items-start gap-2 min-[700px]:grid-cols-2">
          <Alert tone="info">Brand tokens synced from the library.</Alert>
          <Alert tone="warning" action={<Button tone="ghost" size="xs">Fix</Button>}><b>2 pairs fail AA.</b> Check text on surface.</Alert>
          <Alert tone="danger">Publish failed: 3 frames reference a deleted style.</Alert>
          <div className="grid gap-2"><Toast inline title="Published v2.4" description="orbit-pay.caustic.app" actionLabel="Open" /><Toast inline tone="agent" title="Variant ready" description="14 tokens derived" actionLabel="Review" /></div>
        </div>
      </Cell>
      <Cell title="Inputs: default, focus, invalid">
        <Input aria-label="Name" placeholder="Project name" prefix={<Bell />} />
        <Input aria-label="Focused" defaultValue="Checkout redesign" containerClassName="!shadow-[var(--cs-focus-field)]" />
        <Input aria-label="Invalid" defaultValue="orbit pay!" invalid />
      </Cell>
      <Cell title="Selection: list and menu">
        <ListSelection heading="Appearance" mode="single" value={sel} onValueChange={v => setSel(v as string)}>
          <ListSelectionItem itemValue="a" title="Light" /><ListSelectionItem itemValue="b" title="Dark" /><ListSelectionItem itemValue="c" title="Match system" description="Follows your OS" />
        </ListSelection>
        <Menu aria-label="Themes" inline defaultOpen>
          <MenuGroup><MenuHeading>Themes</MenuHeading><MenuItem selected icon={<Check />}>{p.name}</MenuItem><MenuItem>Lagoon dark</MenuItem></MenuGroup>
        </Menu>
      </Cell>
      <Cell title="Charts: series 1-4 plus extra 1-2" className="min-[1100px]:col-span-2"><ChartDemo /></Cell>
      <Cell title="Agent gradient">
        <div className="flex items-center gap-3">
          <span aria-hidden className="orb orb-dot" style={{ ['--orb' as string]: '14px' } as CSSProperties} />
          <span aria-hidden className="spectrum-fill size-12 rounded-full" />
          <div className="grid min-w-0 flex-1 gap-2"><Progress aria-label="Agent progress" tone="agent" value={72} /><div className="spectrum-line h-2 rounded-full" /></div>
        </div>
        <div className="flex flex-wrap gap-3">
          {p.spectrum.map((s, i) => <span key={i} className="inline-flex items-center gap-1.5 text-footnote text-text-secondary"><i className="size-3 rounded-full" style={{ background: `var(--cs-color-agent-stop-${i + 1})` }} />{s.name}</span>)}
        </div>
      </Cell>
    </div>
  );
}

const notes: Record<string, string> = {
  current: 'Reference. The accent is a hued ramp step and every hue shares one chroma ceiling (~0.14), so the whole UI reads blue-tinted and uniform. Its dark neutrals are the light ramp read backwards.',
  signal: 'Status colours are the same in every Signal Grey variant; what changes is the agent gradient and the two extra colours.',
  deep: 'Accent at L 0.11 against 0.16 in the original, strong text 0.12 and secondary 0.29; dark canvas drops to 0.09. Hover stays at L 0.23, which still holds white labels above 14:1.',
  tape: 'The only variant with a drop of hue in its neutrals (C 0.003 at h 90), to show the ceiling. Everything else in the set keeps neutrals at C 0.',
  pad: 'Greens only on the agent and the extras; success keeps the same pad green, so a running agent and a passing check share a family on purpose.',
  panel: 'The quietest set: cool hues on the agent, warm signal orange left for danger only.',
  coral: 'Danger moves from signal orange to brick (h 30, L 0.50) so it stays distinct from the coral agent gradient.',
  dual: 'Mist between the two signals keeps the agent gradient from turning brown where orange and blue meet.',
};

function PaletteSection({ p, theme, base, active, onApply }: { p: Palette; theme: Theme; base: Record<string, string>; active: boolean; onApply: () => void }) {
  const vars = useMemo(() => scopeVars(p.current ? base : paletteVars(p, theme)), [p, theme, base]);
  const r = resolve(p, theme);
  const roleSw: [string, 'accent' | 'success' | 'warning' | 'danger' | 'info', Swatch][] = [['Accent', 'accent', p.accent], ['Success', 'success', p.success], ['Warning', 'warning', p.warning], ['Danger', 'danger', p.danger], ['Info', 'info', p.info]];
  const rows = report(p, theme);
  const textFails = [...rows, ...(p.current ? [] : neutralReport(p, theme))].filter(x => x.need === 4.5 && !x.pass).length;
  return (
    <section id={`p-${p.id}`} aria-labelledby={`h-${p.id}`} className="grid min-w-0 scroll-mt-32 gap-4 border-t border-border-default pt-8">
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
        <div className="grid min-w-0 flex-1 basis-[28rem] gap-1.5">
          <h2 id={`h-${p.id}`} className="m-0 font-ui text-title-1 text-text-primary">{p.name}</h2>
          <p className="m-0 max-w-[70ch] text-body text-text-secondary">{p.concept}</p>
          <p className="m-0 max-w-[70ch] text-ui text-text-tertiary">{notes[p.id]}</p>
        </div>
        <div className="grid justify-items-start gap-2 min-[900px]:justify-items-end">
          <Button tone={active ? 'secondary' : 'ink'} size="sm" onClick={onApply} disabled={active}>{active ? 'Applied' : 'Apply to docs and samples'}</Button>
          <span className={`${mono} tabular-nums text-text-tertiary`}>
            peak C {peakChroma(p).toFixed(2)} · <span className={textFails ? 'text-danger-text' : ''}>{textFails ? `${textFails} text pairs fail AA` : 'all text pairs AA'}</span>
          </span>
        </div>
      </div>

      <div style={vars as CSSProperties} className="grid min-w-0 gap-7 rounded-2xl bg-bg-app p-3 shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] text-text-primary max-[520px]:p-2.5 min-[900px]:p-5">
        <PalettePoster id={p.id} name={p.name} />

        <div className="grid gap-6">
          <SwatchGroup title={`Accent and status (${theme})`} caption={p.current ? `Accent is the hued ${p.accent.name} step. Status colours carry meaning only: success, warning, danger, info.` : 'Accent is ink. Status colours carry meaning only: success, warning, danger, info.'}>
            {roleSw.map(([n, role, sw]) => <SwatchCard key={role} name={sw.name} role={n} c={r.role[role].solid} p={p} />)}
          </SwatchGroup>
          <div className="grid gap-6 min-[900px]:grid-cols-[3fr_2fr] min-[900px]:gap-4">
            <SwatchGroup title="Agent gradient 1-3" caption="Ask agent button border, agent progress, glow and avatar ring.">
              {p.spectrum.map((sw, i) => <SwatchCard key={`s${i}`} name={sw.name} role={`Agent gradient ${i + 1}`} c={sw[theme]} p={p} />)}
            </SwatchGroup>
            <SwatchGroup title="Extra chart / illustration 1-2" caption="Chart series 5 and 6, illustrations and empty states.">
              {p.extras.map((sw, i) => <SwatchCard key={`e${i}`} name={sw.name} role={`Extra ${i + 1}`} c={sw[theme]} p={p} />)}
            </SwatchGroup>
          </div>
        </div>

        {!p.current && <NeutralRamps p={p} />}

        <div className="grid gap-3">
          <h3 className="m-0 text-title-4 text-text-primary">Contrast <span className="font-normal text-text-tertiary">computed from the sRGB-mapped values</span></h3>
          <div className="grid items-start gap-6 min-[1200px]:grid-cols-2 min-[1200px]:gap-4">
            <ContrastMatrix p={p} theme={theme} />
            {!p.current && <NeutralMatrix p={p} theme={theme} />}
          </div>
        </div>

        <div className="grid gap-3">
          <h3 className="m-0 text-title-4 text-text-primary">In components</h3>
          <InComponents p={p} />
        </div>
      </div>
    </section>
  );
}

export default function PalettesPage() {
  const { theme } = useSettings();
  const { palette, setPalette } = usePalette();
  const [base, setBase] = useState<Record<string, string>>({});
  useLayoutEffect(() => { setBase(readBaseline(BASELINE_KEYS)); }, [theme]);
  // ?section=<id> deep-links a palette block (used for review screenshots).
  useLayoutEffect(() => {
    const id = new URLSearchParams(window.location.search).get('section');
    if (id) requestAnimationFrame(() => document.getElementById(`p-${id}`)?.scrollIntoView({ block: 'start' }));
  }, []);

  return (
    <article className="mx-auto grid w-full min-w-0 max-w-[76rem] grid-cols-[minmax(0,1fr)] content-start gap-12 px-4 py-8 min-[900px]:px-8">
      <header className="grid gap-3">
        <h1 className="m-0 font-ui text-display text-text-primary text-balance max-[899px]:text-title-1">Signal Grey and its variants</h1>
        <p className="m-0 max-w-[72ch] text-body text-text-secondary">
          Every variant keeps the Signal Grey base: <b>ink is the accent</b> (black to grey in light, near-white in dark) and <b>neutrals stay neutral</b>, at chroma 0 or at most one drop (C ≤ 0.004).
          Status colours are shared. The variants differ where hue is allowed to lead: the <b>agent gradient</b> and the <b>two extra chart and illustration colours</b>, all dusty, with chroma at or under 0.13.
        </p>
        <p className="m-0 max-w-[72ch] text-ui text-text-tertiary">
          Each block renders with its own palette scoped to a wrapper. The switcher above recolours this docs app and the
          <a className="text-accent-text" href="#/samples/editor"> sample pages</a> through semantic variables only. Contrast is computed in the page from the sRGB-mapped values. Colour direction, round 3.
        </p>
      </header>

      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] min-[1100px]:gap-10">
        <div className="overflow-x-auto">
          <table className={`${table} min-w-[38rem]`}>
            <caption className="sr-only">The eight palettes at a glance</caption>
            <thead><tr><th className={th}>Palette</th><th className={th}>Accent</th><th className={th}>Status</th><th className={th}>Agent gradient · extras</th><th className={thNum}>Neutral C</th><th className={thNum}>Min text contrast</th></tr></thead>
            <tbody>
              {palettes.map(p => {
                const all = [...report(p, theme), ...(p.current ? [] : neutralReport(p, theme))];
                const fails = all.filter(x => x.need === 4.5 && !x.pass).length;
                const minText = Math.min(...all.filter(x => x.need === 4.5).map(x => x.ratio));
                const dot = 'size-3.5 rounded-full shadow-[inset_0_0_0_1px_oklch(0_0_0/0.12)]';
                return (
                  <tr key={p.id} className={row}>
                    <td className="px-2 py-2">
                      <a href="#/palettes" onClick={e => { e.preventDefault(); document.getElementById(`p-${p.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="text-ui-strong text-text-primary underline decoration-border-strong underline-offset-[3px] hover:decoration-text-primary">{p.name}</a>
                      {palette.id === p.id ? <span className="ml-2 text-label text-text-tertiary">applied</span> : null}
                    </td>
                    <td className="px-2 py-2 text-text-secondary"><i className="mr-1.5 inline-block size-3 rounded-full align-[-1px]" style={{ background: css(p.accent[theme]) }} />{p.accent.name}</td>
                    <td className="px-2 py-2"><span className="inline-flex gap-1">{[p.success, p.warning, p.danger, p.info].map((s, i) => <i key={i} className={dot} style={{ background: css(s[theme]) }} title={s.name} />)}</span></td>
                    <td className="px-2 py-2"><span className="inline-flex gap-1">{[...p.spectrum, ...p.extras].map((s, i) => <i key={i} className={`${dot} ${i === p.spectrum.length ? 'ml-1.5' : ''}`} style={{ background: css(s[theme]) }} title={s.name} />)}</span></td>
                    <td className={`px-2 py-2 text-right ${mono} tabular-nums text-text-secondary`}>{p.current ? 'shipped' : Math.max(...neutralsFor(p, theme).map(c => c[1])).toFixed(3)}</td>
                    <td className="px-2 py-2 text-right"><Ratio value={minText} pass={fails === 0} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="grid content-start gap-2">
          <h2 className="m-0 text-title-4 text-text-primary">Neutral roles <span className="font-normal text-text-tertiary">same steps in every Signal Grey variant</span></h2>
          <NeutralRoles />
        </div>
      </div>

      {palettes.map(p => <PaletteSection key={p.id} p={p} theme={theme} base={base} active={palette.id === p.id} onApply={() => setPalette(p.id)} />)}

      <section className="grid gap-2">
        <h2 className="m-0 font-ui text-title-2 text-text-primary">Adopting one</h2>
        <p className="m-0 max-w-[72ch] text-ui text-text-secondary">
          Everything above is expressed as overrides of the semantic variables (<code className={mono}>--cs-color-accent-*</code>, <code className={mono}>--cs-color-success|warning|danger|info-*</code>,
          <code className={mono}> --cs-color-chart-1..6</code>, <code className={mono}>--cs-color-agent-stop-1..3</code>, and every neutral text, border, fill, surface and bg variable). In tokens this becomes two primitive ramps, <code className={mono}>--cs-neutral-light-1..11</code> and <code className={mono}>--cs-neutral-dark-1..11</code>, with the semantic layer reading a step from each.
          The generator is <code className={mono}>apps/docs/src/showcase/palettes.ts</code>; the contrast maths lives in <code className={mono}>color.ts</code>.
        </p>
      </section>
    </article>
  );
}
