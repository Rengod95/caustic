import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Columns3, Copy, CreditCard, Download, Ellipsis, Eye, Layers, Mail, Plus, RefreshCw, Search, Share2, Sparkles, UserMinus, UserPlus } from 'lucide-react';
import {
  Alert, Avatar, Badge, Button, CardBody, CardDescription, CardFooter, CardHeader, CardHeading, CardMeta, CardStat, Card, CardTitle, CardTrailing,
  Chip, Combobox, DatePicker, EmptyState, IconButton, Input, Menu, MenuItem, MenuSeparator,
  Pagination, Progress, SectionHeader, SegmentedControl, SegmentedControlItem, Select, SelectOption, Skeleton, Table, TagInput, Timeline, TimelineItem, TimelineStrong as S,
  type TableColumn, type TableRow, type TableSort,
} from '@caustic/react';

// ---- Fictional data for Fieldnote (design tool). Numbers are internally consistent: Oct MRR 482.9k, 1,284 teams.

type Plan = 'Enterprise' | 'Team' | 'Starter';
type Status = 'Active' | 'Trialing' | 'Past due' | 'Churned';
type OwnerId = 'mina' | 'jun' | 'dahee' | 'eli' | 'sara';
type Tone = 'coral' | 'iris' | 'mint' | 'amber' | 'slate';
type Account = {
  id: string; name: string; domain: string; plan: Plan; status: Status; region: string; owner: OwnerId;
  seats: number; seatCap: number; mrr: number; renews: string; tags: string[];
};
type MetricKey = 'mrr' | 'teams' | 'seats';
type Metric = {
  label: string; max: number; step: number; tick: (v: number) => string; fmt: (v: number) => string;
  series: { name: string; values: number[] }[];
};
type Range = { from: string; to?: string };

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const SERIES_COLOR = ['var(--cs-color-chart-1)', 'var(--cs-color-chart-2)', 'var(--cs-color-chart-3)'];
const REGION_COLOR = ['var(--cs-color-chart-1)', 'var(--cs-color-chart-2)', 'var(--cs-color-chart-3)', 'var(--cs-color-chart-4)'];
const PAGE_SIZE = 5;

const usd = (v: number) => `$${v.toFixed(1)}k`;
const count = (v: number) => v.toLocaleString('en-US');
const initials = (name: string) => name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');

const owners: Record<OwnerId, { name: string; tone: Tone }> = {
  mina: { name: 'Mina Kang', tone: 'coral' },
  jun: { name: 'Jun Seo', tone: 'iris' },
  dahee: { name: 'Dahee Han', tone: 'mint' },
  eli: { name: 'Eli Park', tone: 'amber' },
  sara: { name: 'Sara Okafor', tone: 'slate' },
};

const metrics: Record<MetricKey, Metric> = {
  mrr: {
    label: 'MRR', max: 320, step: 80, tick: v => (v === 0 ? '$0' : `$${v}k`), fmt: usd,
    series: [
      { name: 'Enterprise', values: [201.2, 207.8, 214.5, 221.0, 228.4, 236.1, 243.7, 250.9, 256.3, 259.8, 261.2, 262.4] },
      { name: 'Team', values: [128.6, 130.4, 132.9, 135.1, 138.7, 142.3, 146.0, 150.2, 154.8, 158.1, 161.9, 164.1] },
      { name: 'Starter', values: [49.3, 50.1, 50.9, 51.7, 52.6, 53.5, 54.1, 54.9, 55.6, 55.9, 56.0, 56.4] },
    ],
  },
  teams: {
    label: 'Active teams', max: 1600, step: 400, tick: count, fmt: count,
    series: [
      { name: 'Enterprise', values: [171, 176, 180, 185, 189, 193, 199, 204, 208, 210, 211, 212] },
      { name: 'Team', values: [742, 770, 792, 810, 832, 850, 862, 870, 876, 879, 882, 884] },
      { name: 'Starter', values: [118, 124, 129, 135, 141, 147, 152, 158, 165, 171, 180, 188] },
    ],
  },
  seats: {
    label: 'Seats', max: 32000, step: 8000, tick: v => (v === 0 ? '0' : `${v / 1000}k`), fmt: count,
    series: [
      { name: 'Enterprise', values: [12310, 12540, 12880, 13120, 13350, 13520, 13690, 13790, 13860, 13910, 13930, 13944] },
      { name: 'Team', values: [8020, 8140, 8310, 8420, 8560, 8690, 8820, 8930, 9010, 9080, 9150, 9210] },
      { name: 'Starter', values: [2040, 2090, 2135, 2180, 2215, 2240, 2265, 2300, 2330, 2358, 2380, 2406] },
    ],
  },
};

const sumAt = (m: Metric, i: number) => m.series.reduce((total, s) => total + s.values[i]!, 0);
const mrrTrend = MONTHS.map((_, i) => sumAt(metrics.mrr, i));
const teamTrend = MONTHS.map((_, i) => sumAt(metrics.teams, i));
const utilTrend = [71.9, 73.2, 74.1, 75.3, 76.8, 77.9, 78.9, 79.8, 80.5, 80.1, 79.6, 78.4];
const churnTrend = [3.0, 2.8, 3.1, 2.9, 2.7, 2.8, 2.6, 2.9, 2.4, 2.7, 2.5, 2.1];

/** Maps a series onto the 0..32 sparkline box of CardStat (higher is higher). */
const spark = (values: number[]) => {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return values.map(v => 4 + ((v - lo) / (hi - lo || 1)) * 24);
};
const change = (values: number[]) => {
  const last = values[values.length - 1]!;
  const prev = values[values.length - 2]!;
  return { abs: last - prev, pct: ((last - prev) / prev) * 100 };
};

const regions = [
  { name: 'North America', pct: 46, value: '$222.1k' },
  { name: 'Europe', pct: 31, value: '$149.7k' },
  { name: 'APAC', pct: 17, value: '$82.1k' },
  { name: 'LATAM', pct: 6, value: '$29.0k' },
];

const accounts: Account[] = [
  { id: 'northwind', name: 'Northwind Studio', domain: 'northwind.studio', plan: 'Enterprise', status: 'Active', region: 'North America', owner: 'mina', seats: 420, seatCap: 480, mrr: 18400, renews: 'Nov 3', tags: ['design-ops', 'pilot'] },
  { id: 'lumen', name: 'Lumen & Co', domain: 'lumen.co', plan: 'Enterprise', status: 'Active', region: 'Europe', owner: 'jun', seats: 331, seatCap: 360, mrr: 15200, renews: 'Nov 12', tags: ['eu-west'] },
  { id: 'harbor', name: 'Harbor Labs', domain: 'harborlabs.io', plan: 'Team', status: 'Past due', region: 'Europe', owner: 'dahee', seats: 41, seatCap: 60, mrr: 1640, renews: 'Overdue 4 days', tags: ['eu-west', 'finance'] },
  { id: 'pixel', name: 'Pixelforge', domain: 'pixelforge.app', plan: 'Team', status: 'Active', region: 'North America', owner: 'eli', seats: 58, seatCap: 80, mrr: 2320, renews: 'Nov 9', tags: ['growth'] },
  { id: 'quill', name: 'Quill Health', domain: 'quill.health', plan: 'Enterprise', status: 'Trialing', region: 'North America', owner: 'sara', seats: 40, seatCap: 120, mrr: 0, renews: 'Trial ends Nov 6', tags: ['pilot', 'health'] },
  { id: 'kiln', name: 'Kiln Atelier', domain: 'kilnatelier.com', plan: 'Starter', status: 'Active', region: 'Europe', owner: 'jun', seats: 6, seatCap: 10, mrr: 180, renews: 'Nov 20', tags: ['eu-west'] },
  { id: 'orbit', name: 'Orbit Pay', domain: 'orbitpay.com', plan: 'Enterprise', status: 'Active', region: 'APAC', owner: 'mina', seats: 510, seatCap: 600, mrr: 21900, renews: 'Dec 1', tags: ['payments'] },
  { id: 'moss', name: 'Moss Bank', domain: 'mossbank.eu', plan: 'Enterprise', status: 'Past due', region: 'Europe', owner: 'dahee', seats: 140, seatCap: 200, mrr: 6150, renews: 'Overdue 2 days', tags: ['eu-west', 'finance'] },
  { id: 'tidewater', name: 'Tidewater Media', domain: 'tidewater.media', plan: 'Team', status: 'Active', region: 'LATAM', owner: 'eli', seats: 24, seatCap: 40, mrr: 960, renews: 'Nov 14', tags: ['media'] },
  { id: 'atlas', name: 'Atlas Robotics', domain: 'atlasrobotics.dev', plan: 'Team', status: 'Churned', region: 'North America', owner: 'sara', seats: 0, seatCap: 25, mrr: 0, renews: 'Ended Oct 12', tags: ['churn-risk'] },
  { id: 'fern', name: 'Field & Fern', domain: 'fieldandfern.co', plan: 'Starter', status: 'Active', region: 'APAC', owner: 'eli', seats: 4, seatCap: 5, mrr: 90, renews: 'Nov 2', tags: ['design-ops'] },
  { id: 'bright', name: 'Brightline Co-op', domain: 'brightline.coop', plan: 'Team', status: 'Active', region: 'Europe', owner: 'dahee', seats: 18, seatCap: 30, mrr: 720, renews: 'Nov 18', tags: ['eu-west', 'community'] },
  { id: 'nimbus', name: 'Nimbus Dental', domain: 'nimbusdental.com', plan: 'Starter', status: 'Trialing', region: 'North America', owner: 'sara', seats: 2, seatCap: 5, mrr: 0, renews: 'Trial ends Nov 2', tags: ['pilot'] },
  { id: 'ferris', name: 'Ferris Logistics', domain: 'ferris.logistics', plan: 'Enterprise', status: 'Active', region: 'North America', owner: 'mina', seats: 226, seatCap: 260, mrr: 9840, renews: 'Dec 4', tags: ['ops'] },
  { id: 'plum', name: 'Plum Analytics', domain: 'plum.analytics', plan: 'Team', status: 'Active', region: 'APAC', owner: 'jun', seats: 33, seatCap: 40, mrr: 1320, renews: 'Nov 22', tags: ['growth', 'data'] },
];

const byId = new Map(accounts.map(a => [a.id, a] as const));
const statusTone = { Active: 'success', Trialing: 'info', 'Past due': 'warning', Churned: 'danger' } as const;
const planTone = { Enterprise: 'accent', Team: 'neutral', Starter: 'outline' } as const;
const statusOptions: Status[] = ['Trialing', 'Past due', 'Churned'];
const ownerOptions = (Object.keys(owners) as OwnerId[]).map(id => ({
  value: id, label: owners[id].name, meta: id === 'mina' ? 'Admin' : undefined,
  leading: <Avatar name={owners[id].name} color={owners[id].tone} size="xs" />,
}));

const columns: TableColumn[] = [
  { key: 'name', header: 'Account', sortable: true },
  { key: 'plan', header: 'Plan' },
  { key: 'status', header: 'Status' },
  { key: 'seats', header: 'Seats', align: 'end', sortable: true },
  { key: 'usage', header: 'Seat use', width: 170 },
  { key: 'mrr', header: 'MRR', align: 'end', sortable: true },
  { key: 'renews', header: 'Renewal' },
];

/** Hook: the rendered width of an element, so the SVG draws at 1:1 pixels (axis text never scales). */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(entries => setWidth(Math.floor(entries[0]!.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Multi-series line chart: gridlines, month and value axes, legend, crosshair with tooltip. Last month is highlighted by default. */
function TimeSeries({ metric }: { metric: MetricKey }) {
  const m = metrics[metric];
  const [wrapRef, measured] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const w = Math.max(measured, 300);
  const H = 300;
  const padL = 46, padR = 12, padT = 12, padB = 26;
  const plotW = w - padL - padR;
  const plotH = H - padT - padB;
  const last = MONTHS.length - 1;
  const xAt = (i: number) => padL + (i / last) * plotW;
  const yAt = (v: number) => padT + plotH * (1 - v / m.max);
  const idx = hover ?? last;
  const every = w < 480 ? 3 : w < 640 ? 2 : 1;
  const ticks = [0, 1, 2, 3, 4].map(k => k * m.step);
  const flip = idx >= 8;

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const left = e.currentTarget.getBoundingClientRect().left;
    const i = Math.round(((e.clientX - left - padL) / plotW) * last);
    setHover(Math.min(last, Math.max(0, i)));
  };

  return (
    <div className="grid gap-3">
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-ui-sm text-text-secondary">
        {m.series.map((s, si) => (
          <li key={s.name} className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full" style={{ background: SERIES_COLOR[si] }} />
            {s.name}
            <b className="font-semibold tabular-nums text-text-primary">{m.fmt(s.values[last]!)}</b>
          </li>
        ))}
        <li className="text-text-tertiary">Oct 2026</li>
      </ul>
      <div ref={wrapRef} className="relative w-full">
        <svg
          width={w} height={H} role="img"
          aria-label={`${m.label} by plan, monthly from Nov 2025 to Oct 2026`}
          onPointerMove={onMove} onPointerLeave={() => setHover(null)}
          className="block overflow-visible font-ui"
        >
          {ticks.map(t => (
            <g key={t}>
              <line x1={padL} x2={w - padR} y1={yAt(t)} y2={yAt(t)} strokeOpacity={0.6} style={{ stroke: 'var(--cs-color-border-default)' }} />
              <text x={padL - 8} y={yAt(t) + 4} textAnchor="end" fontSize={11} className="tabular-nums" style={{ fill: 'var(--cs-color-text-tertiary)' }}>{m.tick(t)}</text>
            </g>
          ))}
          {MONTHS.map((mo, i) => (i === last || (i % every === 0 && last - i >= every)) && (
            <text
              key={mo} x={xAt(i)} y={H - 6} fontSize={11} textAnchor={i === 0 ? 'start' : i === last ? 'end' : 'middle'}
              style={{ fill: 'var(--cs-color-text-tertiary)' }}
            >
              {mo}
            </text>
          ))}
          <line x1={xAt(idx)} x2={xAt(idx)} y1={padT} y2={padT + plotH} style={{ stroke: 'var(--cs-color-border-strong)' }} />
          {m.series.map((s, si) => (
            <path
              key={s.name} fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
              d={s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ')}
              style={{ stroke: SERIES_COLOR[si] }}
            />
          ))}
          {m.series.map((s, si) => (
            <circle
              key={`dot-${s.name}`} cx={xAt(idx)} cy={yAt(s.values[idx]!)} r={4} strokeWidth={2}
              style={{ fill: SERIES_COLOR[si], stroke: 'var(--cs-color-surface-base)' }}
            />
          ))}
        </svg>
        <div
          className="pointer-events-none absolute top-0 z-10 w-44 rounded-lg border border-border-subtle bg-surface-raised p-2.5 font-ui text-ui-sm shadow-2"
          style={{ left: flip ? xAt(idx) - 12 : xAt(idx) + 12, transform: flip ? "translateX(-100%)" : "none" }}
          aria-hidden
        >
          <div className="mb-1.5 text-text-tertiary">{MONTHS[idx]} {idx < 2 ? 2025 : 2026}</div>
          {m.series.map((s, si) => (
            <div key={s.name} className="flex items-center justify-between gap-3 py-0.5">
              <span className="inline-flex items-center gap-1.5 text-text-secondary">
                <span className="size-2 rounded-full" style={{ background: SERIES_COLOR[si] }} />
                {s.name}
              </span>
              <b className="font-semibold tabular-nums text-text-primary">{m.fmt(s.values[idx]!)}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Donut of October MRR by region. Hovering a segment or its legend row highlights it and shows its value in the centre. */
function RegionDonut() {
  const [hot, setHot] = useState<number | null>(null);
  const size = 176, r = 70, sw = 22, c = size / 2;
  const circ = 2 * Math.PI * r;
  let start = 0;
  const arcs = regions.map((g, i) => {
    const len = (g.pct / 100) * circ;
    const arc = { i, dash: `${len - 2} ${circ}`, offset: -(start + 1) };
    start += len;
    return arc;
  });
  const active = hot == null ? null : regions[hot]!;

  return (
    <div className="grid gap-4">
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label="MRR by region, October 2026">
          <g transform={`rotate(-90 ${c} ${c})`}>
            {arcs.map(a => (
              <circle
                key={a.i} cx={c} cy={c} r={r} fill="none" strokeWidth={sw}
                strokeDasharray={a.dash} strokeDashoffset={a.offset}
                onPointerEnter={() => setHot(a.i)} onPointerLeave={() => setHot(null)}
                style={{ stroke: REGION_COLOR[a.i], opacity: hot == null || hot === a.i ? 1 : 0.28, transition: 'opacity 120ms ease-out' }}
              />
            ))}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center font-ui">
          <span className="text-ui-sm text-text-tertiary">{active ? active.name : 'MRR, Oct'}</span>
          <b className="text-title-4 font-semibold tabular-nums text-text-primary">{active ? active.value : '$482.9k'}</b>
        </div>
      </div>
      <ul className="grid gap-0.5">
        {regions.map((g, i) => (
          <li
            key={g.name} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(null)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-ui-sm hover:bg-neutral-hover"
          >
            <span aria-hidden className="size-2.5 flex-none rounded-xs" style={{ background: REGION_COLOR[i] }} />
            <span className="flex-1 text-text-secondary">{g.name}</span>
            <span className="tabular-nums text-text-tertiary">{g.pct}%</span>
            <b className="w-16 text-right font-semibold tabular-nums text-text-primary">{g.value}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  const [syncOpen, setSyncOpen] = useState(true);
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('all');
  const [owner, setOwner] = useState('');
  const [range, setRange] = useState<Range>({ from: '2026-10-01', to: '2026-10-24' });
  const [plan, setPlan] = useState('all');
  const [picked, setPicked] = useState<Status[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [metric, setMetric] = useState<MetricKey>('mrr');
  const [sort, setSort] = useState<TableSort>({ key: 'mrr', direction: 'descending' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const togglePick = (s: Status, on: boolean) => setPicked(list => (on ? [...list.filter(x => x !== s), s] : list.filter(x => x !== s)));
  const filtersOn = q !== '' || region !== 'all' || owner !== '' || plan !== 'all' || picked.length > 0 || tags.length > 0;
  const clearAll = () => { setQ(''); setRegion('all'); setOwner(''); setPlan('all'); setPicked([]); setTags([]); setPage(1); };

  const visible = accounts.filter(a =>
    (plan === 'all' || a.plan === plan) &&
    (region === 'all' || a.region === region) &&
    (owner === '' || a.owner === owner) &&
    (picked.length === 0 || picked.includes(a.status)) &&
    tags.every(t => a.tags.includes(t)) &&
    (q.trim() === '' || `${a.name} ${a.domain}`.toLowerCase().includes(q.trim().toLowerCase())),
  );
  const sorted = [...visible].sort((a, b) => {
    const dir = sort.direction === 'ascending' ? 1 : -1;
    const diff = sort.key === 'name' ? a.name.localeCompare(b.name) : sort.key === 'seats' ? a.seats - b.seats : a.mrr - b.mrr;
    return diff * dir;
  });
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pageRows: TableRow[] = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const mrrDelta = change(mrrTrend);
  const teamDelta = change(teamTrend);
  const utilDelta = change(utilTrend);
  const churnDelta = change(churnTrend);

  const renderCell = (row: TableRow, column: TableColumn) => {
    const a = byId.get(row.id)!;
    const pct = Math.round((a.seats / a.seatCap) * 100);
    switch (column.key) {
      case 'name':
        return (
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="grid size-7 flex-none place-items-center rounded-md bg-neutral-track font-ui text-ui-sm font-semibold text-text-secondary">{initials(a.name)}</span>
            <div className="min-w-0">
              <b className="block truncate font-medium">{a.name}</b>
              <span className="block truncate text-ui-sm font-normal text-text-tertiary">{a.domain}</span>
            </div>
          </div>
        );
      case 'plan':
        return <Badge tone={planTone[a.plan]}>{a.plan}</Badge>;
      case 'status':
        return <Badge tone={statusTone[a.status]} dot>{a.status}</Badge>;
      case 'seats':
        return <span className="tabular-nums">{count(a.seats)} / {count(a.seatCap)}</span>;
      case 'usage':
        return (
          <div className="flex items-center gap-2.5">
            <Progress aria-label={`Seat use, ${a.name}`} value={pct} className="w-24" />
            <span className="w-9 text-ui-sm tabular-nums text-text-secondary">{pct}%</span>
          </div>
        );
      case 'mrr':
        return a.mrr === 0 ? <span className="text-text-tertiary">—</span> : `$${count(a.mrr)}`;
      case 'renews':
        return <span className={a.status === 'Past due' ? 'text-warning-text' : 'text-text-secondary'}>{a.renews}</span>;
      default:
        return null;
    }
  };

  const rowActions = (row: TableRow) => {
    const a = byId.get(row.id)!;
    return (
      <Menu
        aria-label={`Actions for ${a.name}`} align="end"
        trigger={<IconButton label={`Actions for ${a.name}`} size="xs"><Ellipsis /></IconButton>}
      >
        <MenuItem icon={<Eye />}>Open account</MenuItem>
        <MenuItem icon={<Layers />}>Change plan</MenuItem>
        <MenuItem icon={<Mail />}>Send invoice</MenuItem>
        <MenuItem icon={<Copy />}>Copy account ID</MenuItem>
        <MenuSeparator />
        <MenuItem tone="danger" icon={<UserMinus />}>Suspend account</MenuItem>
      </Menu>
    );
  };

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-275 flex-col gap-5 px-4 py-6 font-ui text-text-primary min-[720px]:px-6">
      <SectionHeader
        headingLevel={1} size="md" eyebrow="Fieldnote admin" title="Analytics"
        description="Revenue, seats and account health across all workspaces. Data through Oct 24, 2026, 09:40 UTC."
        action={
          <div className="flex flex-wrap gap-2">
            <Button tone="secondary" iconStart={<Share2 />}>Share</Button>
            <Button iconStart={<Plus />}>New report</Button>
          </div>
        }
      />

      {syncOpen && (
        <Alert
          layout="page" tone="warning" dismissible dismissLabel="Dismiss sync warning" onDismiss={() => setSyncOpen(false)}
          action={<Button tone="secondary" size="xs" iconStart={<RefreshCw />}>Retry sync</Button>}
        >
          <b>Stripe sync failed 2 hours ago.</b> Invoices after 07:40 UTC are missing from these numbers, so revenue may lag by up to 2 hours.
        </Alert>
      )}

      <section aria-label="Filters" className="grid gap-3 rounded-2xl bg-surface-base p-3 shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            aria-label="Search accounts" placeholder="Search accounts or domains" prefix={<Search />}
            value={q} onValueChange={v => { setQ(v); setPage(1); }} containerClassName="w-full min-[720px]:w-64"
          />
          <Select aria-label="Region" value={region} onValueChange={v => { setRegion(v); setPage(1); }} className="w-full min-[720px]:w-44">
            <SelectOption value="all">All regions</SelectOption>
            {regions.map(g => <SelectOption key={g.name} value={g.name}>{g.name}</SelectOption>)}
          </Select>
          <Combobox
            aria-label="Owner" placeholder="Any owner" options={ownerOptions} value={owner} className="w-full min-[720px]:w-48"
            onValueChange={v => { setOwner(v); setPage(1); }}
            onInputValueChange={t => { if (t === '') setOwner(''); }}
          />
          <DatePicker
            value={range} onValueChange={v => { if (typeof v !== 'string') setRange(v); }} today="2026-10-24"
            className="w-full min-[720px]:w-60"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl aria-label="Plan" value={plan} onValueChange={v => { setPlan(v); setPage(1); }}>
            <SegmentedControlItem value="all" count={accounts.length}>All</SegmentedControlItem>
            <SegmentedControlItem value="Enterprise" count={accounts.filter(a => a.plan === 'Enterprise').length}>Enterprise</SegmentedControlItem>
            <SegmentedControlItem value="Team" count={accounts.filter(a => a.plan === 'Team').length}>Team</SegmentedControlItem>
            <SegmentedControlItem value="Starter" count={accounts.filter(a => a.plan === 'Starter').length}>Starter</SegmentedControlItem>
          </SegmentedControl>
          {statusOptions.map(s => (
            <Chip
              key={s} pressed={picked.includes(s)} onPressedChange={on => { togglePick(s, on); setPage(1); }}
              count={accounts.filter(a => a.status === s).length}
            >
              {s}
            </Chip>
          ))}
          <div className="min-w-56 flex-1">
            <TagInput
              aria-label="Filter by tag" placeholder="Filter by tag" value={tags}
              onValueChange={v => { setTags(v); setPage(1); }} containerClassName="w-full"
            />
          </div>
          <Button tone="ghost" size="sm" disabled={!filtersOn} onClick={clearAll}>Clear filters</Button>
        </div>
      </section>

      <div className="grid gap-3 min-[720px]:grid-cols-2 min-[1100px]:grid-cols-4">
        <CardStat
          size="compact" label="Monthly recurring revenue" value={usd(mrrTrend[MONTHS.length - 1]!)}
          delta={`${Math.abs(mrrDelta.pct).toFixed(1)}%`} deltaDirection={mrrDelta.abs >= 0 ? 'up' : 'down'} deltaNote="vs Sep"
          trend={spark(mrrTrend)} trendLabel="MRR over 12 months, rising"
        />
        <CardStat
          size="compact" label="Active teams" value={count(teamTrend[MONTHS.length - 1]!)}
          delta={`${Math.abs(teamDelta.pct).toFixed(1)}%`} deltaDirection={teamDelta.abs >= 0 ? 'up' : 'down'} deltaNote="vs Sep"
          trend={spark(teamTrend)} trendLabel="Active teams over 12 months, rising"
        />
        <CardStat
          size="compact" label="Seat utilization" value={`${utilTrend[MONTHS.length - 1]!.toFixed(1)}%`}
          delta={`${Math.abs(utilDelta.abs).toFixed(1)} pts`} deltaDirection="down" deltaTone="bad" deltaNote="vs Sep"
          trend={spark(utilTrend)} trendLabel="Seat utilization over 12 months, falling"
        />
        <CardStat
          size="compact" label="Logo churn" value={`${churnTrend[MONTHS.length - 1]!.toFixed(1)}%`}
          delta={`${Math.abs(churnDelta.abs).toFixed(1)} pts`} deltaDirection="down" deltaTone="good" deltaNote="vs Sep"
          trend={spark(churnTrend)} trendLabel="Logo churn over 12 months, falling"
        />
      </div>

      <div className="grid gap-3 min-[1100px]:grid-cols-[minmax(0,1fr)_340px]">
        <Card aria-labelledby="revenue-title">
          <CardHeader>
            <CardHeading>
              <CardTitle as="h2" titleSize="sm" id="revenue-title">Revenue by plan</CardTitle>
              <CardDescription>Monthly, Nov 2025 to Oct 2026</CardDescription>
            </CardHeading>
            <CardTrailing>
              <SegmentedControl size="xs" aria-label="Chart metric" value={metric} onValueChange={v => setMetric(v as MetricKey)}>
                <SegmentedControlItem value="mrr">MRR</SegmentedControlItem>
                <SegmentedControlItem value="teams">Teams</SegmentedControlItem>
                <SegmentedControlItem value="seats">Seats</SegmentedControlItem>
              </SegmentedControl>
            </CardTrailing>
          </CardHeader>
          <TimeSeries metric={metric} />
          <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border-subtle pt-3 min-[720px]:grid-cols-4">
            <div><dt className="text-ui-sm text-text-tertiary">New logos</dt><dd className="font-ui text-ui-strong tabular-nums text-success-text">+$5.4k</dd></div>
            <div><dt className="text-ui-sm text-text-tertiary">Expansion</dt><dd className="font-ui text-ui-strong tabular-nums text-success-text">+$3.0k</dd></div>
            <div><dt className="text-ui-sm text-text-tertiary">Contraction</dt><dd className="font-ui text-ui-strong tabular-nums text-danger-text">-$0.8k</dd></div>
            <div><dt className="text-ui-sm text-text-tertiary">Churn</dt><dd className="font-ui text-ui-strong tabular-nums text-danger-text">-$3.8k</dd></div>
          </dl>
        </Card>

        <Card aria-labelledby="region-title">
          <CardHeader>
            <CardHeading>
              <CardTitle as="h2" titleSize="sm" id="region-title">MRR by region</CardTitle>
              <CardDescription>October 2026, four regions</CardDescription>
            </CardHeading>
          </CardHeader>
          <CardBody>
            <RegionDonut />
            <Alert
              tone="warning" action={<Button tone="secondary" size="xs">Review</Button>}
            >
              <b>12 accounts</b> use under 40% of their seats. Together they carry $8.1k MRR at risk.
            </Alert>
          </CardBody>
        </Card>
      </div>

      <section aria-label="Accounts" className="grid gap-3">
        <SectionHeader
          size="sm" title="Accounts and projects"
          description="Seat use, plan and billing for every workspace. Sorted by MRR by default."
        />
        {sorted.length > 0 ? (
          <Table
            columns={columns} rows={pageRows} renderCell={renderCell} rowActions={rowActions}
            rowLabel={r => String(r.name ?? r.id)}
            selectable selectedKeys={selected} onSelectedKeysChange={setSelected}
            sort={sort} onSortChange={setSort}
            summary={`${selected.length} of ${sorted.length} selected`}
            page={current} pageCount={pageCount} onPageChange={setPage} pagerLabel="Account pages"
            toolbar={
              <>
                <span className="text-ui-sm tabular-nums text-text-tertiary">{sorted.length} accounts</span>
                {selected.length > 0 && <Badge tone="accent">{selected.length} selected</Badge>}
                <span className="flex-1" />
                <Button tone="secondary" size="sm" iconStart={<Columns3 />}>Columns</Button>
                <Button tone="secondary" size="sm" iconStart={<Download />}>Export</Button>
              </>
            }
          />
        ) : (
          <EmptyState
            icon={<Search />} title="No accounts match these filters"
            description="Try another name, region or owner, or clear the filters to see all 15 accounts."
            actions={<Button tone="secondary" size="sm" onClick={clearAll}>Clear filters</Button>}
          />
        )}
      </section>

      <div className="grid gap-3 min-[1100px]:grid-cols-[minmax(0,1fr)_340px]">
        <Card aria-labelledby="activity-title">
          <CardHeader>
            <CardHeading>
              <CardTitle as="h2" titleSize="sm" id="activity-title">Recent activity</CardTitle>
              <CardDescription>Billing, seats and comments across all accounts</CardDescription>
            </CardHeading>
          </CardHeader>
          <CardBody>
            <Timeline aria-label="Recent activity">
              <TimelineItem marker={<Avatar name="Mina Kang" color="coral" size="md" />} time="12 minutes ago" dateTime="2026-10-24T09:12:00Z">
                <S>Mina Kang</S> upgraded <S>Ferris Logistics</S> to 260 seats
              </TimelineItem>
              <TimelineItem icon={<RefreshCw />} time="2 hours ago" dateTime="2026-10-24T07:40:00Z">
                Stripe sync failed for <S>3 invoices</S> on <S>Moss Bank</S> and <S>Harbor Labs</S>
              </TimelineItem>
              <TimelineItem marker={<Avatar name="Jun Seo" color="iris" size="md" />} quote="Customer asked for net-45 terms. Finance sign-off needed before Friday." time="3 hours ago" dateTime="2026-10-24T06:30:00Z">
                <S>Jun Seo</S> commented on the <S>Harbor Labs</S> renewal
              </TimelineItem>
              <TimelineItem marker={<Avatar kind="agent" name="Fieldnote Agent" size="md" />} time="Yesterday, 17:05" dateTime="2026-10-23T17:05:00Z">
                <S>Fieldnote Agent</S> drafted a win-back offer for <S>Atlas Robotics</S>
              </TimelineItem>
              <TimelineItem icon={<UserPlus />} time="Yesterday, 16:40" dateTime="2026-10-23T16:40:00Z">
                <S>Dahee Han</S> added 6 seats to <S>Brightline Co-op</S>
              </TimelineItem>
              <TimelineItem icon={<CreditCard />} time="Oct 22" dateTime="2026-10-22T10:18:00Z">
                Card on file updated for <S>Orbit Pay</S>
              </TimelineItem>
            </Timeline>
          </CardBody>
          <CardFooter footer="divided">
            <Pagination layout="compact" total={84} pageSize={6} itemLabel="events" aria-label="Activity pages" />
          </CardFooter>
        </Card>

        <Card aria-busy="true" aria-labelledby="forecast-title">
          <CardHeader>
            <CardHeading>
              <CardTitle as="h2" titleSize="sm" id="forecast-title">Q4 revenue forecast</CardTitle>
              <CardDescription>Recalculating with October invoices</CardDescription>
            </CardHeading>
            <CardTrailing>
              <Badge tone="accent" icon={<Sparkles />}>Updating</Badge>
            </CardTrailing>
          </CardHeader>
          <CardBody className="flex-1">
            <div className="grid gap-2.5">
              <Skeleton width={132} height={28} />
              <Skeleton width="62%" height={10} />
            </div>
            <div className="flex min-h-36 flex-1 items-end gap-2 pt-2">
              {[48, 62, 56, 72, 66, 84, 78, 96].map((h, i) => (
                <div key={i} className="flex-1">
                  <Skeleton height={h} radius="lg" />
                </div>
              ))}
            </div>
          </CardBody>
          <CardFooter footer="divided">
            <CardMeta>Last run 09:24 UTC</CardMeta>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
