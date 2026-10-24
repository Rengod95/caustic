import { useLayoutEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Bell, Check, Sparkles, X } from 'lucide-react';
import {
  Alert, Badge, Button, Checkbox, Input, ListSelection, ListSelectionItem, Menu, MenuGroup, MenuHeading, MenuItem,
  Progress, RadioGroup, RadioGroupItem, SegmentedControl, SegmentedControlItem, Switch, Tabs, TabsList, TabsTrigger, Toast,
} from '@caustic/react';
import { useSettings } from '../settings.tsx';
import { contrast, gamutMap, hex, isInGamut, label, css, type LCH } from './color.ts';
import { bestOn, palettes, paletteVars, report, resolve, scopeVars, type Palette, type Swatch, type Theme } from './palettes.ts';
import { readBaseline, usePalette } from './palette-state.tsx';

const mono = 'font-mono text-mono-sm';
const BASELINE_KEYS = Object.keys(paletteVars(palettes[1]!, 'light'));

const peakChroma = (p: Palette) => Math.max(...[p.accent, p.success, p.warning, p.danger, p.info].map(s => s.light[1]));

function PalettePoster({ id }: { id: string }) {
  const A = 'var(--cs-color-accent-solid)', X1 = 'var(--sc-extra-1, var(--cs-color-chart-2))', X2 = 'var(--sc-extra-2, var(--cs-color-chart-3))';
  const W = 'var(--cs-color-warning-solid)', S = 'var(--cs-color-success-solid)', D = 'var(--cs-color-danger-solid)', I = 'var(--cs-color-info-solid)';
  const ink = 'var(--cs-color-text-primary)', bg = 'var(--cs-color-bg-canvas)';
  const common = { viewBox: '0 0 720 150', preserveAspectRatio: 'xMidYMid meet', className: 'block h-[150px] w-full bg-bg-canvas', role: 'img', 'aria-label': 'Palette poster' } as const;
  if (id === 'arcade') {
    const ghost = ['0011100', '0111110', '1101011', '1111111', '1111111', '1010101'];
    return (
      <svg {...common}>
        <rect width="720" height="150" fill={bg} />
        {Array.from({ length: 15 }, (_, i) => <rect key={i} x="0" y={i * 10} width="720" height="1" fill={A} opacity=".12" />)}
        {ghost.flatMap((row, y) => [...row].map((c, x) => c === '1' ? <rect key={`${x}-${y}`} x={70 + x * 16} y={24 + y * 16} width="15" height="15" fill={y === 2 && (x === 2 || x === 4) ? 'var(--cs-color-bg-app)' : A} /> : null))}
        <path d="M330 75 L420 28 A62 62 0 1 0 420 122 Z" fill={W} transform="translate(-20 0)" />
        {[0, 1, 2, 3, 4, 5].map(i => <circle key={i} cx={430 + i * 34} cy="75" r="7" fill={S} />)}
        <rect x="640" y="40" width="40" height="40" fill={X1} /><rect x="664" y="64" width="40" height="40" fill={X2} />
        <text x="352" y="143" fontFamily="var(--cs-font-mono)" fontSize="11" fill={ink} opacity=".7">1UP  HI-SCORE 128400</text>
      </svg>
    );
  }
  if (id === 'riso') {
    return (
      <svg {...common}>
        <defs><pattern id="rdots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(22)"><circle cx="4.5" cy="4.5" r="2.1" fill={I} /></pattern></defs>
        <rect width="720" height="150" fill={bg} />
        <rect x="360" y="0" width="360" height="150" fill="url(#rdots)" opacity=".55" />
        <g style={{ mixBlendMode: 'multiply' }}>
          <circle cx="180" cy="75" r="62" fill={A} /><circle cx="236" cy="82" r="62" fill={I} opacity=".85" /><circle cx="214" cy="46" r="40" fill={W} />
        </g>
        <g style={{ mixBlendMode: 'multiply' }}><rect x="440" y="30" width="150" height="90" rx="6" fill={X1} /><rect x="452" y="42" width="150" height="90" rx="6" fill={A} opacity=".8" /></g>
        <text x="690" y="136" fontFamily="var(--cs-font-ui)" fontWeight="800" fontSize="34" fill={ink} opacity=".9" textAnchor="end" letterSpacing="-2">RISO</text>
      </svg>
    );
  }
  if (id === 'candy') {
    return (
      <svg {...common}>
        <defs>
          {[['g1', A], ['g2', X1], ['g3', S], ['g4', X2]].map(([n, c]) => (
            <radialGradient key={n} id={n} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="white" stopOpacity=".95" /><stop offset=".28" stopColor={c} /><stop offset="1" stopColor={c} /></radialGradient>
          ))}
        </defs>
        <rect width="720" height="150" fill={bg} />
        <rect x="60" y="40" width="250" height="74" rx="37" fill="url(#g1)" /><ellipse cx="150" cy="56" rx="70" ry="9" fill="white" opacity=".6" />
        <circle cx="380" cy="76" r="52" fill="url(#g2)" /><circle cx="470" cy="50" r="30" fill="url(#g3)" /><circle cx="520" cy="108" r="36" fill="url(#g4)" />
        <circle cx="610" cy="70" r="46" fill="none" stroke={I} strokeWidth="14" /><circle cx="610" cy="70" r="46" fill="none" stroke="white" strokeOpacity=".55" strokeWidth="3" strokeDasharray="40 250" />
      </svg>
    );
  }
  if (id === 'memphis') {
    return (
      <svg {...common}>
        <defs><pattern id="mdots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2.4" fill={ink} /></pattern></defs>
        <rect width="720" height="150" fill={bg} />
        <rect x="40" y="26" width="120" height="98" fill="url(#mdots)" opacity=".7" />
        <path d="M200 100 q20-60 40 0 t40 0 t40 0 t40 0" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />
        <path d="M400 118 L450 30 L500 118 Z" fill={A} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        <circle cx="560" cy="60" r="34" fill={S} stroke={ink} strokeWidth="4" /><path d="M526 60 a34 34 0 0 1 68 0 Z" fill={W} stroke={ink} strokeWidth="4" />
        <rect x="610" y="82" width="70" height="44" fill={X1} stroke={ink} strokeWidth="4" transform="rotate(-8 645 104)" />
        <path d="M300 40 l12-14 12 14 12-14 12 14 12-14 12 14" fill="none" stroke={D} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === 'acid') {
    return (
      <svg {...common}>
        <defs><pattern id="hz" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="11" height="22" fill={ink} /><rect x="11" width="11" height="22" fill={X1} /></pattern></defs>
        <rect width="720" height="150" fill={bg} />
        <rect x="24" y="24" width="300" height="102" fill={X1} stroke={ink} strokeWidth="3" />
        <text x="36" y="104" fontFamily="var(--cs-font-ui)" fontWeight="900" fontSize="74" letterSpacing="-4" fill="oklch(0.15 0.01 130)">ACID</text>
        <rect x="344" y="24" width="140" height="102" fill="url(#hz)" stroke={ink} strokeWidth="3" />
        <rect x="504" y="24" width="90" height="48" fill={A} stroke={ink} strokeWidth="3" /><rect x="504" y="78" width="90" height="48" fill={I} stroke={ink} strokeWidth="3" />
        <rect x="614" y="24" width="82" height="102" fill={D} stroke={ink} strokeWidth="3" />
        <text x="655" y="82" fontFamily="var(--cs-font-mono)" fontWeight="700" fontSize="26" textAnchor="middle" fill="var(--cs-color-danger-on)">NO.7</text>
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect width="720" height="150" fill={bg} />
      <circle cx="140" cy="75" r="48" fill="var(--cs-spectrum-1)" /><circle cx="230" cy="75" r="48" fill="var(--cs-spectrum-2)" /><circle cx="320" cy="75" r="48" fill="var(--cs-spectrum-3)" />
      <rect x="420" y="40" width="240" height="14" rx="7" fill={A} /><rect x="420" y="66" width="190" height="14" rx="7" fill={S} /><rect x="420" y="92" width="140" height="14" rx="7" fill={W} />
    </svg>
  );
}

function SwatchCard({ name, role, c, p }: { name: string; role: string; c: LCH; p: Palette }) {
  const mapped = gamutMap(c);
  const on = bestOn(c, p);
  const clipped = !isInGamut(c);
  return (
    <div className="min-w-0 overflow-hidden rounded-lg bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]">
      <div className="flex h-[72px] flex-col justify-between p-2" style={{ background: css(c), color: css(on) }}>
        <span className="text-ui-strong">{name}</span>
        <span className={mono}>Aa · {contrast(on, c).toFixed(1)}:1</span>
      </div>
      <div className="grid gap-0.5 p-2">
        <span className="text-caption uppercase text-text-tertiary">{role}</span>
        <span className={`${mono} text-text-primary`}>oklch({label(c)})</span>
        <span className={`${mono} text-text-tertiary`}>{hex(c)}{clipped ? ` · sRGB C ${mapped[1].toFixed(2)}` : ''}</span>
      </div>
    </div>
  );
}

function Tick({ ok }: { ok: boolean }) {
  return ok ? <Check aria-label="passes" className="size-3.5 text-success-text" /> : <X aria-label="fails" className="size-3.5 text-danger-text" />;
}

function ContrastMatrix({ p, theme }: { p: Palette; theme: Theme }) {
  const rows = useMemo(() => report(p, theme), [p, theme]);
  const roles = ['Accent', 'Success', 'Warning', 'Danger', 'Info'];
  const metrics = [
    { k: 'label on solid fill', title: 'Label on solid', need: '4.5' },
    { k: 'text on surface', title: 'Text on surface', need: '4.5' },
    { k: 'text on its soft badge', title: 'Text on soft badge', need: '4.5' },
    { k: 'solid vs surface (graphic)', title: 'Solid vs surface (UI)', need: '3' },
  ];
  return (
    <div className="overflow-x-auto rounded-lg bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]">
      <table className="w-full min-w-[34rem] border-collapse text-ui">
        <thead>
          <tr className="text-left text-caption uppercase text-text-tertiary">
            <th className="p-2 font-medium">Pair (need)</th>
            {roles.map(r => <th key={r} className="p-2 font-medium">{r}</th>)}
          </tr>
        </thead>
        <tbody>
          {metrics.map(m => (
            <tr key={m.k} className="border-t border-border-subtle">
              <td className="p-2 text-text-secondary">{m.title} <span className="text-text-tertiary">≥ {m.need}</span></td>
              {roles.map(r => {
                const row = rows.find(x => x.label === `${r}: ${m.k}`)!;
                const fillOnly = !row.pass && Boolean(row.note);
                return (
                  <td key={r} className="p-2">
                    <span className="inline-flex items-center gap-1.5">
                      {fillOnly ? <span aria-label="fill plus ink" className="inline-block size-3.5 rounded-full bg-fill-pressed text-center text-[9px] leading-[14px] text-text-secondary">i</span> : <Tick ok={row.pass} />}
                      <span className={`${mono} ${row.pass || fillOnly ? 'text-text-primary' : 'text-danger-text'}`}>{row.ratio.toFixed(1)}</span>
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="m-0 border-t border-border-subtle p-2 text-footnote text-text-tertiary">
        (i) = vivid fill that cannot hold a 3:1 edge on its own. It is always paired with ink text (row 1) and a text or border cue, and never used as a thin line or small glyph.
      </p>
    </div>
  );
}

function Cell({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`grid min-w-0 content-start gap-2.5 rounded-xl bg-surface-base p-3.5 shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] ${className}`}>
      <span className="text-caption uppercase text-text-tertiary">{title}</span>
      {children}
    </div>
  );
}

function ChartDemo() {
  const cols = [[40, 28, 18, 10], [52, 30, 22, 12], [46, 36, 20, 16], [64, 34, 26, 14], [58, 42, 30, 20], [74, 40, 28, 22]];
  const fills = ['var(--cs-color-chart-1)', 'var(--cs-color-chart-2)', 'var(--cs-color-chart-3)', 'var(--cs-color-chart-4)'];
  const X1 = 'var(--sc-extra-1, var(--cs-color-chart-2))', X2 = 'var(--sc-extra-2, var(--cs-color-chart-3))';
  const total = (c: number[]) => c.reduce((a, b) => a + b, 0);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_96px] items-end gap-3">
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
      <Cell title="Charts: series 1-4 plus expressive extras" className="min-[1100px]:col-span-2"><ChartDemo /></Cell>
      <Cell title="Agent spectrum">
        <div className="flex items-center gap-3">
          <span aria-hidden className="orb orb-dot" style={{ ['--orb' as string]: '14px' } as CSSProperties} />
          <span aria-hidden className="spectrum-fill size-12 rounded-full" />
          <div className="grid min-w-0 flex-1 gap-2"><Progress aria-label="Agent progress" tone="agent" value={72} /><div className="spectrum-line h-2 rounded-full" /></div>
        </div>
        <div className="flex flex-wrap gap-3">
          {p.spectrum.map((s, i) => <span key={i} className="inline-flex items-center gap-1.5 text-footnote text-text-secondary"><i className="size-3 rounded-full" style={{ background: `var(--cs-spectrum-${i + 1})` }} />{s.name}</span>)}
        </div>
      </Cell>
    </div>
  );
}

const notes: Record<string, string> = {
  current: 'Reference. Every hue shares one chroma ceiling (~0.14) and one lightness ladder, which reads as uniform and slightly dusty on white.',
  arcade: 'Lime, yellow and cyan are fills that carry black ink. Only violet and red hold white labels. Dark mode becomes an indigo cabinet with the same neon.',
  riso: 'Cream paper and flat spot colours. Pink leads, blue and sunflower overprint (multiply) in artwork. Text colours stay deep so print charm never costs legibility.',
  candy: 'Glossy azure with bubblegum and slime. Pastel lilac glaze on the canvas; sticker-like fills with ink labels on the light hues.',
  memphis: 'Tangerine is the signature (white labels hold 5.5:1). Teal, flamingo and grape fill the confetti. Thick ink outlines in artwork are the style; the tokens stay accessible.',
  acid: 'Light mode: toxic green on stark white. Dark mode: the accent flips to acid lime on black with black ink. Hard 1px edges suit it best.',
};

function PaletteSection({ p, theme, base, active, onApply }: { p: Palette; theme: Theme; base: Record<string, string>; active: boolean; onApply: () => void }) {
  const vars = useMemo(() => scopeVars(p.current ? base : paletteVars(p, theme)), [p, theme, base]);
  const r = resolve(p, theme);
  const roleSw: [string, 'accent' | 'success' | 'warning' | 'danger' | 'info', Swatch][] = [['Accent', 'accent', p.accent], ['Success', 'success', p.success], ['Warning', 'warning', p.warning], ['Danger', 'danger', p.danger], ['Info', 'info', p.info]];
  const rows = report(p, theme);
  const textFails = rows.filter(x => x.need === 4.5 && !x.pass).length;
  return (
    <section id={`p-${p.id}`} className="scroll-mt-28 grid min-w-0 gap-3">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
        <div className="grid min-w-0 flex-1 gap-1">
          <h2 className="m-0 font-ui text-title-1 text-text-primary">{p.name}</h2>
          <p className="m-0 max-w-[70ch] text-body text-text-secondary">{p.concept}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">peak chroma {peakChroma(p).toFixed(2)}</Badge>
          <Badge tone={textFails ? 'danger' : 'success'}>{textFails ? `${textFails} text fails` : 'all text pairs AA'}</Badge>
          <Button tone={active ? 'secondary' : 'ink'} size="sm" onClick={onApply} disabled={active}>{active ? 'Applied to docs and samples' : 'Apply to docs and samples'}</Button>
        </div>
      </div>

      <div style={vars as CSSProperties} className="grid min-w-0 gap-4 rounded-2xl bg-bg-app p-3 text-text-primary max-[520px]:p-2 min-[900px]:p-4">
        <div className="overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]"><PalettePoster id={p.id} /></div>

        <div className="grid gap-2">
          <span className="text-caption uppercase text-text-tertiary">Palette ({theme})</span>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,10.5rem),1fr))] gap-2">
            {roleSw.map(([n, role, sw]) => <SwatchCard key={role} name={sw.name} role={n} c={r.role[role].solid} p={p} />)}
            {p.spectrum.map((sw, i) => <SwatchCard key={`s${i}`} name={sw.name} role={`Spectrum ${i + 1}`} c={sw[theme]} p={p} />)}
            {p.extras.map((sw, i) => <SwatchCard key={`e${i}`} name={sw.name} role={`Expressive ${i + 1}`} c={sw[theme]} p={p} />)}
          </div>
        </div>

        <div className="grid gap-2">
          <span className="text-caption uppercase text-text-tertiary">Contrast, computed from the sRGB-mapped values</span>
          <ContrastMatrix p={p} theme={theme} />
        </div>

        <InComponents p={p} />
      </div>
      <p className="m-0 text-footnote text-text-tertiary">{notes[p.id]}</p>
    </section>
  );
}

export default function PalettesPage() {
  const { theme } = useSettings();
  const { palette, setPalette } = usePalette();
  const [base, setBase] = useState<Record<string, string>>({});
  useLayoutEffect(() => { setBase(readBaseline(BASELINE_KEYS)); }, [theme]);

  return (
    <article className="mx-auto grid w-full min-w-0 max-w-[76rem] grid-cols-[minmax(0,1fr)] content-start gap-10 px-4 py-8 min-[900px]:px-8">
      <header className="grid gap-3">
        <span className="text-caption uppercase text-text-tertiary">Colour direction, proposal</span>
        <h1 className="m-0 font-ui text-display text-text-primary text-balance max-[899px]:text-title-1">Louder palettes for Caustic</h1>
        <p className="m-0 max-w-[72ch] text-body text-text-secondary">
          The shipped hued ramps stop at OKLCH chroma ~0.14, so every non-neutral reads dusty on white. These five directions push chroma to 0.20-0.27 where the sRGB gamut allows,
          and keep usability by one rule: <b>a vivid colour is either a fill that carries ink text, or it is darkened (same hue and chroma, lower lightness) until it holds 4.5:1 as text.</b> Every
          ratio below is computed in the page from the actual values.
        </p>
        <p className="m-0 max-w-[72ch] text-ui text-text-tertiary">
          Each block is rendered with its own palette scoped to a wrapper, independent of the switcher. The switcher above recolours this docs app and the
          <a className="text-text-link" href="#/samples/editor"> sample pages</a> through semantic variables only (accent, status, chart, spectrum and a few canvas tokens, plus an optional paper tint).
          Values beyond sRGB are chroma-reduced the way a browser does it, and the sRGB chroma is printed when that happens.
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]">
        <table className="w-full min-w-[40rem] border-collapse text-ui">
          <thead><tr className="text-left text-caption uppercase text-text-tertiary"><th className="p-2.5 font-medium">Palette</th><th className="p-2.5 font-medium">Accent</th><th className="p-2.5 font-medium">Status colours</th><th className="p-2.5 font-medium">Peak C</th><th className="p-2.5 font-medium">Text AA</th><th className="p-2.5 font-medium" /></tr></thead>
          <tbody>
            {palettes.map(p => {
              const rows = report(p, theme);
              const fails = rows.filter(x => x.need === 4.5 && !x.pass).length;
              const minText = Math.min(...rows.filter(x => x.need === 4.5).map(x => x.ratio));
              return (
                <tr key={p.id} className="border-t border-border-subtle">
                  <td className="p-2.5"><a href="#/palettes" onClick={e => { e.preventDefault(); document.getElementById(`p-${p.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="text-ui-strong text-text-primary no-underline hover:underline">{p.name}</a></td>
                  <td className="p-2.5"><i className="mr-1.5 inline-block size-3 rounded-full align-[-1px]" style={{ background: css(p.accent[theme]) }} />{p.accent.name}</td>
                  <td className="p-2.5"><span className="inline-flex gap-1">{[p.success, p.warning, p.danger, p.info].map((s, i) => <i key={i} className="size-4 rounded-full shadow-[inset_0_0_0_1px_oklch(0_0_0/0.12)]" style={{ background: css(s[theme]) }} title={s.name} />)}</span></td>
                  <td className={`p-2.5 ${mono}`}>{peakChroma(p).toFixed(2)}</td>
                  <td className="p-2.5"><span className="inline-flex items-center gap-1.5"><Tick ok={fails === 0} /><span className={mono}>min {minText.toFixed(1)}:1</span></span></td>
                  <td className="p-2.5 text-right"><Button size="xs" tone={palette.id === p.id ? 'secondary' : 'ink'} disabled={palette.id === p.id} onClick={() => setPalette(p.id)}>{palette.id === p.id ? 'Applied' : 'Apply'}</Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {palettes.map(p => <PaletteSection key={p.id} p={p} theme={theme} base={base} active={palette.id === p.id} onApply={() => setPalette(p.id)} />)}

      <section className="grid gap-2">
        <h2 className="m-0 font-ui text-title-2 text-text-primary">Adopting one</h2>
        <p className="m-0 max-w-[72ch] text-ui text-text-secondary">
          Everything above is expressed as overrides of the semantic variables (<code className={mono}>--cs-color-accent-*</code>, <code className={mono}>--cs-color-success|warning|danger|info-*</code>,
          <code className={mono}> --cs-color-chart-1..4</code>, <code className={mono}>--cs-spectrum-1..3</code>), so the ramp renaming underneath does not matter: only the semantic layer needs new source values per theme.
          The generator is <code className={mono}>apps/docs/src/showcase/palettes.ts</code>; the contrast maths lives in <code className={mono}>color.ts</code>.
        </p>
      </section>
    </article>
  );
}
