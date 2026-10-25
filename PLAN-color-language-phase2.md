# 컬러 랭귀지 2단계 실행 계획 (2026-10-25)

기준: `PROPOSAL-color-language.md`의 결정 7개, 다크 뉴트럴은 **A bit more**(`.09 .135 .18 .225 .345 .535 .595 .645 .70 .795 .96`).
브랜치: `design/color-language` (= design/showcase + design/agent-recovery 병합).

## 운영 규칙
- 오너가 이 계획의 실행을 자동 승인했다. 단 `spec:approve`와 기준 스크린샷 재촬영은 오너 단계라 하지 않는다. 바뀐 스펙과 기준 목록을 보고에 남긴다.
- 메모리: 무거운 명령은 `WS_GUARD_SLOTS=1 WS_GUARD_VERIFY_MAX=2G scripts/guard.sh verify -- …`(타입체크, 게이트), 브라우저는 `scripts/guard.sh browser`(2G). 한 번에 하나.
- 병렬 에이전트는 같은 worktree에서 **자기 묶음 파일만** 고치고 커밋하지 않는다. 커밋은 교차 점검 뒤 묶음별로 한다.
- `just verify`는 보고 직전에 한 번만 돌린다.

## 단계
| 단계 | 내용 | 병렬 |
|---|---|---|
| T | `packages/tokens`: 모드별 램프(neutral-light/-dark, 색마다 light/dark 1–11, 9 = 고른 solid), 슬롯 토큰 `--cs-{tone}-{slot}`, 축·패밀리 토큰, 옛 이름 별칭, theme.css의 Tailwind 이름, tokens:check 대비 표 | 1 에이전트 |
| G | `packages/gateway`: 제안서 §7 게이트 규칙 1–7. 규칙 1(슬롯 토큰만)은 경고로 시작 | T와 동시 1 에이전트 |
| X1 | T·G 교차 점검 (메인) | — |
| B1–B8 | 컴포넌트 묶음 이전 + 해당 스펙의 `styles.expect` 갱신 + fixture. 묶음 목록은 `scratchpad/lang/batches.json` | 8 에이전트 동시 |
| X2 | 묶음별 교차 점검: 규칙 위반 grep, 게이트(G4 제외) 결과, 문서 앱 화면 점검 (메인) | — |
| F | 교차 점검에서 나온 수정 | 필요한 만큼 |
| V | 규칙 차단 전환 가능한 것 전환, `just verify` 1회, 보고 | — |

## 기대 결과와 남는 것
- G4(시각 기준)는 대부분 달라진다: 재촬영은 오너 승인 뒤 `pnpm baseline`.
- 스펙이 바뀐 컴포넌트는 G1이 "미승인"으로 실패한다: 오너가 `pnpm spec:approve <ids>`.
- 위 두 가지 외의 실패는 이 계획 안에서 고친다.
