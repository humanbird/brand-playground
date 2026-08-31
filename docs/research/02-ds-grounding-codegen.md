# Research: Design System Grounding for AI Code Generation (as of 2026-08)

## Core Findings

### Design Tokens: DTCG Is the De Facto Standard
- DTCG Format Module 2025.10 has been stable since October 2025 (W3C Community Group; not an official standard, but adopted across the industry by Figma, Penpot, Sketch, Tokens Studio, Style Dictionary, and Terrazzo). Format: JSON with `$value`, `$type`, `$description`, `$extensions`.
- Style Dictionary v4 supports DTCG natively (alias resolution, transformer pipeline).
- Recommendation: use DTCG JSON as the canonical exchange format and Style Dictionary to build CSS variables/JS/Tailwind.

### Figma MCP + Code Connect
- Official Figma Dev Mode MCP server: 14 tools that provide component metadata, variables, the layer tree, and spacing directly in the agent context.
- **Code Connect** = the key to faithful code generation: maps a Figma node → a real code component (import path, props, snippet). Without this mapping, the agent generates duplicates. The Code Connect UI has offered AI-assisted mapping suggestions since November 2025.

### Component Distribution
- shadcn registry.json: "open code"—components are copied into the project's own code, with no black box → readable and editable by LLMs. Private registries for internal design systems are standard practice.
- Storybook MCP (`@storybook/addon-mcp`, from Storybook 10.3): documentation discovery + story generation + story tests = a "generate → test → fix" loop. React only as of 2026-03.
- Component documentation in Markdown remains the most robust channel without tooling.

### Stack Recommendation: React + Tailwind + the shadcn Pattern
- Market consensus in 2026. Reasons: React's dominance in training data, copy-paste/open code without an abstraction layer, and Tailwind utilities being more reliable for LLMs than deep prop hierarchies. TypeScript measurably improves agent success (constraints).
- Plain HTML + CSS variables: neither established nor disproven as a best practice—an open question for very simple prototypes.

### Three Pillars of an "AI-Readable DS" (from Aggregated Case Studies)
1. Machine-readable tokens (semantic names → significantly better code-generation accuracy)
2. MCP/registry access
3. Component contracts (variants/states/composition rules as metadata)
- Core thesis: in 2026, the question is no longer "can AI generate UI?" but "can the DS consume what is generated without drift?"

## Recommended Pipeline (Scout)
Figma Variables/Tokens Studio → DTCG JSON → Style Dictionary → CSS variables/Tailwind/TS types → component registry (shadcn format) + Code Connect + Storybook MCP → the agent generates against real components.

## Sources
- https://styledictionary.com/info/dtcg/ · https://www.designtokens.org/tr/drafts/format/
- https://docs.tokens.studio/manage-settings/token-format
- https://developers.figma.com/docs/code-connect/code-connect-ui-setup/
- https://github.com/figma/mcp-server-guide
- https://ui.shadcn.com/docs/registry · https://ui.shadcn.com/docs/registry/registry-json
- https://storybook.js.org/docs/ai/mcp/overview
- https://www.builder.io/blog/react-ai-stack-2026
- https://mohitphogat.medium.com/your-design-system-isnt-ai-readable-yet-168aca6d2e13
- https://www.designsystems.one/ai-ready
