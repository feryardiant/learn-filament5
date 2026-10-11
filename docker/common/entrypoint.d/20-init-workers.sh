#!/bin/sh

# shellcheck disable=SC2034
script_name="init-workers"

# Set default values for Laravel automations
: "${APP_WORKERS_ENABLED:=false}"

if [ "$APP_WORKERS_ENABLED" = "true" ]; then
    touch /etc/s6-overlay/user-bundles.d/user/contents.d/scheduler
fi

return 0
