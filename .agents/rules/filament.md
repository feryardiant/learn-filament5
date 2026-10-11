---
paths:
    - 'app/Providers/Filament/**'
---

# Filament

## Defer asset() in panel providers with a closure

The app runs behind a TLS-terminating proxy (OrbStack) and trusted proxies (`bootstrap/app.php`) resolve `X-Forwarded-Proto` only during request handling. Calling `asset()` eagerly in a panel provider — e.g. `->favicon(asset('favicon.svg'))`, as the Filament docs show — is evaluated too early and yields an `http://` URL, which the browser then blocks as mixed content on the HTTPS page. Wrap it in a closure so it resolves at render time: `->favicon(fn (): string => asset('favicon.svg'))`. Same applies to any other `asset()`/`url()` used while configuring the panel.
