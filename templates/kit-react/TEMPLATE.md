# Template `kit-react` — What the Generator Populates

The generic core of a prototyping kit: Vite + React + TypeScript + Tailwind v4,
a single pnpm package. Runs on its own—with neutral placeholder tokens and a sample
prototype, so the conventions and structure can be validated without a design system.

`/playground` copies this folder with `rsync -a --exclude node_modules --exclude export
--exclude .git` (never plain `cp`), runs `pnpm install --frozen-lockfile`, and populates the
marked sections below. Everything not listed here is carried over unchanged and stays
generator-owned (see the list at the end of this file—those files are what
`/playground --refresh` re-copies later).

## Placeholders

Every `{{…}}` in the template and in `templates/kit-common/` is listed here. After the distill
phase, `grep -rn '{{' <kit>` must return nothing.

| Placeholder | Appears in | Value |
|---|---|---|
| `{{KIT_NAME}}` | `package.json` → `name`, `.claude/launch.json` → `name`, `kit-common/AGENTS.md.template`, `kit-common/README.md.template` | Kit name, npm-compatible (lowercase, no spaces); by convention `<ds>-playground` |
| `{{PORT}}` | `kit-common/AGENTS.md.template`, `kit-common/SKILL.md.template`, `kit-common/README.md.template` | The dev-server port. `vite.config.ts` and `.claude/launch.json` carry the literal default `5300`; if the kit gets another port, change those two files **in sync** with the placeholder value (`scripts/preflight.mjs` reads the port from `vite.config.ts`; nothing else needs updating) |
| `{{TEMPLATE_COMMIT}}` | `design/kit.json` | `git rev-parse HEAD` of the framework checkout the kit was generated from |
| `{{GENERATED_AT}}` | `design/kit.json` | ISO-8601 timestamp of the scaffold phase |
| `{{DS_NAME}}`, `{{DS_SLUG}}`, `{{COUNT}}` | `kit-common/AGENTS.md.template`, `SKILL.md.template`, `pitfalls.md.template`, `README.md.template` | Display name, skill directory slug, number of components in `components-meta.json` |
| `{{REFERENCE_SLUG}}` | `kit-common/README.md.template` | Slug of the reference prototype (`reference-<name>`), for the "where to look" links |
| `{{SECTION: instructions}}` | `kit-common/SKILL.md.template` (`STACK`, `CODE_FIRST`, `ICONS`, `ANATOMY`, `LAYOUT`, `TOKENS`, `COMPONENT_CHOICE`, `STANCE`, `WIDTH_NOTE`, `GREP_EXCEPTIONS`), `AGENTS.md.template` (`STACK`), `pitfalls.md.template` (`PITFALLS`) | Prose blocks the generator writes from ingestion evidence; the instruction text inside the braces is replaced entirely |

## What Gets Replaced or Created

| Location | Required content |
|---|---|
| `design/kit.json` | Provenance stamp: `generator`, `template`, `templateCommit`, `generatedAt`, `stack` (framework, styling, pinned DS package if any). Refresh reads it; never edit by hand. |
| `AGENTS.md` (create from `kit-common/AGENTS.md.template`) | **The** canonical kit instructions for every agent: purpose, loop, commands, modes, working approach, definition of done. |
| `CLAUDE.md` (create from `kit-common/CLAUDE.md.template`) | Two lines: `@AGENTS.md` plus a note that AGENTS.md is the source. No content of its own—one source, zero sync. |
| `README.md` (create from `kit-common/README.md.template`) | The human-facing entry: the same "What now" card the generator prints at the end of the run (start command, example requests, reference screen, sharing). |
| `llms.txt` (create) | Entry-point index for any tool: one sentence describing the purpose, followed by one line per relevant path (tokens.css, components-meta.json, skill, craft.md, pitfalls.md, components, prototypes, commands). |
| `.claude/skills/<ds>/SKILL.md` (create from `kit-common/SKILL.md.template`) | Exactly **one** skill per design system, under 500 lines, at most one level of reference files next to it. |
| `.claude/skills/<ds>/pitfalls.md` (create from `kit-common/pitfalls.md.template`) | Seeded with the pitfalls met while building the reference screen; grows freely afterwards. |
| `.claude/skills/<ds>/craft.md` (copy `kit-common/craft.md`) | DS-independent craft guidance, copied unchanged. |
| This file (`TEMPLATE.md`) | **Delete** it from the kit after populating the template—generator documentation does not belong in the consumer repository. |
| `design/tokens.css` | The frozen tokens from the target design system. Replace the entire file, but **keep the generic `--ds-*` aliases defined** (`--ds-color-canvas`, `-surface`, `-line`, `-ink`, `-ink-muted`, `-accent`, `-accent-hover`, `-on-accent`, `-success`, `-danger`, spacing-unit, radii, fonts, font sizes, weights, line heights, border width, shadows—the exact list is the SCAFFOLD CONTRACT comment at the top of the template's `tokens.css`)—map them to the DS tokens with `var()`; never drop or rename them, because `src/kit.css` and the scaffold resolve to them directly. |
| `design/tokens.json` | DTCG source produced by ingestion, with `$extensions.provenance` on every token including `usage` and `id`. Replace the entire file; the scaffold illustrates the expected shape. |
| `design/components-meta.json` | The target design system's component inventory (props, variants, slots, description)—**plus `extends`** for each component (which HTML attributes are passed through and where `className` is applied, for example `"InputHTMLAttributes<HTMLInputElement> excluding placeholder and className—the remaining props go to <input>, className goes to the field frame"`, or `"— no rest props"`) **and `status`** (`verified` = read from code or measured, `derived` = inferred from a deterministic source, `estimated` = LLM judgment). Without `extends`, every prototype agent has to infer the behavior for every field; without `status`, it cannot tell fact from guess. Replace the entire array—the `DsButton` entry only illustrates the expected shape. |
| `src/components/` | The target design system's components (adopted or generated), kept flat as `src/components/<Name>.tsx`. Remove `DsButton.tsx` as soon as a real button is available. |
| `src/components/index.ts` | The barrel file—every component with value and type exports. Prototypes import exclusively through it (`from '../../components'`). |
| `src/icons/index.tsx` | The target design system's icon set, frozen as React components (replace the `ICONS` object; retain `DsIcon`). The two symbols in the template only illustrate the expected shape. Convention: `fill="currentColor"`, size via utilities, and never mix in a second icon set. |
| `design/fonts.css` | The target design system's `@font-face` blocks. Empty in the template (system font stack). Use local `url()` references only—the single-file export embeds them as data URIs; document the licensing status and any substitute font at the top of the file. If the user supplies licensed font files, they replace any substitute. |
| `src/styles.css` → `@theme` block plus any breakpoints, resets, and `@layer components` rules for the design system's layout language | The DS-specific layer. The `@theme` block mirrors the token names; keep the `*: initial` guards in every namespace and replace only the lists beneath them. DS scale names (`text-l`, `spacing-ds-200`, …) live **only here**—the scaffold files never use Tailwind scale utilities, so there is nothing to keep consistent with them. If the design system has its own layout language (containers, vertical rhythm, full bleed), add it via `@layer components`. |
| `src/prototypes/<slug>/_shared/meta.ts` (convention, per prototype) | Optional. `export const meta: PrototypeMeta = { title, description, judgeAt, reference }`. `title`/`description` replace the raw slug on the overview (fallback: humanized slug). `judgeAt`: `'desktop'` (default), `'mobile'` (375px device frame), or a width in px. `reference: true` marks the reference screen (also implied by the `reference-` slug prefix); the generator sets it on the reference prototype. Alternatively a named `meta` export from the index screen. |
| `src/prototypes/example/` | Delete it as soon as the first real prototype exists. Until then, it serves as living documentation of the conventions. |
| `index.html` → `<title>`, theme attributes on `<html>` | Set the title to the kit name; add theme attributes if the DS requires them (see the code-first reference in the generator skill). |

## Convention (Applies to the Generated Kit)

```
src/prototypes/<slug>/index.tsx     →  /p/<slug>
src/prototypes/<slug>/<Name>.tsx    →  /p/<slug>/<name>      (lowercase)
src/prototypes/<slug>/_shared/…     →  no route (shell, mock data, helpers)
src/prototypes/<slug>/_shared/meta.ts  →  optional `meta` (title, description, judgeAt, reference)
src/prototypes/idea-<slug>/…        →  grouped as "Ideas" on the overview
src/prototypes/reference-<slug>/…   →  marked "Reference", listed first
/frame/p/<slug>[/<screen>]          →  the same screen inside a 375px (or judgeAt-px) device frame
```

Creating a folder creates a route. No configuration file and no registration.

The overview has an Auto / Desktop / Mobile toggle (persisted in localStorage `kit.viewport`):
Auto opens each prototype at its `judgeAt`, the other two override it. The device frame is an
iframe of the same page, so it also works in the offline export; it stays in the export on
purpose (about 2 KB) because mobile-first prototypes need it when shared.

## Commands

| Command | Effect |
|---|---|
| `pnpm install --frozen-lockfile` | once, right after scaffolding (pnpm via `npm i -g pnpm`; no corepack) |
| `pnpm preflight` | checks Node ≥ 22.22, pnpm, installed dependencies, and a free port; prints the fix for each failure. `pnpm dev` runs it first |
| `pnpm dev` | development server on the fixed port (`strictPort`; template default **5300**) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm export` | static **single-file** export of all prototypes to `export/index.html`—runs in a browser when opened directly, hence HashRouter and `base: './'`. `pnpm export --only <slug>` exports only `src/prototypes/<slug>/` (plus its `_shared/`) and opens it directly at its declared viewport—mechanism: `VITE_ONLY` env var, read by the `kit:only-prototype` plugin in `vite.config.ts`, which narrows the discovery globs before Vite expands them |

`.claude/launch.json` describes the same development server for the agent's browser preview
(`pnpm dev`, same port). Without this file, the agent cannot inspect the prototype itself.

## Pitfalls

- **Spacing names collide.** In Tailwind v4, the `--spacing-*` namespace shadows the
  container scale: `--spacing-2xl: 3rem` silently turns `max-w-2xl` into 3rem instead
  of 42rem. For that reason, `src/styles.css` maps only `--spacing` (the base unit); the
  numeric scale `p-4`, `gap-6`, and so on is derived from it and therefore tied to the
  tokens. If the target design system has a nonlinear spacing scale, its steps belong
  under a collision-free prefix (for example, `--spacing-ds-200`).
- **Font sizes** use Tailwind names in the template (`--text-xs/sm/base/lg/xl/2xl`). If the
  target design system defines its own step names (`xs · s · m · l · xl · xxl · xxxl`), the
  generator may adopt them in `src/styles.css`—but then exclusively: two naming systems side
  by side are worse than an unfamiliar one, because the prototype agent has to guess for every
  class. The scaffold files are unaffected either way; they use `kit-*` classes, not scale utilities.
- **The `--spacing` base unit ALSO scales `w-*` and `h-*`.** If the generator sets it
  to the target design system's unit (for example, `0.3125rem` for a 5px scale), `h-6`
  suddenly becomes 30px instead of 24, and `w-52` becomes 260px instead of 208. This
  affects every icon and control size and is noticeable only when measured—the screen
  looks "almost right." The design system's measured dimensions (24px icon, 44px control
  height, and so on) almost never lie on the spacing scale because design systems
  calculate them in `em` relative to the font. Solution: define custom `@utility` rules
  with descriptive names at the end of `src/styles.css`; the skill then uses these as
  its vocabulary:

      @utility icon-m   { width: 1.5rem; height: 1.5rem; }   /* 24px */
      @utility control-m { height: 2.75rem; width: 2.75rem; } /* 44px */

  This is preferable to scattering arbitrary values (`h-[1.5rem]`) throughout the kit,
  and it keeps the "no px value in the diff" check honest.
- **Tailwind's default palettes silently creep in.** `src/styles.css` therefore clears
  them per namespace with `--color-*: initial`, `--radius-*: initial`,
  `--shadow-*: initial`, `--text-*: initial`, and `--breakpoint-*: initial`. Without these
  lines, Tailwind continues to generate `bg-gray-100`, `rounded-3xl`, or `2xl:` without
  complaint—the screen looks plausible but still contains foreign colors in the build.
  Keep the guards; replace only the lists beneath them.
- **`-*/` in a CSS comment terminates it early.** Mentioning token-name patterns in prose
  inside `src/styles.css` or `design/tokens.css` (`--fgColor-*/--bgColor-*`) accidentally
  closes the comment block: Tailwind then stops with a `CssSyntaxError` whose message
  quotes the comment text and gives no useful indication of the cause. Separate patterns
  in comments with commas (`--fgColor-*, --bgColor-*`) or wrap them in backticks. This
  affects any design system whose token names can end in `*`—in other words, every one.
- **Breakpoints in `@theme` MUST be literals.** `--breakpoint-md: var(--ds-breakpoint-md)`
  becomes an `@media` condition containing a CSS variable, which is invalid. Tailwind
  does not generate the variant at all, and `md:` disappears without any reported error.
  The screen then looks the same at every width, encouraging a search in the layout
  instead of the theme file. This limitation applies only to media queries—colors, radii,
  font sizes, and shadows may continue to refer to `var()`. The values still belong in
  `design/tokens.css` for documentation and provenance, and must be repeated as literals
  in `src/styles.css`; the generator adds a comment there explaining the duplication.
  **Verification:** load a page at two widths and measure an element that depends on a
  breakpoint variant.
- **Tailwind recognizes only fully written class names.** `` `text-${level}` ``,
  `` `shadow-level${n}` ``, or `` `rounded-${r}` `` generate nothing. This is especially
  relevant to component matrices and reference screens that iterate over variants—write
  the complete classes in a table and iterate over the table only.
- **No external resources.** The single-file export must work offline: no Google Fonts
  via `<link>`, no CDN scripts, and images must be data URIs or reside in `public/`
  (in the latter case, the export is no longer a single file).
- **`vite.config.ts` declares `process` itself** (`declare const process: { env: … }`) so the
  kit does not need `@types/node`. Do not add `@types/node` for this; it would leak Node
  globals into prototype code.
- **`scripts/*.mjs` are plain Node ESM**, not type-checked, and must stay dependency-free.
- **Newly published packages break `pnpm install`.** pnpm 11 rejects versions that are
  too recent according to `minimumReleaseAge` (default 24 hours), and otherwise creates
  a `pnpm-workspace.yaml` with an exception list without prompting. The template therefore
  locks only mature versions (`react-router` deliberately uses 8.3.0 instead of 8.3.1).
  When upgrading dependencies, choose a version more than a day old—do not commit an
  exception list.

## Generator-owned files (never changed by the generator, re-copied by refresh)

The contract: these files use only `kit-*` classes from `@layer kit` and the generic `--ds-*`
aliases from `design/tokens.css`—never DS-specific token names, Tailwind scale utilities, or
kit-specific values. That is what makes them identical across kits and lets
`/playground --refresh` re-copy them verbatim from a newer template.

Re-copied verbatim:

- `src/router.tsx`, `src/prototypes.ts`—automatic routing. No registry and no entry.
- `src/HomeView.tsx`—reads whatever is present. It is never maintained by hand.
- `src/kit.css`—the `@layer kit` rules the scaffold files use, resolved against `--ds-*` aliases.
- `src/viewport.ts`, `src/DeviceFrame.tsx`—the desktop/mobile viewport toggle on the home page.
- `src/main.tsx`—stylesheet order is significant and fixed:
  `design/fonts.css` → `design/tokens.css` → `src/styles.css` → `src/kit.css` → `design/fixes.css`.
  Fonts before tokens, fixes last (they are intended to win). The generator populates
  fonts, tokens, styles, and fixes; it does not change the imports.
- `scripts/preflight.mjs`, `scripts/export.mjs`, `tsconfig.json`, `.gitignore`.
- `.claude/skills/<ds>/craft.md`—DS-independent; refreshed only if the kit has not edited it.

Shown as a diff, never overwritten blindly (they carry kit-specific values):

- `package.json` (name, pinned DS packages), `vite.config.ts` (port), `.claude/launch.json`
  (name, port), `index.html` (title, theme attributes).

Never touched by refresh: everything under `design/`, `src/components/`, `src/icons/`,
`src/prototypes/`, `src/styles.css`, the skill directory, `AGENTS.md`, `README.md`, `llms.txt`.
`design/fixes.css` remains empty until a specific pitfall is documented.

## Verified on 2026-08-29

- Clean-room test: copy without `node_modules`, then `pnpm install` (with
  `name: {{KIT_NAME}}`), `pnpm typecheck` (exit 0), `pnpm export` (exit 0)—Node 26.8.1 /
  pnpm 11.24.0
- `export/index.html` is self-contained: one file, one inline `<script>`, one inline
  `<style>`, no external `src`/`href`, and no `url()`/`@import` in CSS
- Opened in Chrome via `file://`: the overview and deep link
  `…/export/index.html#/p/example/detail?id=A-2477` render, tokens are applied
  (button `rgb(47,111,237)`, 8px radius), and there are no console messages
- `_shared/Shell.tsx` is not routed despite its default export
- A new `idea-*` folder appears in the "Ideas" group without a configuration change

## Verified on 2026-09-01 (kit UX: overview meta, viewport toggle, preflight, `--only` export)

- `pnpm typecheck` exit 0; `pnpm export` and `pnpm export --only example` produce one
  self-contained file (no external `src=`/`href=`); with a temporary second prototype,
  `--only example` excluded it and `--only <other>` excluded `example`
- Dev server: overview shows titles/descriptions/slugs, Ideas group, viewport toggle
  (Auto/Desktop/Mobile → links switch between `/p/…` and `/frame/p/…`), device frame renders
  the prototype in a 375px iframe including a deep link with query string; console clean
- `--only` export served over http: lands directly in the prototype (framed when
  `judgeAt: 'mobile'`), overview link hidden
- `pnpm preflight` reports Node/pnpm/deps and correctly detected port 5300 in use (IPv6-only listener)
