---
paths:
    - 'docker/development/nginx/**'
---

# Nginx

## Dev assets are proxied same-origin to avoid mixed content

The app is served over HTTPS (OrbStack proxy) while the Vite dev server is plain HTTP, so dev assets are reverse-proxied through the app's own origin by `docker/development/nginx/vite.conf`. The development Dockerfile copies `docker/development/nginx/*.conf` into `/etc/nginx/server-opts.d/`, so this file is **baked into the image, not bind-mounted**: after editing it, rebuild with `docker compose build app && docker compose up -d --force-recreate app`. Without it the browser blocks the Vite CSS/font/JS as mixed content.

`server.origin` in `vite.config.ts` is read from the container's `APP_URL`, so `APP_URL` must equal the exact origin you browse (e.g. `https://app.learn-filament.orb.local`). Keep the nginx `location` paths in sync with `vite.config.ts`; the HMR websocket is proxied at `/vite-hmr` (`server.hmr.path`). Note this is unrelated to CORS: `server.cors` only grants cross-origin permission and cannot bypass mixed-content blocking.

## Vite proxy uses `^~` prefix locations, not regex ordering

The base image includes `server-opts.d/*.conf` into the server block, and its `performance.conf` defines regex locations matching `.css` / `.js` / `.woff2`. nginx evaluates regex locations in inclusion order, so a regex-based Vite proxy can be shadowed and dev assets then fall through to the app and 404 (symptom: `/resources/css/fonts.css` returns 200 from Vite directly but the app's 404 through nginx).

`vite.conf` sidesteps ordering by using `^~` prefix locations (`/@`, `/node_modules/`, `/resources/`); a `^~` prefix beats every regex location regardless of include order, so the file needs no numeric prefix. Keep those prefixes in sync with what Vite serves (`server.origin` / `server.hmr.path` in `vite.config.ts`) and retest: `docker compose exec app curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/resources/css/fonts.css`.
