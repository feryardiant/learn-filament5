#!/bin/sh

script_name="run-dev"

mkdir /etc/s6-overlay/s6-rc.d/pnpm-run-dev/dependencies.d
touch /etc/s6-overlay/s6-rc.d/pnpm-run-dev/dependencies.d/pnpm-install

# touch /etc/s6-overlay/s6-rc.d/user/contents.d/artisan-pail
touch /etc/s6-overlay/s6-rc.d/user/contents.d/artisan-queue
touch /etc/s6-overlay/s6-rc.d/user/contents.d/pnpm-run-dev

return 0
