// Lab: temporary decision page for the colour language (PROPOSAL-color-language.md §8). Nothing here ships;
// the page is removed once the owner has decided. Copy is Korean because the owner reads Korean; token names stay English.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Copy, FlaskConical } from 'lucide-react';
import { Badge, Button, SegmentedControl, SegmentedControlItem } from '@caustic/react';
import { contrast, gamutMap } from '../color.ts';
import { neutralsFor, roleStepOf, surfaceFor, type Theme } from '../palette.ts';
import { toPalette, valueOf, type BuilderState } from '../builder/state.ts';
import {
  dangerGuide, decisionBase, GUIDE_OWN, huedAccent, ladder, mergeInk, onOf, opaqueNeutral, OPAQUE_STEPS, ownGuide, roleL, scope, stepL, withDark,
  type Option, type Question,
} from './model.ts';
import { OPEN_CSS, openQuestions } from './open-questions.tsx';
import { CanvasScene, DarkShellScene, Frame, InkScene, LightSolidScene, NeutralScene, RequiredScene, SelectionScene } from './scenes.tsx';

const STORE = 'caustic-lab-decisions';
type Choices = Partial<Record<string, string>>;
function loadChoices(): Choices {
  try { const raw = window.localStorage.getItem(STORE); if (raw) return JSON.parse(raw) as Choices; } catch { /* storage unavailable */ }
  return {};
}
function saveChoices(c: Choices) {
  try { window.localStorage.setItem(STORE, JSON.stringify(c)); } catch { /* ignore */ }
}

const f1 = (n: number) => n.toFixed(1);
const f2 = (n: number) => n.toFixed(2).replace(/^0/, '');
const mono = 'font-mono text-mono-sm';

/** Light and dark frames side by side for questions that differ per mode. */
function Both({ s, extra, children }: { s: BuilderState; extra?: (t: Theme) => Record<string, string>; children: (t: Theme) => ReactNode }) {
  return (
    <div className="grid gap-2">
      {(['light', 'dark'] as const).map(t => (
        <Frame key={t} label={t === 'light' ? '라이트' : '다크'} style={scope(s, t, extra?.(t))}>{children(t)}</Frame>
      ))}
    </div>
  );
}

function useQuestions(s: BuilderState): Question[] {
  return useMemo(() => {
    const p = toPalette(s);
    const sD = surfaceFor(p, 'dark');
    const inkD = neutralsFor(p, 'dark')[roleStepOf(p, 'dark', 'ink button') - 1]!;
    const accD = gamutMap(valueOf(s.colors.accent, 'dark'));
    const accL = gamutMap(valueOf(s.colors.accent, 'light'));
    const inkL = neutralsFor(p, 'light')[roleStepOf(p, 'light', 'ink button') - 1]!;

    // Q2 readouts: how far an opaque hover sits from the background it lands on
    const o = OPAQUE_STEPS;
    const dl = (t: Theme, role: string, k: number) => Math.abs(stepL(p, t, k) - roleL(p, t, role));
    const read = (t: Theme, role: string) => {
      const d = dl(t, role, o[t].hover);
      return `hover step ${o[t].hover} · ΔL ${f2(d)}${d < 0.005 ? ' · 안 보임' : ''}`;
    };
    const lightPanels = (opaque: boolean) => [
      { cls: 'bg-surface-base', name: 'surface', readout: opaque ? read('light', 'surface base') : 'alpha · 바탕 따라 같은 차이' },
      { cls: 'bg-bg-app', name: 'app', readout: opaque ? read('light', 'bg app') : 'alpha · 바탕 따라 같은 차이' },
    ];
    const darkPanels = (opaque: boolean) => [
      { cls: 'bg-surface-base', name: 'surface', readout: opaque ? read('dark', 'surface base') : 'alpha · 바탕 따라 같은 차이' },
      { cls: 'bg-surface-raised', name: 'raised', readout: opaque ? read('dark', 'surface raised') : 'alpha · 바탕 따라 같은 차이' },
    ];

    // Q4
    const dangerL = gamutMap(valueOf(s.colors.danger, 'light'));
    const ownL = gamutMap(GUIDE_OWN.light);

    // Q5: the role links stay; three versions of the neutral-dark ramp
    const q5 = (['previous', 'subtle', 'more'] as const).map(k => {
      const st = withDark(s, k);
      const pp = toPalette(st);
      const l = ladder(st);
      const lch = (role: string) => neutralsFor(pp, 'dark')[roleStepOf(pp, 'dark', role) - 1]!;
      const placeholder = Math.min(...(['surface base', 'surface raised', 'bg app'] as const).map(r => contrast(lch('text placeholder'), lch(r))));
      const border = contrast(lch('control off · border control · text disabled'), lch('surface raised'));
      return { k, st, l, placeholder, border };
    });
    const tagsOf = (l: ReturnType<typeof ladder>) => Object.fromEntries(l.map(x => [x.name, `${x.name} ${x.step} · ${f2(x.L)}`]));
    const ladderText = (l: ReturnType<typeof ladder>) => l.map(x => `${x.name} ${f2(x.L)}`).join(' / ');
    const q5Option = (i: number, title: string, recommended?: boolean): Option => {
      const x = q5[i]!;
      return {
        id: x.k, title, recommended,
        scene: <Frame label="다크" style={scope(x.st, 'dark')}><DarkShellScene tags={tagsOf(x.l)} /></Frame>,
        consequence: <>{ladderText(x.l)}. 플레이스홀더 최저 대비 {f1(x.placeholder)}, 컨트롤 테두리(raised 위) {f2(x.border)}.</>,
      };
    };

    // Q6
    const sL = surfaceFor(p, 'light');
    const tert = neutralsFor(p, 'light')[roleStepOf(p, 'light', 'text tertiary') - 1]!;

    // Q7
    const warnL = valueOf(s.colors.warning, 'light');
    const agentL = valueOf(s.colors.agent1, 'light');
    const samples = [
      { name: `Warning · 지금 값 L${f2(warnL[0])}`, pick: warnL },
      { name: `Agent gradient 1 · 지금 값 L${f2(agentL[0])}`, pick: agentL },
      { name: '예시 노랑 · L .85', pick: [0.85, 0.15, 95] as const },
    ];

    const style = (t: Theme, extra?: Record<string, string>) => scope(s, t, extra);

    return [
      {
        id: 'q1', title: 'ink와 accent를 합칠까',
        question: <>Signal Grey에서는 accent가 곧 잉크다. 기본 버튼과 배지가 쓰는 <code className={mono}>ink-*</code>를 <code className={mono}>accent-*</code>에 합칠지 정한다.</>,
        affects: ['Button tone=ink(기본 톤), Badge solid, Chip pressed, model-menu 마크', 'ink-solid · ink-hover · ink-on · ink-on-muted (+ kbd)', 'accent: 체크·스위치·선택·포커스 링·Build 버튼'],
        why: <>라이트에서는 두 값이 거의 같다(잉크 L{f2(inkL[0])}, 액센트 L{f2(accL[0])}). 갈리는 곳은 다크다. 합치면 화면의 모든 기본 버튼이 다크에서 가장 밝은 요소가 되어 강조 예산을 넘는다.</>,
        options: [
          { id: 'A', title: '따로 둔다 (지금)', recommended: true, scene: <Both s={s}>{() => <InkScene />}</Both>,
            consequence: <>다크 기본 버튼은 회색 잉크(L{f2(inkD[0])}, surface 대비 {f1(contrast(inkD, sD))}), 액센트는 흰색(L{f2(accD[0])}). 토큰 5개 유지, 기준 변화 없음.</> },
          { id: 'B', title: 'accent로 합친다', scene: <Both s={s} extra={t => mergeInk(s, t)}>{() => <InkScene />}</Both>,
            consequence: <>토큰 5개 감소. 다크 기본 버튼이 흰색(surface 대비 {f1(contrast(accD, sD))})으로 바뀌어 다크 기준 스크린샷 중 기본 버튼이 있는 세트가 모두 바뀐다.</> },
        ],
      },
      {
        id: 'q2', title: '뉴트럴 hover·pressed·selected는 반투명으로 둘까',
        question: <>색 있는 톤의 soft는 불투명 램프 단계로 바꾼다. 뉴트럴 인터랙션(<code className={mono}>fill-hover / pressed / selected</code>)도 불투명 단계로 바꿀지 정한다.</>,
        affects: ['list, menu, nav, table 행, icon-button, ghost 버튼, 툴바 등 hover가 있는 거의 모든 컴포넌트', 'fill-hover · fill-pressed · fill-selected'],
        why: <>같은 hover가 surface, app, raised 위에 모두 놓인다. 불투명 단계는 바탕이 같은 단계면 사라진다. 반투명은 바탕을 따라가서 어디서나 같은 차이를 낸다.</>,
        options: [
          { id: 'A', title: '뉴트럴은 반투명, 색 있는 soft만 불투명', recommended: true,
            scene: <div className="grid gap-2"><Frame label="라이트" style={style('light')}><NeutralScene panels={lightPanels(false)} /></Frame><Frame label="다크" style={style('dark')}><NeutralScene panels={darkPanels(false)} /></Frame></div>,
            consequence: <>지금 뉴트럴 동작 그대로. 바탕이 바뀌어도 hover가 보인다. 뉴트럴 쪽 기준 변화 없음.</> },
          { id: 'B', title: '모두 불투명 단계',
            scene: <div className="grid gap-2"><Frame label="라이트" style={style('light', opaqueNeutral('light'))}><NeutralScene panels={lightPanels(true)} /></Frame><Frame label="다크" style={style('dark', opaqueNeutral('dark'))}><NeutralScene panels={darkPanels(true)} /></Frame></div>,
            consequence: <>라이트 hover {o.light.hover}·pressed {o.light.pressed}·selected {o.light.selected}, 다크 {o.dark.hover}·{o.dark.pressed}·{o.dark.selected}단계. 바탕 단계와 hover 단계가 겹치는 곳(라이트 app ΔL {f2(dl('light', 'bg app', o.light.hover))}, 다크 raised ΔL {f2(dl('dark', 'surface raised', o.dark.hover))})에서는 바탕별 토큰이 따로 필요하다.</> },
        ],
      },
      {
        id: 'q3', title: '리스트·메뉴의 선택 표시: accent soft vs 뉴트럴',
        question: <>menu, layer-tree, list-navigation, option-tiles의 "선택됨"을 하나로 정한다. 둘 다 체크 표시가 붙는다. 아래 두 번째 줄은 액센트에 색이 생겼을 때(지금 info 색으로 가정)의 모습이다.</>,
        affects: ['menu, model-menu, layer-tree, list-navigation, option-tiles, icon-toggle, pagination, page-list', 'accent-soft · control-raised · fill-pressed · fill-selected (지금 다섯 가지) → 하나'],
        why: <>지금 잉크 액센트에서는 둘 다 회색이라 차이가 테두리 정도다. 액센트에 색이 생기면 A는 모든 선택 행을 색으로 칠해서 기본 버튼, 체크와 강조를 다툰다. 리스트 선택은 위치 표시라 뉴트럴이 맞고, 액센트는 체크·스위치 같은 "켜짐"에 남긴다.</>,
        options: [
          { id: 'A', title: 'accent soft (5 + 테두리 7)',
            scene: <div className="grid gap-2">
              <Frame label="라이트 · 지금 잉크 액센트" style={style('light')}><SelectionScene mode="accent" /></Frame>
              <Frame label="라이트 · 색 있는 액센트라면" style={style('light', huedAccent(s, 'light'))}><SelectionScene mode="accent" /></Frame>
              <Frame label="다크 · 지금 잉크 액센트" style={style('dark')}><SelectionScene mode="accent" /></Frame>
            </div>,
            consequence: <>선택이 테두리로 분명하다. 액센트 색이 바뀌면 모든 리스트·메뉴 선택이 따라 바뀐다. 8개 컴포넌트 기준 변경.</> },
          { id: 'B', title: '뉴트럴 (fill-selected)', recommended: true,
            scene: <div className="grid gap-2">
              <Frame label="라이트 · 지금 잉크 액센트" style={style('light')}><SelectionScene mode="neutral" /></Frame>
              <Frame label="라이트 · 색 있는 액센트라면" style={style('light', huedAccent(s, 'light'))}><SelectionScene mode="neutral" /></Frame>
              <Frame label="다크 · 지금 잉크 액센트" style={style('dark')}><SelectionScene mode="neutral" /></Frame>
            </div>,
            consequence: <>액센트 색과 무관하게 조용하다. 선택은 채움과 체크로만 보이므로 hover와의 차이가 작다(selected+hover 행 참고). 8개 컴포넌트 기준 변경.</> },
        ],
      },
      {
        id: 'q4', title: '캔버스 가이드 색: danger 그대로 vs 전용 색',
        question: <>스마트 가이드와 측정선은 지금 <code className={mono}>canvas-guide = danger solid</code>다. 근처에 실제 오류 배지·알림이 있을 때 가이드가 오류로 읽히는지 본다.</>,
        affects: ['canvas-guide (smart, measure, snap), motion-timeline 플레이헤드', 'canvas-guide · canvas-guide-on'],
        why: <>가이드는 정상 동작인데 오류와 같은 색이면 편집 중 화면 전체가 경고처럼 보인다. 전용 마젠타는 danger(h {Math.round(dangerL[2])})와 색상이 멀고, 사용자 가이드(info)와도 구분된다.</>,
        options: [
          { id: 'A', title: 'danger 색 그대로 (지금)', scene: <Frame style={style('light', dangerGuide(s, 'light'))}><CanvasScene /></Frame>,
            consequence: <>토큰 추가 없음. 가이드 라벨 대비 {f1(contrast(onOf(dangerL, p), dangerL))}. 가이드와 오류 배지가 같은 색.</> },
          { id: 'B', title: '캔버스 전용 마젠타', recommended: true, scene: <Frame style={style('light', ownGuide(s, 'light'))}><CanvasScene /></Frame>,
            consequence: <>canvas 패밀리에 색 1개 추가(라이트 L{f2(ownL[0])} C{f2(ownL[1])} h345). 라벨 대비 {f1(contrast(onOf(ownL, p), ownL))}. canvas-guide, motion-timeline 기준 변경.</> },
        ],
      },
      {
        id: 'q5', title: '다크 neutral 램프 2–11단계를 조금 어둡게',
        question: <>역할 연결(canvas 1, app 2, surface 3, raised 4)은 그대로 두고, neutral-dark 램프의 2–11단계 값만 조금 내린다. 1단계(.09)는 그대로다.</>,
        affects: ['다크의 bg-app · surface-base · surface-raised · 텍스트·테두리 단계 전부', '다크 기준 스크린샷 전부'],
        why: <>소유자 결정(2026-10-25). 층 간격은 .045 이상을 지키고, 텍스트 4.5 · 컨트롤 테두리 3 대비를 모두 통과한다. 기본값은 A bit more(2026-10-25 결정).</>,
        options: [q5Option(0, '이전 램프'), q5Option(1, 'Subtle'), q5Option(2, 'A bit more (결정)', true)],
      },
      {
        id: 'q6', title: '필수 입력 별표: 뉴트럴 vs danger',
        question: <>지금 <code className={mono}>field-required-mark</code>는 <code className={mono}>danger-text</code>다. 오류가 하나 있는 폼에서 별표와 실제 오류가 구분되는지 본다.</>,
        affects: ['field (required), form-layout을 쓰는 모든 폼', 'field.tsx:79 danger-text → text-tertiary'],
        why: <>입력 전부터 빨간 별표가 줄지어 있으면 폼이 오류 상태처럼 보이고, 진짜 오류(Version)가 묻힌다. danger는 오류에만 남긴다.</>,
        options: [
          { id: 'A', title: 'danger 그대로 (지금)', scene: <Frame style={style('light')}><RequiredScene /></Frame>,
            consequence: <>관례에 익숙한 모양. 별표 4개와 오류 1개가 같은 색. 기준 변화 없음.</> },
          { id: 'B', title: '뉴트럴 (text-tertiary)', recommended: true, scene: <Frame className="dq-mark-neutral" style={style('light')}><RequiredScene /></Frame>,
            consequence: <>오류만 색이 남는다. 별표 대비 {f1(contrast(tert, sL))}(surface). field와 폼 예제 기준 변경.</> },
        ],
      },
      {
        id: 'q7', title: '라이트의 밝은 solid (L > .7)',
        question: <>밝은 solid는 아이콘·차트 선(graphic 8)이 표면 대비 3:1을 지키려고 solid보다 어두워진다. 이걸 허용할지, solid 명도를 .7로 묶을지 정한다.</>,
        affects: ['warning, agent gradient, extra 색처럼 밝은 색', 'ramp 8단계(graphic)와 9단계(solid)의 관계'],
        why: <>graphic이 solid보다 어두운 건 노랑 계열에서 자연스럽다(채움은 밝게, 선과 글자는 진하게). 상한을 두면 노랑이 머스터드로 탁해진다. 지금 경고색이 L{f2(warnL[0])}이면 이 결정과 무관하다.</>,
        options: [
          { id: 'A', title: '허용 (graphic이 더 어두움)', recommended: true, scene: <Frame style={style('light')}><LightSolidScene samples={samples} cap={false} p={p} /></Frame>,
            consequence: <>고른 색 그대로. 아이콘·선은 진한 단계로 3:1 유지. 기준 변화 없음.</> },
          { id: 'B', title: 'solid L 상한 .7', scene: <Frame style={style('light')}><LightSolidScene samples={samples} cap p={p} /></Frame>,
            consequence: <>8과 9가 비슷해진다. 대신 밝은 노랑·피치 solid가 사라지고 어두워진다. 해당 색 쓰는 컴포넌트 기준 변경.</> },
        ],
      },
    ];
  }, [s]);
}

function OptionColumn({ o, chosen }: { o: Option; chosen: boolean }) {
  return (
    <div className={`grid min-w-0 content-start gap-2 rounded-lg p-2 ${chosen ? 'shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-border)]' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        {!['current', 'previous', 'subtle', 'more'].includes(o.id) && <span className={`${mono} text-text-tertiary`}>{o.id}</span>}
        <b className="font-ui text-ui-strong text-text-primary">{o.title}</b>
        {o.recommended && <Badge tone="solid" shape="square">권장</Badge>}
        {chosen && <Badge tone="outline">내 선택</Badge>}
      </div>
      {o.scene}
      <p className="m-0 text-ui-sm text-text-secondary">{o.consequence}</p>
    </div>
  );
}

const label = (q: Question, id: string | undefined) => {
  const o = q.options.find(x => x.id === id);
  return o ? `${o.id === 'current' ? '지금' : o.id} · ${o.title}` : '미정';
};

function QuestionBlock({ q, n, choice, onChoose }: { q: Question; n: string; choice: string | undefined; onChoose: (v: string | undefined) => void }) {
  return (
    <section id={`dq-${q.id}`} aria-labelledby={`dq-${q.id}-h`} className="grid min-w-0 scroll-mt-36 gap-3 border-t border-border-default pt-6 first:border-t-0 first:pt-0">
      <header className="grid max-w-[72ch] gap-1.5">
        <h2 id={`dq-${q.id}-h`} className="m-0 font-ui text-title-4 text-text-primary"><span className={`${mono} mr-2 text-text-tertiary`}>{n}</span>{q.title}</h2>
        <p className="m-0 text-ui text-text-secondary">{q.question}</p>
        <div className="grid gap-0.5 text-ui-sm text-text-tertiary">
          <span>영향 범위</span>
          <ul className="m-0 grid gap-0.5 pl-4">{q.affects.map(a => <li key={a}>{a}</li>)}</ul>
        </div>
      </header>
      <div className={`grid min-w-0 gap-3 ${q.options.length === 3 ? 'min-[1600px]:grid-cols-3' : 'min-[1100px]:grid-cols-2'}`}>
        {q.options.map(o => <OptionColumn key={o.id} o={o} chosen={choice === o.id} />)}
      </div>
      <div className="grid max-w-[72ch] gap-2">
        {q.why ? <p className="m-0 text-ui-sm text-text-secondary"><b className="text-text-primary">{q.whyLabel ?? '권장 이유.'}</b> {q.why}</p> : null}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-ui-strong text-text-primary">내 선택</span>
          <SegmentedControl size="xs" aria-label={`${n}번 선택`} value={choice ?? 'none'} onValueChange={v => onChoose(v === 'none' ? undefined : v)}>
            {q.options.map(o => <SegmentedControlItem key={o.id} value={o.id}>{o.id === 'current' ? '지금' : o.id}{o.recommended ? ' (권장)' : ''}</SegmentedControlItem>)}
            <SegmentedControlItem value="none">미정</SegmentedControlItem>
          </SegmentedControl>
        </div>
      </div>
    </section>
  );
}

export default function DecisionsPage() {
  const [s] = useState<BuilderState>(decisionBase);
  const [choices, setChoices] = useState<Choices>(loadChoices);
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => saveChoices(choices), [choices]);
  const qs = useQuestions(s);
  const open = useMemo(() => openQuestions(s), [s]);
  const choose = (id: string) => (v: string | undefined) => setChoices(c => { const n = { ...c }; if (v === undefined) delete n[id]; else n[id] = v; return n; });

  const text = ['컬러 랭귀지 결정 (#/lab/decisions)', ...open.map((q, i) => `O${i + 1}. ${q.title}: ${label(q, choices[q.id])}`), ...qs.map((q, i) => `${i + 1}. ${q.title}: ${label(q, choices[q.id])}`)].join('\n');
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied('복사했습니다. 대화창에 붙여 넣어 주세요.'); }
    catch { setCopied(`클립보드를 쓸 수 없습니다. 아래를 선택해 복사해 주세요.\n\n${text}`); }
  };

  return (
    <div className="min-w-0 font-ui text-text-primary" data-lab="decisions">
      <style>{`.dq-mark-neutral [data-slot="field-required-mark"]{color:var(--cs-color-text-tertiary)}\n${OPEN_CSS}`}</style>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border-default bg-bg-inset px-4 py-2.5 min-[900px]:px-5">
        <Badge tone="solid" shape="square" icon={<FlaskConical />}>Lab</Badge>
        <p className="m-0 min-w-0 flex-1 text-ui-sm text-text-secondary">
          <b className="text-text-primary">컬러 랭귀지 결정을 위한 임시 페이지입니다.</b> 제품 페이지가 아니고 아무것도 배포되지 않으며, 결정이 끝나면 지웁니다.
          색은 빌더(#/lab/builder)에 저장된 값을 읽고, 제안 랭귀지(Proposed)를 켠 상태로 그립니다.
        </p>
      </div>

      <div className="sticky top-14 z-20 grid gap-2 border-b border-border-subtle bg-surface-base px-4 py-2 min-[900px]:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="m-0 mr-2 font-ui text-title-4">색 결정: 열린 질문 5 · 결정 7</h1>
          <span className="flex-1" />
          <Button tone="secondary" size="xs" iconStart={<Copy />} onClick={() => void copy()}>Copy decisions</Button>
        </div>
        <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {[...open.map((q, i) => ({ q, n: `O${i + 1}` })), ...qs.map((q, i) => ({ q, n: String(i + 1) }))].map(({ q, n }) => (
            <li key={q.id}>
              <a href="#/lab/decisions" onClick={e => { e.preventDefault(); document.getElementById(`dq-${q.id}`)?.scrollIntoView({ block: 'start' }); }}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-ui-sm text-text-secondary outline-none shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] hover:bg-fill-hover focus-visible:shadow-focus">
                <span className={mono}>{n}</span>
                <span className={choices[q.id] ? 'text-text-primary' : 'text-text-tertiary'}>{choices[q.id] ? (choices[q.id] === 'current' ? '지금' : choices[q.id]) : '미정'}</span>
              </a>
            </li>
          ))}
        </ol>
        {copied && (
          <div className="flex items-start gap-3">
            <pre className="m-0 max-h-48 min-w-0 flex-1 overflow-auto whitespace-pre-wrap font-mono text-mono-sm text-text-secondary">{copied}</pre>
            <Button tone="ghost" size="xs" onClick={() => setCopied(null)}>닫기</Button>
          </div>
        )}
      </div>

      <main className="grid min-w-0 content-start gap-10 bg-bg-app px-4 py-6 min-[900px]:px-6">
        <section id="dq-open" aria-labelledby="dq-open-h" className="grid min-w-0 scroll-mt-36 gap-6 rounded-xl bg-bg-inset p-4 min-[900px]:p-5">
          <header className="grid max-w-[72ch] gap-1">
            <h2 id="dq-open-h" className="m-0 font-ui text-title-3 text-text-primary">Open questions (2026-10-26)</h2>
            <p className="m-0 text-ui text-text-secondary">아직 정하지 않은 다섯 가지. 각 옵션은 @caustic/react 컴포넌트를 그대로 그린다. A는 지금 코드이고, B는 이 페이지에서만 슬롯을 바꿔 그린 모습이다(컴포넌트 코드는 그대로).</p>
          </header>
          {open.map((q, i) => <QuestionBlock key={q.id} q={q} n={`O${i + 1}`} choice={choices[q.id]} onChoose={choose(q.id)} />)}
        </section>
        {qs.map((q, i) => <QuestionBlock key={q.id} q={q} n={String(i + 1)} choice={choices[q.id]} onChoose={choose(q.id)} />)}
      </main>
    </div>
  );
}
