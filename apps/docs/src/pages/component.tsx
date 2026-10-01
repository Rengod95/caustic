import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Badge, Button, Kbd, Select, SelectOption, SegmentedControl, SegmentedControlItem, Switch, Table, type TableColumn, type TableRow } from '@caustic/react';
import { slotAttr } from '@caustic/spec';
import type { Fixture } from '../../../../packages/react/src/lib/fixture.ts';
import { groupOf, isGated, loadFixture, lockHash, policies, specs, usedBy, type Spec } from '../data.ts';
import { hrefFor } from '../router.ts';
import { Boundary, Bullets, Chip, Mono, Page, PageHeader, Section, Specimen } from '../ui.tsx';

/** Examples are plain functions; calling them inside a component keeps any hooks they use valid. */
function Call({ fn }: { fn: () => ReactNode }) { return <>{fn()}</>; }

const frameOf = (fx: Fixture) => fx.frame ?? ((n: ReactNode) => n);

function defaultsFor(spec: Spec): Record<string, unknown> {
  const d: Record<string, unknown> = {};
  for (const [axis, v] of Object.entries(spec.variants)) d[axis] = v.default;
  if (spec.sizes) d.size = spec.sizes.default;
  return d;
}

const axes = (spec: Spec): { name: string; values: string[]; default: string; description?: string }[] => [
  ...Object.entries(spec.variants).map(([name, v]) => ({ name, values: v.values, default: v.default, description: v.description })),
  ...(spec.sizes ? [{ name: 'size', values: spec.sizes.values, default: spec.sizes.default, description: undefined }] : []),
];

// ───────────────────────── Examples

function Examples({ spec, fx }: { spec: Spec; fx: Fixture }) {
  const declared = spec.examples.map(e => e.id).filter(id => id in fx.examples);
  const ids = [...declared, ...Object.keys(fx.examples).filter(id => !declared.includes(id))];
  if (ids.length === 0) return <p className="m-0 font-ui text-ui text-text-tertiary">No approved specimen exists for this component yet. See the live variants below.</p>;
  return (
    <div className="grid gap-5">
      {ids.map(id => {
        const meta = spec.examples.find(e => e.id === id);
        return (
          <Specimen key={id} title={meta?.title ?? id} meta={meta?.doc ?? id}>
            <Boundary label={`${spec.id} example “${id}”`}><Call fn={fx.examples[id]!} /></Boundary>
          </Specimen>
        );
      })}
    </div>
  );
}

// ───────────────────────── Playground

function AxisControl({ axis, value, onChange }: { axis: ReturnType<typeof axes>[number]; value: string; onChange: (v: string) => void }) {
  const long = axis.values.length > 5 || axis.values.join('').length > 40;
  return (
    <div className="grid min-w-0 gap-1.5">
      <span className="font-ui text-caption uppercase text-text-tertiary">{axis.name}</span>
      {long ? (
        <Select aria-label={axis.name} value={value} onValueChange={onChange}>
          {axis.values.map(v => <SelectOption key={v} value={v}>{v}</SelectOption>)}
        </Select>
      ) : (
        <div className="relative max-w-full overflow-x-auto"><SegmentedControl size="xs" aria-label={axis.name} value={value} onValueChange={onChange}>
          {axis.values.map(v => <SegmentedControlItem key={v} value={v}>{v}</SegmentedControlItem>)}
        </SegmentedControl></div>
      )}
    </div>
  );
}

const brief = (v: unknown): string => {
  if (v && typeof v === 'object' && 'nativeEvent' in v) return String((v as { type?: string }).type ?? "event");
  if (v === undefined) return '';
  try { return typeof v === 'string' ? `"${v}"` : JSON.stringify(v)?.slice(0, 40) ?? String(v); } catch { return String(v); }
};

function Playground({ spec, fx }: { spec: Spec; fx: Fixture }) {
  const axisList = axes(spec);
  const [values, setValues] = useState<Record<string, unknown>>(() => defaultsFor(spec));
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [log, setLog] = useState<string[]>([]);
  const booleans = Object.entries(spec.props).filter(([k, p]) => p.type.trim() === 'boolean' && k !== 'asChild');
  const recorders = useMemo(() => Object.fromEntries(Object.keys(spec.events).map(name => [name, (...args: unknown[]) => setLog(l => [`${name}(${args.map(brief).filter(Boolean).join(', ')})`, ...l].slice(0, 6))])), [spec]);
  const props = { ...recorders, ...values, ...flags };
  if (axisList.length === 0 && booleans.length === 0 && Object.keys(spec.events).length === 0) {
    return <Specimen title="Default"><Boundary label={`${spec.id} playground`}>{frameOf(fx)(fx.render({}))}</Boundary></Specimen>;
  }
  return (
    <div className="grid min-w-0 gap-3 rounded-3xl bg-surface-base p-3 shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-2)] min-[1100px]:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="canvas-grid relative grid min-h-40 min-w-0 content-center justify-items-start overflow-auto rounded-2xl p-5" data-testid="playground-stage">
        <Boundary key={JSON.stringify([values, flags])} label={`${spec.id} playground`}>{frameOf(fx)(fx.render(props))}</Boundary>
      </div>
      <div className="grid min-w-0 content-start gap-3.5 p-1">
        {axisList.map(a => <AxisControl key={a.name} axis={a} value={String(values[a.name] ?? a.default)} onChange={v => setValues(s => ({ ...s, [a.name]: v }))} />)}
        {booleans.length > 0 ? (
          <div className="grid gap-2">
            <span className="font-ui text-caption uppercase text-text-tertiary">Props</span>
            {booleans.map(([k, p]) => (
              <label key={k} className="flex items-center justify-between gap-3 font-ui text-ui text-text-primary">
                <Mono>{k}</Mono>
                <Switch size="sm" aria-label={k} checked={flags[k] ?? p.default === true} onCheckedChange={v => setFlags(s => ({ ...s, [k]: v }))} />
              </label>
            ))}
          </div>
        ) : null}
        {Object.keys(spec.events).length > 0 ? (
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between"><span className="font-ui text-caption uppercase text-text-tertiary">Events</span><Button size="xs" tone="ghost" onClick={() => setLog([])}>Clear</Button></div>
            <ol aria-live="polite" className="m-0 grid min-h-14 list-none gap-0.5 rounded-lg bg-bg-inset p-2 font-mono text-mono-sm text-text-secondary">
              {log.length === 0 ? <li className="text-text-tertiary">Interact with the component.</li> : log.map((l, i) => <li key={i} className="break-all">{l}</li>)}
            </ol>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ───────────────────────── Anatomy

function SlotTree({ spec, parent }: { spec: Spec; parent?: string }) {
  const kids = spec.slots.filter(s => (parent === undefined ? s.name === 'root' : (s.parent ?? 'root') === parent && s.name !== 'root'));
  if (kids.length === 0) return null;
  return (
    <ul className={`m-0 grid list-none gap-2 p-0 ${parent === undefined ? '' : 'ml-3 border-l border-border-default pl-4'}`}>
      {kids.map(s => (
        <li key={s.name} className="grid gap-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Mono>data-slot="{slotAttr(spec, s.name)}"</Mono>
            <Chip>{`<${s.el}>`}</Chip>
            {s.role ? <Badge tone="info">role={s.role}</Badge> : null}
            {s.required === false ? <Badge tone="outline">optional</Badge> : null}
          </div>
          <p className="m-0 max-w-[70ch] font-ui text-ui text-text-secondary">{s.description}</p>
          <SlotTree spec={spec} parent={s.name} />
        </li>
      ))}
    </ul>
  );
}

// ───────────────────────── Variants & sizes

function Variants({ spec, fx }: { spec: Spec; fx: Fixture | undefined }) {
  const list = axes(spec);
  const states = Object.keys(spec.states);
  const columns: TableColumn[] = [{ key: 'axis', header: 'Axis' }, { key: 'values', header: 'Values' }, { key: 'description', header: 'Description' }];
  const rows: TableRow[] = list.map(a => ({ id: a.name, axis: a.name, values: a.values, default: a.default, description: a.description ?? '' }));
  const base = defaultsFor(spec);
  return (
    <div className="grid min-w-0 gap-5">
      {list.length > 0 ? (
        <div className="relative min-w-0 overflow-x-auto">
          <Table aria-label="Variants and sizes" columns={columns} rows={rows} renderCell={(row, col) => {
            if (col.key === 'axis') return <Mono>{String(row.axis)}</Mono>;
            if (col.key === 'values') return <span className="flex flex-wrap gap-1">{(row.values as string[]).map(v => <Badge key={v} shape="square" tone={v === row.default ? 'accent' : 'neutral'} className="font-mono">{v}{v === row.default ? ' · default' : ''}</Badge>)}</span>;
            return <span className="text-text-secondary">{String(row.description)}</span>;
          }} />
        </div>
      ) : <p className="m-0 font-ui text-ui text-text-tertiary">No variant axes or sizes.</p>}
      {states.length > 0 ? <div className="flex flex-wrap items-center gap-1.5"><span className="font-ui text-ui text-text-secondary">States</span>{states.map(s => <Chip key={s}>{s}</Chip>)}</div> : null}
      {fx ? list.map(a => (
        <Specimen key={a.name} title={a.name} meta="live">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] items-start gap-x-4 gap-y-5">
            {a.values.map(v => (
              <div key={v} className="grid min-w-0 content-start gap-1.5">
                <div className="relative min-w-0 overflow-x-auto"><Boundary label={`${spec.id} ${a.name}=${v}`}>{frameOf(fx)(fx.render({ ...base, [a.name]: v }))}</Boundary></div>
                <span className="font-mono text-mono-sm text-text-tertiary">{a.name}="{v}"</span>
              </div>
            ))}
          </div>
        </Specimen>
      )) : null}
    </div>
  );
}

// ───────────────────────── Page

const propColumns: TableColumn[] = [
  { key: 'name', header: 'Prop' }, { key: 'type', header: 'Type' }, { key: 'default', header: 'Default' }, { key: 'description', header: 'Description' },
];
const eventColumns: TableColumn[] = [{ key: 'name', header: 'Event' }, { key: 'payload', header: 'Payload' }, { key: 'when', header: 'Fires when' }];

const fmtDefault = (v: unknown) => (v === undefined ? '—' : typeof v === 'string' ? `"${v}"` : JSON.stringify(v));

export function ComponentPage({ id }: { id: string }) {
  const spec = specs[id];
  const [fx, setFx] = useState<Fixture | undefined | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    loadFixture(id).then(f => { if (live) setFx(f); }, e => { console.error(`[docs] fixture for ${id} failed to load:`, e); if (live) { setLoadError(String(e)); setFx(undefined); } });
    return () => { live = false; };
  }, [id]);

  if (!spec) return <Page><PageHeader title="Not found" lead={`There is no component “${id}”.`} /></Page>;

  const gated = isGated(id);
  const hash = lockHash(id);
  const keyboard = Object.entries(spec.behavior.keyboard);
  const used = usedBy[id] ?? [];
  const flagList = [spec.flags.floating && 'floating', spec.flags.agent && 'agent', spec.flags.field && 'field', spec.flags.motionLoop && 'motionLoop'].filter(Boolean) as string[];
  const propRows: TableRow[] = Object.entries(spec.props).map(([name, p]) => ({ id: name, name, ...p }));
  const eventRows: TableRow[] = Object.entries(spec.events).map(([name, e]) => ({ id: name, name, ...e }));
  const a11yAttrs = Object.entries(spec.a11y.attrs);

  const sections: { id: string; title: string; show: boolean }[] = [
    { id: 'examples', title: 'Examples', show: true },
    { id: 'playground', title: 'Playground', show: true },
    { id: 'anatomy', title: 'Anatomy', show: true },
    { id: 'variants', title: 'Variants & sizes', show: true },
    { id: 'props', title: 'Props', show: propRows.length > 0 },
    { id: 'events', title: 'Events', show: eventRows.length > 0 },
    { id: 'keyboard', title: 'Keyboard', show: keyboard.length > 0 || spec.behavior.pointer.length > 0 },
    { id: 'a11y', title: 'Accessibility', show: true },
    { id: 'policies', title: 'Policies', show: spec.policies.length > 0 || flagList.length > 0 },
    { id: 'composition', title: 'Composition', show: true },
    { id: 'usage', title: 'Usage', show: spec.usage.length > 0 },
  ].filter(s => s.show);

  const loading = fx === null;
  return (
    <Page>
      <PageHeader
        eyebrow={<><a href={hrefFor.home} className="text-text-tertiary hover:text-text-primary">Docs</a><span aria-hidden>/</span><span>{groupOf(spec)}</span></>}
        title={spec.name}
        lead={spec.purpose}
        badges={
          <>
            {gated ? <Badge tone="success" dot>Gated</Badge> : <Badge tone="warning" dot>Not gated</Badge>}
            <Badge>{spec.status}</Badge>
            <Badge tone="outline">{spec.category}</Badge>
            {spec.role ? <Badge tone="info" className="font-mono">role={spec.role}</Badge> : <Badge tone="outline">presentational</Badge>}
            {hash ? <span className="font-mono text-mono-sm text-text-tertiary" title="Approved spec hash">spec {hash}</span> : null}
          </>
        }
      />
      {spec.description ? <p className="m-0 -mt-6 max-w-[66ch] font-ui text-body text-text-secondary">{spec.description}</p> : null}

      <nav aria-label="On this page" className="-mt-4 flex gap-1 overflow-x-auto">
        {sections.map(s => <Button key={s.id} tone="ghost" size="sm" onClick={() => document.querySelector(`[data-section="${s.id}"]`)?.scrollIntoView()}>{s.title}</Button>)}
      </nav>

      <Section id="examples" title="Examples" description="Each example reproduces the approved specimen and is gated against it.">
        {loading ? <p className="m-0 font-ui text-ui text-text-tertiary">Loading…</p> : fx ? <Examples spec={spec} fx={fx} /> : <p role="alert" className="m-0 font-ui text-ui text-danger-text">No fixture found for {id}{loadError ? `: ${loadError}` : ''}.</p>}
      </Section>

      <Section id="playground" title="Playground" description="Change variants, sizes and boolean props; events from the real component appear in the log.">
        {loading ? <p className="m-0 font-ui text-ui text-text-tertiary">Loading…</p> : fx ? <Playground spec={spec} fx={fx} /> : null}
      </Section>

      <Section id="anatomy" title="Anatomy" description="Slots are the parts the gateway measures. Each carries a data-slot attribute.">
        <div className="rounded-2xl bg-surface-base p-4 shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-1)]"><SlotTree spec={spec} /></div>
      </Section>

      <Section id="variants" title="Variants & sizes">
        <Variants spec={spec} fx={fx ?? undefined} />
      </Section>

      {propRows.length > 0 ? (
        <Section id="props" title="Props" description="Defaults are applied by the component; required props are marked.">
          <div className="relative min-w-0 overflow-x-auto">
            <Table aria-label="Props" columns={propColumns} rows={propRows} renderCell={(row, col) => {
              if (col.key === 'name') return <span className="whitespace-nowrap"><Mono>{String(row.name)}</Mono>{row.required ? <span className="ml-1 text-danger-text" title="Required">*</span> : null}</span>;
              if (col.key === 'type') return <span className="break-words font-mono text-mono-sm text-text-secondary">{String(row.type)}</span>;
              if (col.key === 'default') return <span className="font-mono text-mono-sm text-text-tertiary">{fmtDefault(row.default)}</span>;
              return <span className="text-text-secondary">{String(row.description)}</span>;
            }} />
          </div>
        </Section>
      ) : null}

      {eventRows.length > 0 ? (
        <Section id="events" title="Events">
          <div className="relative min-w-0 overflow-x-auto">
            <Table aria-label="Events" columns={eventColumns} rows={eventRows} renderCell={(row, col) => {
              if (col.key === 'name') return <Mono>{String(row.name)}</Mono>;
              if (col.key === 'payload') return <span className="break-words font-mono text-mono-sm text-text-secondary">{String(row.payload)}</span>;
              return <span className="text-text-secondary">{String(row.when)}</span>;
            }} />
          </div>
        </Section>
      ) : null}

      {sections.some(s => s.id === 'keyboard') ? (
        <Section id="keyboard" title="Keyboard & pointer">
          {keyboard.length > 0 ? (
            <dl className="m-0 grid gap-1.5">
              {keyboard.map(([k, action]) => (
                <div key={k} className="grid items-center gap-x-4 gap-y-1 border-b border-border-subtle py-1.5 min-[700px]:grid-cols-[14rem_1fr]">
                  <dt className="flex flex-wrap items-center gap-1">{k.split('+').map((part, i) => <span key={i} className="inline-flex items-center gap-1">{i > 0 ? <span className="text-text-tertiary">+</span> : null}<Kbd>{part.trim()}</Kbd></span>)}</dt>
                  <dd className="m-0 font-ui text-ui text-text-secondary">{action}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {spec.behavior.pointer.length > 0 ? <Bullets items={spec.behavior.pointer} /> : null}
        </Section>
      ) : null}

      <Section id="a11y" title="Accessibility">
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {spec.role ? <Badge tone="info" className="font-mono">role={spec.role}</Badge> : <Badge tone="outline">presentational root</Badge>}
            <Badge tone={spec.a11y.labelRequired ? 'warning' : 'neutral'}>{spec.a11y.labelRequired ? 'Accessible name required' : 'Name from content'}</Badge>
            <Badge>min hit {spec.a11y.minHit}px</Badge>
          </div>
          {a11yAttrs.length > 0 ? (
            <ul className="m-0 grid list-none gap-1 p-0">
              {a11yAttrs.map(([slot, attrs]) => <li key={slot} className="flex flex-wrap items-center gap-1.5 font-ui text-ui text-text-secondary"><Mono>{slotAttr(spec, slot)}</Mono>{attrs.map(a => <Chip key={a}>{a}</Chip>)}</li>)}
            </ul>
          ) : null}
          {spec.a11y.notes.length > 0 ? <Bullets items={spec.a11y.notes} /> : null}
        </div>
      </Section>

      {sections.some(s => s.id === 'policies') ? (
        <Section id="policies" title="Policies applied" description="Foundation policies the gateway checks for this component.">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] gap-3">
            {spec.policies.map(p => (
              <div key={p} className="grid gap-1 rounded-2xl bg-surface-base p-3.5 shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-1)]">
                <div className="flex items-center gap-2"><Badge tone="accent" shape="square">{p}</Badge><span className="font-ui text-ui-strong">{policies[p].title}</span></div>
                <p className="m-0 font-ui text-ui-dense-relaxed text-text-secondary">{policies[p].rule}</p>
              </div>
            ))}
          </div>
          {flagList.length > 0 ? <div className="flex flex-wrap items-center gap-1.5"><span className="font-ui text-ui text-text-secondary">Flags</span>{flagList.map(f => <Chip key={f}>{f}</Chip>)}</div> : null}
        </Section>
      ) : null}

      <Section id="composition" title="Composition">
        <div className="grid gap-3 font-ui text-ui text-text-secondary">
          <div className="flex flex-wrap items-center gap-1.5"><span className="w-28">Built from</span>{spec.composition.uses.length ? spec.composition.uses.map(u => specs[u] ? <a key={u} href={hrefFor.component(u)} className="no-underline"><Badge tone="accent" shape="square">{specs[u]!.name}</Badge></a> : <Chip key={u}>{u}</Chip>) : <span className="text-text-tertiary">Standalone (no other Caustic components)</span>}</div>
          <div className="flex flex-wrap items-center gap-1.5"><span className="w-28">Used by</span>{used.length ? used.map(u => <a key={u} href={hrefFor.component(u)} className="no-underline"><Badge shape="square">{specs[u]!.name}</Badge></a>) : <span className="text-text-tertiary">Not used by other components</span>}</div>
          <div className="flex flex-wrap items-center gap-1.5"><span className="w-28">Radix</span>{spec.composition.radix.length ? spec.composition.radix.map(r => <Chip key={r}>{r}</Chip>) : <span className="text-text-tertiary">None</span>}</div>
        </div>
      </Section>

      {spec.usage.length > 0 ? <Section id="usage" title="Usage notes"><Bullets items={spec.usage} /></Section> : null}
    </Page>
  );
}
