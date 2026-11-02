# Caustic

See `CONTRIBUTING.md`. Checks, in short:

- While working: `just verify` (no gate) and `just gate <id>` for the specs you changed.
- `just verify-merge`, `pnpm gate:all` and CI (`gh workflow run verify --ref <branch>`) run only right before a PR merge, by the main session or the owner. Subagents never run them.
- Run on the Mac when it is available. Never poll with `sleep` loops.
