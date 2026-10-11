#!/bin/sh

# shellcheck disable=SC2034
script_name="pnpm-install"

touch /etc/s6-overlay/user-bundles.d/user/contents.d/pnpm-install

return 0
