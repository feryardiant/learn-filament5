---
paths:
    - 'docker/**'
---

# Docker

## Run tooling inside the app container, never on the host

There is no host-side execution. Do not run `php`, `composer` or `pnpm` on the machine — run everything inside the app container, e.g. `docker compose exec app php artisan test`, `docker compose exec app pnpm build`, `docker compose exec app composer lint`.

Files under `docker/common/` and `docker/<env>/` that are copied by the environment Dockerfile are baked into the image; `docker/common/` is shared by all environments and `docker/<env>/` overrides it. Rebuild the app image after changing these files or the environment Dockerfile. Changes to `docker/compose.yaml` affect Compose configuration only; recreate the affected services without rebuilding the image.

## Environment-specific config overrides

Each environment can layer its own config over `docker/common/`; both share the same structure, as follows:

- source: `docker/<env>/entrypoint.d/`, target: `/etc/entrypoint.d/`
- source: `docker/<env>/nginx/`, target: `/etc/nginx/server-opts.d/`
- source: `docker/<env>/php/`, target: `/usr/local/etc/php/conf.d/`
- source: `docker/<env>/s6-overlay/`, target: `/etc/s6-overlay/s6-rc.d/`

A missing `docker/common/<dir>/` means no shared config. A missing `docker/<env>/<dir>/` leaves the shared layer in place, if present; base-image defaults apply only when neither layer supplies configuration. Either way, the matching `COPY` line in the environment's Dockerfile must be removed or commented out too — Docker fails the build when a `COPY` source doesn't exist (an empty glob like `nginx/*.conf` counts too).

Staging intentionally overrides none of those configs (its `COPY` lines in `docker/staging/Dockerfile` are commented out, and it has no `php/` layer).

## How the dev server is wired (and how to inspect it)

The app is served at the origin set by `APP_URL` in your local `.env` — currently `https://app.learn-filament.orb.local` on this machine: OrbStack terminates TLS and proxies to the container's nginx on `:8080`, with php-fpm behind it. The Vite dev server listens on `:5173` and is reverse-proxied same-origin by `docker/development/nginx/vite.conf` (the app is HTTPS, Vite is HTTP, so direct loading would be blocked as mixed content). `.env` reaches the container both as a file via the source-tree mount — `loadEnv` in `vite.config.ts` reads it and copies the origin into `server.origin` and `public/hot` — and as environment via `env_file: ../.env` in `docker/compose.yaml`. Because `.env` is local-only (`.env.example` ships `http://localhost:8000`), set `APP_URL` on each machine to the exact origin you browse.

To inspect the running stack without guessing: `docker compose exec app nginx -T`, `docker compose exec app curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/<path>`, `docker compose exec app printenv`, and `cat public/hot`.

## Compose layering: docker/compose.yaml is the shared base

`docker/compose.yaml` is the shared base: it defines the services (app, worker, pgsql, mailpit), default images, `env_file: ../.env`, healthchecks, TZ and `container_name`s. The root compose files extend it via `extends.file: docker/compose.yaml`, so shared concerns belong in the base and only environment specifics in the overlays:

- `docker-compose.yaml` — local development: builds `docker/development/Dockerfile`, publishes `8080` plus the Vite dev port `5173`, mounts the source tree and the `node-modules` volume, and sets the OrbStack `http-port` label.
- `docker-compose.staging.yaml` — rehearses the staging image locally: builds `docker/staging/Dockerfile`, publishes `8080`, and derives `scheduler` / `queue` from the base `worker` service.

Because both overlays inherit the same compose project name, network name (`learn-filament5`) and `container_name`s, they are alternative modes — stop one before starting the other. Dev-only config (e.g. `docker/development/nginx/vite.conf`) is never part of the staging image.
