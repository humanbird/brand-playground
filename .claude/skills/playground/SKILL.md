---
name: playground
description: Compiles a design system of any form (code library, Figma file, live website, specs, screenshots, or a mix) into a self-contained prototyping kit — frozen tokens, real components, one distilled skill — and resumes or refreshes an existing kit. Use it for /playground, "build a playground", "compile my design system", "generate a kit", "resume the kit", "refresh the kit", or whenever new design system input arrives.
---

# /playground — compile a design system into a playground

Turn DS input of any quality into a repository where one sentence describing a requirement goes in and a working prototype in the target corporate design comes out. Thoroughness pays off here because everything that follows inherits from this foundation.

## Environment and tools

This skill runs in Claude Code. It uses the **Agent tool** (general-purpose subagents on the strongest available model) for ingestion and blind tests, the **Figma MCP** only when the input is a Figma file, and a **browser tool** (chrome-devtools MCP, the Claude Browser, or Playwright) for inspecting the reference screen. Without a browser tool, fall back to `curl` against the dev server plus `pnpm typecheck` and the export self-check (`export/index.html` exists, contains no external `src`/`href`/`url()`), and say plainly in the result that visual verification then falls to the user at sign-off. In headless runs (`claude -p`), set `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0` first; otherwise the session is terminated after 600 seconds while subagents are still running.

**Set expectations honestly.** A full run takes 30–90 minutes, consumes a large share of a plan's budget, and may hit a session limit before it finishes. That is why every phase is committed and checkpointed (Step 0b): a second session picks up where the first one stopped.

## Core rules

- **Invent nothing.** Every token value requires a source. Deterministic sources (CSS, code, Figma Variables) take precedence over LLM estimates. Estimated values are marked as such in `tokens.json` (`$extensions.provenance`) and are never frozen silently.
- **Use the best source for each token/component.** Mixed input is the normal case.
- **One DS skill per kit.** Missing knowledge belongs there (or in its `pitfalls.md`), not in a second skill.
- **Licensed assets from the user win.** If the user provides brand fonts, logos, or icons, use them exactly as delivered, even if a free substitute was already chosen; record the swap in `design/ingest/assets.md` and the file header.
- **Never trust memory about the kit's state.** The filesystem decides which phase comes next (Step 0b).
- Use the latest major versions for all dependencies; pin DS packages exactly.

## Workflow

Phases and their checkpoints are listed in [reference/checkpoints.md](reference/checkpoints.md): fixed commit messages, the `design/ingest/PROGRESS.md` format, and the phase-derivation table.

### 0. Receive input
The user names sources in the request (URL, Figma link, repository path/package name, specification file, screenshot directory, or any combination). Default target directory: `../<ds>-playground`, a sibling of this framework checkout; confirm it in interactive sessions. If essential information is missing (no source, unclear target, or a Figma link without MCP access), ask a brief question instead of guessing. Only use conservative defaults in runs without a return channel, and state those defaults in the result.

### 0b. Resume
If the target directory already exists, this is a resume, not a fresh run. Run `git status` there, then derive the phase from the filesystem using the table in `reference/checkpoints.md` — never from memory, the chat, a dossier, or session logs. `design/ingest/PROGRESS.md` and the git log are cross-checks, not the source of truth: an entry that says "done" while the artifact is missing means the phase is open. Verify the last completed phase cheaply (`pnpm typecheck`, `pnpm export`) before building on it, then continue with the first open phase. Report which phases were found complete and which were redone.

### 1. Ingest → `<kit>/design/ingest/`
Working files (raw CSS, downloads) belong in the temporary working directory. The result goes into the kit under `design/ingest/` and is committed THERE — **never to the framework repository** (it is the product, not a workspace, and kits must work without the framework repository). The output always includes: `tokens.json` (DTCG, with provenance on every token, including `usage` (how often the value occurred in the source) and a stable `id` (short hash of role+value) so that later re-ingests can be diffed), `report.md` (colors+roles, typography, spacing logic, radius/shadow, breakpoints, component inventory with values, page anatomy), and `assets.md` (logos, fonts, icon style, license status).

| Input | Method |
|---|---|
| Code library | Pin the package; extract props/variants mechanically (vue/react-docgen, component-meta, d.ts). See [reference/code-first.md](reference/code-first.md) |
| Figma | Live pull via Figma MCP (`get_variable_defs`, `get_design_context`); use the `figma-use` skill when write access is available. Figma delivers values and names, rarely structure — expect a second source |
| Live website | Subagent downloads and concatenates stylesheets, then analyzes declaration histograms and custom properties (`curl` + `grep`/`sort`/`uniq -c` is enough); derive the component inventory from the rendered DOM. First check the `<link rel=stylesheet>` list for a versioned DS bundle — if one exists, ingestion is deterministic, as with code |
| Specs/MD | Parse and cross-check against other sources |
| Screenshots | Vision on component crops (never full pages because of downscaling); mark candidates low-confidence and refine them against a reconstruction |

Delegate ingestion to a subagent and distill the result back into the main task. If uncertain, work inline instead of in the background. Keep run plans in a temporary file outside the repository.

### 2. Generate → the kit
1. **Scaffold.** Copy the template with `rsync -a --exclude node_modules --exclude export --exclude .git templates/kit-react/ <kit>/` (never plain `cp`), then `git init` in the kit. Replace the placeholders listed in the template's `TEMPLATE.md` (`{{KIT_NAME}}`, `{{PORT}}`, `{{TEMPLATE_COMMIT}}`, `{{GENERATED_AT}}`); if the port differs from 5300, change `vite.config.ts` and `.claude/launch.json` in sync with it. Fill `design/kit.json` (provenance stamp: generator, `templateCommit` = `git rev-parse HEAD` of this framework, template name, timestamp, stack). Run `pnpm install --frozen-lockfile`, then `pnpm preflight`. Delete `TEMPLATE.md`; keep `src/prototypes/example/` until the first real prototype exists. Commit.
   **The stack is an implementation detail — derive it from the input.** If the DS ships runnable code, use its framework (`templates/kit-vue/` for Vue; otherwise port the kit-react conventions, using `templates/kit-vue/TEMPLATE.md` as the worked example). Otherwise use the default template. Ask only when the stack is genuinely ambiguous (several frameworks shipped, mixed inputs pointing in different directions); one framework = one kit, so run `/playground` once per stack. Without a return channel, pick the option closest to the DS source and state it. The user may override the stack in one sentence; state the derived choice in the result either way.
2. **Freeze tokens**: copy the curated DTCG `tokens.json` from ingestion to `design/tokens.json` (replacing the scaffold) and generate `design/tokens.css` from it (semantic CSS variables). Keep the generic `--ds-*` aliases defined — the generator-owned scaffold files depend on them. From this point on, edit deliberately and never regenerate. Commit.
3. **Components**: one component per inventory entry as `src/components/<Name>.tsx` (flat). Tokens only; all documented variants/states. If a code library exists, use the original instead of recreating it. Export everything from `src/components/index.ts` (value and type exports); prototypes import only through this barrel.
4. **Icons** (`src/icons/index.tsx`): copy the source set into the `ICONS` object, enforce `fill="currentColor"`, keep the original names. If the source only names a library ("Lucide, 20px"), freeze the 20–30 most common UI symbols. No runtime package, no `<use>` against a sprite file — the single-file export must work offline. Never mix in a second set. Commit.
5. **`design/components-meta.json`**: every component with props, variants, slots, `extends` (forwarded HTML attributes or "no rest props"), `className` (where it is applied), and `status` (`verified` = read from code or measured; `derived` = inferred from a deterministic source; `estimated` = LLM judgment). Expand object props (`{min, max}`) or point to the type source. This file is the API source of truth; anything missing here will be guessed later. Commit. Generate it with a repo-local script (`scripts/gen-components-meta.mjs`) that parses `src/components/*` and merges a curated `status` map — never hand-write entries in one pass; the script's `--check` mode is part of Done and makes the file regenerable.
6. **Fonts and logos**: `@font-face` blocks in `design/fonts.css` (local `url()` only, so the export can embed them; respect the license — if uncertain, use a metrically close free font and document it at the top of the file). Logos as SVG under `src/assets/`.

### 3. Distill → the DS skill and the agent instructions
Fill `templates/kit-common/SKILL.md.template` using only verified knowledge from ingestion and the components actually built. The skill explains the system (anatomy, grid, token rules, component selection, compositions, visual stance), never individual APIs; for APIs it points to `components-meta.json`. Reference repository-local paths only (including `node_modules`). Keep it under 500 lines; if a section outgrows the file, move the detail into a reference file next to the skill and link it — one level deep, never nested. Create `.claude/skills/<ds>/pitfalls.md` from `templates/kit-common/pitfalls.md.template`; it grows without limit and does not count against the cap. Copy `templates/kit-common/craft.md` unchanged next to the skill.

**One instruction source.** Fill `templates/kit-common/AGENTS.md.template` into the kit's `AGENTS.md` — the canonical kit instructions for every agent (Cursor, Copilot, Codex, Claude). `CLAUDE.md` is only the Claude Code import from `CLAUDE.md.template` (`@AGENTS.md` plus one line); never duplicate content into it. Also write `llms.txt`: one sentence explaining what the kit is, then one line per entry point (tokens.css, components-meta.json, SKILL.md, craft.md, pitfalls.md, src/components/, src/prototypes/, commands). The human-facing `README.md` comes from `templates/kit-common/README.md.template`.

For kit-vue, replace every React/`.tsx` reference in the templates with the Vue equivalents from the framework-differences section of `templates/kit-vue/TEMPLATE.md`. Commit.

### 4. Reference screen (completion of generator work)
Build a representative reference screen under `src/prototypes/reference-<name>/` (set `reference: true` and `judgeAt` in its `_shared/meta.ts`) and inspect it (typecheck, console, the width the DS targets). What it shows depends on the source: an original exists (live site, Figma screens) → recreate it; code library → a typical application page from the package's official examples; specs only → a **specification coverage screen** that applies every source rule once, plus a component matrix if useful. Record every pitfall met on the way in `pitfalls.md`. Commit.
The reference prototype also gets a `Components.tsx` screen (route `/p/reference-<name>/components`) showing every component and variant — the kit README links to it as the visual answer to "what does X look like?".

### 5. Sign-off (the only human review point — the user, not an agent)
Place the reference screen(s) beside the original or specification for the user to compare. Feed deltas back into tokens.css, components, the skill, and `design/fixes.css`. The foundation is then frozen.

**Recommended before sign-off: a blind-test prototype.** A fresh agent uses only the kit's knowledge (AGENTS.md, the skill, `components-meta.json`, source code — no ingestion context, no questions) to build a multi-step prototype and records every point of friction. Anything it had to guess is missing from the kit: feed each finding back as a component, metadata field, skill section, or pitfall. Nothing exposes gaps as reliably as the first independent use.

### 6. Hand over
End the run by printing the "What now" card from [reference/what-now.md](reference/what-now.md) — start command, three example requests, where the reference screen lives, how to share. The kit's `README.md` carries the same card; keep both identical.

## Refresh (`/playground --refresh <kit>`)
Brings a kit's scaffold up to the current template without touching its design system. Read `design/kit.json` for template and `templateCommit`, then compare ONLY the files in the template's `TEMPLATE.md` "Generator-owned files" list against the kit. Never touch `design/` (tokens, meta, ingest), `src/components/`, `src/icons/`, `src/prototypes/`, `src/styles.css`, the skill directory, `AGENTS.md`, `README.md`, or `llms.txt`. Present the diff per file, apply only what the user confirms, update `templateCommit` and `generatedAt`, commit as `playground: refresh <short commit>`. The contract that makes this safe: scaffold files use only `@layer kit` classes and generic `--ds-*` aliases, so they are identical in every kit and can be re-copied verbatim. Files that carry kit-specific values (`package.json`, `vite.config.ts`, `.claude/launch.json`, `index.html`) are shown as a three-way diff and never overwritten blindly.

## Refinement
New input (for example, later access to Figma) goes through ingestion again. Present conflicts with frozen tokens to the user as a diff; never overwrite them silently. The `id` and `usage` fields in `tokens.json` make that diff mechanical.
