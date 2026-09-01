# Checkpoints, commits, and resume

A `/playground` run is long. Every phase ends with a commit in the kit and an entry in
`design/ingest/PROGRESS.md`, so that a second session can continue from the filesystem alone.

## Phase order and commit messages

Commit messages are fixed so that they can be grepped. Never combine two phases in one commit.

| # | Phase | Commit message | Produces |
|---|---|---|---|
| 1 | scaffold | `playground: scaffold` | template copy, `design/kit.json` filled, `pnpm install --frozen-lockfile` done, `TEMPLATE.md` deleted |
| 2 | ingest | `playground: ingest` | `design/ingest/{tokens.json,report.md,assets.md}` |
| 3 | tokens | `playground: tokens` | `design/tokens.json` (curated), `design/tokens.css` |
| 4 | components | `playground: components` | `src/components/*`, `src/components/index.ts`, `src/icons/*`, `design/fonts.css`, `src/assets/*` |
| 5 | meta | `playground: meta` | `design/components-meta.json` with `status` on every entry |
| 6 | skill | `playground: skill` | `.claude/skills/<ds>/{SKILL.md,pitfalls.md,craft.md}`, `AGENTS.md`, `CLAUDE.md`, `llms.txt`, `README.md` |
| 7 | reference | `playground: reference` | `src/prototypes/reference-<name>/`, pitfalls recorded |
| 8 | sign-off | `playground: sign-off` | deltas from the user's review fed back; foundation frozen |

Ingest may be committed before scaffold when the ingestion subagent finishes first; the
order in the table is the order in which the phases are *verified*, not necessarily executed.

## `design/ingest/PROGRESS.md`

One line per phase, updated when the phase's commit is made. Keep it terse; it is a checkpoint,
not a report.

```
# Progress

| Phase | State | Commit | Note |
|---|---|---|---|
| scaffold | done | 3f2a1c9 | kit-react, port 5300 |
| ingest | done | 8b77d02 | live site + theme bundle 15.3.1 |
| tokens | done | c01e4aa | 224 tokens, 3 estimated |
| components | open | | 12 of 30 built |
| meta | open | | |
| skill | open | | |
| reference | open | | |
| sign-off | open | | |
```

## Deriving the phase from the filesystem (resume)

Run these checks in order in the kit directory; the first failing row is the phase to resume.
The filesystem wins over `PROGRESS.md`, the git log, the chat, and any dossier.

| Check | Command or observation | If it fails |
|---|---|---|
| Kit is scaffolded | `design/kit.json` exists and contains no `{{`; `node_modules/` exists; `TEMPLATE.md` is gone | redo scaffold (rsync is idempotent; then `pnpm install --frozen-lockfile`) |
| Ingest exists | `design/ingest/tokens.json`, `report.md`, `assets.md` all present and non-trivial | run ingest |
| Tokens are frozen | `design/tokens.json` contains no `"source": "template-placeholder"`; `design/tokens.css` defines the `--ds-*` aliases | freeze tokens |
| Components are complete | `ls src/components/*.tsx \| wc -l` (or `.vue`) matches the inventory count in `design/ingest/report.md`; `DsButton.tsx` template file is gone (unless the DS really has a `DsButton`) | continue components from the inventory diff |
| Meta is complete | entry count in `design/components-meta.json` equals the component count; no entry describes itself as a "template example"; every entry has `status` | write or complete meta |
| Skill is filled | `.claude/skills/<ds>/SKILL.md` exists and contains no `{{`; `pitfalls.md`, `craft.md`, `AGENTS.md`, `CLAUDE.md`, `llms.txt`, `README.md` exist | distill |
| Reference exists | `src/prototypes/reference-*/` exists and `pnpm typecheck` passes | build the reference screen |
| Signed off | `PROGRESS.md` row `sign-off` is `done` (this is the one phase only the user can complete) | ask the user for sign-off |

Before continuing, verify the last completed phase cheaply: `pnpm typecheck` and `pnpm export`.
A green typecheck on a half-finished component set is normal; a red one means the previous
session stopped mid-file — fix that first.
