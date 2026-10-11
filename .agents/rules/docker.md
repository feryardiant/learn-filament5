---
paths:
    - 'docker/**'
---

# Docker

## Run tooling inside the app container, never on the host

There is no host-side execution. Do not run `php`, `composer` or `pnpm` on the machine — run everything inside the app container, e.g. `docker compose exec app php artisan test`, `docker compose exec app pnpm build`, `docker compose exec app composer lint`.

Files under `docker/` are baked into the image by each environment's Dockerfile (`docker/<env>/Dockerfile`); `docker/common/` is shared by all environments and `docker/<env>/` overrides it. Do not bind-mount docker/ config from `docker-compose.yaml` — edit the file, then `docker compose build app` and `docker compose up -d --force-recreate app`. Staging intentionally does not receive the development nginx/php config (its COPY lines are commented out).

## How the dev server is wired (and how to inspect it)

The app is served at `https://app.learn-filament.orb.local`: OrbStack terminates TLS and proxies to the container's nginx on `:8080`, with php-fpm behind it. The Vite dev server listens on `:5173` and is reverse-proxied same-origin by `docker/development/nginx/vite.conf` (the app is HTTPS, Vite is HTTP, so direct loading would be blocked as mixed content). `.env` reaches the container via `env_file: ../.env` in `docker/compose.yaml`, which is why `process.env.APP_URL` is available to Vite.

To inspect the running stack without guessing: `docker compose exec app nginx -T`, `docker compose exec app curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/<path>`, `docker compose exec app printenv`, and `cat public/hot`.

## Compose layering: docker/compose.yaml is the shared base

`docker/compose.yaml` is the shared base: it defines the services (app, worker, pgsql, mailpit), default images, `env_file: ../.env`, healthchecks, TZ and `container_name`s. The root overlays `extends` it via `extends.file: docker/compose.yaml`, so shared concerns belong in the base and only environment specifics in the overlays:

- `docker-compose.yaml` — local development: builds `docker/development/Dockerfile`, publishes `8080` plus the Vite dev port `5173`, mounts the source tree and the `node-modules` volume, and sets the OrbStack `http-port` label.
- `docker-compose.staging.yaml` — rehearses the staging image locally: builds `docker/staging/Dockerfile`, publishes `8080`, and derives `scheduler` / `queue` from the base `worker` service.

Because both overlays inherit the same compose project name, network name (`learn-filament5`) and `container_name`s, they are alternative modes — stop one before starting the other. Dev-only config (e.g. `docker/development/nginx/vite.conf`) is never part of the staging image.
