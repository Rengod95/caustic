import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import tokens from '@caustic/tokens/tokens';
import contrast from '@caustic/tokens/contrast';
import { Badge, Button, Input, SegmentedControl, SegmentedControlItem, Table, type TableColumn, type TableRow } from '@caustic/react';
import { foundationPages } from '../data.ts';
import { useSettings } from '../settings.tsx';
import { Bullets, Chip, Mono, Page, PageHeader, Section } from '../ui.tsx';

const T = tokens;
const grid = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*50)),1fr))] gap-3';
const card = 'rounded-2xl bg-surface-base p-3.5 shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-1)]';

/** A color from resolved token data, drawn over a checker so alpha stays visible. */
const rgba = (c: { hex: string; alpha: number }) => `color-mix(in srgb, ${c.hex} ${Math.round(c.alpha * 100)}%, transparent)`;
function Swatch({ color, className = 'h-8 w-full' }: { color: string; className?: string }) {
  return (
    <span aria-hidden className={`checker block overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)] ${className}`}>
      <span className="block size-full" style={{ background: color }} />
    </span>
  );
}

// ───────────────────────── Color ramps

function ColorPage() {
  const steps = T.hueSteps;
  const ramp = (key: string, name: string, role: string, live: boolean, stepList: (string | number)[]) => (
    <div key={key} className="grid gap-2">
      <div className="flex flex-wrap items-baseline gap-2"><h3 className="m-0 font-ui text-title-3">{name}</h3><span className="font-ui text-ui text-text-tertiary">{role}</span>{live ? <Badge tone="accent">follows the hue slider</Badge> : null}</div>
      <div className="grid grid-cols-6 gap-1.5 min-[900px]:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {stepList.map(s => (
          <div key={s} className="grid min-w-0 gap-1">
            <span aria-hidden className="block h-12 rounded-lg shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]" style={{ background: `var(--cs-${key}-${s})` }} />
            <span className="font-mono text-mono-sm text-text-primary">{s}</span>
            <span className="truncate font-mono text-mono-sm text-text-tertiary">{T.primitiveHex[key]?.[String(s)]}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <>
      <Section id="ramps" title="Ramps" description="Five chromatic ramps share one lightness and chroma curve, so changing the accent hue keeps contrast. Hex values are the defaults (accent at hue 205).">
        <div className="grid gap-6">
          {Object.entries(T.hues).map(([key, h]) => ramp(key, h.name, `${h.role} · hue ${h.hue}`, Boolean(h.live), steps))}
          {ramp('neutral', T.neutral.name, `Surfaces, text and borders · hue ${T.neutral.hue}`, false, Object.keys(T.primitiveHex.neutral ?? {}))}
        </div>
      </Section>
      <Section id="spectrum" title="Agent spectrum" description="Three stops that only mark agent presence, work or provenance (P2). Never decoration.">
        <div className="grid gap-2">
          <div aria-hidden className="h-10 rounded-xl" style={{ background: 'var(--cs-spectrum-linear)' }} />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(i => <div key={i} className="grid gap-1"><Swatch color={`var(--cs-spectrum-${i})`} className="h-8 w-full" /><span className="font-mono text-mono-sm text-text-tertiary">--cs-spectrum-{i}</span></div>)}
          </div>
        </div>
      </Section>
      <Section title="Usage">
        <Bullets items={[
          <>Components read semantic tokens (<Mono>bg-surface-base</Mono>), never ramp steps.</>,
          <>The accent hue is one custom property on the root: <Mono>--cs-accent-hue</Mono>. Setting it on a descendant does not reach the semantic tokens.</>,
          'Mint, Amber, Coral and Iris mean status. Do not use them as decoration.',
        ]} />
      </Section>
    </>
  );
}

// ───────────────────────── Semantic colors

function SemanticPage() {
  const light = T.themes.light;
  const names = Object.keys(light);
  const groups = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const n of names) (out[n.split('.')[0]!] ??= []).push(n);
    return Object.entries(out);
  }, [names]);
  const cell = (theme: 'light' | 'dark', name: string) => {
    const c = T.resolved[theme][name];
    const ref = T.themes[theme][name];
    return (
      <div className="grid min-w-0 gap-1">
        <Swatch color={c ? rgba(c) : 'transparent'} />
        <span className="truncate font-mono text-mono-sm text-text-secondary">{ref}</span>
        <span className="truncate font-mono text-mono-sm text-text-tertiary">{c ? `${c.hex}${c.alpha < 1 ? ` · ${c.alpha}` : ''}` : ''}</span>
      </div>
    );
  };
  return (
    <>
      <p className="m-0 max-w-[66ch] font-ui text-body text-text-secondary">{names.length} roles. Each one points at a ramp step per theme; light and dark are shown side by side regardless of the global theme.</p>
      {groups.map(([group, list]) => (
        <Section key={group} id={group} title={group}>
          <div className="grid gap-2">
            {list.map(n => (
              <div key={n} className={`${card} grid items-start gap-3 min-[700px]:grid-cols-[minmax(8rem,12rem)_1fr_1fr]`}>
                <Mono>{n}</Mono>
                <div className="grid grid-cols-2 gap-3 min-[700px]:col-span-2">{cell('light', n)}{cell('dark', n)}</div>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </>
  );
}

// ───────────────────────── Contrast

const contrastColumns: TableColumn[] = [
  { key: 'pair', header: 'Pair' },
  { key: 'sample', header: 'Sample' },
  { key: 'min', header: 'Required', align: 'end' },
  { key: 'ratio', header: 'Ratio', align: 'end' },
  { key: 'result', header: 'Result' },
  { key: 'note', header: 'Rule' },
];
const PAGE = 15;

function ContrastPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [page, setPage] = useState(1);
  const all = contrast.results;
  const failing = all.filter(r => !r.pass).length;
  const rows = useMemo<TableRow[]>(() => all.filter(r => r.theme === theme).map((r, i) => ({ id: `${theme}-${i}`, ...r })), [all, theme]);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE));
  const slice = rows.slice((page - 1) * PAGE, page * PAGE);
  const res = T.resolved[theme];
  const renderCell = (row: TableRow, col: TableColumn): ReactNode => {
    const r = row as unknown as (typeof all)[number];
    switch (col.key) {
      case 'pair': return <span className="font-mono text-mono">{r.fg} <span className="text-text-tertiary">on</span> {r.bg}</span>;
      case 'sample': {
        const fg = res[r.fg]; const bg = res[r.bg];
        return <span className="inline-flex h-6 min-w-10 items-center justify-center rounded-sm px-2 font-ui text-ui-strong shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]" style={{ background: bg ? rgba(bg) : undefined, color: fg ? rgba(fg) : undefined }}>Aa</span>;
      }
      case 'min': return `${r.min}:1`;
      case 'ratio': return `${r.ratio.toFixed(2)}:1`;
      case 'result': return r.pass ? <Badge tone="success" dot>Pass</Badge> : <Badge tone="danger" dot>Fail</Badge>;
      default: return <span className="text-text-secondary">{r.note}{r.sweep ? ` · worst hue ${r.worstHue}°` : ''}</span>;
    }
  };
  return (
    <>
      <Section id="rules" title="Rules" description={`${all.length} checks across both themes; ${failing === 0 ? 'every one passes' : `${failing} fail`}. Pairs marked with a hue are checked across a ${contrast.hueSweep.length}-step sweep of the accent hue and report the worst case.`}>
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl aria-label="Theme" value={theme} onValueChange={v => { setTheme(v as 'light' | 'dark'); setPage(1); }}>
            <SegmentedControlItem value="light">Light</SegmentedControlItem>
            <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
          </SegmentedControl>
          <Badge tone={failing === 0 ? 'success' : 'danger'} dot>{failing === 0 ? 'All pass' : `${failing} failing`}</Badge>
        </div>
        <Table aria-label={`Contrast rules, ${theme}`} columns={contrastColumns} rows={slice} renderCell={renderCell} page={page} pageCount={pageCount} onPageChange={setPage} pagerLabel="Contrast pages" summary={`${rows.length} rules in ${theme}`} />
      </Section>
      <Section title="Thresholds">
        <Bullets items={['Body text 7:1 (AAA). Secondary and meta text 4.5:1 (AA).', 'Control borders, focus rings and selection 3:1.', 'A new color pairing needs a rule in tokens.mjs before it ships (P6).']} />
      </Section>
    </>
  );
}

// ───────────────────────── Typography

const samples = { ui: 'Design with the agent beside you', voice: 'I tried a calmer layout first, then tightened the spacing.', mono: '--cs-accent-hue: 205;' } as const;

function TypographyPage() {
  return (
    <>
      <Section id="families" title="Families" description="UI for people, voice for the agent’s prose, mono for machine values (P4).">
        <div className={grid}>
          {(Object.keys(T.font) as ('ui' | 'voice' | 'mono')[]).map(k => (
            <div key={k} className={`${card} grid gap-1`}>
              <span className="font-ui text-ui-strong">font-{k}</span>
              <span className="text-title-2" style={{ fontFamily: `var(--cs-font-${k})` }}>Aa Gg 한글 123</span>
              <span className="truncate font-mono text-mono-sm text-text-tertiary">{T.font[k].split(',')[0]}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section id="roles" title="Roles" description={`${Object.keys(T.type).length} roles. Use text-<role> as a utility; it sets size, line height, weight and tracking together.`}>
        <div className="grid gap-2">
          {Object.entries(T.type).map(([role, [family, size, lh, weight, tracking, transform]]) => (
            <div key={role} className={`${card} grid items-center gap-2 min-[900px]:grid-cols-[13rem_minmax(0,1fr)]`}>
              <div className="grid gap-0.5">
                <Mono>text-{role}</Mono>
                <span className="font-mono text-mono-sm text-text-tertiary">{family} · {size}/{lh} · {weight} · {tracking}em{transform ? ` · ${transform}` : ''}</span>
              </div>
              <div className="min-w-0 break-words text-text-primary" style={{ font: `var(--cs-text-${role})`, letterSpacing: `var(--cs-text-${role}-tracking)`, textTransform: transform === 'uppercase' ? 'uppercase' : undefined, fontStyle: transform === 'italic' ? 'italic' : undefined }}>
                {samples[family]}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Usage">
        <Bullets items={['Functional text never goes below 11px.', 'font-voice only on agent prose slots; text-voice* and text-thought require it.', 'Korean headings tighten tracking to at most −0.01em.']} />
      </Section>
    </>
  );
}

// ───────────────────────── Space, radius, sizes

function SpacePage() {
  const entries = Object.entries(T.space).sort((a, b) => a[1] - b[1]);
  return (
    <Section id="scale" title="Scale" description="A 4px base. Fractions exist for hairline and optical adjustments; prefer whole steps.">
      <div className="grid gap-1.5">
        {entries.map(([k, px]) => (
          <div key={k} className="grid grid-cols-[6rem_3.5rem_1fr] items-center gap-3 max-[520px]:grid-cols-[4.5rem_3rem_1fr]">
            <Mono>space-{k}</Mono>
            <span className="font-mono text-mono-sm text-text-tertiary">{px}px</span>
            <span aria-hidden className="h-3 max-w-full rounded-xs bg-accent-fill" style={{ width: Math.max(px, 1) }} />
          </div>
        ))}
      </div>
      <div className={grid}>
        {Object.entries(T.inset).map(([k, [x, y]]) => (
          <div key={k} className={card}><Mono>inset-{k}</Mono><p className="m-0 font-ui text-ui text-text-secondary">{x}px horizontal · {y}px vertical</p></div>
        ))}
      </div>
    </Section>
  );
}

function RadiusPage() {
  const scale = Object.entries(T.radius).sort((a, b) => a[1] - b[1]);
  const studio = Object.entries(T.studio).filter(([k]) => k.endsWith('radius'));
  const tile = (name: string, px: number, varName: string) => (
    <div key={name} className="grid justify-items-start gap-1.5">
      <span aria-hidden className="size-18 bg-accent-soft shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-border)]" style={{ borderRadius: `var(${varName})` }} />
      <Mono>{name}</Mono><span className="font-mono text-mono-sm text-text-tertiary">{px === 999 ? 'full' : `${px}px`}</span>
    </div>
  );
  return (
    <>
      <Section id="scale" title="Scale" description="Concentric corners (P5): an inner radius never exceeds its parent radius minus the parent padding.">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-4">{scale.map(([k, px]) => tile(`rounded-${k}`, px, `--cs-radius-${k}`))}</div>
      </Section>
      <Section id="shell" title="Studio shell" description="Named radii for the app shell.">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-4">{studio.map(([k, px]) => tile(k.replace('-radius', ''), px, `--cs-studio-${k}`))}</div>
      </Section>
    </>
  );
}

function SizesPage() {
  const { compact } = useSettings();
  const groups = (['control', 'field'] as const).map(g => ({ g, keys: Object.keys(T.size[g] ?? {}) }));
  const comp = Object.entries(T.size.component ?? {});
  const [q, setQ] = useState('');
  const shown = comp.filter(([k]) => k.includes(q.toLowerCase()));
  return (
    <>
      <Section id="control" title="Control & field heights" description={`Bars use the live tokens, so the density toggle in the top bar changes them. Density is ${compact ? 'compact' : 'regular'}.`}>
        <div className={grid}>
          {groups.map(({ g, keys }) => (
            <div key={g} className={`${card} grid gap-2`}>
              <span className="font-ui text-ui-strong">{g}</span>
              {keys.map(k => (
                <div key={k} className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
                  <span className="font-mono text-mono-sm text-text-secondary">{g}-{k}<br /><span className="text-text-tertiary">{T.size[g]![k]} / {T.size[`${g}-compact`]![k]}</span></span>
                  <span aria-hidden className="block rounded-md bg-fill-pressed shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)]" style={{ height: `var(--cs-${g}-${k})` }} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="m-0 font-ui text-footnote text-text-tertiary">Values shown as regular / compact.</p>
      </Section>
      <Section id="icon" title="Icons">
        <div className="flex flex-wrap items-end gap-5">
          {Object.entries(T.size.icon ?? {}).map(([k, px]) => (
            <div key={k} className="grid justify-items-center gap-1.5"><span aria-hidden className="rounded-xs bg-text-primary" style={{ width: px, height: px }} /><Mono>icon-{k}</Mono><span className="font-mono text-mono-sm text-text-tertiary">{px}px</span></div>
          ))}
        </div>
      </Section>
      <Section id="component" title="Component dimensions" description={`${comp.length} named sizes components read as utilities (h-switch-md-h, w-dialog-md…).`}>
        <div className="max-w-72"><Input aria-label="Filter sizes" placeholder="Filter, e.g. switch" value={q} onValueChange={setQ} /></div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-x-4 gap-y-1">
          {shown.map(([k, px]) => <div key={k} className="flex items-baseline justify-between gap-2 border-b border-border-subtle py-1"><Mono>{k}</Mono><span className="font-mono text-mono-sm text-text-tertiary">{px}px</span></div>)}
        </div>
      </Section>
    </>
  );
}

// ───────────────────────── Elevation & materials

function ElevationPage() {
  const { theme } = useSettings();
  const levels = Object.keys(T.elevation.light);
  return (
    <>
      <Section id="levels" title="Levels" description={`A short contact shadow plus a wide diffuse one. Strings below are the ${theme} values; switch the theme in the top bar to compare.`}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-5 rounded-3xl bg-bg-canvas p-5">
          {levels.map(k => (
            <div key={k} className="grid gap-2">
              <div className="grid h-20 place-items-center rounded-2xl bg-surface-base font-mono text-mono text-text-secondary" style={{ boxShadow: `var(--cs-elevation-${k})` }}>shadow-{k}</div>
              <span className="break-words font-mono text-mono-sm text-text-tertiary">{T.elevation[theme][k]}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function MaterialsPage() {
  const tiles = [
    { name: 'glass-ultrathin', cls: 'glass glass-ultrathin', blur: T.blur.ultrathin },
    { name: 'glass-thin', cls: 'glass glass-thin', blur: T.blur.thin },
    { name: 'glass', cls: 'glass', blur: T.blur.regular },
    { name: 'glass-thick', cls: 'glass glass-thick', blur: T.blur.thick },
  ];
  return (
    <>
      <Section id="glass" title="Glass" description="Glass is for what floats (P1): menus, popovers, toolbars, dialogs. It refracts what is behind it, so it needs something behind it.">
        <div className="canvas-grid relative isolate overflow-hidden rounded-3xl p-5">
          <span aria-hidden className="absolute left-[8%] top-12 size-28 rounded-full bg-accent-solid" />
          <span aria-hidden className="absolute left-[34%] top-20 size-24 rounded-full bg-success-solid" />
          <span aria-hidden className="absolute left-[58%] top-12 size-28 rounded-full bg-warning-solid" />
          <span aria-hidden className="absolute left-[80%] top-20 size-24 rounded-full bg-danger-solid" />
          <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] gap-3 pt-10">
            {tiles.map(t => (
              <div key={t.name} className={`${t.cls} grid h-32 content-end gap-0.5 rounded-2xl p-3`}>
                <span className="font-ui text-ui-strong text-text-primary">{t.name}</span>
                <span className="font-mono text-mono-sm text-text-secondary">blur {t.blur}px</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section id="blur" title="Blur & frost">
        <div className="flex flex-wrap gap-1.5">{Object.entries(T.blur).map(([k, px]) => <Chip key={k}>blur-{k} · {px}px</Chip>)}</div>
        <Bullets items={[
          <>Menus and forms with text over glass use <Mono>glass-thick</Mono> or heavier.</>,
          <><Mono>frost</Mono> is the light control blur and is allowed on any control.</>,
          'With prefers-reduced-transparency the glass becomes a solid surface.',
        ]} />
      </Section>
    </>
  );
}

// ───────────────────────── Motion

const demoDurations = ['quick', 'base', 'gentle', 'slow'] as const;
const demoEasings = ['standard', 'out', 'in', 'spring'] as const;

function MotionPage() {
  const [dur, setDur] = useState<(typeof demoDurations)[number]>('base');
  const [ease, setEase] = useState<(typeof demoEasings)[number]>('out');
  const [on, setOn] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dotStyle: CSSProperties = {
    left: on ? 'calc(100% - 2.25rem)' : '0.25rem',
    transition: reduced ? 'none' : `left var(--cs-duration-${dur}) var(--cs-ease-${ease})`,
  };
  const maxFinite = 480;
  return (
    <>
      <Section id="demo" title="Try it" description="Pick a duration and an easing, then play. With reduced motion on, the dot jumps instead of travelling.">
        <div className={`${card} grid gap-4`}>
          <div className="flex flex-wrap items-center gap-4">
            <SegmentedControl aria-label="Duration" size="xs" value={dur} onValueChange={v => setDur(v as typeof dur)}>
              {demoDurations.map(d => <SegmentedControlItem key={d} value={d}>{d}</SegmentedControlItem>)}
            </SegmentedControl>
            <SegmentedControl aria-label="Easing" size="xs" value={ease} onValueChange={v => setEase(v as typeof ease)}>
              {demoEasings.map(d => <SegmentedControlItem key={d} value={d}>{d}</SegmentedControlItem>)}
            </SegmentedControl>
            <Button tone="secondary" size="sm" onClick={() => setOn(o => !o)}>Play</Button>
          </div>
          <div className="relative h-10 rounded-xl bg-bg-inset">
            <span aria-hidden data-testid="motion-dot" className="absolute top-1 size-8 rounded-full bg-accent-solid shadow-1" style={dotStyle} />
          </div>
          <p className="m-0 font-mono text-mono-sm text-text-tertiary">{T.motion.duration[dur]}ms · {T.motion.easing[ease]?.slice(0, 40)}{reduced ? ' · reduced motion: no transition' : ''}</p>
        </div>
      </Section>
      <Section id="durations" title="Durations" description="Feedback is fast, position changes use the spring, loops belong to the agent (P8).">
        <div className="grid gap-1.5">
          {Object.entries(T.motion.duration).map(([k, ms]) => (
            <div key={k} className="grid grid-cols-[6rem_4rem_1fr] items-center gap-3">
              <Mono>duration-{k}</Mono><span className="font-mono text-mono-sm text-text-tertiary">{ms}ms</span>
              <span aria-hidden className="block h-2 rounded-full bg-accent-fill" style={{ width: `${Math.min(100, (ms / maxFinite) * 100)}%`, minWidth: 2 }} />
            </div>
          ))}
        </div>
      </Section>
      <Section id="easings" title="Easings">
        <div className="grid gap-1.5">
          {Object.entries(T.motion.easing).map(([k, v]) => <div key={k} className="grid items-baseline gap-x-3 min-[700px]:grid-cols-[6rem_1fr]"><Mono>ease-{k}</Mono><span className="break-all font-mono text-mono-sm text-text-tertiary">{v.length > 90 ? `${v.slice(0, 90)}…` : v}</span></div>)}
        </div>
        <Bullets items={['Reduced motion stops all animation and transition: the base layer zeroes durations.', 'Infinite animation is reserved for the agent signature and spinners (flags.agent, flags.motionLoop).']} />
      </Section>
    </>
  );
}

// ───────────────────────── Page switch

const bodies: Record<string, { lead: string; view: () => ReactNode }> = {
  color: { lead: 'Five chromatic ramps and a neutral scale, generated from one lightness and chroma curve.', view: ColorPage },
  semantic: { lead: 'Role-named colors for light and dark, side by side.', view: SemanticPage },
  contrast: { lead: 'Contrast is a build gate: if any rule fails, the tokens do not build.', view: ContrastPage },
  typography: { lead: 'A 13px interface, a serif voice for the agent, and mono for machine values.', view: TypographyPage },
  space: { lead: 'A 4px scale and two container insets.', view: SpacePage },
  radius: { lead: 'Concentric corners from xs to full, plus the studio shell radii.', view: RadiusPage },
  sizes: { lead: 'Control, field, icon and component dimensions in two densities.', view: SizesPage },
  elevation: { lead: 'Five levels plus named shadows for cards, thumbs and artboards.', view: ElevationPage },
  materials: { lead: 'Glass thicknesses and the light control frost.', view: MaterialsPage },
  motion: { lead: 'Durations and easings, with a demo that honors reduced motion.', view: MotionPage },
};

export function FoundationPage({ slug }: { slug: string }) {
  const meta = foundationPages.find(p => p.slug === slug);
  const body = bodies[slug];
  if (!meta || !body) return <Page><PageHeader title="Not found" lead={`There is no foundation page “${slug}”.`} /></Page>;
  const View = body.view;
  return (
    <Page>
      <PageHeader eyebrow={<>Foundation · tokens {T.meta.version}</>} title={meta.title} lead={body.lead} />
      <View />
    </Page>
  );
}
