# Lessons from a Previous Project (an Earlier Design QA Tool)—Distilled

Findings from an independent analysis of an earlier project with a similar scope. Relevance: direct course correction for this concept.

## Mainstream Stack in 2026 for “Faithful LLM Implementation of Figma/Design Systems”
Context plus an inexpensive feedback loop, NOT verification infrastructure:
1. **Figma Dev Mode MCP live in the editor**: `get_design_context` (structured selection), `get_variable_defs` (tokens), `get_screenshot` (reference image). No export, no pinning, no artifacts—the agent queries the source live.
2. **Code Connect** (or a simple mapping file): “this Figma node is `<BaseButton>` in the repo” → the agent uses existing components instead of rebuilding them.
3. **Rules/skill file** containing project conventions—Figma provides a dedicated prompt for this (`create_design_system_rules`).
4. **Screenshot loop** (“Eyes” pattern): implement → render → capture a screenshot → compare it with the reference image → fix.

Setup effort: one MCP server plus two text files. Result: “very close, usually correct.”

## The Central Pitfall (Encountered There, to Be Avoided Here)
**A proof instrument was built instead of an outcome-oriented tool.** Canonical records, pins, contracts, gates, provenance validation, and response bureaucracy → the machinery of a QA/audit product (answering “can I trust this claim?”). To achieve the goal of having “the agent build it correctly,” only two things are needed: **reliable structured truth as input plus a precise error signal as feedback.** The implementation itself was never the problem (blind test: three knowledge bases, three flawless results).

## What Remains Valuable from the Previous Project
The **precise, deterministic error signal**: a property comparison (“font-size 15 instead of 16, line by line”) outperforms LLM vision and imprecise screenshot diffs (“looks roughly the same”). This is exactly what the mainstream stack lacks.

## An Honest View of “Pixel-Perfect”
No one guarantees this through automation in 2026: vision models miss small metric deviations, and **pixel diffs against Figma fail because of different rasterization**. What is achievable is “**property-perfect plus human review for the rest**”—the state of the art, including at Figma itself.

## Implications for This Framework
1. Make the verification gate primarily a **property diff** (Playwright computed styles vs. a token/spec table); use the screenshot loop only as a coarse secondary signal.
2. No proof/audit machinery: provenance remains a simple metadata field, with no validation bureaucracy or artifact-chain gates.
3. Prefer **live pulls via Dev Mode MCP** for Figma input over exported artifacts; evaluate `create_design_system_rules` as a building block for kit compilation.
4. Treat a lightweight approach as a design principle: a knowledge base plus a precise error signal. Every feature must serve the implementation loop, not the proof process.
