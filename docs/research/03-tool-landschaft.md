# Research: AI Prototyping Tool Landscape (as of 2026-08)

## Core Findings

### v0 / Lovable / Bolt / Replit
- **v0 (Vercel)**: the most mature DS integration—custom shadcn registries as an "AI-Native Design System" (MCP-based), custom Tailwind config, Figma import. Also works in Cursor/Windsurf.
- **Lovable, Bolt, Replit**: optimized for shadcn + Tailwind, but with no custom registry concept—DS grounding is only informal, through prompts/style documentation.

### Figma Make
- July 2026: visual editing + annotations. **No evidence** that team libraries are consumed directly as a grounding source for code generation—an open gap, with only marketing suggesting a connection.

### Niche Tools
- **Polymet**: Figma import + round-trip, with what appears to be the most DS-native approach.
- **Onlook**: DS consistency through global styles/tokens.
- **Subframe**: tends to generate its own DS, with limited import support.
- **Magic Patterns**: Figma import + re-export plugin.
- **superdesign.dev**: not a tool, but the best analysis of the drift problem (see below).

### Claude Design / Claude Code
- **Claude Design** (launched 2026-04-17): clickable prototypes in the browser; **every project requires an attached/created design system**—structurally very close to our approach. Recommended workflow: exploration in Claude Design → documentation → implementation in the repository with Claude Code.
- No established third-party recipes were found for "Claude Code + enterprise corporate design as a prototyping framework"—the niche remains open.

### Design Drift (Documented Weaknesses)
- Models without access to real tokens/components "guess from the average of all UIs in their training data": fabricated tokens, drift within a session, amnesia between sessions, and silent breaking changes.
- Mitigation (superdesign): keep tokens in a frozen file that is never regenerated; restrict the model to assembling real components; run a lint + screenshot-diff loop before shipping.

## Assessment (Scout)
**Adopt:** the v0 registry pattern (DS as a registry/frozen reference instead of a prompt description); the superdesign checklist (freeze tokens, lint + diff); the Claude Design UX ("no project without a DS").
**A custom Claude Code framework is worthwhile because:** there is no vendor lock-in, it can support any DS format beyond shadcn (including enterprise corporate design systems), and drift mitigation can be embedded directly in skills/subagents. Enterprise corporate design systems with custom CSS/Web Components are poorly supported by the architecture of v0/Lovable/Bolt.

## Sources
- https://vercel.com/blog/working-with-figma-and-custom-design-systems-in-v0
- https://v0.app/docs/design-systems-legacy · https://github.com/vercel/registry-starter
- https://www.designsystemscollective.com/design-systems-lovable-bolt-v0-and-replit-50a0a197bc35
- https://docs.polymet.ai/academy/figma-integration
- https://www.magicpatterns.com/docs/documentation/importing/import-from-figma
- https://superdesign.dev/blog/ai-design-system-drift
- https://www.designsystemscollective.com/claude-design-the-complete-setup-workflow-guide-2026-5de41e62fd4c
- https://www.mindstudio.ai/blog/claude-design-vs-claude-code-ui-prototypes
