# Template `kit-vue` — What the Generator Populates

The generic core of a Vue prototyping kit: Vite + Vue 3 + TypeScript + Tailwind v4,
a single pnpm package. Runs on its own—with neutral placeholder tokens and a sample
prototype, so the conventions and structure can be validated without a design system.

This is a **direct port of `kit-react`**, not a second design decision: the same folders,
conventions, file names, and comments. Vue-specific requirements are documented below
under “Differences from kit-react.” Everything else is intentionally identical—whenever
one of the two templates changes, check the other one as well.

`/basis` copies this folder and populates the marked sections below. Everything not
listed here is carried over unchanged.

## When to Use This Template Instead of kit-react

Use it when the target design system is available as a **Vue code library** (Vuetify, PrimeVue,
a company-internal library, and so on). Pin and **use** the library directly; do not reimplement it—
`src/components/index.ts` re-exports it, so prototypes do not see the difference. If no
design-system code is available, `kit-react` remains the default.

## What Gets Replaced

| Location | Required content |
|---|---|
| `package.json` → `name`, `.claude/launch.json` → `name` | Replace the `{{KIT_NAME}}` placeholder with the kit name (npm-compatible: lowercase, no spaces). The placeholder is the **only** text substitution in the template—it appears in exactly these two locations. |
| Port (only if different from the default 5300) | Update `vite.config.ts`, `.claude/launch.json`, and the command table in the kit's CLAUDE.md **in sync**—otherwise the documentation and server will diverge. |
| `AGENTS.md` (create) | Identical content to the kit's CLAUDE.md—Cursor, Copilot, and other agents read this file; keep both files synchronized whenever they change. |
| `llms.txt` (create) | Entry-point index for any tool: one sentence describing the purpose, followed by one line per relevant path (tokens.css, components-meta.json, skill, components, commands). |
| This file (`TEMPLATE.md`) | **Delete** it from the kit after populating the template—generator documentation does not belong in the consumer repository. |
| `design/tokens.css` | The frozen tokens from the target design system. Replace the entire file. If token **names** change, update the `@theme` block in `src/styles.css` accordingly. If the design system supplies its own CSS variables (see “Design Systems with Their Own CSS” below), this file contains only the mappings to those variables. |
| `design/tokens.json` | DTCG source produced by ingestion, with `$extensions.provenance` on every token. Replace the entire file; the scaffold illustrates the expected shape. |
| `design/components-meta.json` | The target design system's component inventory (props, **events**, variants, slots, description)—**plus `extends` for each component**: which fallthrough attributes are passed through and where `class` is applied (with `inheritAttrs: false`, specify the inner element; otherwise use `"— no fallthrough attributes"`). Without this field, every prototype agent has to infer the behavior for every field. Replace the entire array—the `DsButton` entry only illustrates the expected shape. |
| `src/components/` | The target design system's components (adopted or generated), kept flat as `src/components/<Name>.vue`. Remove `DsButton.vue` as soon as a real button is available. For an existing library, leave the folder empty except for the barrel file. |
| `src/components/index.ts` | The barrel file—value and type exports for every component. Prototypes import exclusively through it (`from '../../components'`). |
| `src/icons/icons.ts` | The target design system's icon set, frozen as SVG markup (replace the `ICONS` object). Retain `DsIcon.vue` and `src/icons/index.ts`. The two symbols in the template only illustrate the expected shape. Convention: `fill="currentColor"`, size via utilities, and never mix in a second icon set. |
| `design/fonts.css` | The target design system's `@font-face` blocks. Empty in the template (system font stack). Use local `url()` references only—the single-file export embeds them as data URIs; document the licensing status and any substitute font at the top of the file. |
| `src/styles.css` → `@theme` block plus any breakpoints, resets, and `@layer components` | The `@theme` block mirrors the token names; keep the `*: initial` guards in every namespace and replace only the lists beneath them. Retain the generic color aliases (`canvas`, `surface`, `line`, `ink`, `ink-muted`, `accent`, `accent-hover`, `on-accent`, `success`, `danger`)—the unmaintained scaffold files (`HomeView`, `NotFound`) use them. |
| `CLAUDE.md` | Not included in the template. The generator creates it with the purpose, loop, commands, workflow, and definition of done. |
| `.claude/skills/<ds>/SKILL.md` | Not included in the template. The generator creates exactly **one** skill per design system. |
| `src/prototypes/example/` | Delete it as soon as the first real prototype exists. Until then, it serves as living documentation of the conventions. |
| `index.html` → `<title>` | Optionally set it to the project name. |

## What the Generator Must NOT Change

- `src/router.ts`, `src/prototypes.ts`—automatic routing. No registry and no entry.
- `src/HomeView.vue`, `src/NotFound.vue`, `src/App.vue`—scaffold. It is never maintained.
- `src/icons/DsIcon.vue`, `src/icons/index.ts`—only `icons.ts` is populated.
- `src/main.ts`—stylesheet order is significant and fixed:
  `design/fonts.css` → `design/tokens.css` → `src/styles.css` → `design/fixes.css`.
  Fonts before tokens, fixes last (they are intended to win). The generator populates
  the four files; it does not change the imports. **Exception:** if the design system
  supplies its own base stylesheet, import it first (see below); the order of the other
  four files remains unchanged.
- `vite.config.ts`, `tsconfig.json`—except for justified stack deviations.
- `design/fixes.css`—remains empty until a specific pitfall is documented.

## Convention (Applies to the Generated Kit)

```
src/prototypes/<slug>/index.vue     →  /p/<slug>
src/prototypes/<slug>/<Name>.vue    →  /p/<slug>/<name>      (lowercase)
src/prototypes/<slug>/_shared/…     →  no route (shell, mock data, helpers)
src/prototypes/idea-<slug>/…        →  grouped as “Ideas” on the overview
```

Creating a folder creates a route. No configuration file and no registration.

## Commands

| Command | Effect |
|---|---|
| `pnpm install` | once |
| `pnpm dev` | development server on fixed port **5300** (`strictPort`) |
| `pnpm typecheck` | `vue-tsc --noEmit` (not `tsc`—otherwise no `.vue` files are checked) |
| `pnpm export` | static **single-file** export to `export/index.html`—runs in a browser when opened directly, hence hash history and `base: './'` |

If another kit on the same network already uses port 5300, assign the new kit its own
port in both `vite.config.ts` **and** `.claude/launch.json`; otherwise the agent will see
the wrong server.

`.claude/launch.json` describes the same development server for the agent's browser preview.
Without this file, the agent cannot inspect the prototype itself.

## Differences from kit-react

These are the only differences; everything else is identical.

| Topic | kit-react | kit-vue | Reason |
|---|---|---|---|
| Screens | `.tsx`, default export | `.vue` SFC, default export | Corresponding glob pattern `./prototypes/*/*.vue`; identical depth and `_shared` exclusion |
| Scroll reset | `<ScrollReset>` component in the router | `scrollBehavior: () => ({ top: 0 })` in `createRouter` | Vue Router provides a built-in hook; a component would duplicate that behavior |
| Router file | `src/router.tsx` with JSX routes | `src/router.ts` + `src/App.vue` (`<RouterView />`) + `src/NotFound.vue` | Vue separates the router instance from the root component; NotFound is a catch-all route `/:pathMatch(.*)*` |
| Types from components | directly from the `.tsx` file | additional `<script lang="ts">` block alongside `<script setup>` | nothing can be exported from `<script setup>`, but the barrel file requires the types |
| Icons | one `src/icons/index.tsx` file with a JSX body | three files: `icons.ts` (markup strings), `DsIcon.vue` (`v-html`), `index.ts` (barrel file) | SFCs cannot store a JSX fragment as a data field; `v-html` is safe because the content comes exclusively from `icons.ts` |
| Passing through props | explicit `...rest` spread | Vue fallthrough (`$attrs`); `class` is merged automatically | the metadata field `extends` is therefore called “fallthrough attributes” here; document `inheritAttrs: false` in that field |
| Events | `onClick` props | native listeners via fallthrough, custom events via `defineEmits` | `components-meta.json` therefore has an additional `events` array |
| typecheck | `tsc --noEmit` | `vue-tsc --noEmit` | `tsc` does not see anything in `.vue` files |
| TypeScript | `^7.0.2` | `^6.0.3` | **Pitfall; see below**—`vue-tsc` 3.3.11 does not run on TS 7 |
| Mount target | `#root` | `#app` | Vue convention; affects only `index.html` and `main.ts` |

## Design Systems with Their Own CSS: When the Tailwind Layer Is Removed

The template uses Tailwind because it must run without a design system. If the target
design system **provides its own styles** (a base stylesheet, CSS variables, and a grid,
for example, a component library that ships its own styles), Tailwind becomes unnecessary weight and a second, competing
layout system. In that case:

1. Remove `@tailwindcss/vite` and `tailwindcss` from `package.json` and `vite.config.ts`.
2. Retain `src/styles.css`, but remove `@import "tailwindcss"` and `@theme`; only the base
   layer (html/body/focus) and, if needed, the design system's layout language as regular
   classes remain.
3. Import the design system's base stylesheet in `src/main.ts` **before** the four kit
   stylesheets so that `design/fixes.css` still wins last.
4. `design/tokens.css` does **not** duplicate the design system's variables. It documents
   the semantic groups and refers to the package source; the package remains the source
   of truth, preventing the kit from silently diverging after the next version upgrade.
5. The scaffold files (`HomeView.vue`, `NotFound.vue`) use Tailwind utilities. Without
   Tailwind, replace their classes once with design-system classes or a few local rules in
   `src/styles.css`—this is the only scaffold adjustment forced by a design-system change.

The template supports either path: all Tailwind coupling is contained in `vite.config.ts`,
`src/styles.css`, and the scaffold files' classes—and nowhere else.

## Pitfalls

- **`vue-tsc` and TypeScript 7 are not compatible yet.** `vue-tsc` calls
  `typescript/lib/tsc` internally; TS 7 no longer exports that path, so `pnpm typecheck`
  fails with `ERR_PACKAGE_PATH_NOT_EXPORTED` even though `peerDependencies` claims
  `>=5.0.0`. TypeScript is therefore pinned to `^6.0.3` here. When upgrading, run
  `pnpm typecheck`, not only `pnpm install`.
- **`tsc` instead of `vue-tsc` checks nothing.** A green `tsc --noEmit` is meaningless
  in a Vue kit because `.vue` files remain unchecked. The script deliberately uses
  `vue-tsc`.
- **Spacing names collide.** In Tailwind v4, the `--spacing-*` namespace shadows the
  container scale: `--spacing-2xl: 3rem` silently turns `max-w-2xl` into 3rem instead
  of 42rem. For that reason, `src/styles.css` maps only `--spacing` (the base unit); the
  numeric scale `p-4`, `gap-6`, and so on is derived from it and therefore tied to the
  tokens. If the target design system has a nonlinear spacing scale, its steps belong
  under a collision-free prefix (for example, `--spacing-ds-200`).
- **Font sizes** use Tailwind names (`--text-xs/sm/base/lg/xl/2xl`), avoiding two names
  for the same step.
- **Tailwind's default palettes silently creep in.** `src/styles.css` therefore clears
  them per namespace with `--color-*: initial`, `--radius-*: initial`,
  `--shadow-*: initial`, `--text-*: initial`, and `--breakpoint-*: initial`. Without these
  lines, Tailwind continues to generate `bg-gray-100`, `rounded-3xl`, or `2xl:` without
  complaint—the screen looks plausible but still contains foreign colors in the build.
  Keep the guards; replace only the lists beneath them.
- **Fast Refresh in SFCs.** A `.vue` file under `_shared/` exports only the component.
  Put constants, mock data, and helpers in a separate adjacent `.ts` file; otherwise the
  page reloads completely after every change and clears the prototype store again.
- **No external resources.** The single-file export must work offline: no Google Fonts
  via `<link>`, no CDN scripts, and images must be data URIs or reside in `public/`
  (in the latter case, the export is no longer a single file).
- **Newly published packages break `pnpm install`.** pnpm 11 rejects versions that are
  too recent according to `minimumReleaseAge` (default 24 hours), and otherwise creates
  a `pnpm-workspace.yaml` with an exception list without prompting. When upgrading
  dependencies, choose a version more than a day old—do not commit an exception list.

## Verified on 2026-08-29

- `pnpm install` (with `name: {{KIT_NAME}}`), `pnpm typecheck` (exit 0), `pnpm export`
  (exit 0)—Node 26.8.1 / pnpm 11.24.0; resolved versions: Vue 3.5.42, vue-router 5.3.0,
  vue-tsc 3.3.11, TypeScript 6.0.3, Vite 8.2.2
- `export/index.html` is self-contained: one file (109 kB), no external `src`/`href`,
  and no `url()`/`@import` in CSS
- Opened in Chrome via `file://`: the overview renders; the flow from the overview to
  `example` to the detail view (`?id=A-2481`) works; tokens are applied (blue button,
  radius); the empty state appears when `id` is absent; and there are **no console messages**
- `_shared/Shell.vue` is not routed despite its default export (the prototype reports
  “2 screens,” not 3)
- A new `idea-probe/` folder appeared in the “Ideas” group without a configuration change;
  it was then removed again
