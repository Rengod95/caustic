#!/usr/bin/env bash
# ws-guard v2
# scripts/guard.sh: tests and verifications under a machine-wide guard (the source is dotfiles modules/ws/templates/guard.sh;
# ws repo new and ws repo adopt copy it, ws stack update guard brings the copy to the newest version).
# Parallel agents that run tests in many worktrees can exhaust a small machine (swap thrashing freezes the VM). So:
#   guard.sh verify -- <cmd...>   a machine-wide slot (flock: at most WS_GUARD_SLOTS verifications at once, the rest wait),
#                                 then the whole command in one systemd user scope, capped at WS_GUARD_VERIFY_MAX
#   guard.sh run -- <cmd...>      the command in one systemd user scope, capped at WS_GUARD_RUN_MAX (no slot)
#   guard.sh browser -- <cmd...>  a headless browser run (screenshots, page checks): a machine-wide browser slot (at most
#                                 WS_GUARD_BROWSER_SLOTS at once, the rest wait), capped at WS_GUARD_BROWSER_MAX
#   guard.sh serve -- <cmd...>    a preview or dev server: a machine-wide server slot, held while the server runs (at most
#                                 WS_GUARD_SERVE_SLOTS at once; when all are taken it does not wait: exit 75 and the list of
#                                 the servers that hold them), capped at WS_GUARD_SERVE_MAX, no time limit
# Every scope sits in the shared slice WS_GUARD_SLICE (ws-dev.slice, installed by the ws module: dot install ws), whose
# limit is the memory budget of all tests and verifications together. Exceeding a cap ends only that run (exit 137).
# Chromium moves one of its processes into its own scope over the D-Bus session bus (app-org.chromium.Chromium-*.scope),
# out of the slice and its cap; ten browsers at once froze an 8GB WSL that way. A guarded command therefore runs with
# DBUS_SESSION_BUS_ADDRESS=disabled: (WS_GUARD_DBUS=keep leaves the bus for a command that needs it).
# Inside a guarded run the nested guard.sh calls run the command directly: the outer scope already caps it (and a nested
# verify would wait for a slot its parent holds).
# Without a systemd user session (macOS, CI, containers) the command runs unguarded, with one note on stderr: a repository
# stands alone. The exit code of the command is the exit code of guard.sh (64: a wrong call).
# env: WS_GUARD_SLOTS (2)           verifications at once on this machine
#      WS_GUARD_VERIFY_MAX (3G)     memory cap of one verification
#      WS_GUARD_RUN_MAX (1500M)     memory cap of one run
#      WS_GUARD_BROWSER_SLOTS (1)   browser runs at once on this machine
#      WS_GUARD_BROWSER_MAX (2G)    memory cap of one browser run
#      WS_GUARD_SERVE_SLOTS (4)     servers at once on this machine
#      WS_GUARD_SERVE_MAX (1500M)   memory cap of one server
#      WS_GUARD_DBUS (off)          keep: the guarded command keeps the D-Bus session bus
#      WS_GUARD_TIMEOUT_SEC         seconds a run may take, 0 for no limit (default: run and browser 900, verify and serve none)
#      WS_GUARD_SLICE (ws-dev.slice)  the shared slice
#      WS_GUARD_SAMPLE_SEC (5)      seconds between samples of the top memory users in ~/.cache/ws/guard-mem.log, 0 for none
#      WS_GUARD_POLL_SEC (3)        seconds between looks for a free slot
# Exit codes: the command's; 64 a wrong call; 75 serve: every server slot is taken.
# Bash 3.2 compatible (the Mac's /bin/bash).
set -euo pipefail

guard_usage() {
  cat >&2 <<'EOF'
usage: guard.sh verify -- <command...>   take a machine slot, run the command capped (one verification)
       guard.sh run -- <command...>      run the command capped in the shared slice (one test run)
       guard.sh browser -- <command...>  take the machine's browser slot, run the command capped (screenshots)
       guard.sh serve -- <command...>    take a server slot or exit 75, run the server capped (a preview)
EOF
}

mode="${1:-}"
case "$mode" in
  verify | run | browser | serve) shift ;;
  -h | --help)
    guard_usage
    exit 0
    ;;
  *)
    guard_usage
    exit 64
    ;;
esac
if [ "${1:-}" = -- ]; then shift; fi
if [ "$#" -eq 0 ]; then
  guard_usage
  exit 64
fi

# nested in a guarded run: the outer scope is the cap
if [ -n "${WS_GUARD_ACTIVE:-}" ]; then exec "$@"; fi

slice="${WS_GUARD_SLICE:-ws-dev.slice}"
slots="${WS_GUARD_SLOTS:-2}"
sample_sec="${WS_GUARD_SAMPLE_SEC:-5}"
case "$mode" in
  verify)
    mem="${WS_GUARD_VERIFY_MAX:-3G}"
    timeout_sec="${WS_GUARD_TIMEOUT_SEC:-0}"
    ;;
  browser)
    slots="${WS_GUARD_BROWSER_SLOTS:-1}"
    mem="${WS_GUARD_BROWSER_MAX:-2G}"
    timeout_sec="${WS_GUARD_TIMEOUT_SEC:-900}"
    ;;
  serve)
    slots="${WS_GUARD_SERVE_SLOTS:-4}"
    mem="${WS_GUARD_SERVE_MAX:-1500M}"
    timeout_sec="${WS_GUARD_TIMEOUT_SEC:-0}"
    ;;
  *)
    mem="${WS_GUARD_RUN_MAX:-1500M}"
    timeout_sec="${WS_GUARD_TIMEOUT_SEC:-900}"
    ;;
esac

# a systemd user session that can start scopes ("degraded" only means some unit failed)
guard_systemd() {
  command -v systemd-run >/dev/null 2>&1 || return 1
  command -v systemctl >/dev/null 2>&1 || return 1
  case "$(systemctl --user is-system-running 2>/dev/null)" in
    running | degraded) return 0 ;;
    *) return 1 ;;
  esac
}

if ! guard_systemd; then
  echo "guard.sh: no systemd user session, running $mode without a memory cap or slot" >&2
  if [ "$timeout_sec" != 0 ] && command -v timeout >/dev/null 2>&1; then
    exec timeout "$timeout_sec" "$@"
  fi
  exec "$@"
fi

if ! systemctl --user cat "$slice" >/dev/null 2>&1; then
  echo "guard.sh: $slice is not installed: each run is capped, but there is no shared memory budget (dot install ws)" >&2
fi

# a free slot (verify, browser, serve): a lock file per slot (verify: slotN, browser: browserN, serve: serveN). verify
# and browser wait and retry while all are busy; serve does not wait (a server runs for hours): it names the holders and
# exits 75. The holder writes its pid, folder and command into the lock file it holds.
if [ "$mode" != run ] && command -v flock >/dev/null 2>&1; then
  lock_dir="${XDG_RUNTIME_DIR:-/tmp}/ws-guard"
  mkdir -p "$lock_dir"
  case "$mode" in
    verify) lock_name=slot what="verification" ;;
    browser) lock_name=browser what="browser" ;;
    serve) lock_name=serve what="server" ;;
  esac
  taken=0
  waited=0
  while [ "$taken" = 0 ]; do
    i=1
    while [ "$i" -le "$slots" ]; do
      exec 9<>"$lock_dir/$lock_name$i"
      if flock -n 9; then
        taken=1
        : >"$lock_dir/$lock_name$i"
        echo "$$ ${PWD} $*" >&9
        break
      fi
      exec 9>&-
      i=$((i + 1))
    done
    if [ "$taken" = 0 ]; then
      if [ "$mode" = serve ]; then
        echo "guard.sh: all $slots $what slots of this machine are taken (WS_GUARD_SERVE_SLOTS); stop one of these first:" >&2
        i=1
        while [ "$i" -le "$slots" ]; do
          echo "  $lock_name$i: $(head -n 1 "$lock_dir/$lock_name$i" 2>/dev/null)" >&2
          i=$((i + 1))
        done
        exit 75
      fi
      if [ "$waited" = 0 ]; then
        echo "guard.sh: all $slots $what slots of this machine are busy, waiting" >&2
        waited=1
      fi
      sleep "${WS_GUARD_POLL_SEC:-3}"
    fi
  done
fi

# the top memory users while the command runs (a person reads this after a freeze or an oom-kill)
sampler=""
if [ "$sample_sec" != 0 ] && command -v ps >/dev/null 2>&1; then
  log_dir="${XDG_CACHE_HOME:-$HOME/.cache}/ws"
  log="$log_dir/guard-mem.log"
  mkdir -p "$log_dir"
  if [ -f "$log" ] && [ "$(wc -c <"$log" | tr -d ' ')" -gt 5000000 ]; then mv "$log" "$log.1"; fi
  guard_pid="$$"
  guard_dir="${PWD##*/}"
  (
    while sleep "$sample_sec"; do
      {
        echo "== $(date '+%F %T') $mode $guard_dir pid $guard_pid $(free -m | awk 'NR==2{print "used " $3 "M avail " $7 "M"}')"
        ps -eo rss=,comm= --sort=-rss | head -8
      } >>"$log" 2>&1
    done
  ) >/dev/null 2>&1 9>&- &
  sampler=$!
fi
trap '[ -z "$sampler" ] || kill "$sampler" 2>/dev/null || true' EXIT

args="-p MemoryMax=$mem -p MemorySwapMax=0"
if [ "$timeout_sec" != 0 ]; then args="$args -p RuntimeMaxSec=$timeout_sec"; fi
export WS_GUARD_ACTIVE="$mode"
# systemd-run needs the bus to start the scope; the command inside it does not get it (see the top)
bus=""
if [ "${WS_GUARD_DBUS:-}" != keep ]; then bus="env DBUS_SESSION_BUS_ADDRESS=disabled:"; fi
status=0
# shellcheck disable=SC2086 # args is a list of -p options and bus the env prefix, split on purpose
systemd-run --user --scope --quiet --slice="$slice" --description="ws guard $mode ${PWD##*/}" $args -- $bus "$@" 9>&- || status=$?
if [ "$status" = 137 ] || [ "$status" = 143 ]; then
  echo "guard.sh: $mode ended by a signal (exit $status): memory cap $mem or time limit ${timeout_sec}s; see journalctl --user -n 20" >&2
fi
exit "$status"
