# 제안: 컬러 디자인 랭귀지 (branch design/showcase)

상태: 1단계 제안. 배포 토큰(`packages/tokens`)과 컴포넌트는 손대지 않았다. 미리보기는 빌더(`#/lab/builder`)의 **Proposed language** 토글로 본다.
근거 자료: 컴포넌트 158개 전수 조사 1,674행. `tone × variant × state`마다 쓰는 색 토큰을 뽑았다. 원자료는 scratchpad `lang/audit-1..4.json`과 `-notes.md`에 있다.

## 0. 왜 필요한가
- 지금은 "어떤 상황에 어느 단계 색을 쓰는가"라는 규칙이 없다. 그래서 컴포넌트마다 `soft` / `text` / `solid` / `fill-*`를 그때그때 고른다.
- 고른 색이 화면에 닿는 경로가 대부분 반투명 `soft`(16~30%)라서, 단색을 바꿔도 화면에서는 1/7 정도만 보인다(§5).
- 같은 의미가 컴포넌트마다 다르게 그려진다. "선택됨"만 해도 다섯 가지 모양이다. 상태가 바뀌면 강조 단계가 튀기도 한다. 예를 들어 danger 버튼은 hover에서 soft가 solid로 바뀐다.

---

## 1. 단계 문법 (step grammar)

모든 색은 **모드별로 따로 만든 1–11 램프**를 갖는다. `neutral-light`와 `neutral-dark`처럼 라이트와 다크가 각자의 램프다. 한 램프를 뒤집어 쓰지 않는다. 두 모드 모두 **1이 배경 쪽**이다.

| 단계 | 역할 | 라이트 L (고정) | 다크 L (고정) | 채도 비율 (라이트/다크) | 쓰는 곳 |
|---|---|---|---|---|---|
| 1 | tint | .985 | .225 | .14 / .22 | 넓은 영역 틴트 |
| 2 | tint 강 · subtle 배경 · hover 바닥 | .965 | .255 | .28 / .32 | 배너·알림 배경, outline/text의 hover |
| 3 | **soft** | .935 | .29 | .46 / .46 | 배지, 칩, soft 버튼, 선택 행, diff 라인 |
| 4 | soft-hover | .905 | .32 | .58 / .56 | |
| 5 | soft-pressed · soft-selected | .87 | .355 | .70 / .66 | |
| 6 | **border** | .80 | .42 | .80 / .76 | outline·subtle 테두리, 장식 경계 |
| 7 | border-strong · 선택 테두리 | 6→9의 40% | 6→9의 40% | .90 / .88 | hover 테두리, selected 테두리 |
| 8 | **graphic** (표면 대비 3:1 이상 보장) | 6→9의 70% | 6→9의 70% | 1 | 아이콘, 차트 선, 1px 상태 표시, 점 |
| 9 | **solid = 고른 색** | 고른 값 | 고른 값 | 1 | 채운 버튼, 체크·스위치 켜짐, 진행 바 |
| 10 | solid-hover | 9 ± .05 / .12 | 9 ± .05 / .08 | 1 | |
| 11 | **text** (표면과 3–5 위 모두 4.5:1 이상) | 9·10보다 .04 진하게, 이후 대비 맞춤 | 9·10보다 .04 밝게, 이후 대비 맞춤 | 1 | 글자, 아이콘 글리프, 링크 |
| on | solid 위 글자 | 잉크/페이퍼 중 대비 큰 쪽 | 동일 | 0 | |

- 1–6단계는 색상과 관계없이 **같은 명도**에 둔다. 그래야 success soft와 danger soft의 무게가 같다. 7–8단계는 6에서 9로 이어지는 구간이다. 9는 사용자가 고른 값 그대로다.
- 채도는 고른 solid의 채도에 비율을 곱한다. 이 비율이 soft에도 **고른 채도를 비례해서 실어 준다**. 투명도로 섞지 않는다. 모든 단계는 sRGB에 맞게 자른다.
- 뉴트럴도 같은 번호를 쓴다. 이미 승인된 Deep Black `neutral-light`/`neutral-dark`를 쓰며, 뉴트럴 톤의 solid는 9단계 회색이다.
- 예외가 하나 있다. 라이트에서 solid L이 약 .7보다 밝으면(agent .78, warning .66) 8단계(graphic)가 3:1을 지키느라 9보다 어두워진다. 이건 의도한 동작이다.

Deep Black의 라이트 danger를 예로 들면 다음과 같다(빌더가 만든 값).

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L | .985 | .965 | .935 | .905 | .87 | .80 | .696 | .618 | .54 | .49 | .45 |
| C | .008 | .018 | .034 | .051 | .073 | .104 | .117 | .13 | .13 | .13 | .13 |

이때 대비는 text 11이 표면 위 7.8, soft 3–5 위 5.2다. on 대 solid 9는 5.3, graphic 8 대 표면은 3.8이다. 이 램프는 고른 값에서 그대로 계산되므로, 다른 톤이나 다크 램프도 빌더에서 같은 방식으로 확인할 수 있다.

---

## 2. 강조 × 톤 매트릭스

**톤:** accent(잉크), neutral, success, warning, danger, info, agent. agent 톤은 에이전트 그라디언트 1번 색의 램프다.
**강조 단계:** solid, soft, outline, subtle, text. 모든 톤이 **같은 칸에서 같은 단계 번호**를 쓴다.

| 강조 | 배경 rest → hover → pressed | 글자 | 아이콘 | 테두리 | selected | 대표 사용처 |
|---|---|---|---|---|---|---|
| **solid** | 9 → 10 → 10(+안쪽 1px 11) | on | on | – | 10 + 체크 | 주요·파괴적 버튼, 체크/스위치 켜짐, 토스트 상태 마크, 아바타 |
| **soft** | 3 → 4 → 5 | 11 | 11 | – | 5 + 테두리 7 + 체크 | 배지, 칩, soft 버튼 (메뉴·리스트 선택 행은 뉴트럴, 아래 selected 참고) |
| **outline** | 없음 → 2 → 3 | 11 | 11 | 6 → 7 → 7 | 3 + 테두리 8(1.5px) + 체크 | 필터 칩, 선택 가능한 태그, 보조 액션 |
| **subtle** | 2 → 3 → 4 | 11 | 8 | 6 → 6 → 7 | 4 + 테두리 7 | 알림, 배너, 잘못된 필드 컨테이너, 오류 카드 |
| **text** | 없음 → 2 → 3 | 11 | 11 (작은 마크는 8) | – | 3 + 체크 | 링크, 인라인 상태, ghost 버튼, 메뉴의 위험 항목 |

**축으로 분리하는 상태** (강조 단계가 아니다)
- **focus**는 모든 칸에서 똑같이, 바깥에 2px 간격을 두고 2px 링을 그린다(`focus-ring`). 간격 색은 `surface.base`로 고정하지 않고, 그 요소가 놓인 표면 색을 따른다(`--cs-focus-offset`).
- **selected**는 **체크 표시와 테두리 7/8**로 표현하고 focus 링은 절대 빌려 쓰지 않는다. 그래서 선택된 항목에 포커스가 오면 둘 다 보인다. **리스트·메뉴·트리·내비·옵션 타일의 선택은 뉴트럴**이다: `neutral-selected`(알파) + 체크 + 뉴트럴 테두리 7. accent soft는 선택에 쓰지 않는다(결정 3).
- **disabled**는 opacity가 아니라 **색**이다. 채움 뉴트럴 3(다크 4), 글자 뉴트럴 6, 테두리 뉴트럴 4(다크 5)를 쓰고, 톤은 빠진다.
- **inherit**는 `currentColor`를 따르는 글리프(칩 점, 피커 글리프 등)용이다. 자기 톤을 갖지 않고 부모의 text 슬롯을 따른다.
- **invalid**는 danger subtle의 테두리 7이며, focus 링과 **함께** 보인다. 하나가 다른 하나를 덮지 않는다.

**상태 전이 규칙**
1. hover와 pressed는 **같은 강조 단계 안에서만** 움직인다. soft는 3→4→5, solid는 9→10이다. danger 버튼처럼 soft에서 solid로 뛰는 건 금지한다. 파괴적 행동은 처음부터 solid 버튼으로 둔다.
2. selected 위에 hover가 오면 selected 모양을 유지하고 배경만 한 단계 올린다. soft는 5→5에 테두리 8, 뉴트럴은 `selected-hover`다.
3. 톤은 상태가 바뀌어도 바뀌지 않는다. 눌린 상태 칩이 잉크로 바뀌어 톤을 잃는 일은 금지한다.

**톤이 아닌 별도 패밀리** (같은 단계 문법을 쓰지만 의미 축이 다르다)

| 패밀리 | 내용 | 램프 연결 |
|---|---|---|
| agent | 그라디언트 테두리(rim), 오브, 글로우, 진행 바. shimmer는 뉴트럴 글자 그라디언트 | 그라디언트 1–3 각각의 9단계가 정지점, 글로우는 그라디언트 1의 9에 투명도. 지금 고정값인 spectrum 정지점에 다크 매핑을 추가 |
| chart | 시리즈 1–6, 트랙, 선택된 막대 | 1–4 = accent·info·success·warning의 9, 5–6 = extra의 9, 트랙 = 뉴트럴 3 |
| identity | 아바타·사람 색(범주형) | 범주 색의 solid 9 + on. 다크 매핑 추가 |
| diff · syntax | diff 라인 배경과 +/− 기호, 코드 구문색 | diff 배경 = success/danger 2–3, 기호 = 11. syntax.* 4색은 별도 토큰(지금은 status 색을 빌려 씀) |
| canvas | 선택, 가이드, 마키, 핸들, 레이블 | 선택 = accent 9, 가이드 = 캔버스 전용 마젠타 `canvas-guide`(라이트 L.60 C.20 h345, 다크 L.72 C.17 h345)와 `canvas-guide-on`. danger 색은 더 이상 빌리지 않는다(결정 4) |
| content · media | 사용자 색(스와치, 그라디언트, 이미지), 이미지 위 글자 | 테마와 무관. `swatch-edge`, `on-media`만 토큰 |

---

## 3. 슬롯 토큰 이름 제안

**톤 슬롯:** `--cs-{tone}-{slot}`. tone은 accent, neutral, success, warning, danger, info, agent다.

| 슬롯 | 단계 | 슬롯 | 단계 |
|---|---|---|---|
| `tint` | 2 | `border-strong` | 7 |
| `soft` | 3 | `graphic` | 8 |
| `soft-hover` | 4 | `solid` | 9 |
| `soft-pressed` | 5 | `solid-hover` | 10 |
| `border` | 6 | `text` | 11 |
| | | `on` | solid 위 글자 |

**뉴트럴 인터랙션 슬롯:** `--cs-neutral-hover`, `-pressed`, `-selected`, `-selected-hover`, `-track`, `-well`.
이 슬롯들은 어떤 표면(app, surface, raised, glass) 위에서도 같은 차이를 내야 한다. ~~투명도를 유지한다~~ → 2026-10-26 결정 9: 알파로 적어 두되 **표면별 불투명 값**으로 내보낸다(아래 결정 표).

**축 토큰:** `--cs-focus-ring`, `--cs-focus-offset`, `--cs-selection-edge`(= 뉴트럴 7, 결정 3), `--cs-disabled-fill`, `-text`, `-border`, `--cs-required-mark`(= `text-tertiary`, 결정 6).

**캔버스 패밀리:** `--cs-canvas-guide`, `--cs-canvas-guide-on`(전용 마젠타, 결정 4), `--cs-canvas-guide-user`(info 9 유지).

**옛 토큰 → 새 토큰**

| 지금 | 새 이름 | 비고 |
|---|---|---|
| `accent.solid`, `accent.fill` | `accent-solid` | 둘이 라이트에서 단계가 달랐음(7/8). 하나로 합침 |
| `accent.hover`, `accent.fill-hover` | `accent-solid-hover` | |
| `accent.text`, `text.link` | `accent-text` (`text-link`는 별칭 유지) | |
| `accent.soft` (알파) | `accent-soft` (불투명 3) | |
| `accent.tint` | `accent-tint` (2) | |
| `accent.border` (알파 .45–.5) | `accent-border-strong` (7) | |
| `{status}.solid` / `.text` / `.on` | 같은 이름, 단계 9 / 11 / on | |
| `{status}.soft` (알파 .2–.3) | `{status}-soft` (불투명 3) | |
| (없음) | `{status}-soft-hover`, `-soft-pressed`, `-border`, `-border-strong`, `-graphic`, `-solid-hover`, `-tint` | 조사에서 누락 슬롯 1순위 |
| `fill.hover` / `.pressed` / `.selected` | `neutral-hover` / `-pressed` / `-selected` | 쉬고 있는 상태의 채움으로 쓰던 곳은 `neutral-track` / `-well`로 |
| `ink.solid` / `.hover` / `.on` / `.on-muted` | `ink-solid` / `-solid-hover` / `-on` / `-on-muted` (유지) | accent와 합치지 않는다(결정 1). 다크에서 잉크는 회색 버튼, accent는 흰색으로 역할이 다르다 |
| `canvas.guide` / `.guide-on` (danger 빌림) | `canvas-guide` / `-guide-on` (전용 마젠타) | 결정 4 |
| `field-required-mark`의 `danger.text` | `required-mark` (= `text-tertiary`) | 결정 6 |
| `diff.add` / `.remove` (알파) | `diff-add-bg` / `-remove-bg` (success·danger 2–3), `diff-add-text` / `-remove-text` (11) | |
| `chart.1–4` | `chart-1..6` | extra 1·2를 5·6으로 정식 편입 |
| `--cs-spectrum-1..3` (고정 oklch) | `agent-stop-1..3` (라이트/다크) | |

**지울 토큰:** `accent.fill`, `accent.fill-hover`(중복), `accent.glow`(agent 패밀리로 이동), 모든 `*.soft` 알파 정의, `material.rim`(두 모드 모두 투명이라 아무것도 그리지 않음). `ink.*`는 지우지 않는다(결정 1).

---

## 4. 불일치 목록

경로는 `packages/react/src/components/` 기준이다. 심각도 기준: **상**은 접근성 문제이거나 사용자가 바로 알아챔, **중**은 같은 의미가 다르게 보임, **하**는 정리 수준.

### A. 상태가 바뀌면 강조 단계가 튐 (9)
| # | 컴포넌트 | variant · 상태 | 지금 | 제안 칸 | 심각도 | 위치 |
|---|---|---|---|---|---|---|
| A1 | button | tone=danger · hover | soft → solid | soft 3→4 | 상 | button/button.variants.ts:18 |
| A2 | chip | aria-pressed (모든 tone) | tone soft → ink-solid | 그 톤의 soft selected | 상 | chip/chip.variants.ts:8 |
| A3 | chip | appearance=solid/outline + tone | tone 클래스가 appearance를 덮음 → 전부 soft | solid 9 / outline 6 | 상 | chip/chip.variants.ts:21-24 |
| A4 | file-upload | hover · 드래그 | 뉴트럴 → accent-soft + accent-solid 점선 | 뉴트럴 outline hover | 중 | file-upload/file-upload.variants.ts:8 |
| A5 | composer | 실행 중 정지 버튼 | ink solid → fill-selected | solid 유지 | 중 | composer/composer.variants.ts:19 |
| A6 | floating-bar | pressed vs active | fill-selected와 ink-solid, "켜짐"이 두 단계 | 뉴트럴 soft selected 하나 | 중 | floating-bar/floating-bar.variants.ts:35-36 |
| A7 | contrast-chip / contrast-insight | WCAG 등급 배지 | solid / soft | 둘 다 soft | 중 | contrast-chip.variants.ts:24-25, contrast-insight.variants.ts:24-25 |
| A8 | toast | tone별 액션 | success는 ghost, agent는 ink(solid) | 둘 다 text | 하 | toast/toast.tsx:54 |
| A9 | stack-row | hidden | 행은 opacity-64인데 meta는 tertiary → primary로 더 진해짐 | disabled 색 | 하 | stack-row/stack-row.variants.ts:31 |

### B. "선택됨"이 다섯 가지 모양 (10)
| # | 컴포넌트 | 상태 | 지금 | 제안 칸 | 심각도 | 위치 |
|---|---|---|---|---|---|---|
| B1 | menu, model-menu, select, combobox, icon-toggle, option-tiles, layer-tree, table, revision-history | selected | accent-soft (알파) | accent soft selected (5 + 테두리 7 + 체크) | 중 | menu/menu.variants.ts:14, table/table.tsx:117, revision-history.variants.ts:8 |
| B2 | list-navigation, pagination, segmented(raised), toggle-group, table 페이지 | selected | control-raised + control-edge | "세그먼트 썸"으로 따로 유지(컨트롤 패밀리) | 중 | list-navigation.variants.ts:14-15, pagination.variants.ts:20-21, toggle-group.variants.ts:21 |
| B3 | page-list, session-list | 현재 항목 | fill-pressed | B2와 통일 | 중 | page-list/page-list.tsx:50, session-list.variants.ts:10 |
| B4 | icon-button ghost, floating-bar, foundation-toolbar, color-picker, segmented(outline) | pressed | fill-selected | 뉴트럴 soft selected | 중 | icon-button.variants.ts:13, foundation-toolbar.variants.ts:21 |
| B5 | constraints-control 핀 | pressed | accent-solid | accent soft selected | 중 | constraints-control.variants.ts:13 |
| B6 | font-options | pressed | accent-soft + accent-text | accent soft selected | 하 | font-options.variants.ts:25 |
| B7 | list-selection | selected | 채움 없음, 체크 박스만 | 뉴트럴 soft selected + 체크 | 하 | list-selection.variants.ts:26-33 |
| B8 | card-action | checked | accent.tint + focus-field | accent soft selected | 중 | card-action.variants.ts:12-13 |
| B9 | menu, option-tiles, layer-tree, icon-toggle, pagination | selected + hover | 정의 없음, CSS 순서가 결정 | selected-hover 슬롯 | 중 | option-tiles.variants.ts:12-13, pagination.variants.ts:18-20 |
| B10 | model-menu | selected | 강조 신호 두 개(accent-soft + accent-text 아이콘) | 하나 | 하 | model-menu.variants.ts:31,45 |

### C. hover가 fill-hover와 fill-pressed로 섞임 (4)
| # | 컴포넌트 | 지금 | 제안 | 심각도 | 위치 |
|---|---|---|---|---|---|
| C1 | menu, model-menu, icon-button, icon-toggle, inspector-select, zoom-control, step-slider, chip 제거, dialog 닫기, floating-bar, foundation-toolbar, font-picker, composer 모델 | hover = fill-pressed | `neutral-hover` 하나 | 중 | menu.variants.ts:14, zoom-control.variants.ts:20,37, button.variants.ts:17 |
| C2 | list, list-navigation, page-list, pagination, layer-tree, option-tiles, reading-order, revision-history, session-list, table, stepper-input, clarification | hover = fill-hover | (기준) | – | |
| C3 | color-picker format, font-picker trigger, code-realization target, 움푹한 input, number-field | 쉬는 상태가 fill-hover라서 hover가 pressed로 한 칸 위 | `neutral-well`(쉼) → `neutral-hover` | 중 | input.variants.ts:21, number-field.tsx:125 |
| C4 | align-bar, alignment-pad, angle-dial (fill.hover) / badge neutral, card 아이콘, card-well (fill.pressed) / token-chip | 인터랙션 토큰을 쉬는 상태 채움으로 씀 | `neutral-track` / `-well` | 중 | align-bar.variants.ts:3, badge.variants.ts:8, card-well.tsx:13, token-chip.variants.ts:8 |

### D. invalid 무게가 세 가지 (5)
| # | 컴포넌트 | 지금 | 제안 | 심각도 | 위치 |
|---|---|---|---|---|---|
| D1 | input 기본, input-group, otp-input, picker-trigger, textarea, stepper-input, tag-input | danger-solid 안쪽 테두리만 | danger subtle 테두리 7 | 중 | input.variants.ts:16, otp-input.variants.ts:10 |
| D2 | 움푹한 input, number-field, hex-input | danger-soft 채움 + danger-solid 테두리 | D1과 같음 | 중 | input.variants.ts:21, number-field.tsx:125, hex-input.variants.ts:8 |
| D3 | inspector-select, checkbox | invalid 없음 | 추가 | 중 | |
| D4 | stepper-input, tag-input, textarea / picker-trigger | invalid + focus에서 하나가 다른 하나를 지움 | 테두리 7 + 바깥 focus 링 | 상 | stepper-input.tsx:57, tag-input.tsx:71, textarea.variants.ts:10, picker-trigger.variants.ts:9 |
| D5 | tool-call failed / token-graph missing | 뉴트럴 테두리 + danger-soft / danger-soft + danger-solid 테두리 | danger subtle | 하 | tool-call.variants.ts:8,20, token-graph.variants.ts:23 |

### E. 상태 색을 상태가 아닌 의미에 씀 (15)
| # | 컴포넌트 | 지금 | 제안 | 심각도 | 위치 |
|---|---|---|---|---|---|
| E1 | code-diff 구문색 | info/success/accent text | syntax.* | 중 | code-diff.variants.ts:42 |
| E2 | code-diff, code-realization의 +/− 기호와 개수 | success/danger text | diff-*-text | 하 | code-diff.variants.ts:14,16,34, code-realization.variants.ts:44-45 |
| E3 | field 필수 별표 | danger-text | 뉴트럴(§8 질문 6) | 하 | field/field.tsx:79 |
| E4 | canvas-guide, motion-timeline 플레이헤드 | coral(=danger 색) | canvas 패밀리 자체 색 | 중 | canvas-guide.variants.ts:10-13, motion-timeline.variants.ts:30,32 |
| E5 | layer-tree "컴포넌트" | identity-iris와 info를 같이 씀 | 범주 색 하나 | 중 | layer-tree.variants.ts:13,25,28,31 |
| E6 | position-size hug / fill | info-soft / accent-soft | 뉴트럴 subtle + 아이콘 | 하 | position-size.variants.ts:16-17 |
| E7 | append-list 아이콘, card 머리말, section-header 머리말·링크, suggestions 아이콘 | accent-text / info-text 장식 | 뉴트럴 글자 / text-link | 하 | append-list.variants.ts:22, card.tsx:37, section-header.tsx:27,46, suggestions.tsx:31 |
| E8 | effect-editor 배경 줄무늬 | accent-soft + info-soft | 패턴 슬롯 | 하 | effect-editor.variants.ts:26,28 |
| E9 | card-stat 스파크라인, context-analytics 출력, motion-timeline 막대 | accent-solid / accent-soft | chart 패밀리 | 중 | card-stat.tsx:68-73, context-analytics.variants.ts:20, motion-timeline.variants.ts:21 |
| E10 | list-actions 뉴트럴 액션 | identity-slate | neutral solid | 하 | list-actions.variants.ts:49 |
| E11 | toast success 마크 | success-solid 위에 text-accent-on | success-on | 하 | toast.variants.ts:25 |
| E12 | model-menu 제공자 마크 | ink-solid + text-inverse | ink(accent)-on | 하 | model-menu.variants.ts:36 |
| E13 | list 셰브론, nav 셰브론, layer-tree 펼침, code-diff 줄번호, floating-bar 단축키 | 동작하는 요소에 text-disabled | 뉴트럴 graphic / tertiary | 중 (대비) | list.variants.ts:109, code-diff.variants.ts:31, floating-bar.tsx:123 |
| E14 | step-slider, tabs 인디케이터, spinner, stroke-editor, checkpoint 점 | 글자 토큰을 채움에 씀 | 뉴트럴 graphic / accent solid | 하 | step-slider.tsx:52, tabs.tsx:51, spinner.variants.ts:8, checkpoint-timeline.variants.ts:30 |
| E15 | 스크롤바 썸, 시트 손잡이, 구분선 | 테두리 토큰을 채움에 씀 | neutral-track / divider | 하 | scroll-area.variants.ts:10, sheet.tsx:50, align-bar.tsx:44 |

### F. 빠진 톤과 슬롯 (10)
| # | 내용 | 심각도 | 위치 |
|---|---|---|---|
| F1 | 상태 테두리 토큰 없음(4색 모두). 그래서 `danger-solid`를 1px 테두리로 빌려 씀 | 상 | input, hex-input, file-upload, inspector-bindings.variants.ts:28 |
| F2 | 상태 hover와 pressed 없음(solid-hover, soft-hover) | 상 | button, list-actions.variants.ts:45-51 |
| F3 | alert에 success 없음(banner에는 있음) | 중 | alert/alert.variants.ts:7 |
| F4 | toast는 success와 agent만 있음 | 중 | toast/toast.store.ts:4 |
| F5 | chip에 accent 톤 없음, 상태 톤별 solid/outline 없음 | 중 | chip/chip.variants.ts:21-24 |
| F6 | contrast-chip/insight에 warning(AA large) 없음 | 하 | contrast-chip.variants.ts:24-25 |
| F7 | progress에 상태 톤 없음 | 하 | progress/progress.variants.ts:10 |
| F8 | field, file-upload에 warning 없음 / code-realization에 danger 없음 | 하 | |
| F9 | focus 링 간격이 `surface.base`로 고정돼 calendar, app-shell, avatar에서 틀림 | 중 | calendar.variants.ts:18, avatar.variants.ts:3 |
| F10 | identity 색에 다크 매핑 없음 | 하 | tokens.mjs identity.* |

### G. 선택을 focus 링으로 그림 (9, 모두 상: 포커스와 선택을 구분할 수 없음)
card-action (card-action.variants.ts:12-13) · choice-cards (choice-cards.variants.ts:9) · clarification (clarification.variants.ts:11) · color-well (color-well.variants.ts:7) · gradient-editor 점 (gradient-editor.variants.ts:43) · gradient-strip (gradient-strip.variants.ts:27) · option-tiles (option-tiles.variants.ts:13) · swatch-strip (swatch-strip.variants.ts:10) · theme-gallery (theme-gallery.variants.ts:14)
→ 모두 `selection-edge`(테두리 7/8)와 체크 표시로 바꾼다.

### H. 리터럴 색과 의미 층 밖의 값 (8)
| # | 내용 | 심각도 | 위치 |
|---|---|---|---|
| H1 | elevation 그림자가 리터럴 oklch(그림자 색 토큰 없음) | 하 | dist caustic.tokens.css:520-532 |
| H2 | spectrum 정지점이 리터럴이고 다크 매핑이 없음. agent-cursor는 정지점을 직접 읽음 | 중 | agent-cursor.tsx:27-29 |
| H3 | card-glass 픽스처 `oklch(1 0 0 / .4)` | 하 | card-glass.fixture.tsx:37 |
| H4 | card-media 픽스처가 칩·버튼 색을 덮어씀 | 하 | card-media.fixture.tsx:24,28 |
| H5 | change-detail 픽스처 `#2b1d14` | 하 | change-detail.fixture.tsx:6 |
| H6 | dialog 픽스처 `bg-[oklch(...)]` 무대 | 하 | dialog.fixture.tsx:15 |
| H7 | color-picker, color-plane의 `hsl()`(색 계산이라 허용 목록 후보) | 하 | color-picker.tsx:117,314, color-plane.tsx:76 |
| H8 | popover 화살표가 투명한 `material-rim`으로 칠해 아무것도 그리지 않음 | 하 | popover.variants.ts:21-24 |

### I. disabled를 opacity로 처리 (1행, 37개 컴포넌트)
`opacity-42`를 요소 전체에 건다(button, checkbox, chip, choice-cards, composer, file-upload, floating-bar, font-picker, grid-tracks, hex-input 등 37개). 그래서 disabled 상태의 톤이 사라지지 않고 흐려지기만 하며, 색 토큰도 없다. → disabled 축 슬롯으로 바꾼다.

**합계:** A 9 · B 10 · C 4 · D 5 · E 15 · F 10 · G 9 · H 8 · I 1(37개) = **71행**. 상 15 · 중 28(I 포함) · 하 27 · 기준행 1(C2).

---

## 5. 희석 분석 (soft가 고른 색을 얼마나 남기나)

지금 soft는 solid를 투명도 .16–.30으로 표면 위에 얹은 색이다. 브라우저는 감마가 적용된 sRGB 공간에서 색을 섞으므로, 그 방식으로 계산하면 다음과 같다.

| | 고른 solid C | 지금 soft의 실제 C | 제안 soft(3단계) C |
|---|---|---|---|
| danger (Deep Black, 라이트) | .13 | **.018** (≈1/7) | **.034** |
| success | .085 | .013 | .039 |
| info | .075 | .011 | .035 |
| 배포 중 danger(coral.4/.2) | .105 | .019 | – |
| danger 다크 | .11 | – | .051 |

- 투명도 방식에서는 solid 채도를 .13에서 .2로 올려도 soft가 .02 언저리에 머문다. 제안 방식에서는 soft 채도가 고른 채도에 **비례해서** 따라간다. 3단계는 46%이고, 상한은 sRGB 색역이다.
- 불투명 soft는 놓이는 표면이 달라도 색이 같다. 투명도 방식은 surface, raised, glass 위에서 각각 달라 보인다.
- 테두리 단계(6/7)를 새로 두면 연한 배경에서도 그 톤이 무슨 색인지 드러난다. 배지, 알림, 잘못된 필드에 쓴다.
- 빌더의 대비 계산도 고쳤다. 원래 선형광 공간에서 섞어 배지 대비를 실제보다 높게 계산하고 있었는데, 이제 감마 sRGB로 섞는다(`color.ts` `over()`).

---

## 6. 다크 neutral 램프 (결정 5: 2–11단계를 조금 어둡게)

역할 연결은 그대로 둔다: canvas 1, app 2, surface 3, raised 4. 대신 Deep Black `neutral-dark`의 **2–11단계 값**을 조금 내린다. 1단계(.09)는 그대로다. 안 A(연결을 한 칸 내리기)는 채택하지 않았다.

| 단계 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 이전 | .09 | .16 | .215 | .27 | .39 | .56 | .62 | .67 | .72 | .81 | .97 |
| Subtle | .09 | .145 | .195 | .245 | .365 | .545 | .605 | .655 | .71 | .80 | .965 |
| **A bit more (결정)** | .09 | .135 | .18 | .225 | .345 | .535 | .595 | .645 | .70 | .795 | .96 |

| 확인 (다크, 감마 기준) | 이전 | Subtle | A bit more | 기준 |
|---|---|---|---|---|
| app → surface ΔL | .055 | .050 | .045 | ≥ .045 |
| surface → raised ΔL | .055 | .050 | .045 | ≥ .045 |
| text primary 최저 (raised) | 13.82 | 14.66 | 15.23 | 4.5 |
| text secondary 최저 (raised) | 8.34 | 8.69 | 9.00 | 4.5 |
| text tertiary 최저 (raised) | 6.07 | 6.30 | 6.40 | 4.5 |
| placeholder 최저 (raised) | 5.03 | 5.12 | 5.19 | 4.5 |
| border-control 최저 (raised) | 3.24 | 3.27 | 3.31 | 3 |

- 배경 사다리(2–4)가 .015–.045 내려가고, 글자 단계(9–11)는 .005–.02만 내려간다. 그래서 대비는 오히려 조금 오른다.
- 단계 문법과의 관계: 다크 색 틴트 1–5는 L .225–.355에 고정돼 있다. surface가 .215에서 .195(Subtle)로 내려가 1단계와의 차이가 .01에서 .03으로 늘어, 다크 soft와 틴트가 조금 더 분명해진다.
- 빌더 Neutrals 아래 **Dark ramp: Subtle / A bit more / Previous**로 비교한다. 결정 페이지 5번도 세 램프를 나란히 보여준다.

---

## 7. 이전 단계와 비용

| 단계 | 내용 | 손대는 컴포넌트 | 기준 스크린샷 | 스펙 승인 |
|---|---|---|---|---|
| 1 (지금) | 이 문서와 빌더 미리보기 | 0 | 0 | 0 |
| 2 토큰 | 모드별 램프(accent, 4개 상태, agent, 뉴트럴) 추가, 슬롯 토큰 추가(옛 이름은 별칭으로 유지), soft를 불투명으로 | 0 (토큰만) | soft·상태 글자를 쓰는 49 + 34개 컴포넌트의 기준이 바뀜. 기준 세트 112개(262장) 대부분 재촬영 | 없음 (토큰 전용 스펙은 없다. 바인딩이 같은 스펙은 별칭으로 유지) |
| 3 컴포넌트 | 색 토큰을 쓰는 134개를 슬롯으로 옮김, §4의 71행 수정, disabled 37개를 색으로 | 134 | 112개 세트 전부 | 새 톤·상태가 생기는 약 10개: alert, toast, chip, progress, contrast-chip/insight, field, file-upload, checkbox, inspector-select (+ agent-recovery 트랙의 실패 상태) |
| 4 게이트 | 아래 규칙을 gateway 검사로 추가 | 0 | 0 | 0 |

**추가할 게이트 규칙**
1. 컴포넌트는 슬롯 토큰만 참조한다: `--cs-{tone}-{slot}`, 뉴트럴 슬롯, 축 토큰, 패밀리 토큰. 램프를 직접 읽거나 알파를 붙인 토큰(`/50`)은 실패다.
2. opacity로 disabled를 처리하지 않는다(`opacity-*` + disabled 조합은 실패).
3. hover와 pressed는 rest와 같은 강조 단계의 슬롯만 쓴다. 예: soft rest에 solid hover는 실패.
4. selected는 focus 토큰(`--cs-focus*`, `focus-ring`)을 쓰지 않는다.
5. invalid + focus 조합에서 둘 다 보여야 한다.
6. 허용 목록(색 계산, content 픽스처) 밖에서는 리터럴 색을 쓰지 않는다.
7. 슬롯 쌍마다 대비를 검사한다: text 11 대 soft 3–5와 surface는 4.5 이상, on 대 solid 9는 4.5 이상(accent·danger) 또는 3 이상, graphic 8 대 surface는 3 이상.

---

## 8. 오너 확인이 필요한 질문 (모두 해결, 2026-10-25)
아래 "결정 (2026-10-25)" 절에 답을 적었다. 남은 질문은 없다.

## 결정 (2026-10-25)
오너가 `#/lab/decisions`에서 고른 답이다.

| # | 질문 | 결정 | 반영 |
|---|---|---|---|
| 1 | `ink.*`를 `accent-*`에 합칠까 | **따로 둔다** | `ink-*` 슬롯 유지. 다크에서 잉크(회색 버튼)와 accent(흰색)의 역할이 다르다 |
| 2 | 뉴트럴 hover·pressed·selected | **뉴트럴은 알파, 색 있는 soft만 불투명** | `neutral-hover/-pressed/-selected/-selected-hover`는 알파로 남고, `{tone}-soft*`만 램프 3–5 |
| 3 | 리스트·메뉴 선택 | **뉴트럴** | `neutral-selected` + 체크 + 뉴트럴 테두리 7(`selection-edge`). menu, model-menu, layer-tree, icon-toggle, option-tiles, list-navigation, pagination, page-list가 accent soft·control-raised·fill-pressed에서 옮겨 온다 |
| 4 | 캔버스 가이드 색 | **캔버스 전용 마젠타** | `canvas-guide` 라이트 oklch(.60 .20 345), 다크 oklch(.72 .17 345), `canvas-guide-on`은 잉크/종이 중 대비가 큰 쪽 |
| 5 | 다크 surface | **연결은 그대로, `neutral-dark` 2–11을 조금 어둡게 (A bit more)** | §6 표. 안 A는 채택하지 않음 |
| 6 | 필수 입력 별표 | **뉴트럴** | `required-mark` = `text-tertiary`. danger는 실제 오류에만 |
| 7 | 라이트의 밝은 solid (L > .7) | **허용** | solid 상한 없음. ~~graphic 8이 solid보다 어두울 수 있다~~ (결정 10: 8은 9를 따른다) |

## 결정 (2026-10-26)

| # | 질문 | 결정 | 반영 |
|---|---|---|---|
| 8 | 선택된 항목 (결정 3을 바꿈) | **반전 채움, 칩 solid(ink)와 같은 색 (안 B)** | `selected` 유틸리티: `selection.fill`(= ink.solid) 바탕, `selection.on` 글자, 테두리 없음. 안쪽 보조 글자·아이콘·체크도 불투명 단계로 함께 뒤집힌다. 사이드바·페이지 번호 같은 "현재 위치" 썸은 그대로 |
| 9 | 반투명 배경 (결정 2를 바꿈) | **표면별 불투명 값** | 뉴트럴 hover·pressed·selected·selected-hover·track·well과 `bg.inset`은 표면마다 그 위에 합성한 불투명 색으로 나간다(`--…--on-<surface>`). 표면 클래스가 자기 위 값으로 바꿔 끼운다. scrim·이미지 위 칩·캔버스 표시·테두리는 알파로 남는다 |
| 10 | 램프 순서 (결정 7을 바꿈) | **고른 색(9) 기준으로 한 방향** | 8은 3:1로 끌어내리지 않는다. 9가 6보다 밝으면 6–8이 5와 9 사이에 놓인다. graphic 8·차트 대비는 경고로만 보고 |

빌더의 Proposed language는 결정 2·3·4·6을 반영한다: 매트릭스의 뉴트럴 hover·pressed·selected가 알파 채움이고, "List and menu selection" 줄이 뉴트럴 선택을 보여주며, 가이드는 마젠타, 필수 별표는 text-tertiary다.

---

## 빌더에서 보는 법 (`#/lab/builder`)
- Neutrals 아래 **Dark ramp**(A bit more 기본 / Subtle / Previous)로 다크 램프를 비교한다.
- 툴바에서 **Current / Proposed language**를 고른다. Proposed를 켜면 각 색 컨트롤 아래에 1–11 램프가 나타나고(9에 표시), 대비 칩이 슬롯 기준으로 바뀐다.
- "Emphasis × tone matrix" 섹션: 모든 톤 × 강조 × 상태(rest, hover, pressed, selected, focus, disabled)를 `--lang-*` 슬롯 변수로 직접 그린다.
- 아래 실제 컴포넌트 시나리오는 기존 시멘틱 변수를 슬롯에 다시 연결해서 보여준다(solid 9, soft 3, text 11, accent border 7, diff 3). 컴포넌트에 새 슬롯이 아직 없으므로, hover와 테두리 차이는 매트릭스에서만 보인다.
- Copy JSON과 Copy CSS에 이 토글 상태와 `--lang-*` 램프가 포함된다.

---

## 2단계 실행 계획 (초안, 아직 시작하지 않음)

§7의 2–4단계를 실제로 옮기는 순서다. 각 묶음은 따로 커밋하고, 묶음마다 `pnpm gate <묶음 컴포넌트>`를 한 번 돌린다. 기준 스크린샷 재촬영과 `spec:approve`는 오너 단계다.

### 2-1. 토큰 구조 (`packages/tokens`)
1. **모드별 램프.** `neutral-light-1..11`, `neutral-dark-1..11`(Deep Black, 다크는 A bit more)을 따로 정의한다. 지금처럼 한 램프를 뒤집지 않는다. 색 있는 램프도 `{hue}-light-1..11`, `{hue}-dark-1..11`로 나눈다: accent(잉크), success, warning, danger, info, agent 1–3, extra 1–2, canvas-guide.
2. **램프 생성.** `build.mjs`가 빌더의 `hueRamp()`와 같은 규칙으로 9단계(고른 solid)에서 1–11을 만든다. 1–6은 고정 명도, 채도는 solid의 비율, 8은 표면 대비 3, 11은 표면과 soft 3–5 위 4.5. 고른 값은 `tokens.mjs`에 모드별 solid 하나씩만 둔다.
3. **슬롯 토큰.** `--cs-{tone}-{slot}`(§3), 뉴트럴 인터랙션 슬롯(알파), 축 토큰(`focus-ring`, `focus-offset`, `selection-edge`, `disabled-*`, `required-mark`), 패밀리 토큰(`canvas-guide*`, `chart-1..6`, `agent-stop-1..3`, `diff-*-bg/-text`, `syntax-*`).
4. **별칭(전환 기간).** 옛 이름은 새 슬롯을 가리키는 별칭으로 남긴다: `danger.soft` → `danger-soft`(불투명 3), `accent.fill` → `accent-solid`, `fill.hover` → `neutral-hover` 등. 별칭은 3단계 컴포넌트 이전이 끝나고 게이트 규칙 1이 켜질 때 지운다.
5. **검사.** `tokens:check` 대비 표에 슬롯 쌍(§7 게이트 규칙 7)과 다크 neutral 표(§6)를 넣는다.

이 단계만으로도 soft가 불투명해지고 다크 배경이 어두워지므로, 컴포넌트 코드를 건드리지 않아도 **기준 스크린샷 112세트(262장) 대부분이 바뀐다**. 그래서 2-1과 2-2의 첫 묶음 사이에 한 번 재촬영 승인을 받는다.

### 2-2. 컴포넌트 이전 (묶음별)
| 묶음 | 컴포넌트 수 | 색 토큰 사용 | 기준 세트 (장) | 주요 작업 |
|---|---|---|---|---|
| B1 기본 컨트롤 (button, chip, badge, checkbox, switch, slider, progress, avatar …) | 23 | 21 | 11 (24) | danger 버튼 hover를 soft 안에서, chip의 tone이 appearance를 덮는 문제, 눌린 chip이 잉크로 바뀌는 문제, disabled를 색으로 |
| B2 폼·필드 (field, input, textarea, select, combobox, calendar, file-upload …) | 18 | 16 | 10 (26) | invalid = danger subtle 테두리 7 + focus 함께, 필수 별표 뉴트럴, `focus-field`로 그리던 선택 분리 |
| B3 피드백·상태 (alert, banner, toast, empty-state, permission/review-request …) | 10 | 10 | 9 (18) | 빠진 톤 추가(alert success, toast warning/danger/info), subtle 강조로 통일 |
| B4 리스트·내비·메뉴 (list*, menu, model-menu, tabs, pagination, layer-tree, table …) | 20 | 19 | 19 (48) | 선택을 뉴트럴 + 체크 + 테두리로, hover를 `neutral-hover` 하나로 |
| B5 에이전트 (message, composer, plan, activity-tree, tool-call, code-diff, checkpoint …) | 19 | 18 | 14 (28) | agent 패밀리 슬롯, diff/syntax 전용 토큰, agent-recovery 트랙의 실패 상태와 합치기 |
| B6 캔버스·인스펙터 (canvas-*, inspector-*, floating-bar, toolbar, motion-timeline …) | 27 | 19 | 14 (36) | 가이드 마젠타, 플레이헤드, 툴바 눌림/선택 통일 |
| B7 색·페인트·타입·토큰 (color-*, gradient-*, paint-*, font-*, token-graph …) | 24 | 18 | 18 (38) | 선택을 focus 링에서 분리, hsl() 색 계산은 허용 목록 |
| B8 컨테이너·카드 (card*, dialog, modal, sheet, popover, app-shell …) | 17 | 14 | 17 (44) | 쉬는 상태의 `fill.pressed`를 `neutral-well`로, 포커스 간격 색을 표면 따라 |
| **합계** | **158** | **135** | **112 (262)** | |

순서는 B1 → B2 → B3 → B4 → B5 → B8 → B6 → B7을 권한다. 앞 묶음의 버튼·필드·배지가 뒤 묶음 안에 들어가므로, 뒤 묶음 기준은 앞 묶음이 끝난 뒤에 한 번만 다시 찍는다.

### 2-3. 게이트 규칙
§7의 규칙 1–7을 `packages/gateway`의 검사로 추가한다. 별칭이 남아 있는 동안 규칙 1은 경고로 두고, 모든 묶음이 끝나면 차단으로 바꾼다. 나머지 규칙은 해당 묶음이 끝나는 즉시 그 묶음에 대해 차단으로 켠다.

### 2-4. 오너 승인이 필요한 스펙
스펙은 `expect`에 토큰 이름을 고정한다. 별칭 덕분에 이름이 같은 곳(예: `danger.soft`)은 값만 바뀌고 스펙은 그대로다. 스펙이 바뀌는 곳은 **바인딩 자체가 바뀌는 컴포넌트**다.
- 선택 표시 변경(accent soft → 뉴트럴 선택): `accent.soft`를 선택에 쓰는 스펙 중 menu, model-menu, layer-tree, icon-toggle, list-selection, option-tiles, font-options, font-picker, combobox, calendar 등 약 15개.
- 선택을 focus로 그리던 곳: card-action, choice-cards, clarification, color-well, gradient-editor, gradient-strip, option-tiles, swatch-strip, theme-gallery (9개).
- hover 통일(`fill.pressed` → `neutral-hover`): `fill.pressed`를 hover로 고정한 스펙 약 13개.
- disabled를 색으로: `opacity`를 규칙에 적은 스펙 중 disabled 관련 약 37개.
- 새 톤·상태: alert(success), toast(warning/danger/info, failed), chip, progress, contrast-chip/insight(warning), field(required mark), file-upload, checkbox, inspector-select(invalid), button(danger hover) — 약 10개. agent-recovery 트랙에서 이미 요청한 checkpoint-timeline, plan, toast, activity-tree 변경과 같이 승인받는다.
- canvas-guide, motion-timeline: 토큰 이름은 같고 값만 바뀌므로 스펙은 그대로, 기준만 재촬영.

중복을 빼면 **약 60–70개 스펙**이 바뀐다. 묶음마다 해당 스펙 변경을 모아 한 번에 승인을 요청한다(묶음당 1회, 총 8회 + 토큰 단계 1회).
