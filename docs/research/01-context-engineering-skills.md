# Research: Context Engineering & Skills (as of 2026-08)

## Core Findings

### Skills/SKILL.md—Official Anthropic Best Practices
- Three loading levels: (1) `name`+`description` (~30–50 tokens) always in the system prompt, (2) the full SKILL.md on a task match, (3) reference files/scripts only when needed.
- Frontmatter: `description` must be no more than 1024 characters, written in the third person, and include both "what" AND "when to trigger"—vague descriptions → under-triggering.
- Keep the SKILL.md body under 500 lines, ideally under 150. Above that, split it into reference files.
- Progressive disclosure: SKILL.md = table of contents/navigation, with details in `reference/*.md`. **Keep references only one level deep**—nested references lead to partial reads (`head -100`).
- An explicit domain split is recommended (the BigQuery example uses `reference/finance.md`, etc.)—applicable here as `reference/tokens.md`, `components.md`, `patterns.md`, `accessibility.md`.
- Reference files longer than 100 lines need a TOC at the top.
- Use scripts instead of prose for deterministic operations (token validation, lint checks).
- Evaluation-driven: define 3 test scenarios first, then write the skill.

### Push vs. Pull
- Push (always in context): system prompt, CLAUDE.md, skill descriptions. Pull (on demand): skill body, reference files, MCP calls, registry queries, reads.
- Rule of thumb: push only enough for Claude to know THAT a capability exists (trigger signal); the content belongs in the pull layer.
- MCP complements skills: MCP = capabilities/live data, skills = repeatable workflows/knowledge.
- For a design system, CLAUDE.md should contain only concise references + triggers ("For UI work, use the DS skill"), not token tables.

### Structure for a DS Knowledge Base (Reference Examples)
- **shadcn/ui** (the most mature public example in late 2026): `llms.txt` + one JSON descriptor per component (name, version, stability, a11y, props, usage), with 313 components available in machine-readable form; a dedicated MCP server for registry search; a "Skills" package that dynamically injects project context (reads components.json and the Tailwind config).
- Recommended pattern: **do not use one large DESIGN.md**; instead, use SKILL.md as an overview + domain-specific references + a machine-readable registry format (JSON/llms.txt) for exact facts.
- daisyUI "Blueprint" MCP: grounding through live queries of real component patterns.
- Claude Design (claude.ai/design): validates output against real DS components before display—a verification loop.

## Recommendation (Scout)
- Keep CLAUDE.md minimal: trigger sentences + references to skills/MCP.
- Use one `designsystem-usage` skill with SKILL.md as a TOC and references (tokens, components, patterns, A11y), no more than one level deep.
- Store exact facts (props, variants, color values) in a structured format (JSON registry/llms.txt), not prose—this reduces hallucination.
- Use an MCP server only when there are many components or a live registry; otherwise, use a skill + reference files.
- Common mistakes: too much detail (every token has to justify itself), vague descriptions, deep nesting, and time-dependent statements without a legacy marker.

## Open Gaps
- Anthropic's "Context Engineering" publication has only been confirmed through secondary sources.

## Sources
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://ui.shadcn.com/docs/skills · https://ui.shadcn.com/llms.txt · https://ui.shadcn.com/docs/registry
- https://ui.shadcn.com/docs/changelog/2026-03-cli-v4
- https://www.anthropic.com/engineering/code-execution-with-mcp
- https://daisyui.com/claude-code/ui-design-mcp-server/
- https://github.com/e-brokenc0de/claude-design-mcp
- https://support.claude.com/en/articles/14604416-get-started-with-claude-design
- https://www.designsystemscollective.com/design-systems-in-2026-turn-your-system-into-a-claude-skill-3dd4d8bf5feb
