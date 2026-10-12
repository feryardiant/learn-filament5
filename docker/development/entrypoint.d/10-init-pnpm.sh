#!/bin/sh

# shellcheck disable=SC2034
script_name="init-pnpm"

touch /etc/s6-overlay/user-bundles.d/user/contents.d/pnpm-install
touch /etc/s6-overlay/user-bundles.d/user/contents.d/pnpm-run-dev

return 0
