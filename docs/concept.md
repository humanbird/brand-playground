# brand-playground (concept, v1)

As of 2026-08-29, revised 2026-09-01. Based on research in `docs/research/01–06` and a distilled reference implementation from an internal Vue prototyping repository.

## Purpose in One Sentence

**One sentence describing the requirement goes in; a working prototype in the target corporate design comes out—for any design system, regardless of its form.**

A colleague's hand-built reference repository for an internal Vue DS serves as a small-scale model of the target: a repository that does exactly this for ONE design system—built by hand because the Vue DS was already fully available as code (components, component-meta.json, MCP server). Our framework is the **generator that creates such a repository for any design system**, even when the only input is a live site, specifications, or screenshots. It therefore also builds the parts that were already present in the reference implementation.

## One Command, Two Modes

1. **`/playground`—compile the design system into a playground.** The only command the framework provides. It accepts DS input of any quality and produces a working prototyping repository (the *kit*, structure below). It runs once per design system, resumes an interrupted run from the kit's filesystem state, refreshes a kit's scaffold from a newer template (`/playground --refresh <kit>`), and is rerun when new input or insights arrive. This is the one stage where thoroughness pays off—everything that follows inherits from it.
2. **proto mode—build prototypes.** Not a command: the default way of working inside the generated kit. A one-sentence requirement becomes a clickable prototype (create a directory = the route exists). Flows use multiple linked screens.
3. **ideate mode—generate ideas.** Also lives inside the kit: a question produces several distinct directions as rough variants, shown side by side in the auto-generated overview. The best direction moves on to proto mode.

The two modes share the same repository and loop—they differ in approach (one polished path vs. breadth and speed), not in mechanics. They are described in the kit's `AGENTS.md`; the agent recognizes which one is asked for from the request.

## Naming Conventions

- Framework repository: `brand-playground`; the generator skill lives in `.claude/skills/playground/`.
- A generated kit: `<ds>-playground` (for example `acme-playground`), by default created as a sibling of the framework checkout (`../<ds>-playground`).
- Inside a kit: one skill per DS at `.claude/skills/<ds>/` (`SKILL.md`, `craft.md`, `pitfalls.md`); prototypes under `src/prototypes/<slug>/`; ideation variants under `src/prototypes/idea-<topic>-<variant>/`; the reference screen under `src/prototypes/reference-<name>/`.
- Templates: `templates/kit-react/` (default), `templates/kit-vue/` (Vue code libraries), `templates/kit-common/` (files shared by both, filled by the generator).

## The Generated Prototyping Repository (the Kit)

Generalized structure based on the reference pattern:

```
AGENTS.md                        canonical instructions for every agent: purpose, loop,
                                 commands, modes, working approach, "Done means"
CLAUDE.md                        two lines: @AGENTS.md import for Claude Code
README.md                        for humans: start, example requests, where to look, sharing
llms.txt                         entry-point index for any tool
.claude/skills/<ds>/SKILL.md     THE one skill (conceptual level, see below)
.claude/skills/<ds>/craft.md     DS-independent craft (states, motion, anti-patterns),
                                 copied unchanged from templates/kit-common/
.claude/skills/<ds>/pitfalls.md  everything that went wrong once; grows without limit
design/kit.json                  provenance stamp: generator, template, framework commit,
                                 timestamp, stack—what refresh reads
design/tokens.css                frozen tokens as CSS variables—NEVER regenerated,
                                 edited only deliberately
design/tokens.json               DTCG source with provenance (source, confidence, usage, id)
design/components-meta.json      machine-readable component inventory: props, variants,
                                 slots, status (verified/derived/estimated)
design/fonts.css                 @font-face for the DS fonts, stored locally (export = one file)
design/fixes.css                 documented, commented micro-fixes
design/ingest/                   the ingest result (tokens.json, report.md, assets.md,
                                 PROGRESS.md)—lives in the kit, not in the framework repository
src/components/<Name>.tsx        DS components in code (open code, editable),
                                 flat, with a barrel export in src/components/index.ts
src/icons/index.tsx              the frozen icon set as React components
src/prototypes/<slug>/*.tsx      directory = prototype = route; _shared/ for shell, mock
                                 data, and optional meta (title, judgeAt, reference)
src/HomeView…, src/router…       generator-owned scaffold: overview, routing, viewport toggle
```

Commands: `dev` (fixed port, runs a preflight first), `typecheck`, `export` (static single-file export of all prototypes or one—sharing by file/link is a required feature; stakeholders can click through without any setup).

### The One Skill
Adopted from the reference implementation: **exactly one skill per design system**—"when knowledge is missing, it belongs there, not in a second skill." It explains the system, not the components:
- Page anatomy: the regions in a typical application/page in the target corporate design, the component that fills each region, and a working scaffold example
- Layout/grid rules, including non-obvious pitfalls
- Token rules: "tokens instead of values"—hex/px values are errors, not shortcuts
- Component selection: native elements → DS component, plus a table of typical compositions
- How to find the exact API: query components-meta.json and inspect real usage—**never rely on memory**
- Approach: left-align, use whitespace instead of borders, use realistic content, and account for states
- "Done means": textual checklist (typecheck passes, checked in a browser at the width the prototype targets, no console errors, no hard-coded values, flows clicked through)

Pitfalls live next to the skill in `pitfalls.md`, which grows through use and does not count against the skill's 500-line limit. This replaces the previously planned reference/ file tree: conceptual knowledge lives in one skill, while exact facts sit alongside it in machine-readable form (tokens.json, components-meta.json). Content is split out only when a skill exceeds the 500-line limit, and only one level deep.

### Knowledge Hierarchy (Never Guess)
1. `components-meta.json` + component source code—version-specific and substantiated; `status` says whether an entry was verified, derived, or estimated
2. `tokens.css`—frozen and the single source of truth for values
3. SKILL.md—concepts and rules
4. Provenance in tokens.json marks anything inferred from screenshots—follow-up prompting is normal there, not a bug

## Core Decisions

1. **Framework = Skills + Templates**, not SaaS. Claude is the brain; a subagent performs extraction using standard tools (`curl`, `grep`, browser MCP) instead of prebuilt scripts—heterogeneous input is too varied for a script to go far enough. At present, these are **project-local skills** (`.claude/skills/`); packaging them as a Claude Code plugin remains open (roadmap).
2. **Normalized intermediate representation**: DTCG token JSON + component inventory. Every input adapter (code, Figma, live site, specifications, screenshots) maps to it; the repository is generated from this representation.
3. **The stack follows the target DS**: if DS code exists (Vue, React, Web Components), its framework is used and pinned exactly—as in the reference implementation. Without a code base, the default is Vite + React + TS + Tailwind, and components are generated.
4. **SSOT = code.** Figma is an input (live pull via Dev Mode MCP) and later an optional generated view—never a second source of truth and never a bidirectional sync.
5. **No gates, no QA.** This is an exploration tool; fidelity is established up front (frozen tokens, real components, one good skill). "Done means" is a checklist in the skill text, not infrastructure. Instead of gates, there is **one human sign-off at the end of `/playground`**—the generator recreates a reference screen, the owner compares it with the original, and corrections feed back into tokens/the skill.
6. **Working approach in the kit** (adopted from the reference implementation and included verbatim as guidance in the generated AGENTS.md): do not ask—build; make assumptions visible and state them afterward; **the prototype is the question, not the answer**; represent flows as linked screens; use realistic content.
7. **A run is resumable and a kit is refreshable.** A `/playground` run commits after every phase and keeps a checkpoint in `design/ingest/PROGRESS.md`; on resume, the phase is derived from the filesystem, never from memory. Every kit carries `design/kit.json` with the template and framework commit it was built from. `/playground --refresh` re-copies only generator-owned scaffold files (listed in the template's `TEMPLATE.md`) and never touches tokens, components, the skill, or prototypes. The contract that makes this safe: scaffold files use only `@layer kit` classes and generic `--ds-*` aliases, so they are identical across kits.
8. **One instruction source per kit.** `AGENTS.md` is canonical for every agent; `CLAUDE.md` merely imports it. Nothing is kept in sync by hand.

## Input Quality Levels

| Input | Method | Confidence |
|---|---|---|
| Code library | pin, extract meta.json, use directly | high |
| Figma Variables/Library | live pull via Dev Mode MCP, with DTCG export as a fallback | high for values; structure usually needs a second source |
| Live website | CSS analysis (Project Wallace-style) + computed-styles scan; a versioned DS bundle makes it deterministic | high (deterministic) |
| Specs/MD | parse, cross-check against other sources | medium |
| Screenshots | vision LLM (component crops), refined during ingest through render comparison | low, marked |

Mixed input is the norm: the best source wins for each token/component.

## What `/playground` Does

0. **Resume check**: if the target exists, derive the phase from the filesystem and continue.
1. **Ingest**: input adapters populate the normalized intermediate representation (tokens + inventory).
2. **Generate**: create the repository from the template—scaffold it (with `kit.json`), freeze tokens, adopt/generate components, and write components-meta.json.
3. **Distill**: Claude writes the one skill—anatomy, rules, compositions—from the evidence established during ingest, plus `AGENTS.md`, `pitfalls.md`, `llms.txt`, and the human `README.md`.
4. **Reference screen**: recreate a reference screen from the original (or a coverage screen from specs).
5. **Sign-off**: have the owner compare it visually, and feed deltas back into tokens/the skill/fixes.css. The foundation is then "frozen."
6. **Hand over**: print the "What now" card—start, example requests, where to look, how to share.

## Roadmap

- **M1—repository template + generator scaffold**: the reference pattern as a parameterized template (default React variant), the `/playground` skill, and live-site and code adapters. Real-world trial: tested against a public corporate website, followed by reference-screen sign-off. Packaging as a plugin (instead of project-local skills) is still pending.
- **M2—proto + ideate modes**: both modes in the template, including the auto-generated overview and export.
- **M3—screenshot adapter**: vision extraction with crops, plus render comparison during ingest.
- **M4—Figma adapter**: live pull via Dev Mode MCP; optional Figma views generated from prototypes (generate_figma_design) for stakeholders.
