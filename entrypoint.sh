#!/bin/sh
# Emits every APP_* env var (with prefix stripped) as a field of window.APP_CONFIG
# into /srv/config.js, then execs Caddy. Runs once per container start; edits to
# .env.prod require `docker compose up -d web` to take effect.
set -eu

{
  printf 'window.APP_CONFIG = '
  jq -n '$ENV | with_entries(select(.key | startswith("APP_")) | .key |= sub("^APP_"; ""))'
  printf ';\n'
} > /srv/config.js

exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
