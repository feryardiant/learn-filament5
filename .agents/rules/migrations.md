---
paths:
    - 'database/migrations/**'
---

# Migrations

## Route migrations to public vs system schema

This app splits Postgres into two schemas: `public` (application tables, via the default connection) and `system` (framework tables: sessions, cache, cache_locks, jobs, job_batches, failed_jobs, via `Schema::connection(config('database.system'))`). App tables use the default `Schema::create()`; framework tables must use `Schema::connection(config('database.system'))`. The first migration (`..._create_system_schema.php`) bootstraps `DROP/CREATE SCHEMA` and must stay first. Cross-schema FKs reference `config('database.schemas.public').'.<table>'`.

## Gate conditional migrations with shouldRun()

For framework-table migrations that are only created under a specific driver (sessions when `session.driver === 'database'`, cache when `cache.default === 'database'`), gate them with `public function shouldRun(): bool` instead of `if (...) return;` inside `up()`. `shouldRun()` returning `false` skips the migration WITHOUT recording it, so it re-runs if the driver later changes. `shouldRun()` gates only `up()`, not `down()` (use idempotent `dropIfExists`). Only use it when the whole migration is conditional — the `jobs` migration also creates `job_batches`/`failed_jobs` unconditionally, so it keeps an inline guard.
