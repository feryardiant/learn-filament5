---
paths:
    - bootstrap/providers.php
---

# Bootstrap

## Clear cached config after editing bootstrap/providers.php

Laravel skips merging `bootstrap/providers.php` when config comes from cache (`Illuminate\Foundation\Bootstrap\RegisterProviders` checks `config_loaded_from_cache`), and the cached `config.php` snapshots the merged `app.providers` list. So after adding/removing an app provider (or a panel provider), requests keep using the old list until the config cache is cleared — the new provider silently does not boot.

Fix: `docker compose exec app php artisan optimize:clear`, then re-test. Symptom seen with `FilamentServiceProvider`: `app()->getLoadedProviders()` did not contain it and its assets were missing from the panel HTML.
