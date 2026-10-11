---
paths:
    - '.vite-hooks/**'
    - '.agents/**'
---

# General

## Commits run vite-plus hooks and commitlint

Hooks are active via `core.hooksPath=.vite-hooks/_`, which `vp config` (the `prepare` script) generates — edit the source hooks `.vite-hooks/pre-commit` (`vp staged`) and `.vite-hooks/commit-msg` (`commitlint --edit $1`), never the generated `_/` copies.

`vp staged` runs the `staged` map in `vite.config.ts`: `vp check --fix` for `*.{md,json,js,ts,yaml,yml}` and `pint --parallel` for `{app,config,database,routers,tests}/**/*.php`. The hooks auto-fix files, so when they modify something, `git add` again and re-commit.

commitlint config is inline in `package.json` (`commitlint` key → `@commitlint/config-conventional`): header and body lines max 100 chars, lower-case subject, so `feat(scope): do thing` (never `Do thing`). The image has no `git`, so `pint --dirty` fails inside the container — pass explicit paths instead. `pnpm install` in the container exits non-zero because `prepare: vp config` needs git; the install itself still succeeds.

## AI artifacts are local-only and never committed

All AI metadata lives under `.agents/` (`.ai` is a symlink to it): plans in `.agents/plans/`, durable rules in `.agents/rules/` indexed by `.agents/rules/index.md`, skills in `.agents/skills/`. `.gitignore` excludes `.agents`, `.ai`, `.claude`, `.mcp.json`, `boost.json`, `opencode.json`, `AGENTS.md` and `CLAUDE.md`.

This is intentional — these are local-only. Never stage them, and never `git add -f` them; commits must contain application code only. Read `.agents/rules/index.md` and the matching rule files before planning or editing.
