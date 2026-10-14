# justfile 계약 v1 (전체: ws help justfile). 고치기 전에 읽는다.
# 1. 공개 레시피 이름은 동사 사전에서 고른다(ws help verbs). 없는 동사가 필요하면 저장소 고유 이름 + [group('local')].
# 2. 변형은 레시피를 늘리지 말고 env/target/mode 값으로 추가한다. 새 env는 `just env-add <env>`.
# 3. 기기를 넘는 일은 `ws on`, 비밀은 `secrets`. ssh·sops·절대 경로·비밀 값 출력 금지.
# 4. 레시피 본문이 10줄을 넘으면 scripts/<이름>.sh로 옮긴다.
# 5. verify에서 단계를 빼거나 약하게 바꾸려면 주인 확인을 받는다.
# 6. 앱 스크립트(package.json 등)를 바꾸면 그것을 부르는 레시피도 같은 커밋에서 고친다.
# 7. 환경·비밀 동사(secret-add, dotenv …)는 ~/.config/ws/ws.just에서 온다. 여기서 다시 만들지 않는다.
# 8. 고친 뒤 `just --list`, `just verify`.
set shell := ["bash", "-euo", "pipefail", "-c"]
set allow-duplicate-recipes
import? '~/.config/ws/ws.just'

envs := "dev"

# 준비: 잠금 파일(pnpm-lock.yaml) 기준으로 의존성 설치
[group('setup')]
setup:
    pnpm install --frozen-lockfile

# 타입 검사 (tsc --noEmit)
[group('quality')]
typecheck:
    pnpm typecheck

# 완료 기준: 의존성, 타입, 토큰 검사, 게이트 전부(gate:all), ws check (ws help justfile)
[group('quality')]
verify: setup typecheck
    pnpm tokens:check
    pnpm gate:all
    ws check

# 생성 파일 갱신: 토큰 빌드(dist)와 레지스트리(index, fixtures, specs index)
[group('build')]
codegen:
    pnpm tokens
    pnpm registry

# 컴포넌트 게이트, id를 여러 개 줄 수 있다: just gate button switch
[group('local')]
gate *ids:
    pnpm gate {{ids}}

# 전체 게이트를 병렬 샤드로 (verify의 게이트와 같다)
[group('local')]
gate-all:
    pnpm gate:all

# 문서 사이트 개발 서버 (apps/docs, port 5180)
[group('local')]
docs:
    pnpm docs:dev

# 문서 사이트 빌드 (dist-docs/)
[group('local')]
docs-build:
    pnpm docs:build
