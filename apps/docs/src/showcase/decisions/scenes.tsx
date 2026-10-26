// Mini scenes for the decision cards. Each renders inside a scoped wrapper (see model.ts) and reads only semantic
// variables, slot variables (--lang-*) or values passed in, so the same scene shows each option faithfully.
import type { CSSProperties, ReactNode } from 'react';
import { Bell, Check, Component, Frame as FrameIcon, Package, Square, TriangleAlert, Type, Users } from 'lucide-react';
import {
  Alert, Badge, Button, CanvasArtboard, CanvasGuide, CanvasSelection, Checkbox, Field, Input, InputGroup, Switch, Textarea,
} from '@caustic/react';
import { contrast, css, type LCH } from '../color.ts';
import { surfaceFor, type Palette, type Theme } from '../palettes.ts';
import { rampFor } from '../builder/language.ts';
import { capped, onOf } from './model.ts';

/** The scoped frame every option scene sits in. `color` is set here so text inherits the scoped value. */
export function Frame({ style, label, className = '', children }: { style: CSSProperties; label?: string; className?: string; children: ReactNode }) {
  return (
    <div className="grid min-w-0 content-start gap-1">
      {label && <span className="text-footnote text-text-tertiary">{label}</span>}
      <div style={style} className={`min-w-0 overflow-hidden rounded-lg border border-border-default font-ui text-text-primary ${className}`}>{children}</div>
    </div>
  );
}

const mono = 'font-mono text-mono-sm';

// ---------- Q1 ----------

export function InkScene() {
  return (
    <div className="grid gap-3 bg-surface-base p-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm">Publish</Button>
        <Button size="sm" tone="accent">Build it</Button>
        <Button size="sm" tone="secondary">Cancel</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Switch aria-label="Notify" defaultChecked />
        <Checkbox aria-label="Colour" defaultChecked />
        <Badge tone="solid">New</Badge>
        <Badge tone="accent">Draft</Badge>
        <Button size="sm" tone="secondary" className="shadow-focus">Focused</Button>
      </div>
      <div className={`flex flex-wrap items-center gap-3 text-text-tertiary ${mono}`}>
        <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-xs border border-border-default" style={{ background: 'var(--cs-color-ink-solid)' }} />ink-solid</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-xs border border-border-default" style={{ background: 'var(--cs-color-accent-solid)' }} />accent-solid</span>
      </div>
    </div>
  );
}

// ---------- Q2 ----------

const ROWS = [['Rest', null], ['Hover', 'var(--cs-color-neutral-hover)'], ['Pressed', 'var(--cs-color-neutral-pressed)'], ['Selected', 'var(--cs-color-neutral-selected)']] as const;

function StateList() {
  return (
    <div className="grid gap-0.5">
      {ROWS.map(([name, bg]) => (
        <div key={name} className="flex h-8 items-center gap-2 rounded-md px-2 text-ui-sm" style={{ background: bg ?? 'transparent' }}>
          {name === 'Selected' ? <Check aria-hidden className="size-icon-sm" /> : <Square aria-hidden className="size-icon-sm text-text-tertiary" />}
          <span className="flex-1">Button / Primary</span>
          <span className="text-footnote text-text-tertiary">{name.toLowerCase()}</span>
        </div>
      ))}
    </div>
  );
}

/** Two backgrounds the same list sits on; `readout` says how far hover sits from each. */
export function NeutralScene({ panels }: { panels: { cls: string; name: string; readout: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-px bg-border-default">
      {panels.map(pn => (
        <div key={pn.name} className={`grid content-start gap-2 p-2 ${pn.cls}`}>
          <span className={`${mono} text-text-tertiary`}>on {pn.name}</span>
          <StateList />
          <div className="flex items-center gap-2"><Badge tone="success">Passed</Badge><span className="text-footnote text-text-tertiary">hued soft: opaque</span></div>
          <span className={`${mono} text-text-secondary`}>{pn.readout}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- Q3 ----------

export type SelMode = 'accent' | 'neutral';
type RowState = 'rest' | 'hover' | 'selected' | 'selhover';

const HOVER_OVER = 'linear-gradient(var(--cs-color-neutral-hover), var(--cs-color-neutral-hover))';

function rowStyle(mode: SelMode, st: RowState): CSSProperties {
  if (st === 'rest') return {};
  if (st === 'hover') return { background: 'var(--cs-color-neutral-hover)' };
  const base = mode === 'accent'
    ? { bg: 'var(--lang-accent-5)', hoverBg: `${HOVER_OVER}, var(--lang-accent-5)`, fg: 'var(--lang-accent-11)', edge: 'inset 0 0 0 1px var(--lang-accent-7)' }
    : { bg: 'var(--cs-color-neutral-selected)', hoverBg: 'var(--cs-color-neutral-selected-hover)', fg: 'var(--cs-color-text-primary)', edge: undefined };
  return {
    background: st === 'selhover' ? base.hoverBg : base.bg,
    color: base.fg,
    boxShadow: base.edge,
  };
}

function Row({ mode, st, icon, children, note, indent = 0 }: { mode: SelMode; st: RowState; icon: ReactNode; children: ReactNode; note?: string; indent?: number }) {
  const sel = st === 'selected' || st === 'selhover';
  return (
    <div className="flex h-7 items-center gap-1.5 rounded-md px-1.5 text-ui-sm [&_svg]:size-icon-sm" style={{ ...rowStyle(mode, st), paddingLeft: `${6 + indent * 14}px` }}>
      <span className={sel ? '' : 'text-text-tertiary'}>{icon}</span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {note && <span className="text-mono-micro font-mono text-text-tertiary">{note}</span>}
      {sel && <Check aria-hidden />}
    </div>
  );
}

export function SelectionScene({ mode }: { mode: SelMode }) {
  return (
    <div className="grid gap-3 bg-bg-app p-2.5 min-[600px]:grid-cols-2">
      <div className="grid content-start gap-0.5 rounded-lg border border-border-default bg-surface-raised p-1 shadow-2">
        <span className="px-1.5 pb-0.5 text-footnote text-text-tertiary">Menu · width</span>
        <Row mode={mode} st="rest" icon={<Square />}>Fill container</Row>
        <Row mode={mode} st="selected" icon={<Square />} note="sel">Hug contents</Row>
        <Row mode={mode} st="hover" icon={<Square />} note="hover">Fixed 320</Row>
      </div>
      <div className="grid content-start gap-0.5 rounded-lg border border-border-default bg-surface-base p-1">
        <span className="px-1.5 pb-0.5 text-footnote text-text-tertiary">Layers</span>
        <Row mode={mode} st="rest" icon={<FrameIcon />}>Checkout</Row>
        <Row mode={mode} st="selhover" icon={<Component />} indent={1} note="sel+hover">Header</Row>
        <Row mode={mode} st="rest" icon={<Type />} indent={2}>Title</Row>
      </div>
      <div className="grid content-start gap-0.5 rounded-lg border border-border-default bg-surface-base p-1">
        <span className="px-1.5 pb-0.5 text-footnote text-text-tertiary">Settings nav</span>
        <Row mode={mode} st="rest" icon={<Package />}>General</Row>
        <Row mode={mode} st="selected" icon={<Users />}>Members</Row>
        <Row mode={mode} st="rest" icon={<Bell />}>Notifications</Row>
      </div>
      <div className="grid grid-cols-3 content-start gap-1.5">
        {['Compact', 'Cozy', 'Loose'].map((t, i) => {
          const st: RowState = i === 1 ? 'selected' : 'rest';
          return (
            <div key={t} className="relative grid h-16 place-items-center rounded-md border border-border-default bg-surface-base text-ui-sm" style={rowStyle(mode, st)}>
              {t}
              {st === 'selected' && <Check aria-hidden className="absolute top-1 right-1 size-icon-sm" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Q4 ----------

const dots: CSSProperties = { backgroundImage: 'radial-gradient(var(--cs-color-canvas-dot) 1px, transparent 1px)', backgroundSize: '16px 16px' };

export function CanvasScene() {
  return (
    <div className="grid gap-2.5 bg-surface-base p-2.5">
      <div className="relative h-52 overflow-hidden rounded-md bg-bg-canvas" style={dots}>
        <CanvasArtboard rect={{ left: 24, top: 26, width: 250, height: 150 }}>
          <div className="absolute top-4 left-4 h-6 w-28 rounded-xs bg-[oklch(0.9_0_0)]" />
          <div className="absolute top-14 left-4 h-12 w-36 rounded-sm bg-[oklch(0.82_0.04_250)]" />
          <div className="absolute top-14 left-44 h-12 w-16 rounded-sm bg-[oklch(0.86_0.05_150)]" />
        </CanvasArtboard>
        <CanvasSelection handles="corners" label="144 × 48" rect={{ left: 40, top: 82, width: 144, height: 48 }} />
        <CanvasGuide kind="smart" orientation="horizontal" rect={{ left: 24, top: 82, width: 300 }} />
        <CanvasGuide kind="measure" orientation="horizontal" rect={{ left: 184, top: 106, width: 24 }}>24</CanvasGuide>
        <CanvasGuide kind="user" orientation="vertical" rect={{ left: 300, top: 0, height: 208 }} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="danger" dot>2 errors</Badge>
        <Badge tone="info" dot>User guide</Badge>
      </div>
      <Alert tone="danger">Header overflows the artboard by 12 px.</Alert>
    </div>
  );
}

// ---------- Q5 ----------

function Tag({ children }: { children: ReactNode }) {
  return <span className="justify-self-start rounded-xs bg-media-scrim px-1 font-mono text-mono-micro text-media-on">{children}</span>;
}

export function DarkShellScene({ tags }: { tags: Record<string, string> }) {
  return (
    <div className="grid h-80 grid-cols-[6.5rem_minmax(0,1fr)_9rem] bg-bg-app text-ui-sm">
      <aside className="grid content-start gap-0.5 p-1.5">
        <Tag>{tags.app}</Tag>
        {['Pages', 'Layers', 'Assets', 'Tokens'].map((n, i) => (
          <span key={n} className={`rounded-md px-2 py-1 ${i === 1 ? 'bg-control-raised text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)]' : 'text-text-secondary'}`}>{n}</span>
        ))}
      </aside>
      <main className="relative bg-bg-canvas" style={dots}>
        <span className="absolute top-1.5 left-1.5"><Tag>{tags.canvas}</Tag></span>
        <CanvasArtboard rect={{ left: 18, top: 30, width: 150, height: 110 }} />
        <div className="absolute right-3 bottom-3 left-3 grid gap-1.5 rounded-lg border border-border-default bg-surface-base p-2 shadow-2">
          <div className="flex items-center justify-between"><b className="text-ui-strong">Release 0.4.1</b><Tag>{tags.surface}</Tag></div>
          <div className="flex items-center gap-1.5"><Badge tone="success" dot>Passed</Badge><Badge tone="warning" dot>Review</Badge><span className="flex-1" /><Button size="xs">Publish</Button></div>
        </div>
        <div className="absolute top-8 right-3 grid w-36 gap-0.5 rounded-lg border border-border-default bg-surface-raised p-1 shadow-3">
          <div className="flex justify-end"><Tag>{tags.raised}</Tag></div>
          {['Rename', 'Duplicate', 'Delete'].map((n, i) => <span key={n} className={`rounded-md px-2 py-1 ${i === 0 ? 'bg-neutral-hover' : ''} ${i === 2 ? 'text-danger-text' : ''}`}>{n}</span>)}
        </div>
      </main>
      <aside className="grid content-start gap-2 border-l border-border-default bg-surface-base p-2">
        <Tag>{tags.surface}</Tag>
        <span className="text-footnote text-text-tertiary">Inspector</span>
        <Input size="sm" aria-label="Width" defaultValue="320" />
        <Input size="sm" aria-label="Height" defaultValue="Hug" />
        <Button size="xs" tone="secondary">Detach</Button>
      </aside>
    </div>
  );
}

// ---------- Q6 ----------

export function RequiredScene() {
  return (
    <div className="grid gap-3 bg-surface-base p-3 min-[600px]:grid-cols-2">
      <Field label="Release name" required><Input defaultValue="Signal Grey, deeper ink" /></Field>
      <Field label="Version" required error="0.4.0 is already published."><InputGroup start="v" defaultValue="0.4.0" invalid /></Field>
      <Field label="Rollout note" required><Textarea rows={2} placeholder="One line for the changelog" /></Field>
      <Field label="Reviewer" optional optionalLabel="Optional"><Input placeholder="@handle" /></Field>
    </div>
  );
}

// ---------- Q7 ----------

export interface LightSample { name: string; pick: LCH }

function Mini({ solid, line }: { solid: string; line: string }) {
  const h = [10, 16, 12, 20, 14, 22];
  return (
    <svg aria-hidden width="84" height="28" viewBox="0 0 84 28" className="shrink-0">
      {h.map((v, i) => <rect key={i} x={i * 14 + 2} y={28 - v} width="10" height={v} rx="2" fill={solid} />)}
      <polyline points={h.map((v, i) => `${i * 14 + 7},${26 - v}`).join(' ')} fill="none" stroke={line} strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function LightSolidScene({ samples, cap, p }: { samples: LightSample[]; cap: boolean; p: Palette }) {
  const surface = surfaceFor(p, 'light');
  return (
    <div className="grid gap-px bg-border-default">
      {samples.map(sm => {
        const pick = cap ? capped(sm.pick) : sm.pick;
        const r = rampFor(pick, p, 'light');
        const [g8, s9, soft3, t11] = [r[7]!, r[8]!, r[2]!, r[10]!];
        const on = onOf(s9, p);
        return (
          <div key={sm.name} className="grid gap-1.5 bg-surface-base p-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <span className="text-ui-strong">{sm.name}</span>
              <span className={`${mono} text-text-tertiary`}>9 L{s9[0].toFixed(2).slice(1)} · 8 L{g8[0].toFixed(2).slice(1)}{cap && sm.pick[0] > 0.7 ? ` · capped from L${sm.pick[0].toFixed(2).slice(1)}` : ''}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex h-7 items-center rounded-md px-2.5 text-ui-sm font-medium" style={{ background: css(s9), color: css(on) }}>Review</span>
              <span className="inline-flex h-5 items-center rounded-full px-2 text-hint font-medium" style={{ background: css(soft3), color: css(t11) }}>Needs review</span>
              <TriangleAlert aria-label="icon in step 8" className="size-icon-md" style={{ color: css(g8) }} />
              <Mini solid={css(s9)} line={css(g8)} />
              <span className="text-ui-sm" style={{ color: css(t11) }}>4 findings</span>
            </div>
            <span className={`${mono} text-text-tertiary`}>
              graphic 8 vs surface {contrast(g8, surface).toFixed(1)} · label on solid {contrast(on, s9).toFixed(1)} · text 11 {contrast(t11, surface).toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
