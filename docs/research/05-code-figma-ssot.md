# Research: Code ↔ Figma Single Source of Truth (as of 2026-08)

## Key Finding
For an individual UX designer building HTML prototypes, bidirectional Figma sync is **overkill** in 2026. The industry trend is toward **code as the source of truth, with Figma as an input/downstream view**—the reverse of the traditional assumption.

## Details

### Code → Figma (generate_figma_design & Co.)
Useful for simple to moderately complex screens, but it has no feedback loop (it cannot see the rendered result), invents ad hoc styles without Code Connect mappings, reduces logic to a static frame state, and often requires manual cleanup of auto layout and variants.

### Figma → Code (Tokens)
The gap is largely closed in 2026: Figma Variables → DTCG JSON export (“Export to JSON” per collection) → Style Dictionary v4 → CSS variables/Tailwind. A round trip with reasonable fidelity is possible.

### What Is the Source of Truth?
- JumpCloud has publicly documented the shift: Figma became “upstream input, not downstream truth”—the design system in code is the contract.
- Figma remains valuable for token management, visual exploration, and stakeholder communication, but it is losing its role as the sole source of truth.
- Field reports (UX Collective) show solo designers moving to prototyping directly in code because the Figma sync-and-rebuild loop has become “structurally unnecessary.”

## Recommended Roadmap (Scout)
- **MVP: no sync pipeline.** HTML prototypes are the primary artifact; Figma is used selectively as input; generate_figma_design may occasionally produce stakeholder views, with no consistency guarantee.
- **Stage 2** (once a target system or team emerges): a unidirectional token pipeline from Figma Variables → DTCG → Style Dictionary → CSS variables.
- **Stage 3** (only for a genuine team handoff): Code Connect for a shared vocabulary. Full bidirectional sync remains fragile—useful as an aid, but not as reliable automation.

## Sources
- https://www.builder.io/blog/figma-mcp-server · https://developers.figma.com/docs/figma-mcp-server/
- https://levelup.gitconnected.com/how-to-build-a-figma-to-code-design-token-pipeline-part-1-8b66ef9a45d4
- https://medium.com/@jc-design/figma-is-no-longer-the-source-of-truth-adb89feabafb
- https://superdesign.dev/blog/figma-to-code
- https://uxdesign.cc/why-i-skipped-figma-and-prototyped-in-code-instead-8d1dab51c07d
- https://uxmag.com/articles/your-design-system-works-in-figma-does-it-work-in-code
