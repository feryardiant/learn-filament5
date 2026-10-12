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

## AI artifacts **MUST be stored EXCLUSIVELY** in the `.agents/` directory (`.ai/` is a symlink to it)

**Artifacts:** anything you generate _for the work_: ledgers, logs, handoffs, plans, specs, reports, exports, fixtures, scratch scripts. Durable output belongs in the tool's own location: plans in `.agents/plans/`, skills in `.agents/skills/`, per-task material in the topic subdir (e.g. `.agents/sdd/<task>/`). `.agents/.gitignore` ignores everything under `.agents/` except `rules/`; the root `.gitignore` additionally ignores `.ai`, `.claude`, `.mcp.json` and `CLAUDE.md`.

**Not artifacts:** project files being edited, project config the user requested (`AGENTS.md`, rules), durable rules in `.agents/rules/` indexed by `.agents/rules/index.md`, global tool config (skills, dotfiles), harness internals.

Session-ephemeral scratch → `.agents/tmp/` (delete when done) or the harness temp dir for single-command throwaways. Metadata docs → `.agents/logs/` (chronological) **or a topic subdir as mandated (`.agents/plans/`, `.agents/specs/`, `.agents/sdd/<task>/`)**; scripts + machine config → `.agents/` root.

This is intentional — **unless the user names content inside it, `git commit`/`commit everything` never stages `.agents/`, and never `git add -f` it.** Read `.agents/rules/index.md` and the matching rule files before planning or editing.
