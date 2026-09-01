---
name: basis
description: Generates a self-contained prototyping kit repository (frozen tokens, real components, one distilled skill) from design system input — a code library, Figma file, live website, specifications, screenshots, or any combination. Use it whenever a design foundation needs to be created or refined (/basis, "build foundation", "generate kit", new DS input).
---

# /basis — Generate a design foundation

Turn DS input of any quality into a repository where one sentence describing a requirement goes in and a working prototype in the target corporate design comes out. Thoroughness pays off here because everything that follows inherits from this foundation.

## Core rules

- **Invent nothing.** Every token value requires a source. Deterministic sources (CSS, code, Figma Variables) take precedence over LLM estimates. Estimated values are marked as such in `tokens.json` (`$extensions.provenance`) and are never frozen silently.
- **Use the best source for each token/component.** Mixed input is the normal case.
- **One DS skill per kit.** Missing knowledge belongs there, not in a second skill.
- Use the latest major versions for all dependencies; pin DS packages exactly.

## Workflow

### 0. Receive input
The user names sources in the request (URL, Figma link, repository path/package name, specification file, screenshot directory, or any combination). If essential information is missing (no source, unclear target directory, or a Figma link without MCP access), ask a brief question in interactive sessions instead of guessing. Only use conservative defaults in runs without a return channel, and state those defaults in the result.

### 1. Ingest → `<kit>/design/ingest/`
Working files (raw CSS, downloads) belong in the temporary working directory. The result goes into the kit under `design/ingest/` and is committed THERE—**never to the framework repository** (it is the product, not a workspace, and kits must work without the framework repository). The output always includes: `tokens.json` (DTCG, with provenance—for every token, also include `usage` (how often the value occurred in the source) and a stable `id` (short hash of role+value) so that later re-ingests can be diffed manually), `report.md` (style report: colors+roles, typography system, spacing logic, radius/shadow, breakpoints, component inventory with values, page anatomy), and `assets.md` (logos, fonts, icon style).

| Input | Method |
|---|---|
| Code library | Pin the package; extract props/variants mechanically (vue/react-docgen, component-meta, d.ts) |
| Figma | Live pull via Figma MCP (`get_variable_defs`, `get_design_context`); use the `figma-use` skill when write access is available |
| Live website | Use a subagent to download and concatenate stylesheets, then analyze declaration histograms and custom properties (`curl` + `grep`/`sort`/`uniq -c` is sufficient); derive the HTML component inventory from the rendered DOM. First check whether the site provides its own token/theme CSS—if so, ingestion is deterministic, just as it is for code |
| Specs/MD | Parse and cross-check against other sources |
| Screenshots | Use vision on component crops (never full pages because of downscaling), mark candidates as low-confidence, and refine them by comparing against a reconstruction |

Delegate ingestion runs to a subagent (Agent tool, general-purpose type; use the strongest available model), then distill the result back into the main task. In headless runs (`claude -p`), first ensure that `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`; otherwise the session is terminated after 600 seconds while subagents are still running. If uncertain, work inline there instead of in the background. Keep run plans in a temporary file outside the repository to avoid collisions with parallel sessions.

### 2. Generate → Target repository
1. Confirm the target directory with the user (default: `~/dev/<ds>-rapidprototype`), copy `templates/kit-react/` there, and replace placeholders according to `TEMPLATE.md` (including the port if it differs: keep vite.config.ts, `.claude/launch.json`, and the CLAUDE.md command table in sync). Remove TEMPLATE.md; keep the example/ prototype until the first real prototype exists, then delete it.
   **The stack is an implementation detail — derive it from the input instead of making the user choose.** If the design system ships runnable code, use its framework (pick the matching template if one exists, e.g. `templates/kit-vue/`; otherwise port the kit-react conventions to that framework, following the differences documented in `templates/kit-vue/TEMPLATE.md` as the worked example). For all other inputs, use the default template. **Only when the stack is genuinely ambiguous** — the DS ships code for several frameworks, or mixed inputs point in different directions — ask the user briefly instead of guessing (if they want more than one framework, that means one kit per framework — run /basis once per stack) (in runs without a return channel: pick the option closest to the DS source and state it). The user may also override the stack with a single sentence in the request; state the derived choice in the result either way.
2. **Freeze tokens**: copy the curated DTCG `tokens.json` from ingestion to `design/tokens.json` (replacing the scaffold), and generate `design/tokens.css` from it (semantic CSS variables). From this point on, edit it only deliberately and never regenerate it.
3. **Components**: create one component per inventory entry as `src/components/<Name>.tsx` (flat, one file per component). It must use tokens exclusively and cover all documented variants/states. If a code library exists, use the original instead of recreating it. Export every component from `src/components/index.ts` (value and type exports); prototypes import only through this barrel.
4. **Freeze the icon set as React components** (`src/icons/index.tsx`): copy the source set (sprite, icon library, Figma components) into the `ICONS` object, enforce `fill="currentColor"`, and preserve the original names. If the source names only a library without a subset (for example, “Lucide, 20px”), freeze the 20–30 most common UI symbols and expand the set as needed. Do not use a runtime package or `<use>` pointing to a sprite file—the single-file export must work offline. Never mix in a second set.
5. Write **`design/components-meta.json`**: include every component with its props, variants, and slots, including `extends` (forwarded HTML attributes or “no rest props”) and `className` (exactly where it is applied). Do not merely name object props: expand their shape (`{min, max}`) or reference the type source in the repository. This file is the API source of truth; anything missing here will be guessed during implementation.
6. Add fonts from `assets.md` to `design/fonts.css` as `@font-face` declarations (local `url()` only, so the export can embed them as data URIs; respect the license—if uncertain, use a free replacement font and document it at the top of the file). Add logos as SVG files under `src/assets/`.

### 3. Distill → the DS skill
Fill `templates/kit-common/SKILL.md.template` using only verified knowledge from ingestion and the components that were actually built. The skill may reference repository-local sources only (including node_modules)—paths outside the kit are unavailable in blind tests and on other machines. The skill explains the system (anatomy, grid, token rules, component selection, compositions, visual stance), never individual APIs; for APIs, it points to `components-meta.json`. Likewise, turn `CLAUDE.md.template` into the kit's CLAUDE.md. Keep the generated skill under 500 lines (the official limit for reliable loading): if a filled section outgrows its structure, move the detail into a reference file next to the skill and link it — one level deep, never nested further.

For kit-vue, replace every React/`.tsx` reference in both templates with the Vue equivalents described in the framework-differences section of `templates/kit-vue/TEMPLATE.md` (file extensions, router/HomeView filenames, icon structure icons.ts/DsIcon.vue/index.ts).

Copy `templates/kit-common/craft.md` unchanged to `.claude/skills/<ds>/craft.md`—this is the DS-independent craft guidance. SKILL.md and CLAUDE.md reference it; without the copy, both references are broken.

**Multi-agent support**: Also write two files to the kit root so that Cursor, Copilot, and other agents can use the kit:
- `AGENTS.md`—identical in content to the kit's CLAUDE.md (one source of truth, two filenames; keep both in sync when making changes). Reference the skill and craft.md there as regular file paths (“read .claude/skills/<ds>/SKILL.md”)—other agents do not understand the skill concept, but they can read files.
- `llms.txt`—a short entry-point index: one sentence explaining what the kit is, followed by paths with a one-line purpose for each (tokens.css, components-meta.json, SKILL.md, craft.md, src/components/, src/prototypes/, commands).

### 4. Reference screen (completion of generator work)
Build a representative reference screen under `src/prototypes/reference-<name>/` and inspect it in the browser (typecheck, console, realistic width). What it shows depends on the source:
- An original exists (live site, Figma screens): recreate the original.
- Code library: build a typical application page based on the package's official examples.
- Sources without an original (specifications/MD, component files only): build a **specification coverage screen** that visibly applies every source rule once, plus a component matrix if useful.

### 5. Sign-off (the only human review point—the user, not an agent)
Place the reference screen(s) beside the original or specification for the user to compare. Feed any deltas back into tokens.css, components, the skill, and `design/fixes.css`. The foundation is then considered frozen.

**Recommended before sign-off: a blind-test prototype** (you decide whether to run it; it is not automatically part of the /basis deliverable). A fresh agent uses only the kit's knowledge (CLAUDE.md, the skill, `components-meta.json`, source code—without ingestion context or questions) to build a multi-step prototype and records every point of friction. Anything it had to guess is missing from the kit: feed each finding back as a component, metadata field, skill section, or pitfall. Nothing exposes gaps as reliably as the first independent use.

## Special case: code-first (the DS is maintained as a package)

Validated in a field test against a mature Vue component library—the workflow becomes shorter, and several contract points change roles:
- **Ingest** = pin the package exactly + mechanically extract metadata (component-meta/docgen/d.ts + alias resolution for exports); there is a single source with high confidence, so no provenance reconciliation is needed.
- **Components/icons are omitted**: import directly from the package—`src/components/` and `src/icons/` do not exist. Rewrite CLAUDE.md/SKILL wording (“Import through src/components/”) for the package path.
- **Verify export resolution against the type definitions, not against the package's metadata file.** A DS may claim an incorrect import path for a component, and a subpath says nothing about freshness (in Primer, the *outdated* `SelectPanel` variant is under `/experimental`, while the current one is on the main path). `components-meta.json` therefore records two fields: the verified `import` and the source's claim. Distinguish same-named components on multiple paths by `id`+`status`.
- **Keep Tailwind or remove it?** Base this decision on what the DS provides for layout. Some design systems provide their own grid and utilities, so Tailwind was removed. Primer 38 provides neither `Box` nor `sx`, only components, so Tailwind remains—but explicitly as a *layout* tool, with breakpoints aligned to the DS tiers and a rule that colors/typography never come from Tailwind. Explain the decision in CLAUDE.md and the skill.
- **`tokens.css` becomes a map rather than the source of truth**: naming patterns, roles, and fixed mappings—NO copied values (theme-dependent values such as `light-dark()` would be wrong in one mode). “Never regenerate” no longer applies; the package versions the source of truth. If the package supplies its tokens as CSS, add the corresponding `@import` here as well. If the template keeps Tailwind, also add an **alias bridge**: `--ds-color-ink: var(--fgColor-default)`, and so on. This keeps the unmaintained scaffold files working without copying a single value, and they follow theme changes automatically.
- **Theme switching is part of the setup contract.** If color variables depend on attribute selectors (`[data-color-mode]`, `.dark`, `:root[data-theme]`), add those attributes to `<html>` in `index.html`, not just to a provider wrapper; otherwise `<body>` remains unthemed. Also note that many design systems set fallback values in their component CSS (`var(--bgColor-default,#fff)`). If the theme import is missing, the prototype looks *almost* correct and only custom `var()` rules fail—the error does not appear where it originates. The kit must include the validation command for this.
- **components-meta.json** may change shape: a `$` header (source, regeneration instructions, missing/alias notes) + `components[]`; it is regenerable, grep-friendly, and never loaded in full.
- **Sign-off**: there is no external original—the reference screen demonstrates anatomy and composition from the package's official examples.
- **Ask about the layout model, not breakpoints**: some design systems are container-based rather than viewport-based—the skill describes the DS model, not the template model.

## Refinement
New input (for example, later access to Figma) goes through ingestion again. Present conflicts with frozen tokens to the user as a diff; never overwrite them silently.
