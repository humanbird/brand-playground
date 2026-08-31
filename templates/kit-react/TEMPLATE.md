# Template `kit-react` — What the Generator Populates

The generic core of a prototyping kit: Vite + React + TypeScript + Tailwind v4,
a single pnpm package. Runs on its own—with neutral placeholder tokens and a sample
prototype, so the conventions and structure can be validated without a design system.

`/basis` copies this folder and populates the marked sections below. Everything not
listed here is carried over unchanged.

## What Gets Replaced

| Location | Required content |
|---|---|
| `package.json` → `name`, `.claude/launch.json` → `name` | Replace the `{{KIT_NAME}}` placeholder with the kit name (npm-compatible: lowercase, no spaces). The placeholder is the **only** text substitution in the template—it appears in exactly these two locations. |
| Port (only if different from the default 5300) | Update `vite.config.ts`, `.claude/launch.json`, and the command table in the kit's CLAUDE.md **in sync**—otherwise the documentation and server will diverge. |
| `AGENTS.md` (create) | Identical content to the kit's CLAUDE.md—Cursor, Copilot, and other agents read this file; keep both files synchronized whenever they change. |
| `llms.txt` (create) | Entry-point index for any tool: one sentence describing the purpose, followed by one line per relevant path (tokens.css, components-meta.json, skill, components, commands). |
| This file (`TEMPLATE.md`) | **Delete** it from the kit after populating the template—generator documentation does not belong in the consumer repository. |
| `design/tokens.css` | The frozen tokens from the target design system. Replace the entire file. If token **names** change, update the `@theme` block in `src/styles.css` accordingly. |
| `design/tokens.json` | DTCG source produced by ingestion, with `$extensions.provenance` on every token. Replace the entire file; the scaffold illustrates the expected shape. |
| `design/components-meta.json` | The target design system's component inventory (props, variants, slots, description)—**plus `extends` for each component**: which HTML attributes are passed through and where `className` is applied (for example, `"InputHTMLAttributes<HTMLInputElement> excluding placeholder and className—the remaining props go to <input>, className goes to the field frame"`, or `"— no remaining props"`). Without this field, every prototype agent has to infer the behavior for every field. Replace the entire array—the `DsButton` entry only illustrates the expected shape. |
| `src/components/` | The target design system's components (adopted or generated), kept flat as `src/components/<Name>.tsx`. Remove `DsButton.tsx` as soon as a real button is available. |
| `src/components/index.ts` | The barrel file—every component with value and type exports. Prototypes import exclusively through it (`from '../../components'`). |
| `src/icons/index.tsx` | The target design system's icon set, frozen as React components (replace the `ICONS` object; retain `DsIcon`). The two symbols in the template only illustrate the expected shape. Convention: `fill="currentColor"`, size via utilities, and never mix in a second icon set. |
| `design/fonts.css` | The target design system's `@font-face` blocks. Empty in the template (system font stack). Use local `url()` references only—the single-file export embeds them as data URIs; document the licensing status and any substitute font at the top of the file. |
| `src/styles.css` → `@theme` block plus any breakpoints, resets, and `@layer components` rules for the design system's layout language | The `@theme` block mirrors the token names; keep the `*: initial` guards in every namespace and replace only the lists beneath them. If the design system has its own layout language (containers, vertical rhythm, full bleed), add it via `@layer components`. Retain the generic color aliases (`canvas`, `surface`, `line`, `ink`, `ink-muted`, `accent`, `accent-hover`, `on-accent`, `success`, `danger`)—the unmaintained scaffold files (`HomeView`, `router`) use them. |
| `CLAUDE.md` | Not included in the template. The generator creates it with the purpose, loop, commands, workflow, and definition of done. |
| `.claude/skills/<ds>/SKILL.md` | Not included in the template. The generator creates exactly **one** skill per design system. |
| `src/prototypes/example/` | Delete it as soon as the first real prototype exists. Until then, it serves as living documentation of the conventions. |
| `index.html` → `<title>` | Optionally set it to the project name. |

## What the Generator Must NOT Change

- `src/router.tsx`, `src/prototypes.ts`—automatic routing. No registry and no entry.
- `src/HomeView.tsx`—reads whatever is present. It is never maintained.
- `src/main.tsx`—stylesheet order is significant and fixed:
  `design/fonts.css` → `design/tokens.css` → `src/styles.css` → `design/fixes.css`.
  Fonts before tokens, fixes last (they are intended to win). The generator populates
  the four files; it does not change the imports.
- `vite.config.ts`, `tsconfig.json`—except for justified stack deviations.
- `design/fixes.css`—remains empty until a specific pitfall is documented.

## Convention (Applies to the Generated Kit)

```
src/prototypes/<slug>/index.tsx     →  /p/<slug>
src/prototypes/<slug>/<Name>.tsx    →  /p/<slug>/<name>      (lowercase)
src/prototypes/<slug>/_shared/…     →  no route (shell, mock data, helpers)
src/prototypes/idea-<slug>/…        →  grouped as “Ideas” on the overview
```

Creating a folder creates a route. No configuration file and no registration.

## Commands

| Command | Effect |
|---|---|
| `pnpm install` | once |
| `pnpm dev` | development server on fixed port **5300** (`strictPort`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm export` | static **single-file** export to `export/index.html`—runs in a browser when opened directly, hence HashRouter and `base: './'` |

`.claude/launch.json` describes the same development server for the agent's browser preview
(`pnpm dev`, port 5300). Without this file, the agent cannot inspect the prototype itself.

## Pitfalls

- **kit-vue pins TypeScript to `^6` because `vue-tsc` does not support TS 7—this is intentional.**
- **Spacing names collide.** In Tailwind v4, the `--spacing-*` namespace shadows the
  container scale: `--spacing-2xl: 3rem` silently turns `max-w-2xl` into 3rem instead
  of 42rem. For that reason, `src/styles.css` maps only `--spacing` (the base unit); the
  numeric scale `p-4`, `gap-6`, and so on is derived from it and therefore tied to the
  tokens. If the target design system has a nonlinear spacing scale, its steps belong
  under a collision-free prefix (for example, `--spacing-ds-200`).
- **Font sizes** use Tailwind names (`--text-xs/sm/base/lg/xl/2xl`), avoiding two names
  for the same step. If the target design system defines its own step names
  (`xs · s · m · l · xl · xxl · xxxl` instead of `sm/base/lg/2xl`), the generator may
  adopt them—but must do so CONSISTENTLY, including in the scaffold files (`HomeView.tsx`,
  `router.tsx` use `text-base`, `text-2xl`, `font-bold`, `rounded-lg`, `shadow-sm`,
  `sm:`, `lg:`, `max-w-2xl`, `max-w-5xl`). Two naming systems side by side are worse
  than an unfamiliar one: the prototype agent otherwise has to guess for every class.
- **The `--spacing` base unit ALSO scales `w-*` and `h-*`.** If the generator sets it
  to the target design system's unit (for example, `0.3125rem` for a 5px scale), `h-6`
  suddenly becomes 30px instead of 24, and `w-52` becomes 260px instead of 208. This
  affects every icon and control size and is noticeable only when measured—the screen
  looks “almost right.” The design system's measured dimensions (24px icon, 44px control
  height, and so on) almost never lie on the spacing scale because design systems
  calculate them in `em` relative to the font. Solution: define custom `@utility` rules
  with descriptive names at the end of `src/styles.css`; the skill then uses these as
  its vocabulary:

      @utility icon-m   { width: 1.5rem; height: 1.5rem; }   /* 24px */
      @utility control-m { height: 2.75rem; width: 2.75rem; } /* 44px */

  This is preferable to scattering arbitrary values (`h-[1.5rem]`) throughout the kit,
  and it keeps the “no px value in the diff” check honest.
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
- **Tailwind recognizes only fully written class names.** `` `text-${stufe}` ``,
  `` `shadow-level${n}` ``, or `` `rounded-${r}` `` generate nothing. This is especially
  relevant to component matrices and reference screens that iterate over variants—write
  the complete classes in a table and iterate over the table only.
- **No external resources.** The single-file export must work offline: no Google Fonts
  via `<link>`, no CDN scripts, and images must be data URIs or reside in `public/`
  (in the latter case, the export is no longer a single file).
- **Newly published packages break `pnpm install`.** pnpm 11 rejects versions that are
  too recent according to `minimumReleaseAge` (default 24 hours), and otherwise creates
  a `pnpm-workspace.yaml` with an exception list without prompting. The template therefore
  locks only mature versions (`react-router` deliberately uses 8.3.0 instead of 8.3.1).
  When upgrading dependencies, choose a version more than a day old—do not commit an
  exception list.

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
- A new `idea-*` folder appears in the “Ideas” group without a configuration change
