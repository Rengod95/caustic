// Lab: the open questions of 2026-10-26, shown with live @caustic/react components. Option A is the shipped code; a B that
// differs from it is drawn by re-pointing slots in this page only (OPEN_CSS, scoped to the frame's class), never by
// changing a component. Copy is Korean like the rest of the page; token and slot names stay English.
import type { ReactNode } from 'react';
import { Component, Eye, Frame as FrameIcon, Hand, Image, Layers, Minus, Monitor, MousePointer2, Palette, PenTool, Rows3, Ruler, Smartphone, Square, SquareDashed, Type } from 'lucide-react';
import {
  CardChoice, CardIndicator, CardDescription, CardHeader, CardHeading, CardIcon, CardTitle, Chip, ChoiceGroup, ChoiceGroupItem,
  FloatingBar, FloatingBarGroup, FloatingBarItem, FloatingBarSeparator, FoundationToolbar, LayerTree, LayerTreeItem, ThemeGallery, ThemeGalleryItem,
} from '@caustic/react';
import type { Theme } from '../palette.ts';
import type { BuilderState } from '../builder/state.ts';
import { scope, type Question } from './model.ts';
import { Frame } from './scenes.tsx';

const mono = 'font-mono text-mono-sm';
const c = (s: string) => <code className={mono}>{s}</code>;

/** The selected utility's re-pointed variables, handed back to the parent so a B that drops the inversion reads plain tokens. */
const UNINVERT = [
  '--cs-focus-offset', '--cs-color-text-primary', '--color-text-primary', '--cs-color-text-secondary', '--color-text-secondary',
  '--cs-color-text-tertiary', '--color-text-tertiary', '--color-accent-text', '--color-accent-solid', '--color-accent-on', '--color-border-control',
  '--color-surface-base', '--cs-color-neutral-hover', '--color-neutral-hover', '--cs-color-fill-hover', '--color-fill-hover',
].map(v => `${v}:inherit`).join(';');

const TONES = ['accent', 'info', 'success', 'warning', 'danger'] as const;
const HUED_ON = TONES.map(t => `.oq1-b [data-slot="chip"][data-tone="${t}"][aria-pressed="true"]:not(:disabled)`).join(',');
const THUMB = '.oq4-b [data-slot="floating-bar-item"][data-active="true"]:not(:disabled),.oq4-b [data-slot="foundation-toolbar-domain"][aria-pressed="true"]:not(:disabled)';

/** Page-local overrides for the B options (unlayered, so they win over the component utilities). */
export const OPEN_CSS = [
  // Q1 B: a hued toggle chip that is on inverts like a neutral one (selected utility: ink fill, paper text and check, no edge).
  `${HUED_ON}{background-color:var(--cs-color-selection-fill);color:var(--cs-color-selection-on);box-shadow:none}`,
  `${HUED_ON.replaceAll(':not(:disabled)', ':not(:disabled):hover')}{background-color:var(--cs-color-selection-fill-hover);box-shadow:none}`,
  // Q2 B: every check circle in the selection ink, the glyph in selection.on.
  '.oq2-b [data-slot="theme-gallery-check"],.oq2-b [data-state="checked"] [data-slot="choice-group-indicator"],.oq2-b [data-state="checked"] [data-slot="card-indicator"]{background-color:var(--cs-color-selection-fill);color:var(--cs-color-selection-on)}',
  '.oq2-b [data-state="checked"] [data-slot="choice-group-indicator"]>span,.oq2-b [data-state="checked"] [data-slot="card-indicator"]>span{background-color:var(--cs-color-selection-on)}',
  // Q3 B: a secondary selected row takes the lighter fill, so primary and secondary read apart.
  '.oq3-b [data-slot="layer-tree-row"][data-secondary]{background-color:var(--cs-color-selection-fill-hover)}',
  // Q4 B: the current tool and the chosen domain are a location thumb (segmented control), not a selection.
  `${THUMB}{${UNINVERT};background-color:var(--cs-color-control-raised);color:var(--cs-color-text-primary);box-shadow:inset 0 0 0 1px var(--cs-color-control-edge)}`,
  `${THUMB.replaceAll(':not(:disabled)', ':not(:disabled):hover')}{background-color:var(--cs-color-control-raised-hover)}`,
].join('\n');

/** Light and dark frames of one option, each under the builder's variables for that mode. */
function Pair({ s, cls, children }: { s: BuilderState; cls?: string; children: (t: Theme) => ReactNode }) {
  return (
    <div className="grid gap-2">
      {(['light', 'dark'] as const).map(t => (
        <Frame key={t} label={t === 'light' ? '라이트' : '다크'} className={cls} style={scope(s, t)}>{children(t)}</Frame>
      ))}
    </div>
  );
}

// ---------- scenes ----------

function ChipScene() {
  return (
    <div className="grid gap-2 bg-surface-base p-3">
      {[false, true].map(on => (
        <div key={String(on)} className="flex flex-wrap items-center gap-1.5">
          <span className={`${mono} w-7 text-text-tertiary`}>{on ? 'on' : 'off'}</span>
          {TONES.map(t => <Chip key={t} tone={t} defaultPressed={on}>{t[0]!.toUpperCase() + t.slice(1)}</Chip>)}
          <Chip defaultPressed={on}>Neutral</Chip>
        </div>
      ))}
    </div>
  );
}

const THEMES = [
  { id: 'lagoon', name: 'Lagoon', description: 'Caustic default', preview: { background: '#f7f8fa', surface: '#ffffff', accent: '#0e7f93', ink: '#191c20', muted: '#e1e4e9', radius: '8px' } },
  { id: 'swiss', name: 'Swiss', description: 'International style', preview: { background: '#f2f0eb', surface: '#ffffff', accent: '#e2231a', ink: '#111111', muted: '#dcd8cf', radius: '0px' } },
];

function CheckScene() {
  return (
    <div className="grid gap-3 bg-bg-app p-3">
      <ThemeGallery aria-label="Themes" defaultValue="lagoon" className="grid-cols-2">
        {THEMES.map(t => <ThemeGalleryItem key={t.id} themeId={t.id} name={t.name} description={t.description} preview={t.preview} />)}
      </ThemeGallery>
      <ChoiceGroup type="multiple" aria-label="Export targets" defaultValue={['react']}>
        <ChoiceGroupItem value="react" title="React" description="Components + Tailwind" />
        <ChoiceGroupItem value="tokens" title="Tokens" description="DTCG JSON" />
      </ChoiceGroup>
      <div role="radiogroup" aria-label="Device" className="grid grid-cols-2 gap-2.5">
        <CardChoice checked size="compact">
          <CardHeader headerAlign="center"><CardIcon><Monitor /></CardIcon><CardHeading><CardTitle>Desktop</CardTitle><CardDescription>1440 × 900</CardDescription></CardHeading><CardIndicator /></CardHeader>
        </CardChoice>
        <CardChoice size="compact">
          <CardHeader headerAlign="center"><CardIcon><Smartphone /></CardIcon><CardHeading><CardTitle>Mobile</CardTitle><CardDescription>390 × 844</CardDescription></CardHeading><CardIndicator /></CardHeader>
        </CardChoice>
      </div>
    </div>
  );
}

const treeLabels = { announce: () => '', stateLabels: { hidden: 'hidden', locked: 'locked', agent: 'edited by the agent' } };

function TreeScene() {
  return (
    <div className="bg-surface-base p-2">
      {/* The last id is the primary selection: Price reads selection.on, Starter and Pro selection.on-secondary. */}
      <LayerTree {...treeLabels} aria-label="Layers" defaultValue={['starter', 'pro', 'price']}>
        <LayerTreeItem itemId="frame" depth={0} icon={<FrameIcon />} label="Pricing / Desktop" expandable open />
        <LayerTreeItem itemId="cards" depth={1} icon={<Rows3 />} label="Cards" expandable open caption="auto · 12" />
        <LayerTreeItem itemId="starter" depth={2} icon={<Square />} label="Starter" expandable />
        <LayerTreeItem itemId="pro" depth={2} icon={<Square />} label="Pro" expandable open />
        <LayerTreeItem itemId="button" depth={3} icon={<Component />} label="Button / Primary" tag="Instance" />
        <LayerTreeItem itemId="price" depth={3} icon={<Type />} label="Price" />
        <LayerTreeItem itemId="photo" depth={1} icon={<Image />} label="Background photo" />
      </LayerTree>
    </div>
  );
}

const families = [{ value: 'presentation', label: 'Presentation' }, { value: 'behavioral', label: 'Motion' }];
const domains = [
  { value: 'color', label: 'Color', icon: <Palette /> }, { value: 'spacing', label: 'Spacing', icon: <Ruler /> },
  { value: 'radius', label: 'Radius', icon: <SquareDashed /> }, { value: 'stroke', label: 'Stroke', icon: <Minus /> },
  { value: 'shadow', label: 'Shadow', icon: <Layers /> }, { value: 'opacity', label: 'Opacity', icon: <Eye /> },
];

function ToolScene() {
  return (
    <div className="canvas-grid grid justify-items-center gap-3 p-3">
      <FloatingBar label="Canvas tools" size="md">
        <FloatingBarGroup>
          <FloatingBarItem aria-label="Move V" icon={<MousePointer2 />} shortcut="V" active />
          <FloatingBarItem aria-label="Hand H" icon={<Hand />} shortcut="H" />
        </FloatingBarGroup>
        <FloatingBarSeparator />
        <FloatingBarGroup>
          <FloatingBarItem aria-label="Frame F" icon={<FrameIcon />} shortcut="F" />
          <FloatingBarItem aria-label="Rectangle R" icon={<Square />} shortcut="R" />
          <FloatingBarItem aria-label="Pen P" icon={<PenTool />} shortcut="P" />
        </FloatingBarGroup>
      </FloatingBar>
      <FoundationToolbar
        label="Domain toolbar" familyLabel="Domain family" domainsLabel="Token domain" className="max-w-full"
        families={families} defaultFamily="presentation" domains={domains} defaultDomain="color"
      />
    </div>
  );
}

function TextScene({ lines }: { lines: string[] }) {
  return (
    <div className="grid gap-1 rounded-lg border border-border-default bg-surface-base p-3">
      {lines.map(l => <span key={l} className={`${mono} text-text-secondary`}>{l}</span>)}
    </div>
  );
}

// ---------- questions ----------

export function openQuestions(s: BuilderState): Question[] {
  return [
    {
      id: 'o1', title: '색 있는 토글 칩이 켜졌을 때',
      question: <>뉴트럴 토글 칩은 켜지면 잉크로 반전된다({c('selected')}). accent·info·success·warning·danger 칩도 반전할지, 지금처럼 자기 톤 안에서 켜짐을 보일지 정한다.</>,
      affects: ['Chip (soft · outline · dashed × 색 있는 톤, pressed)', 'soft-pressed · border-strong · graphic 대 selection.fill · selection.on'],
      options: [
        { id: 'A', title: '자기 톤 유지 (지금)', scene: <Pair s={s}>{() => <ChipScene />}</Pair>,
          consequence: <>켜진 칩은 soft-pressed 채움 + 진한 테두리 + 체크. 톤이 남지만 뉴트럴 칩과 켜짐 표시가 두 가지다.</> },
        { id: 'B', title: '잉크로 반전', scene: <Pair s={s} cls="oq1-b">{() => <ChipScene />}</Pair>,
          consequence: <>켜짐 표시가 하나(잉크 반전)로 통일되지만, 켜진 칩에서는 톤 색이 사라진다.</> },
      ],
    },
    {
      id: 'o2', title: '체크 원: accent vs 잉크',
      question: <>theme-gallery, choice-group(card), CardChoice의 체크 원은 지금 {c('accent-solid')}다. 선택 잉크({c('selection.fill')} 바탕, {c('selection.on')} 글리프)로 바꿀지 정한다.</>,
      affects: ['theme-gallery-check, choice-group-indicator, card-indicator', 'accent-solid · accent-on 대 selection.fill · selection.on'],
      whyLabel: '참고.',
      why: <>반전된 카드(choice-group card, CardChoice) 안에서는 {c('selected')}가 accent를 paper로 바꾸므로 지금도 원은 흰색이다. B에서는 그 원이 카드 채움과 같은 잉크가 되어 글리프만 남는다.</>,
      options: [
        { id: 'A', title: 'accent 체크 원 (지금)', scene: <Pair s={s}>{() => <CheckScene />}</Pair>,
          consequence: <>갤러리 체크는 accent(라이트 검정, 다크 흰색). 반전 카드 안에서는 paper 원.</> },
        { id: 'B', title: '잉크 체크 원', scene: <Pair s={s} cls="oq2-b">{() => <CheckScene />}</Pair>,
          consequence: <>모든 선택 표시가 잉크 한 색으로 모인다. 다크 갤러리 체크가 흰색에서 회색 잉크로 조용해진다.</> },
      ],
    },
    {
      id: 'o3', title: '레이어 트리: 1차 선택과 보조 선택',
      question: <>여러 행을 선택하면 마지막 행이 1차 선택이다. 지금은 같은 잉크 채움 위에서 글자 세기({c('selection.on')} 대 {c('selection.on-secondary')})만 다르다.</>,
      affects: ['layer-tree (다중 선택)', 'selection.on-secondary · selection.fill-hover'],
      options: [
        { id: 'A', title: '글자 세기만 (지금)', scene: <Pair s={s}>{() => <TreeScene />}</Pair>,
          consequence: <>선택 행이 모두 같은 채움. 어느 행이 1차인지는 글자 밝기로만 구분된다.</> },
        { id: 'B', title: '보조 선택은 더 밝은 채움', scene: <Pair s={s} cls="oq3-b">{() => <TreeScene />}</Pair>,
          consequence: <>보조 선택이 {c('selection.fill-hover')}로 1차와 갈라진다. 대신 보조 선택 위 hover는 채움이 바뀌지 않는다.</> },
      ],
    },
    {
      id: 'o4', title: '현재 도구·선택된 도메인: 선택 vs 현재 위치',
      question: <>floating-bar의 현재 도구와 foundation-toolbar의 선택된 도메인을 선택(잉크 반전)으로 볼지, segmented control 썸 같은 현재 위치({c('control-raised')} + {c('control-edge')})로 볼지 정한다.</>,
      affects: ['floating-bar (active), foundation-toolbar (domain)', 'selection.fill · selection.on 대 control-raised · control-edge'],
      options: [
        { id: 'A', title: '선택 (잉크 반전, 지금)', scene: <Pair s={s}>{() => <ToolScene />}</Pair>,
          consequence: <>pressed 토글과 같은 반전. 툴바에서 가장 진한 요소가 현재 도구다.</> },
        { id: 'B', title: '현재 위치 (썸)', scene: <Pair s={s} cls="oq4-b">{() => <ToolScene />}</Pair>,
          consequence: <>위의 패밀리 스위치(segmented control)와 같은 썸. 조용해지고, 반전은 실제 선택에만 남는다.</> },
      ],
    },
    {
      id: 'o5', title: 'just verify 메모리',
      question: <>머신 가드는 한 실행을 2.56G로 막는다. 레시피의 게이트는 2샤드(약 3G)로 돌다가 가드에 죽는다.</>,
      affects: ['scripts/guard.sh (WS_GUARD_VERIFY_MAX), justfile verify 레시피'],
      options: [
        { id: 'A', title: '가드 상한 3G', scene: <TextScene lines={['guard cap 2.56G → 3G', 'gate: 2 shards · ≈18 min']} />,
          consequence: <>지금 속도 유지. 다른 검증과 겹치면 머신 메모리 여유가 그만큼 줄어든다.</> },
        { id: 'B', title: '게이트 1샤드', scene: <TextScene lines={['guard cap 2.56G (그대로)', 'gate: 1 shard · ≈35 min']} />,
          consequence: <>가드 안에서 안전하게 돈다. 검증 한 번이 약 18분에서 35분으로 늘어난다.</> },
      ],
    },
  ];
}
