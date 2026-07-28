#!/usr/bin/env bash
# Atomic, zero-downtime deploy for the SixStore Mini App frontend.
#
# Why this exists: the previous deploy process ran `bun run build` directly
# into the live .output/ directory that the running systemd service reads
# from on every request. A build deletes and rewrites content-hashed asset
# and SSR chunk files; any request that dynamic-imports a not-yet-loaded
# route chunk (wallet, order.$orderId, product.$productId, ...) during that
# window hits files that were just deleted -- ENOENT / ERR_MODULE_NOT_FOUND,
# a 500, and the "This page didn't load" fallback screen. That was the root
# cause of the intermittent failures (see journalctl -u sixstore-miniapp
# entries from 2026-07-27 10:15-12:39 for the historical evidence).
#
# Fix: every deploy builds into its own private, never-mutated release
# directory, and `current` only ever moves via an atomic symlink swap. A
# process that's already running keeps serving from the release directory
# it started against, untouched, until it is itself restarted. The two
# running instances (ports 4200/4201, behind Caddy's load balancer) are then
# restarted one at a time so at least one is always accepting traffic.
set -euo pipefail

APP_DIR=/home/ubuntu/sixstore-premium-ui
RELEASES_DIR="$APP_DIR/releases"
CURRENT_LINK="$APP_DIR/current"
PORTS=(4201 4200) # restart 4201 first, then 4200 -- Caddy always has the other one up
KEEP_RELEASES=5
HEALTH_TIMEOUT_S=20

ts() { date '+%Y-%m-%d %H:%M:%S'; }
log() { echo "[$(ts)] $*"; }
die() { echo "[$(ts)] ERROR: $*" >&2; exit 1; }

cd "$APP_DIR"

PREVIOUS_RELEASE=""
if [ -L "$CURRENT_LINK" ]; then
  PREVIOUS_RELEASE=$(readlink -f "$CURRENT_LINK")
fi

RELEASE_ID=$(date +%Y%m%d%H%M%S)
RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"
log "building release $RELEASE_ID in isolation (previous: ${PREVIOUS_RELEASE:-none})"

mkdir -p "$RELEASE_DIR"
rsync -a \
  --exclude .git \
  --exclude node_modules \
  --exclude releases \
  --exclude current \
  --exclude .output \
  --exclude .tanstack \
  --exclude .wrangler \
  --exclude deploy.sh \
  "$APP_DIR/" "$RELEASE_DIR/"

# node_modules is shared (not copied per-release) -- run `bun install` in
# $APP_DIR yourself first if dependencies changed. This keeps each deploy
# fast and avoids duplicating ~250 packages on every release.
ln -s "$APP_DIR/node_modules" "$RELEASE_DIR/node_modules"

log "running build"
if ! (cd "$RELEASE_DIR" && bun run build); then
  rm -rf "$RELEASE_DIR"
  die "build failed -- release discarded, current untouched, nothing restarted"
fi

if [ ! -f "$RELEASE_DIR/.output/server/index.mjs" ]; then
  rm -rf "$RELEASE_DIR"
  die "build did not produce .output/server/index.mjs -- release discarded"
fi

log "swapping current -> releases/$RELEASE_ID (atomic)"
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

check_health() {
  local port=$1
  local deadline=$((SECONDS + HEALTH_TIMEOUT_S))
  while [ $SECONDS -lt $deadline ]; do
    if curl -fsS -o /dev/null --max-time 3 "http://127.0.0.1:${port}/"; then
      return 0
    fi
    sleep 1
  done
  return 1
}

rollback() {
  log "ROLLING BACK to ${PREVIOUS_RELEASE:-<none>}"
  if [ -n "$PREVIOUS_RELEASE" ]; then
    ln -sfn "$PREVIOUS_RELEASE" "$CURRENT_LINK"
  fi
  for p in "${PORTS[@]}"; do
    sudo systemctl restart "sixstore-miniapp@${p}" || true
  done
  die "deploy failed health check -- rolled back to previous release, both instances restarted on old code"
}

for PORT in "${PORTS[@]}"; do
  log "restarting sixstore-miniapp@${PORT}"
  sudo systemctl restart "sixstore-miniapp@${PORT}"
  log "waiting for :${PORT} to become healthy"
  if ! check_health "$PORT"; then
    rollback
  fi
  log ":${PORT} healthy"
done

log "deploy of release $RELEASE_ID complete, both instances healthy"

# Prune old releases, keeping the current one and the last few for quick
# manual rollback (ln -sfn releases/<id> current && restart both).
mapfile -t OLD_RELEASES < <(ls -1t "$RELEASES_DIR" | tail -n +$((KEEP_RELEASES + 1)))
for old in "${OLD_RELEASES[@]:-}"; do
  [ -z "$old" ] && continue
  if [ "$RELEASES_DIR/$old" != "$(readlink -f "$CURRENT_LINK")" ]; then
    log "pruning old release $old"
    rm -rf "${RELEASES_DIR:?}/$old"
  fi
done

log "done"
