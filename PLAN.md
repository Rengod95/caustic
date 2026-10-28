# Caustic 코드 구현 계획

**작성:** 2026-10-02
**대상:** `caustic-preview`의 시각 시안(토큰 1.0, 문서 102페이지)을 React 19 + Tailwind CSS 4 컴포넌트 라이브러리로 옮기는 작업

**목표:**
- 현재 정의된 디자인을 그대로 지키는, 확장 가능하고 재사용 가능하며 의존성이 최소인 코드 컴포넌트를 만든다.
- 모든 컴포넌트는 **명세(spec)** 를 먼저 갖는다.
- 그 명세와 파운데이션 정책을 기계가 검사하는 **게이트웨이**를 통과해야만 병합된다.
- 통과하지 못하면 게이트웨이가 실패 항목을 담은 **재작성 요청서**를 만든다. 작성자(사람이나 에이전트)는 그 요청서만 보고 다시 고친다.

---

## 1. 출발점: 이미 있는 것

| 자산 | 위치 | 새 구조에서의 역할 |
|---|---|---|
| 토큰 원본 (프리미티브, 테마 2개, 시맨틱 색 76개, 타입 역할 15개, 라운드·간격·크기·모션·z) | `foundation/tokens.mjs` | `@caustic/tokens`의 원본. 그대로 옮긴다 |
| 빌드 + 대비 게이트 (규칙 96개 × 테마 2개 × 액센트 24색상) | `foundation/build.mjs` | 게이트 G0의 일부. 그대로 재사용 |
| 베이스 레이어 (재질, 타입 역할, 에이전트 시그니처, 필드 포커스 정책) | `foundation/base.css` | Tailwind 4 `@utility`와 `@layer base`로 이식 |
| 정책 문서 (P1–P9, 컴포넌트 수치표) | `FOUNDATION.md` | 사람이 읽는 정책. 기계 검사용 원본은 정책 레지스트리(6.3절)로 옮긴다 |
| 문서 사이트 맵 (컴포넌트 페이지 102개, usage·tokens 메모) | `preview/docs.registry.mjs` | 컴포넌트 명세 목록과 초안의 씨앗 |
| 컴포넌트 시안 HTML (Specimen) | `preview/src/*.html` + `preview/*.css` | 시각 기준선(golden)이자 해부도(anatomy) 추출 원본 |

컴포넌트 페이지는 102개입니다. 한 페이지에 여러 컴포넌트가 있는 경우(Dialog + Review request 등)를 나누면 명세 대상은 약 **95개**입니다.

---

## 2. 결정 사항 (권장안)

선택이 필요한 지점입니다. 아래 권장안으로 진행하고, 바꾸려면 알려 주세요.

| # | 결정 | 권장 | 이유 |
|---|---|---|---|
| D1 | 코드 위치 | 독립 모노레포 `caustic/` (pnpm workspace). Axiom은 나중에 패키지로 소비 | 처음 요청대로 Axiom 디자인 시스템과 분리하고, 게이트웨이를 독립적으로 굴린다 |
| D2 | 동작 프리미티브 | Radix UI 개별 패키지 (`@radix-ui/react-dialog` 등). 필요한 컴포넌트만 쓴다 | 포커스 트랩, 포털, 타입어헤드, 충돌 회피 같은 접근성 동작은 직접 만들면 비용이 크다. 개별 패키지라 의존성이 최소다. shadcn과 같은 기반이다 |
| D3 | 변형(variant) 표현 | `class-variance-authority` + `tailwind-merge` (`cn()` 유틸) | shadcn 방식. 런타임이 작고, 명세의 variants·sizes와 1:1로 대응해 게이트에서 검사하기 쉽다 |
| D4 | 배포 형태 | ① npm 패키지 `@caustic/react` ② shadcn 호환 레지스트리 JSON(소스 복사형) 둘 다 | 앱은 패키지로, 커스텀이 필요한 팀은 소스로 가져간다 |
| D5 | 시각 기준선 | 현재 HTML 시안을 1차 기준선으로 쓴다. React 버전이 승인되면 그 결과로 기준선을 다시 기록한다 | 지금 "좋다"고 확정한 화면이 곧 정답이다 |
| D6 | 테스트 러너 | Vitest browser mode(Playwright 공급자) + Playwright 스크린샷 비교 | 실제 브라우저에서 계산된 스타일을 검사해야 토큰 준수를 증명할 수 있다 |

**최소 의존성 허용 목록 (게이트에서 강제):**
- `react`, `react-dom` (peer)
- `@radix-ui/react-*` (컴포넌트별로 필요한 것만)
- `class-variance-authority`
- `tailwind-merge`
- `@floating-ui/react` (Radix에 없는 앵커 배치가 필요할 때만)
- 런타임 의존성은 이 밖에 금지
- 아이콘은 `lucide-react`를 peer optional로 두고, 컴포넌트는 아이콘을 slot으로 받는다

---

## 3. 목표 구조

```
caustic/
├─ packages/
│  ├─ tokens/            # foundation 원본 + 빌드. 출력: caustic.css, theme.css(Tailwind 4), DTCG JSON
│  ├─ spec/              # 컴포넌트 명세(*.spec.ts) + 명세 스키마(zod) + 정책 레지스트리
│  ├─ react/             # 컴포넌트 구현 (src/<component>/<component>.tsx, index.ts)
│  ├─ gateway/           # 검사기 CLI `caustic gate` + 리포터 + 재작성 요청서 생성기
│  └─ registry/          # shadcn 호환 레지스트리 빌드 (소스 배포용)
├─ apps/
│  └─ docs/              # 문서 사이트 (현재 HTML 문서를 React로 이전; 예제 = 게이트 스토리)
├─ baselines/            # 시각 기준선 이미지 (테마 × 너비 × 예제)
└─ .github/workflows/    # PR 게이트
```

---

## 4. Tailwind 4 연결 방식

**원칙:** Tailwind가 아는 값은 Caustic 토큰뿐이다.
- 기본 팔레트, 간격, 라운드 같은 기본 네임스페이스를 모두 끄고(`--*: initial`), Caustic 토큰만 다시 선언한다.
- 그러면 `bg-red-500`이나 `rounded-md` 같은 비토큰 유틸리티는 CSS가 생성되지 않는다. 게이트가 이것을 "알 수 없는 클래스"로 잡는다.

`packages/tokens`가 `tokens.mjs`에서 **`theme.css`를 생성**합니다(직접 수정 금지).

```css
/* @caustic/tokens/theme.css — generated */
@theme {
  --color-*: initial; --radius-*: initial; --spacing-*: initial; --shadow-*: initial; --font-*: initial; --text-*: initial;
  /* 시맨틱 색 → --cs-* 변수 참조 (런타임 테마·액센트 색상 전환 유지) */
  --color-surface-base: var(--cs-color-surface-base);
  --color-text-primary: var(--cs-color-text-primary);
  --color-ink: var(--cs-color-ink-solid);
  /* … 76개 전부 */
  --radius-md: var(--cs-radius-md);      /* 8 */
  --radius-xl: var(--cs-radius-xl);      /* 12 */
  --spacing: 4px;                        /* 4pt 그리드: p-3 = 12px */
  --height-field-md: var(--cs-field-md); /* h-field-md = 40 */
  --shadow-1: var(--cs-elevation-1);
  --font-ui: var(--cs-font-ui);
}
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
@utility glass { /* .cs-glass 레시피 */ }
@utility glass-thick { … }
@utility agent-rim { … }        /* 스펙트럼 림 — 정책 P2 */
@utility focus-field { box-shadow: var(--cs-focus-field); }
```

- **사용하는 쪽:** `@import "tailwindcss"; @import "@caustic/tokens/caustic.css"; @import "@caustic/tokens/theme.css";`
- **시스템 다크 모드:** `prefers-color-scheme` 처리는 지금처럼 토큰 CSS에 두고, Tailwind의 `dark:`는 명시적 `data-theme`용으로만 쓴다.

---

## 5. 컴포넌트 명세 (Spec): 계약서

명세가 원본이고, 코드는 그 구현입니다. 명세는 TypeScript 객체로 쓰고 zod 스키마로 검증합니다. 사람이 읽을 문서와 게이트 검사가 모두 이 명세에서 생성됩니다.

### 5.1 명세 항목

| 항목 | 내용 | 게이트가 검사하는 방법 |
|---|---|---|
| `id`, `name`, `category`, `status` | 식별자, 분류(primitive/form/overlay/card/list/agent/canvas/inspector), 단계(draft → gated → stable) | 레지스트리 일관성 |
| `purpose`, `role` | 한 문장 목적. ARIA 역할(`button`, `switch`, `dialog`…) | 렌더 후 role 확인 |
| `anatomy` (slots) | 슬롯 트리. 이름, 요소, 필수 여부, `data-slot` 값, 허용 자식 | DOM에서 `data-slot` 트리 일치 |
| `variants` | 축별 enum과 기본값 (예: `tone: ink \| accent \| secondary \| ghost \| danger \| agent`) | cva 키·값 = 명세 enum, 기본값 일치 |
| `sizes` | 크기 enum과 **정확한 수치를 토큰으로** (높이, 패딩, 라운드, 글꼴 역할, 아이콘 크기) | 계산된 스타일이 토큰 해석값과 일치 |
| `states` | hover, active, focus-visible, disabled, invalid, loading, selected, open… 와 각 상태의 토큰 바인딩 | 상태를 강제한 뒤 계산 스타일 비교 |
| `tokens` | 슬롯 × variant × state별 시맨틱 토큰 바인딩 (bg, fg, border, shadow, radius, material) | 계산값 = 토큰값. 바인딩되지 않은 색이 나오면 실패 |
| `props` (입력) | 이름, 타입, 기본값, 제어/비제어 쌍(`value`/`defaultValue`/`onValueChange`) | ts-morph로 추출한 Props 타입과 비교 |
| `events` (출력·액션) | 콜백 이름, 페이로드 타입, 발생 조건 | 상호작용 시나리오 실행 후 호출 인자 검사 |
| `behavior` | 키보드 맵, 포인터 동작(드래그, 스크럽), 포커스 이동, 열고 닫기 규칙 | 스크립트 상호작용 테스트 |
| `a11y` | 필수 aria 속성, 레이블 규칙, 최소 히트 영역(24), 포커스 정책(P9) | axe-core + 커스텀 단언 |
| `policies` | 적용 정책 (P1–P9)과 플래그: `floating`(유리 허용), `agent`(스펙트럼 허용), `field`(필드 포커스 정책) | 정책 검사 (6.3절) |
| `composition` | 내부에서 쓰는 다른 Caustic 컴포넌트, 허용 외부 의존성 | import 그래프 검사 |
| `examples` | 예제 id ↔ 현재 문서 페이지 예제(시각 기준선)와 props 조합 | 스토리 자동 생성 + 시각 비교 |

### 5.2 예시: Button 명세 (초안 형태)

```ts
export default defineSpec({
  id: 'button', name: 'Button', category: 'primitive', status: 'draft',
  purpose: '사용자가 하나의 동작을 실행한다.', role: 'button',
  anatomy: { root: { el: 'button', slot: 'button', children: ['icon?', 'label', 'spinner?'] } },
  variants: { tone: { values: ['ink', 'accent', 'secondary', 'ghost', 'danger', 'agent'], default: 'ink' },
              shape: { values: ['rounded', 'pill'], default: 'rounded' } },
  sizes: {
    xs: { height: 'control-xs', padX: 8,  radius: 'sm', text: 'footnote', icon: 'sm' },
    sm: { height: 'control-sm', padX: 10, radius: 'md', text: 'ui-strong', icon: 'md' },
    md: { height: 'control-md', padX: 12, radius: 'md', text: 'ui-strong', icon: 'md', default: true },
    lg: { height: 'control-lg', padX: 16, radius: 'lg', text: 'body',     icon: 'md' },
  },
  tokens: {
    ink:       { bg: 'ink.solid', fg: 'ink.on', edge: 'control.edge', shadow: 'elevation-1', hover: { bg: 'ink.hover' } },
    accent:    { bg: 'accent.solid', fg: 'accent.on', shadow: 'elevation-1', hover: { bg: 'accent.hover' } },
    secondary: { bg: 'control.raised', fg: 'text.primary', edge: 'control.edge', hover: { bg: 'control.raised-hover' } },
    agent:     { bg: 'surface.base', fg: 'text.primary', rim: 'spectrum' },
  },
  material: { frost: 'blur-control' },                // 반투명 + 12px 블러 (Frosted controls)
  states: ['hover', 'active', 'focus-visible', 'disabled', 'loading'],
  props: { asChild: 'boolean', loading: 'boolean', disabled: 'boolean', iconStart: 'ReactNode', iconEnd: 'ReactNode' },
  events: { onClick: { payload: 'MouseEvent', when: 'activated and not disabled/loading' } },
  behavior: { keys: { Enter: 'activate', Space: 'activate' }, pressScale: 0.97 },
  a11y: { minHit: 24, loading: 'aria-busy=true, label kept', iconOnly: 'requires aria-label' },
  policies: ['P3', 'P8'], flags: { agent: ['tone=agent'] },
  examples: [{ id: 'variants', doc: 'button#button-variants' }, { id: 'sizes', doc: 'button#button-sizes-and-states' }],
});
```

### 5.3 명세 작성 흐름
1. `docs.registry.mjs`와 시안 HTML에서 **명세 초안을 자동 추출**한다. 슬롯, 클래스, 사용 토큰, usage 메모가 들어간다.
2. 에이전트가 빈칸(행동, 입출력, 키보드 맵)을 채운다.
3. 사람이 승인한다. 승인된 명세만 `status: draft → ready`가 되고, 그때부터 구현 대상이 된다.
4. 명세 변경은 별도 PR로 하고 디자인 승인이 필요하다. **명세를 고쳐 게이트를 통과시키는 것은 금지**한다 (게이트 G1이 같은 PR 안의 명세 + 구현 동시 변경을 막는다).

---

## 6. 게이트웨이 (`caustic gate`)

**흐름:**
1. 컴포넌트 구현 PR
2. G0 파운데이션 무결성
3. G1 명세 유효성
4. G2 정적 소스 검사
5. G3 렌더 적합성 (토큰·해부도·a11y·행동)
6. G4 시각 일치
7. G5 정책 검사
8. G6 패키징·의존성
9. 결과:
   - 통과: `status: gated`, 레지스트리 반영
   - 실패: `REWRITE_REQUEST.md` + `report.json` → 작성자에게 반환 → 수정 → 2번부터 다시

- 각 단계는 실패해도 멈추지 않고 끝까지 돌아서 **모든 실패를 한 번에** 보고한다. 단, G0이 실패하면 아래 단계는 의미가 없으므로 중단한다.
- 모든 검사는 결정적이고, 같은 입력이면 같은 결과를 낸다.

### 6.1 단계별 검사

| 단계 | 검사 | 구현 수단 |
|---|---|---|
| **G0 파운데이션** | 기존 대비 규칙(현재 96개) 전부 통과 / 토큰 이름 규칙(`--cs-<category>-<name>`) / 시맨틱이 프리미티브만 참조 / `theme.css`가 모든 시맨틱 토큰을 매핑 / 동심원 라운드 체인(창 32 → 패널 22 → 16 → 10) 계산 검증 / `FOUNDATION.md` 수치표와 토큰 값 동기화 / dist가 원본과 일치(재빌드 diff 0) | 기존 `build.mjs` 확장 + 스냅샷 |
| **G1 명세** | zod 스키마 통과 / 명세가 참조하는 토큰이 실제로 존재 / sizes 수치가 토큰 스케일 위 / 예제가 문서 예제와 연결 / 명세·구현 동시 변경 금지 | zod + 토큰 인덱스 |
| **G2 정적 검사** | ① 리터럴 색(hex, rgb, hsl, oklch) 금지 (TSX·CSS) ② 임의값 유틸(`[13px]`, `[#fff]`) 금지. `[--cs-…]` 변수 참조만 허용 ③ 모든 클래스 후보를 Tailwind 4 컴파일러로 빌드해 CSS가 안 나오는 클래스 = 비토큰 클래스로 실패 ④ cva 키·값·기본값 = 명세 ⑤ Props 타입 = 명세 props·events ⑥ 각 슬롯에 `data-slot` ⑦ `style={{…}}` 안의 색·크기·그림자, `!important`, 리터럴 z-index, 리터럴 duration 금지 ⑧ 허용 목록 밖 import 금지 | ESLint 커스텀 규칙 + ts-morph + `tailwindcss` 컴파일 API |
| **G3 렌더 적합성** | 명세의 variant × size × state 행렬을 자동 렌더 (라이트/다크, 일반/compact 밀도, 액센트 색상 3종) 후: ① `data-slot` 트리 = anatomy ② 계산 스타일(높이, 패딩, 라운드, 배경, 글자색, 테두리, 그림자, 블러) = 토큰 해석값 ③ ARIA role·속성 ④ 키보드 맵·포인터 시나리오 실행 → 상태·이벤트 페이로드 = 명세 ⑤ axe-core 위반 0 ⑥ 렌더된 텍스트·배경 실측 대비 ≥ 정책 기준 ⑦ SSR `renderToString` 성공 | Vitest browser mode + Testing Library + axe-core |
| **G4 시각 일치** | 예제마다 React 렌더 vs 기준선 스크린샷 (2테마 × 1440·390) 픽셀 비교. 기본 허용치 0.3%, 안티앨리어싱 무시. 실패하면 diff 이미지 첨부 | Playwright `toHaveScreenshot` |
| **G5 정책** | 아래 6.3절 정책 레지스트리의 모든 규칙 | 렌더 결과 + 명세 플래그 |
| **G6 패키징** | 의존성 허용 목록 / 컴포넌트 간 deep import 금지(공개 export만) / 컴포넌트별 번들 크기 예산 / 트리 셰이킹 가능(side effect 없음) / `"use client"` 경계 표기 / 타입 선언 생성 | publint, size-limit, dependency-cruiser |

### 6.2 토큰 준수 판정
- "토큰을 썼는가"는 클래스 이름이 아니라 **실제로 계산된 값**으로 판정합니다.
- 테스트는 현재 테마의 토큰 해석값 표(`dist/tokens.mjs`의 resolved 값과 브라우저에서 읽은 `--cs-*` 계산값)를 만듭니다. 그다음 컴포넌트의 각 슬롯 스타일 값이 명세가 지정한 토큰의 값과 같은지 비교합니다.
- 그래서 클래스를 우회해 같은 값을 하드코딩하면 G2에서 걸리고, 클래스를 잘못 고르면 G3에서 걸립니다.

### 6.3 정책 레지스트리 (P1–P9 → 기계 규칙)

| 정책 | 기계 규칙 |
|---|---|
| P1 Glass only for what floats | `glass*` 유틸·`backdrop-filter`(material 블러)는 명세 `flags.floating` 컴포넌트에서만. 반투명 컨트롤 블러(`blur-control`)는 별도 허용 목록 |
| P2 Light means agent | `agent-rim`, `orb`, `shimmer`, `--cs-spectrum-*` 사용은 `flags.agent` 컴포넌트·variant에서만. 스펙트럼 색은 3개(Lagoon, Mint, Amber) 고정 |
| P3 Ink first, accent once | 버튼은 평평함(그라디언트·inset 하이라이트 금지). 예제 렌더 화면당 `tone=accent` 버튼 ≤ 1 |
| P4 Two voices | 에이전트 산문 슬롯은 `font-voice`, 기계 값 슬롯은 `font-mono`, 버튼·라벨에 serif 금지 |
| P5 Concentric corners | 렌더 트리에서 자식 라운드 ≤ 부모 라운드 − 부모 패딩 (허용 오차 2px). 동일 값 허용 |
| P6 Contrast build gate | G0 + G3 실측 대비. 컴포넌트 소스에 리터럴 색 0 |
| P7 Human vs agent on canvas | 캔버스 선택 슬롯은 `canvas.selection`, 에이전트 작업 슬롯은 `agent-rim` |
| P8 Motion has a job | duration·easing은 토큰만. 무한 반복 애니메이션은 `flags.agent`에서만. `prefers-reduced-motion` 에뮬레이션에서 애니메이션 0 |
| P9 A field owns its focus | `flags.field` 컴포넌트는 포커스 시 컨테이너에 `focus-field`(평소의 1px `border.default` 헤어라인) 하나만 두고 채움을 바꾼다(흰 필드는 `neutral.well`, 회색 필드는 `surface.base`). 내부 input은 outline·box-shadow 없음, 바깥 링 없음. 컨테이너의 배경이나 box-shadow가 쉼 상태와 달라야 한다 (쉼·포커스 상태 계산 스타일로 검사) |
| 수치 정책 | 필드 36/40/44, 인스펙터 컨트롤 32, 툴바 라운드 14/10, 토스트 60·22, 세그먼트 패딩 4, 카드 간격 규칙(섹션 간 10, 바깥 14/15, 구분선 푸터 12) |

### 6.4 재작성 요청서 (게이트 실패 시 출력)

```
# REWRITE REQUEST · button · attempt 2/5
Status: FAILED (G2: 1, G3: 3, G4: 1)

## G3-tokens  size=md tone=secondary state=hover   [blocking]
- slot "button" background-color: expected control.raised-hover → oklch(0.995 0.001 260 / 0.94), got oklch(0.97 0.003 260)
  Fix: hover 배경은 bg-control-raised-hover. 현재 hover:bg-surface-raised 사용 중 (button.tsx:41)
## G3-focus  state=focus-visible   [blocking]
- outer ring missing: expected box-shadow var(--cs-focus) (P9: 버튼은 바깥 링 유지)
## G4-visual  example=variants theme=dark width=1440   [blocking]
- 1.8% pixels differ (budget 0.3%) → diff: artifacts/button/variants-dark-1440.diff.png
## Spec excerpt (변경 금지)
tokens.secondary = { bg: control.raised, hover: { bg: control.raised-hover }, edge: control.edge }
```

- **요청서에 담는 것:** 실패 항목만 담습니다. 각 항목에는 ① 기대값과 실제값 ② 해당 명세 발췌 ③ 파일·줄 위치 ④ 고치는 방향 한 줄이 들어갑니다.
- **반복 상한:** 컴포넌트당 5회. 넘으면 사람 검토로 넘깁니다. 이때 명세가 틀렸을 가능성을 함께 표시합니다.
- **에이전트 루프:** 구현 에이전트 → `caustic gate <id> --json` → 실패하면 요청서를 그대로 다음 턴 입력으로 넘깁니다 → 통과하면 PR. CI에서도 같은 명령을 돌려 병합을 막습니다.

---

## 7. React 작성 규약 (shadcn 응용)

- **파일 구조:** 컴포넌트당 폴더 하나를 둡니다.
  - `button.tsx`: 구현
  - `button.variants.ts`: cva
  - `index.ts`
  - 테스트는 명세에서 자동 생성되므로 직접 쓰지 않습니다. 추가 시나리오만 `button.extra.test.tsx`에 둡니다.
- **슬롯 표기:** 모든 파트에 `data-slot="card-header"` 같은 값을 붙입니다. 상태는 `data-state`, `data-variant`, `data-size`, `data-disabled`로 노출하고, 스타일은 `data-[state=open]:` 같은 데이터 변형으로 겁니다.
- **합성:** shadcn처럼 파트를 분리해 export합니다 (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`). 다형성은 `asChild`(Radix Slot)로 처리합니다.
- **React 19:** ref는 prop으로 받습니다(`forwardRef` 미사용). 제어/비제어는 공용 `useControllableState`로 처리하고, 이벤트 이름은 `onValueChange`, `onOpenChange`처럼 통일합니다.
- **클래스:** `cn(cva(...)(props), className)` 형태입니다. 사용자 `className`은 마지막에 병합되지만, G2가 라이브러리 내부 소스에만 적용되므로 사용자 오버라이드는 막지 않습니다.
- **카드 변형:** 시안대로 variant별로 독립 컴포넌트를 둡니다 (`SurfaceCard`, `GlassCard`, `WellCard`, `StatCard`…). 섹션 간격 규칙은 공용 `CardSection` 레이아웃 유틸 하나로만 구현해서 중복 간격이 구조적으로 불가능하게 합니다.
- **아이콘:** 컴포넌트는 아이콘 slot만 받습니다. 아이콘 크기는 `[&_svg]:size-icon-md`처럼 토큰으로 강제합니다.
- **도메인 컴포넌트:** 스크럽 필드, 그라디언트 편집기, 컬러 피커는 포인터 로직을 훅(`useScrub`, `useDragPoints`)으로 분리합니다. 훅은 DOM 없이 단위 테스트합니다.

---

## 8. 단계별 진행

| 단계 | 내용 | 산출물 | 완료 기준 |
|---|---|---|---|
| **P0 기반** | 모노레포, pnpm, TS strict, Vitest browser, Playwright, ESLint, CI 골격 | `caustic/` 저장소 | 빈 패키지들이 CI 통과 |
| **P1 토큰** | `foundation/` 이식, `theme.css` 생성기, Tailwind 유틸(`glass`, `agent-rim`, `focus-field`, `frost`), G0 | `@caustic/tokens` | G0 통과, `bg-red-500`이 CSS를 만들지 않음 |
| **P2 명세** | 명세 스키마, 정책 레지스트리, 시안 HTML·docs registry에서 초안 자동 추출, **파일럿 7종** 명세 승인 | `@caustic/spec` | 파일럿 명세 G1 통과 |
| **P3 게이트웨이** | G2–G6 구현, 기준선 수집(현재 HTML 시안 캡처), 재작성 요청서 생성기, 반복 루프 스크립트 | `@caustic/gateway` | 고의로 틀린 컴포넌트를 모두 잡아내는 **자기 검증 테스트**(게이트용 negative fixture) 통과 |
| **P4 파일럿** | Button, Field+Input, Switch, SurfaceCard(+Card 파트), Dialog, ToolCall, NumberField 구현 → 게이트 통과까지 반복 | 파일럿 7종 `gated` | 7종 통과, 반복 횟수·실패 유형으로 허용치와 규약 보정, `CONTRIBUTING.md` 확정 |
| **P5 확산** | 웨이브별 구현: ① Components·Forms ② Overlays·Navigation·Data ③ Cards·Lists ④ Agent ⑤ Canvas·Inspector·Structure(복잡 도메인) | 약 95종 | 웨이브마다 전부 `gated` |
| **P6 문서·배포** | 문서 사이트를 React로 이전(예제 = 게이트 스토리), 기준선을 React 결과로 재기록, npm 배포, shadcn 레지스트리 | `apps/docs`, `@caustic/react` 1.0 | 문서 102페이지 React 렌더, 기준선 교체 승인 |

**파일럿 7종을 고른 이유:** 이 일곱 개가 게이트의 모든 단계를 한 번씩 건드립니다.

| 파일럿 | 시험하는 것 |
|---|---|
| Button | variant 행렬, 평평한 버튼 정책 |
| Field + Input | P9 포커스, 36/40/44 크기 |
| Switch | 스프링 모션, 3:1 경계 |
| SurfaceCard | 섹션 간격 규칙 |
| Dialog | Radix 포털, 포커스 트랩, 유리 재질 |
| ToolCall | 에이전트 스펙트럼 P2 |
| NumberField | 포인터 스크럽, 32 컨트롤 |

---

## 9. 위험과 대응

| 위험 | 대응 |
|---|---|
| 시각 비교가 폰트 렌더링·블러 때문에 흔들림 | 고정 Chromium 버전과 폰트 로컬 번들, 애니메이션 정지, `backdrop-filter` 영역은 마스크 처리하거나 허용치를 별도로 둠 |
| 명세가 시안과 어긋난 채 승인됨 | 명세 초안을 시안 HTML에서 자동 추출하고, G4가 시안 기준선과 비교하므로 어긋나면 바로 드러남 |
| 게이트가 너무 엄격해 반복이 끝나지 않음 | 파일럿에서 허용치 보정. 5회 상한 후 사람 검토. 규칙마다 blocking과 warning 구분 |
| Radix 기본 동작이 정책과 충돌 (예: 포커스 링) | Radix는 무스타일이라 스타일은 Caustic만 적용. 충돌하는 동작은 명세 behavior에 명시하고 G3로 검증 |
| 컴포넌트 약 95개의 명세 작성 비용 | 자동 추출 + 에이전트 초안 + 웨이브별 승인. 명세 템플릿을 category별로 상속 |

---

## 10. 바로 다음 작업

1. 2절 결정 사항(D1–D6) 확인
2. P0 + P1: `caustic/` 모노레포 생성, 토큰 이식, `theme.css` 생성기, G0
3. P2: 명세 스키마 + Button 명세 1종을 끝까지 작성해 형식을 확정
4. P3 일부: G2(정적)와 G3(토큰·해부도)를 Button에 대해 먼저 구현하고, 일부러 틀린 Button으로 재작성 요청서가 제대로 나오는지 확인
