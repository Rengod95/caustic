// Preview scenarios for the builder. Caustic's own domain (design-system and agent tooling), built from real components,
// so every semantic token the builder drives shows up somewhere: fills, soft tints, text, rims, rings, charts and diffs.
import { useState, type ReactNode } from 'react';
import {
  Bell, Blocks, Bot, Boxes, FileCode, FlaskConical, FolderGit2, KeyRound, Package, Pencil, Search, Send, ShieldCheck, Trash2, Users, WandSparkles,
} from 'lucide-react';
import {
  ActivityTree, type ActivityNode, AgentRequest, AgentRequestProse, AgentRequestSummary, Alert, Avatar, Badge, Button, CardStat, Checkbox, Chip,
  CodeDiff, CodeDiffLine, CodeDiffToken as T, Combobox, type ComboboxOptionData, Composer, DatePicker, EmptyState, Field, FormLayout, FormLayoutFooter,
  FormLayoutSection, IconButton, Input, Kbd, ListDescription, ListDescriptionRow, ListNavigation, ListNavigationGroup, ListNavigationItem,
  Message, MessageCode, NumberField, Plan, type PlanStep, Progress, RadioGroup, RadioGroupItem, SectionHeader,
  SegmentedControl, SegmentedControlItem, Select, SelectOption, Skeleton, Slider, Switch, Table, type TableColumn, type TableRow,
  Tabs, TabsContent, TabsList, TabsTrigger, Textarea, Thinking, Timeline, TimelineItem, Toast, ToggleGroup, ToggleGroupItem, ToolCall,
} from '@caustic/react';

const noop = () => {};

/** A titled block in the preview column. Flat: a hairline and a heading, no card around cards. */
export function Scenario({ id, title, note, children }: { id: string; title: string; note: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="@container grid min-w-0 gap-4 border-t border-border-default pt-5 first:border-t-0 first:pt-0">
      <header className="grid gap-0.5">
        <h2 id={`${id}-h`} className="m-0 font-ui text-title-4 text-text-primary">{title}</h2>
        <p className="m-0 text-ui-sm text-text-tertiary">{note}</p>
      </header>
      {children}
    </section>
  );
}

// ---------- 1. complex form: publish a token release ----------

const THEMES: ComboboxOptionData[] = [
  { value: 'signal-deep', label: 'Signal Grey · Deep Black', meta: 'theme', leading: <Badge mono size="sm" radius="full" swatch="var(--cs-color-accent-solid)" /> },
  { value: 'signal', label: 'Signal Grey', meta: 'theme', leading: <Badge mono size="sm" radius="full" swatch="var(--cs-color-ink-solid)" /> },
  { value: 'current', label: 'Current (shipped)', meta: 'theme', leading: <Badge mono size="sm" radius="full" swatch="var(--cs-color-info-solid)" /> },
];

export function PublishForm() {
  const [scope, setScope] = useState({ color: true, type: true, space: false, motion: false });
  const all = Object.values(scope);
  const allState = all.every(Boolean) ? true : all.some(Boolean) ? 'indeterminate' : false;
  return (
    <div className="grid gap-4">
      <Alert tone="danger" action={<Button tone="secondary" size="xs">Go to first</Button>}>
        <b>2 fields need attention before publishing.</b> Version 0.4.0 already exists, and the rollout note is empty.
      </Alert>
      <FormLayout title="Publish token release" description="Builds @caustic/tokens from this theme and opens a release for review." onSubmit={e => e.preventDefault()}>
        <FormLayoutSection title="Release" description="Name and version shown in the changelog and on npm.">
          <div className="grid gap-4 @min-[40rem]:grid-cols-2">
            <Field label="Release name" required hint="Shown as the changelog heading.">
              <Input defaultValue="Signal Grey, deeper ink" />
            </Field>
            <Field label="Version" required error="0.4.0 is already published. Use 0.4.1 or higher.">
              <Input addons prefix="v" defaultValue="0.4.0" invalid />
            </Field>
            <Field label="Package" hint="Read only: set by the workspace.">
              <Input readOnly value="@caustic/tokens" />
            </Field>
            <Field label="Registry" disabled hint="Only owners change the registry.">
              <Select aria-label="Registry" value="npm" disabled onValueChange={noop}>
                <SelectOption value="npm">npm · public</SelectOption>
              </Select>
            </Field>
          </div>
        </FormLayoutSection>
        <FormLayoutSection title="Scope" description="What the release rebuilds. Unchecked groups keep their last published values.">
          <div className="grid gap-4 @min-[40rem]:grid-cols-2">
            <Field label="Base theme" hint="Type to search themes in this workspace.">
              <Combobox aria-label="Base theme" options={THEMES} defaultValue="signal-deep" defaultInputValue="Signal Grey · Deep Black" resultsLabel={n => `${n} themes`} />
            </Field>
            <Field label="Output">
              <ToggleGroup type="single" appearance="outline" aria-label="Output" defaultValue="css">
                <ToggleGroupItem value="css" className="w-auto px-3">CSS</ToggleGroupItem>
                <ToggleGroupItem value="json" className="w-auto px-3">JSON</ToggleGroupItem>
                <ToggleGroupItem value="tw" className="w-auto px-3">Tailwind</ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <Field group label="Token groups" required>
              <div className="grid gap-2">
                <label className="flex items-center gap-2.5 text-ui text-text-primary">
                  <Checkbox aria-label="All groups" checked={allState} onCheckedChange={v => { const on = v === true; setScope({ color: on, type: on, space: on, motion: on }); }} />
                  All groups
                </label>
                {(['color', 'type', 'space', 'motion'] as const).map(k => (
                  <label key={k} className="flex items-center gap-2.5 pl-6 text-ui text-text-primary">
                    <Checkbox aria-label={k} checked={scope[k]} onCheckedChange={v => setScope(s => ({ ...s, [k]: v === true }))} />
                    <span className="capitalize">{k}</span>
                  </label>
                ))}
              </div>
            </Field>
            <Field group label="Version bump">
              <RadioGroup aria-label="Version bump" defaultValue="minor" className="gap-2.5">
                <RadioGroupItem value="patch">Patch · values only</RadioGroupItem>
                <RadioGroupItem value="minor">Minor · new tokens</RadioGroupItem>
                <RadioGroupItem value="major" disabled>Major · renames (needs owner)</RadioGroupItem>
              </RadioGroup>
            </Field>
            <Field label="Modes">
              <SegmentedControl aria-label="Modes" defaultValue="both">
                <SegmentedControlItem value="light">Light</SegmentedControlItem>
                <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
                <SegmentedControlItem value="both">Both</SegmentedControlItem>
              </SegmentedControl>
            </Field>
            <Field label="Contrast floor" hint="Text pairs below this ratio block the release.">
              <NumberField aria-label="Contrast floor" label="AA" defaultValue={4.5} step={0.1} min={3} max={7} unit=":1" />
            </Field>
          </div>
        </FormLayoutSection>
        <FormLayoutSection title="Rollout" description="Who gets the release, and when.">
          <div className="grid gap-4 @min-[40rem]:grid-cols-2">
            <Field label="Release window">
              <DatePicker today="2026-10-25" defaultValue={{ from: '2026-10-27', to: '2026-10-31' }} />
            </Field>
            <Slider label="Canary share" field unit="%" defaultValue={25} />
            <Field label="Rollout note" required error="Write one line for the changelog." count="0 / 200">
              <Textarea rows={3} invalid placeholder="What changed, in one line" />
            </Field>
            <div className="grid content-start gap-3">
              <label className="flex items-center justify-between gap-3 text-ui text-text-primary">Notify subscribed projects <Switch aria-label="Notify subscribed projects" defaultChecked /></label>
              <label className="flex items-center justify-between gap-3 text-ui text-text-primary">Ask the agent to migrate usages <Switch aria-label="Ask the agent to migrate usages" /></label>
              <label className="flex items-center justify-between gap-3 text-ui text-text-tertiary">Auto-merge (locked by policy) <Switch aria-label="Auto-merge" disabled /></label>
            </div>
          </div>
        </FormLayoutSection>
        <FormLayoutFooter discardLabel="Discard" saveLabel="Publish release" onDiscard={noop} />
      </FormLayout>
    </div>
  );
}

// ---------- 2. agent conversation ----------

const PLAN: PlanStep[] = [
  { id: 'audit', label: 'Audit literal colours in components', status: 'done', detail: '14 found' },
  { id: 'map', label: 'Map literals to semantic tokens', status: 'done', detail: 'tokens.mjs' },
  { id: 'ramp', label: 'Rebuild neutral ramps per mode', status: 'now', detail: 'neutral-light, neutral-dark' },
  { id: 'gate', label: 'Run contrast gate', status: 'todo' },
  { id: 'baseline', label: 'Ask before re-recording baselines', status: 'todo' },
];

const TREE: ActivityNode[] = [
  { id: 's1', kind: 'step', status: 'done', label: 'Audit literal colours', meta: '3.1s' },
  { id: 'c1', kind: 'call', label: 'grep · oklch\\(', meta: '14 matches' },
  { id: 's2', kind: 'step', status: 'active', label: 'Rebuild neutral ramps', meta: 'step 3' },
  { id: 'c2', kind: 'call', running: true, label: 'edit_file · tokens.mjs', meta: 'running' },
  { id: 'c3', kind: 'call', label: 'run · tokens:check', meta: '1 failed' },
];

export function AgentSession() {
  const [decision, setDecision] = useState<string | null>(null);
  return (
    <div className="grid min-w-0 gap-4 @min-[46rem]:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="grid min-w-0 content-start gap-4">
        <Message author="user">Make the dark neutrals a separate ramp, not the light one flipped. Ask before touching baselines.</Message>
        <Thinking label="Thought for 9s" status="done">
          Text roles can share a step number in both modes; only the background ladder differs, so the mapping stays readable.
        </Thinking>
        <Message meta="Caustic agent · 3 tool calls · 41s" onCopy={noop} copyLabel="Copy message" onRetry={noop} retryLabel="Retry">
          <p>Both ramps now start at the background end. I moved the role map into <MessageCode>NEUTRAL_ROLES</MessageCode> so each step is named once.</p>
        </Message>
        <AgentRequest kind="proposal" title="Split neutrals per mode" badge="Plan mode" onAction={noop}>
          <AgentRequestProse>
            <code className="font-mono text-mono">neutral-light-1..11</code> and <code className="font-mono text-mono">neutral-dark-1..11</code>, same role steps in both modes except the background ladder.
          </AgentRequestProse>
          <AgentRequestSummary><Chip size="sm" appearance="soft">22 steps</Chip><Chip size="sm" appearance="soft">3 files</Chip></AgentRequestSummary>
        </AgentRequest>
        <Plan title="Neutral ramps" steps={PLAN} countLabel={(d, t) => `${d} of ${t} done`} statusLabels={{ done: 'Done', now: 'In progress', todo: 'To do' }} />
        <Message streaming meta="Caustic agent · 4 tool calls · 12s">
          <p>Dark step 6 sits at L 0.56 so control borders hold 3:1 on raised surfaces. Running the contrast gate next…</p>
        </Message>
        <ActivityTree nodes={TREE} worker={{ name: 'Worker · neutral-ramps', meta: 'round 2 · 12s' }} />
        <ToolCall name="read_file" detail="packages/tokens/src/tokens.mjs" icon={<FileCode />} duration="0.3s" />
        <ToolCall status="failed" name="run" detail="pnpm tokens:check" icon={<FlaskConical />} failedLabel="1 failed">
          <span className="font-mono text-mono">border-control on raised · 2.9 : 1 (needs 3)</span>
        </ToolCall>
        <ToolCall status="running" name="edit_file" detail="tokens.mjs" icon={<Pencil />} activity="Editing" progress={64} progressLabel={n => `${n} progress`} />
        <CodeDiff aria-label="Changes to tokens.mjs" filename="packages/tokens/src/tokens.mjs" onAccept={noop} onReject={noop}>
          <CodeDiffLine number={41}><T syntax="keyword">const</T> DARK_L = [</CodeDiffLine>
          <CodeDiffLine number={42} kind="remove">{'  '}0.105, 0.175, 0.23, 0.285, 0.40, <T syntax="string">0.54</T>,</CodeDiffLine>
          <CodeDiffLine number={42} kind="add">{'  '}0.09, 0.16, 0.215, 0.27, 0.39, <T syntax="string">0.56</T>,</CodeDiffLine>
          <CodeDiffLine number={43}>{'  '}0.62, 0.67, 0.72, 0.81, 0.97];</CodeDiffLine>
        </CodeDiff>
        {decision === null ? (
          <AgentRequest kind="permission" title="Re-record 12 visual baselines?" subtitle="Neutral steps changed in dark mode. Baselines need your approval." onAction={d => setDecision(d)} />
        ) : (
          <AgentRequest kind="permission" status="allowed" title="Allowed once" subtitle="12 baselines re-recorded · gateway/baselines" />
        )}
        <div className="grid gap-2">
          <Toast inline title="Contrast gate passed" description="96 pairs · lowest 4.53 : 1" />
          <Toast inline tone="agent" title="Agent finished the ramp" description="3 files changed · ready for review" actionLabel="Review" onAction={noop} />
          <Alert tone="info">Toast ships success and agent tones only; info, warning and danger notices use Alert (inline or page layout).</Alert>
          <Alert tone="warning">Dark step 6 is 0.1 above the 3:1 floor on raised. Small moves will fail.</Alert>
          <Alert tone="danger">The gate blocked one pair. Publishing waits until it passes.</Alert>
        </div>
        <Composer
          inputLabel="Message the agent" sendLabel="Send" stopLabel="Stop" attachLabel="Add context" modeLabel="Mode"
          usageLabel={p => `Context ${p}%`} placeholder="Reply, or ask for a change…" modes={['Ask', 'Plan', 'Build']}
          defaultMode="Build" modelLabel="Claude Opus" usage={58} running onAttach={noop} onStop={noop} onModelClick={noop}
          context={<Chip shape="rounded" appearance="surface" icon={<FileCode />} onRemove={noop} removeLabel="Remove">tokens.mjs</Chip>}
        />
      </div>
      <aside className="grid min-w-0 content-start gap-5" aria-label="Session side panel">
        <div className="grid gap-2">
          <h3 className="m-0 font-ui text-ui-sm font-semibold text-text-primary">Working</h3>
          <div className="flex items-center gap-3">
            <span aria-hidden className="spectrum-fill size-9 rounded-full" />
            <div className="grid min-w-0 flex-1 gap-1.5">
              <Progress aria-label="Agent progress" tone="agent" value={64} />
              <Progress aria-label="Gate progress" value={40} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-ui-sm text-text-secondary"><Progress shape="ring" label="Loading" size="sm" /> Loading baselines…</div>
          <div className="grid gap-2" aria-label="Loading preview">
            <Skeleton height={12} width="70%" />
            <Skeleton height={12} width="90%" />
            <Skeleton height={56} radius="lg" />
          </div>
        </div>
        <div className="grid gap-2">
          <h3 className="m-0 font-ui text-ui-sm font-semibold text-text-primary">Checkpoints</h3>
          <Timeline aria-label="Checkpoints" restore="item" onRestore={noop}>
            <TimelineItem author="agent" selected title="Before ramp split" detail="checkpoint 2 · 3 files" />
            <TimelineItem title="Last green gate" detail="96 pairs" time="14:02" dateTime="2026-10-25T14:02" />
            <TimelineItem title="Token cleanup" detail="design/visual-cleanup" time="Fri" />
          </Timeline>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="agent" dot>Agent</Badge><Badge tone="success" dot>Gate</Badge><Badge tone="warning" dot>Review</Badge><Badge tone="danger" dot>1 blocked</Badge>
        </div>
      </aside>
    </div>
  );
}

// ---------- 3. settings ----------

type Member = { id: string; name: string; email: string; role: string; status: 'active' | 'invited' | 'agent' | 'suspended'; color?: 'coral' | 'iris' | 'mint' | 'amber' | 'slate' };
const MEMBERS: Member[] = [
  { id: 'mk', name: 'Mina Kang', email: 'Owner · tokens', role: 'Owner', status: 'active', color: 'coral' },
  { id: 'js', name: 'Jun Seo', email: 'Maintainer · components', role: 'Maintainer', status: 'active', color: 'iris' },
  { id: 'to', name: 'Tomás Ortega', email: 'Contributor', role: 'Contributor', status: 'invited', color: 'mint' },
  { id: 'pr', name: 'Priya Raman', email: 'Reviewer', role: 'Reviewer', status: 'suspended', color: 'amber' },
  { id: 'ag', name: 'Caustic agent', email: 'Agent · Claude Opus', role: 'Contributor', status: 'agent' },
];
const MEMBER_COLS: TableColumn[] = [{ key: 'member', header: 'Member' }, { key: 'role', header: 'Role' }, { key: 'status', header: 'Status' }];

export function LibrarySettings() {
  const rows: TableRow[] = MEMBERS.map(m => ({ id: m.id, member: m.name, role: m.role, status: m.status }));
  const byId = new Map(MEMBERS.map(m => [m.id, m]));
  return (
    <div className="grid min-w-0 gap-6 @min-[60rem]:grid-cols-[12rem_minmax(0,1fr)]">
      <div className="self-start"><ListNavigation aria-label="Library settings">
        <ListNavigationGroup>
          <ListNavigationItem icon={<Package />}>General</ListNavigationItem>
          <ListNavigationItem icon={<Users />} current count={5}>Members</ListNavigationItem>
          <ListNavigationItem icon={<Bot />}>Agent</ListNavigationItem>
          <ListNavigationItem icon={<ShieldCheck />} count={2}>Policies</ListNavigationItem>
          <ListNavigationItem icon={<KeyRound />}>Tokens API</ListNavigationItem>
          <ListNavigationItem icon={<Bell />}>Notifications</ListNavigationItem>
        </ListNavigationGroup>
      </ListNavigation></div>
      <div className="grid min-w-0 gap-6">
        <Alert layout="page" tone="warning" action={<Button tone="secondary" size="xs">Review</Button>}>2 policy findings block the next release.</Alert>
        <Tabs defaultValue="members">
          <TabsList aria-label="Members">
            <TabsTrigger value="members" count="5">Members</TabsTrigger>
            <TabsTrigger value="invites" count="1">Invites</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="audit" disabled>Audit log</TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="pt-3">
            <Table
              aria-label="Library members" columns={MEMBER_COLS} rows={rows} selectable defaultSelectedKeys={['js']}
              renderCell={(row, col) => {
                const m = byId.get(row.id)!;
                if (col.key === 'member') return (
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar name={m.name} kind={m.status === 'agent' ? 'agent' : 'person'} color={m.color} size="sm" presence={m.status === 'active'} />
                    <div className="min-w-0"><b className="block truncate font-medium">{m.name}</b><span className="block truncate text-ui-sm font-normal text-text-tertiary">{m.email}</span></div>
                  </div>
                );
                if (col.key === 'status') {
                  if (m.status === 'invited') return <Badge tone="info" dot>Invited</Badge>;
                  if (m.status === 'agent') return <Badge tone="agent" dot>Working</Badge>;
                  if (m.status === 'suspended') return <Badge tone="neutral" dot>Suspended</Badge>;
                  return <Badge tone="success" dot>Active</Badge>;
                }
                return String(row[col.key] ?? '');
              }}
            />
          </TabsContent>
          <TabsContent value="invites" className="pt-3" />
          <TabsContent value="webhooks" className="pt-3" />
        </Tabs>
        <div className="grid gap-6 @min-[40rem]:grid-cols-2">
          <section className="grid content-start gap-3">
            <SectionHeader title="Agent usage" description="This cycle, across every project using the library." />
            <Meter label="Agent runs" value={812} max={1000} />
            <Meter label="Contrast gate minutes" value={286} max={300} warn />
            <Meter label="Storage for baselines" value={1.2} max={5} unit=" GB" />
            <ListDescription aria-label="Library details">
              <ListDescriptionRow term="Package">@caustic/tokens</ListDescriptionRow>
              <ListDescriptionRow term="Token API key" mono copyValue="cst_live_••••">cst_live_••••4f2a</ListDescriptionRow>
              <ListDescriptionRow term="Default model">Claude Opus</ListDescriptionRow>
            </ListDescription>
          </section>
          <section className="grid content-start gap-3">
            <SectionHeader title="Notifications" />
            <SwitchRow title="Gate failures" description="Email maintainers when a release is blocked." on />
            <SwitchRow title="Agent finished" description="Post to the library channel when a run ends." on />
            <SwitchRow title="Weekly token digest" description="New, renamed and removed tokens." />
            <EmptyState icon={<Blocks />} title="No webhooks yet" description="Send release events to CI or your chat." actions={<Button tone="secondary" size="sm">Add webhook</Button>} />
          </section>
        </div>
        <section className="grid gap-3 rounded-lg p-4 shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]">
          <SectionHeader title={<span className="text-danger-text">Danger zone</span>} description="These actions cannot be undone." />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="m-0 text-ui text-text-secondary">Unpublish every release of <b className="text-text-primary">@caustic/tokens</b>.</p>
            <div className="flex gap-2"><Button tone="danger" size="sm">Archive library</Button><Button tone="destructive" size="sm" iconStart={<Trash2 />}>Delete library</Button></div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Meter({ label, value, max, unit = '', warn = false }: { label: string; value: number; max: number; unit?: string; warn?: boolean }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-ui">
        <span className="text-text-secondary">{label}</span>
        <span className="flex items-center gap-2 tabular-nums text-text-primary">{value}{unit} of {max}{unit}{warn && <Badge tone="warning">95%</Badge>}</span>
      </div>
      <Progress aria-label={label} value={Math.round((value / max) * 100)} />
    </div>
  );
}

function SwitchRow({ title, description, on = false }: { title: string; description: string; on?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1"><b className="block text-ui-strong text-text-primary">{title}</b><span className="block text-ui-sm text-text-tertiary">{description}</span></div>
      <Switch aria-label={title} defaultChecked={on} />
    </div>
  );
}

// ---------- 4. dashboard strip ----------

const SERIES = [
  { name: 'Ink usage', color: 'var(--cs-color-chart-1)', d: [12, 14, 13, 18, 22, 21, 26, 30] },
  { name: 'Info', color: 'var(--cs-color-chart-2)', d: [8, 9, 12, 11, 14, 16, 15, 19] },
  { name: 'Success', color: 'var(--cs-color-chart-3)', d: [5, 7, 6, 9, 8, 12, 14, 13] },
  { name: 'Warning', color: 'var(--cs-color-chart-4)', d: [3, 4, 6, 5, 7, 6, 8, 10] },
  { name: 'Extra 1', color: 'var(--cs-color-chart-5)', d: [10, 8, 9, 7, 9, 11, 10, 12] },
  { name: 'Extra 2', color: 'var(--cs-color-chart-6)', d: [2, 3, 2, 4, 5, 4, 6, 7] },
];

function LineChart() {
  const W = 440, H = 170, max = 32;
  const x = (i: number) => 28 + (i * (W - 40)) / 7;
  const y = (v: number) => H - 20 - (v / max) * (H - 36);
  return (
    <figure className="m-0 grid gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Token usage by role, 8 weeks, six series">
        {[0, 8, 16, 24, 32].map(v => (
          <g key={v}>
            <line x1={28} x2={W - 12} y1={y(v)} y2={y(v)} stroke="var(--cs-color-border-default)" />
            <text x={0} y={y(v) + 4} fontSize={10} className="fill-text-tertiary font-mono">{v}</text>
          </g>
        ))}
        {SERIES.map(s => (
          <polyline key={s.name} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" points={s.d.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
        ))}
        <circle cx={x(7)} cy={y(30)} r={4} fill="var(--cs-color-chart-1)" stroke="var(--cs-color-surface-base)" strokeWidth={2} />
      </svg>
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1">
        {SERIES.map((s, i) => (
          <span key={s.name} className="inline-flex items-center gap-1.5 text-ui-sm text-text-secondary">
            <i aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: s.color }} />{i + 1}. {s.name}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

function Bars() {
  const rows = [
    { k: 'Buttons', v: [40, 22, 18, 10, 6, 4] },
    { k: 'Badges', v: [12, 30, 26, 18, 8, 6] },
    { k: 'Charts', v: [20, 18, 16, 14, 18, 14] },
  ];
  return (
    <div className="grid gap-2.5" role="img" aria-label="Share of each colour role per component family">
      {rows.map(r => (
        <div key={r.k} className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
          <span className="text-ui-sm text-text-secondary">{r.k}</span>
          <div className="flex h-3 overflow-hidden rounded-full">
            {r.v.map((w, i) => <span key={i} style={{ width: `${w}%`, background: SERIES[i]!.color }} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

const RUNS: TableRow[] = [
  { id: 'r1', release: 'tokens 0.4.1', when: '14:20', pairs: '96', status: 'passed' },
  { id: 'r2', release: 'tokens 0.4.0', when: '11:02', pairs: '96', status: 'blocked' },
  { id: 'r3', release: 'react 2.3.0', when: 'Fri', pairs: '412', status: 'review' },
  { id: 'r4', release: 'react 2.2.9', when: 'Thu', pairs: '409', status: 'running' },
];
const RUN_COLS: TableColumn[] = [{ key: 'release', header: 'Release' }, { key: 'when', header: 'Started' }, { key: 'pairs', header: 'Pairs', align: 'end' }, { key: 'status', header: 'Gate' }];

export function GateDashboard() {
  const [sel, setSel] = useState<string[]>(['r2']);
  return (
    <div className="grid min-w-0 gap-5">
      <div className="grid gap-3 @min-[40rem]:grid-cols-4">
        <CardStat label="Gate pass rate" value="94%" delta="3.1%" deltaNote="vs last week" trend={[10, 14, 13, 18, 20, 19, 24, 27]} trendLabel="Pass rate rising" />
        <CardStat label="Agent runs" value="812" unit="of 1,000" delta="64" deltaNote="today" trend={[6, 11, 10, 17, 20, 19, 23, 21]} trendLabel="Runs" />
        <CardStat label="Blocked pairs" value="1" delta="2 fixed" deltaDirection="down" deltaNote="today" />
        <CardStat label="Literal colours" value="0" unit="of 14" delta="14 mapped" deltaDirection="down" deltaNote="this cycle" />
      </div>
      <div className="grid gap-5 @min-[40rem]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <LineChart />
        <div className="grid content-start gap-4">
          <Bars />
          <div className="flex flex-wrap gap-1.5">
            <Chip size="sm" tone="success" dot>passing 38</Chip><Chip size="sm" tone="warning" dot>review 2</Chip><Chip size="sm" tone="danger" dot>blocked 1</Chip><Chip size="sm" tone="info" dot>queued 4</Chip>
          </div>
        </div>
      </div>
      <Table
        aria-label="Gate runs" columns={RUN_COLS} rows={RUNS} selectable selectedKeys={sel} onSelectedKeysChange={setSel}
        renderCell={(row, col) => {
          if (col.key !== 'status') return String(row[col.key] ?? '');
          const s = String(row.status);
          if (s === 'passed') return <Badge tone="success" dot>Passed</Badge>;
          if (s === 'blocked') return <Badge tone="danger" dot>Blocked</Badge>;
          if (s === 'review') return <Badge tone="warning" dot>Review</Badge>;
          return <Badge tone="agent" dot>Running</Badge>;
        }}
      />
    </div>
  );
}

// ---------- 5. state matrix ----------

const BTN_HOVER: Record<string, string> = {
  // the hover each tone has in button.variants.ts, drawn statically
  ink: 'bg-ink-solid-hover', accent: 'bg-accent-solid-hover', secondary: 'bg-control-raised-hover', ghost: 'bg-neutral-hover text-text-primary',
  danger: 'bg-danger-soft-hover', destructive: 'bg-danger-solid-hover', agent: '',
};
const STATES = ['Default', 'Hover', 'Focus', 'Disabled'] as const;

export function StateMatrix() {
  const tones = ['ink', 'accent', 'secondary', 'ghost', 'danger', 'destructive', 'agent'] as const;
  return (
    <div className="grid gap-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Button tones by state. Hover and focus are drawn statically.</caption>
          <thead>
            <tr>
              <th className="pb-2 pr-4 text-caption font-normal uppercase text-text-tertiary">Button</th>
              {STATES.map(s => <th key={s} className="pb-2 pr-4 text-caption font-normal uppercase text-text-tertiary">{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {tones.map(t => (
              <tr key={t} className="border-t border-border-subtle">
                <th className="py-2 pr-4 font-mono text-mono-sm font-normal text-text-secondary">{t}</th>
                <td className="py-2 pr-4"><Button tone={t} size="sm" iconStart={t === 'agent' ? <WandSparkles /> : undefined}>{t === 'agent' ? 'Ask agent' : 'Publish'}</Button></td>
                <td className="py-2 pr-4"><Button tone={t} size="sm" className={BTN_HOVER[t]} iconStart={t === 'agent' ? <WandSparkles /> : undefined}>{t === 'agent' ? 'Ask agent' : 'Publish'}</Button></td>
                <td className="py-2 pr-4"><Button tone={t} size="sm" className="shadow-focus" iconStart={t === 'agent' ? <WandSparkles /> : undefined}>{t === 'agent' ? 'Ask agent' : 'Publish'}</Button></td>
                <td className="py-2 pr-4"><Button tone={t} size="sm" disabled iconStart={t === 'agent' ? <WandSparkles /> : undefined}>{t === 'agent' ? 'Ask agent' : 'Publish'}</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-5 @min-[40rem]:grid-cols-2">
        <div className="grid content-start gap-3">
          <h3 className="m-0 text-caption uppercase text-text-tertiary">Badges and chips</h3>
          <div className="flex flex-wrap gap-1.5">
            {(['neutral', 'accent', 'success', 'warning', 'danger', 'info', 'solid', 'outline', 'agent'] as const).map(t => <Badge key={t} tone={t}>{t}</Badge>)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(['neutral', 'info', 'success', 'warning', 'danger'] as const).map(t => <Chip key={t} size="sm" tone={t} dot>{t}</Chip>)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(['soft', 'outline', 'solid', 'dashed', 'surface'] as const).map(a => <Chip key={a} size="sm" appearance={a}>{a}</Chip>)}
          </div>
          <h3 className="m-0 mt-2 text-caption uppercase text-text-tertiary">Controls</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Switch aria-label="On" defaultChecked /><Switch aria-label="Off" /><Switch aria-label="Disabled on" defaultChecked disabled />
            <Checkbox aria-label="Checked" defaultChecked /><Checkbox aria-label="Mixed" checked="indeterminate" /><Checkbox aria-label="Unchecked" /><Checkbox aria-label="Disabled" disabled />
            <RadioGroup aria-label="Radio" defaultValue="a" className="flex gap-3"><RadioGroupItem value="a">On</RadioGroupItem><RadioGroupItem value="b">Off</RadioGroupItem></RadioGroup>
          </div>
          <div className="grid gap-2 @min-[30rem]:grid-cols-2">
            <Input aria-label="Default" placeholder="Placeholder" prefix={<Search />} />
            <Input aria-label="Read only" readOnly value="Read only" />
            <Input aria-label="Invalid" defaultValue="Invalid" invalid />
            <Input aria-label="Disabled" defaultValue="Disabled" disabled />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {(['coral', 'iris', 'mint', 'amber', 'slate'] as const).map(c => <Avatar key={c} name={c} color={c} size="md" />)}
            <Avatar name="Agent" kind="agent" size="md" />
            <Progress shape="ring" label="Loading" /><Progress shape="ring" label="Loading accent" tone="accent" />
            <span className="flex items-center gap-1 text-ui-sm text-text-tertiary"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
            <IconButton label="Webhooks" size="sm"><FolderGit2 /></IconButton>
            <IconButton label="Library" size="sm" className="shadow-focus"><Boxes /></IconButton>
            <Button tone="ink" size="sm" iconStart={<Send />}>Send</Button>
          </div>
        </div>
        <div className="grid content-start gap-2">
          <h3 className="m-0 text-caption uppercase text-text-tertiary">Notices</h3>
          {(['info', 'warning', 'danger'] as const).map(t => <Alert key={t} tone={t} action={<Button tone="secondary" size="xs">Open</Button>}>Alert · {t}: one line about what happened.</Alert>)}
          {(['info', 'success', 'warning', 'danger'] as const).map(t => <Alert key={t} layout="page" tone={t}>Banner · {t}: page-level status.</Alert>)}
          <Toast inline title="Toast · success" description="Saved 3 tokens" />
          <Toast inline tone="agent" title="Toast · agent" description="Agent is still working" />
          <div className="grid gap-1.5">
            <Progress aria-label="Default" value={62} />
            <Progress aria-label="Agent" tone="agent" value={62} />
          </div>
        </div>
      </div>
    </div>
  );
}
