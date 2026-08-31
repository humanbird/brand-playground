# Research: Similar Projects, Market, and Adoption Candidates (as of 2026-09)

Large-scale research across seven parallel tracks: the OSS landscape, hands-on code inspection (six repos cloned and reviewed), competing products, team practices, the design-system vendor perspective, research, and market positioning.

## Key Finding

**No one is building our complete pipeline.** The market is fragmented into three camps, each solving ONE segment:

| Category | Examples | What they solve |
|---|---|---|
| Ingestion tools | arvindrk/extract-design-system, DESIGN.md generators (design.dev, getdesign.md), Project Wallace | Live CSS → tokens/Markdown—but no kit, no components, no loop |
| Consumption formats | shadcn registry.json (149 registries, the de facto standard), Storybook component manifest + MCP | machine-readable component truth—but no ingestion, no prototype loop |
| SaaS platforms | Claude Design, v0 (Custom Registries), Figma Make (Make Kits), Subframe, Polymet, Lovable (Brand Kit), new: Figr/Alloy (Live-Capture) | end to end, but hosted, tied to an editor, and locked in |

Our opportunity (confirmed by market research): **local, CLI-native, bring-your-own design system in any form, with self-contained kits that require no hosting—all the way to a prototype from a single sentence.** No competitor combines multi-input ingestion, a frozen kit repo, a distilled skill, and an automatic routing loop.

**Scientific validation of the architecture:** the CHI 2026 study “Design System-Compliant UI Generation with LLM Agents” ([ACM](https://dl.acm.org/doi/10.1145/3772363.3798616)) compares a style guide in the prompt, context fragments, and a **registry-based** approach (ready-made components). The registry-based approach achieves **95% compliance** and outperforms both prompt variants. This is exactly our kit model. “Compliance Rate” (the proportion of generated UI built from genuine kit components) would be the validated metric if measurement is ever needed.

A second validation: “one skill per design system, preloaded in every session” has become an industry convention in 2026 (Anthropic’s own documentation and community practice)—the same model we developed independently.

## The Most Interesting Mechanics in Detail (Hands-On)

- **extract-design-system**: a clean Zod schema for normalized extraction; the **`audit` command** fuzzy-matches raw code values against the token palette → `coveragePct`. Skill and MCP serve as two interfaces over the same logic; the SKILL.md includes a “Safety Boundaries” section.
- **Google Labs `design.md`** (since 04/2026, with `npx @google/design.md lint`): ONE Markdown file with YAML frontmatter, a fixed section order, and an **`omitted` field** that explicitly declares intentionally missing sections and explains why—an anti-hallucination pattern for gaps. A candidate for a future standard; monitor it.
- **Storybook MCP**: react-docgen manifests plus a two-stage discovery flow; the central instruction **“Never hallucinate component properties”** as a first-class rule; a dedicated `eval/` directory containing ~50 standardized agent tasks as a benchmark.
- **Project Wallace css-design-tokens**: **stable hash IDs per token** (diffable across runs) plus `$extensions` containing usage-count and source locations—a model for provenance.
- **v0/registry-starter**: tokens, components, and blocks in one registry format over HTTP/MCP—cross-tool consumption (including Cursor/Windsurf) without repo access.
- **Claude Design**: actively checks output against the imported design system and **corrects it automatically**; an admin can lock a design system as mandatory; `/design-sync` provides a bidirectional bridge. (Vendor claims; no independent verification found.)
- **DESIGN.md community pattern**: “token, rule, and **rationale** in the same file” plus an explicit do’s/don’ts section—enabling agents to extrapolate in a system-compliant way when patterns are missing instead of drifting.

## Design-System Vendor Perspective (Where We Integrate)

No major design system is fully “agent-ready” (best audit result: shadcn at 3/5). Points of convergence: **DTCG v2025.10** for tokens (already supported for reading), **registry.json** for component distribution, **llms.txt** (rare—only Atlassian, which creates an opportunity for differentiation), and occasional MCP servers (Carbon, Polaris, Atlassian). Recommendation: prioritize READING DTCG, Figma-MCP, registry.json, and llms.txt; additionally GENERATE llms.txt in the kit (inexpensive, rare, interoperable), optionally generate registry.json for React kits, and retain DTCG as our format.

## Research (Summary)

- Registry approach > prompt context (CHI 2026, see above).
- Screenshot-to-code benchmarks from 2026 (DesignBench, WebGen-V, WebMMU): the consensus favors “screenshots + tokens combined”—tokens alone do not capture rhythm, density, or hierarchy.
- Structured schemas significantly outperform prose in API fidelity, but incur 40–60% token overhead—supporting our separation of “machine-readable facts, concept as a prose skill.”
- No published study on “story code vs. prop lists” was found; our practical finding from the Primer field test (story code eliminates guesswork) remains practitioner knowledge.

## Market/Publishing

- Reception of comparable releases is positive when they address a real pain point (“AI builds ugly UIs without a design-system standard”); the standard criticism of Claude-specific tools is “why not generic/MCP?”—prepare an answer (deliberate single-agent depth instead of cross-tool breadth; the kits themselves are readable by any tool).
- Commercial vendors all monetize through hosted editors/canvases plus sync lock-in → our OSS opportunity is credible.
- Naming: “Prototype Builder”/“RapidPrototype” already carry generic associations; **“Design System Compiler” is available as a term** and precise (a strong tagline beneath a distinctive name). Before publishing: check npm and trademarks.
- Brand tokens sourced from public CSS in examples: a common practice when disclosed (“reverse-engineered, not authorized”)—label example kits accordingly before publishing or exclude them; this is not legal advice.
- License: MIT (trust signal, following OpenCode’s example) or Apache 2.0 (patent grant)—owner decision.

## Adoption Backlog (Prioritized)

**P1—inexpensive, immediate:**
1. Add the anti-hallucination rule verbatim to the skill template: “Prop not in components-meta.json → do not use it” (Storybook pattern).
2. `omitted` concept: explicitly declare missing token categories/sections in the kit and explain why, instead of leaving them silently empty (design.md pattern; extends our “assumed, not evidenced” convention).
3. Rationale alongside each token: the skill states WHY each token role exists (DESIGN.md pattern)—partially present already; make it mandatory in the template.

**P2—next expansion step:**
4. Kit exports for ecosystem integration: always provide `llms.txt`; make `registry.json` optional for React kits.
5. Extend token provenance with usage count, source location, and stable IDs (Wallace pattern)—making refinement diffable.
6. Formalize the refinement command: re-ingest → diff against frozen tokens → owner decides (southleft-MCP/`/design-sync` pattern; aligns with our existing refinement section).
7. Zero-setup onboarding for non-developers in the Kit-README (one command, no environment knowledge)—a confirmed pain point.

**Deliberately NOT adopted:**
- `audit`/coverage as a gate and Claude Design’s automatic correction loop—conflicts with the No-Gates decision (this is an exploration tool). At most, consider it as an optional one-time check during refinement; owner decision.
- Registry hosting/HTTP endpoints (v0 pattern)—we are intentionally local.
- Mono-DESIGN.md instead of a kit—does not scale with the number of components; we will keep skill and metadata separate, but could add DESIGN.md as an export projection if the Google standard gains traction.

## Sources (Selection)
CHI 2026: https://dl.acm.org/doi/10.1145/3772363.3798616 · extract-design-system: https://github.com/arvindrk/extract-design-system · Google design.md: google-labs-code/design.md · Storybook MCP: https://github.com/storybookjs/mcp · Wallace: https://github.com/projectwallace/css-design-tokens · registry-starter: https://github.com/vercel/registry-starter · shadcn registry: https://ui.shadcn.com/docs/registry · awesome-design-md: https://github.com/VoltAgent/awesome-design-md · southleft/design-systems-mcp · v0: https://vercel.com/blog/ai-powered-prototyping-with-design-systems · Subframe: https://www.subframe.com/design-systems · Lovable Brand Kit: https://docs.lovable.dev/features/design-systems · DS-Audit: designsystems.one · DTCG: https://www.designtokens.org/
