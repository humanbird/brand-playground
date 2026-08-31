# brand-playground (concept, v1)

As of 2026-08-29. Based on research in `docs/research/01–06` and a distilled reference implementation from an internal Vue prototyping repository.

## Purpose in One Sentence

**One sentence describing the requirement goes in; a working prototype in the target corporate design comes out—for any design system, regardless of its form.**

A colleague's hand-built reference repository for an internal Vue DS serves as a small-scale model of the target: a repository that does exactly this for ONE design system—built by hand because the Vue DS was already fully available as code (components, component-meta.json, MCP server). Our framework is the **generator that creates such a repository for any design system**, even when the only input is a live site, specifications, or screenshots. It therefore also builds the parts that were already present in the reference implementation.

## Three Core Functions

1. **`/basis`—generate the design foundation.** The generator accepts DS input of any quality and produces a working prototyping repository (structure below). It runs once per design system and is refined when new input or insights become available. This is the one stage where thoroughness pays off—everything that follows inherits from it.
2. **`/proto`—build prototypes.** This convergent mode lives in the generated repository: a one-sentence requirement becomes a clickable prototype (create a directory = the route exists). Flows use multiple linked screens.
3. **`/ideate`—generate ideas.** This divergent mode also lives in the generated repository: a question produces several distinct directions as rough variants, shown side by side in the auto-generated overview. The best direction moves into `/proto`.

`/proto` and `/ideate` share the same repository and loop—they differ in approach (one polished path vs. breadth and speed), not in mechanics.

## The Generated Prototyping Repository (the Kit)

Generalized structure based on the reference pattern:

```
CLAUDE.md                        brief: purpose, loop, commands, workflow, "Done means"
.claude/skills/<ds>/SKILL.md     THE one skill (conceptual level, see below)
.claude/skills/<ds>/craft.md     DS-independent craft (states, motion, anti-patterns),
                                 copied unchanged from templates/kit-common/
design/tokens.css                frozen tokens as CSS variables—NEVER regenerated,
                                 edited only deliberately
design/tokens.json               DTCG source with provenance field (substantiated vs. inferred)
design/components-meta.json      machine-readable component inventory: props, variants,
                                 slots—the counterpart to the reference's component-meta.json
design/fonts.css                 @font-face for the DS fonts, stored locally (export = one file)
src/components/<Name>.tsx        DS components in code (open code, editable),
                                 flat, with a barrel export in src/components/index.ts
src/icons/index.tsx              the frozen icon set as React components
src/prototypes/<slug>/*.vue|tsx  directory = prototype = route; _shared/ for shell + mock data
src/Home…                        auto-generated overview of all prototypes (ideate variants grouped)
design/fixes.css                 documented, commented micro-fixes
design/ingest/                   the ingest result (tokens.json, report.md, assets.md)—
                                 lives in the kit, not in the framework repository
```

Commands: `dev` (fixed port), `typecheck`, `export` (static single-file export—sharing by file/link is a required feature; stakeholders can click through without any setup).

### The One Skill
Adopted from the reference implementation: **exactly one skill per design system**—"when knowledge is missing, it belongs there, not in a second skill." It explains the system, not the components:
- Page anatomy: the regions in a typical application/page in the target corporate design, the component that fills each region, and a working scaffold example
- Layout/grid rules, including non-obvious pitfalls
- Token rules: "tokens instead of values"—hex/px values are errors, not shortcuts
- Component selection: native elements → DS component, plus a table of typical compositions
- How to find the exact API: query components-meta.json and inspect real usage—**never rely on memory**
- Pitfalls (grows through use—every discovered pitfall is recorded)
- Approach: left-align, use whitespace instead of borders, use realistic content, and account for states
- "Done means": textual checklist (typecheck passes, checked in a browser at a realistic width, no console errors, no hard-coded values, flows clicked through)

This replaces the previously planned reference/ file tree: conceptual knowledge lives in one skill, while exact facts sit alongside it in machine-readable form (tokens.json, components-meta.json). Content is split out only when a skill exceeds the 500-line limit.

### Knowledge Hierarchy (Never Guess)
1. `components-meta.json` + component source code—version-specific and substantiated
2. `tokens.css`—frozen and the single source of truth for values
3. SKILL.md—concepts and rules
4. Provenance in tokens.json marks anything inferred from screenshots—follow-up prompting is normal there, not a bug

## Core Decisions

1. **Framework = Skills + Templates**, not SaaS. Claude is the brain; a subagent performs extraction using standard tools (`curl`, `grep`, browser MCP) instead of prebuilt scripts—heterogeneous input is too varied for a script to go far enough. At present, these are **project-local skills** (`.claude/skills/`); packaging them as a Claude Code plugin remains open (roadmap).
2. **Normalized intermediate representation**: DTCG token JSON + component inventory. Every input adapter (code, Figma, live site, specifications, screenshots) maps to it; the repository is generated from this representation.
3. **The stack follows the target DS**: if DS code exists (Vue, React, Web Components), its framework is used and pinned exactly—as in the reference implementation. Without a code base, the default is Vite + React + TS + Tailwind, and components are generated.
4. **SSOT = code.** Figma is an input (live pull via Dev Mode MCP) and later an optional generated view—never a second source of truth and never a bidirectional sync.
5. **No gates, no QA.** This is an exploration tool; fidelity is established up front (frozen tokens, real components, one good skill). "Done means" is a checklist in the skill text, not infrastructure. Instead of gates, there is **one human sign-off at the end of `/basis`**—the generator recreates a reference screen, the owner compares it with the original, and corrections feed back into tokens/the skill.
6. **Working approach in the kit** (adopted from the reference implementation and included verbatim as guidance in the generated CLAUDE.md): do not ask—build; make assumptions visible and state them afterward; **the prototype is the question, not the answer**; represent flows as linked screens; use realistic content.

## Input Quality Levels

| Input | Method | Confidence |
|---|---|---|
| Code library | pin, extract meta.json, use directly | high |
| Figma Variables/Library | live pull via Dev Mode MCP, with DTCG export as a fallback | high |
| Live website | CSS analysis (Project Wallace-style) + computed-styles scan | high (deterministic) |
| Specs/MD | parse, cross-check against other sources | medium |
| Screenshots | vision LLM (component crops), refined during ingest through render comparison | low, marked |

Mixed input is the norm: the best source wins for each token/component.

## What `/basis` Does

1. **Ingest**: input adapters populate the normalized intermediate representation (tokens + inventory).
2. **Generate**: create the repository from the template—scaffold it, freeze tokens, adopt/generate components, and write components-meta.json.
3. **Distill**: Claude writes the one skill—anatomy, rules, compositions—from the evidence established during ingest.
4. **Sign-off**: recreate a reference screen from the original, have the owner compare it visually, and feed deltas back into tokens/the skill/fixes.css. The foundation is then "frozen."

## Roadmap

- **M1—repository template + generator scaffold**: the reference pattern as a parameterized template (default React variant), the `/basis` skill, and live-site and code adapters. Real-world trial: tested against a public corporate website, followed by reference-screen sign-off. Packaging as a plugin (instead of project-local skills) is still pending.
- **M2—`/proto` + `/ideate`**: both modes in the template, including the auto-generated overview and export.
- **M3—screenshot adapter**: vision extraction with crops, plus render comparison during ingest.
- **M4—Figma adapter**: live pull via Dev Mode MCP; optional Figma views generated from prototypes (generate_figma_design) for stakeholders.
