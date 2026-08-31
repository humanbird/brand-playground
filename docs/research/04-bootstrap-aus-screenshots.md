# Research: Bootstrapping a DS from Screenshots/Live Sites (as of 2026-08)

## Core Finding
There is no established single standard, but a convergent four-part stack has emerged:
1. Static CSS/DOM extraction when a live site is available (deterministic and always more accurate than LLM estimation)
2. Multimodal LLM extraction for screenshot-only input
3. Render-diff correction loop (Playwright + pixelmatch)
4. DTCG tokens with a custom provenance/confidence field (`$extensions`—no standard vocabulary is prescribed)

## Details

### Screenshot → Tokens
- Codia AI VisualStruct API (colors/spacing/typography from screenshots), superdesign extraction (reconstructs rules instead of copying the page), extract-design-system (GitHub arvindrk, CLI/agent skill), and abi/screenshot-to-code as a reference implementation.

### Live Website → DS
- Project Wallace (`@projectwallace/css-analyzer`, `css-design-tokens`): static CSS analysis → DTCG JSON, color/font histograms, and 200+ consistency metrics.
- Computed-styles scraping: no dedicated tool found → build it in-house (Playwright `getComputedStyle` + clustering).

### Vision LLM Limitations
- Claude tokenizes images into 28×28 patches, capped at 1568px—full-page screenshots are downscaled, and small text falls below the accuracy threshold. **Cropping at the component level is critical.**
- Error categories (Omni-I2C benchmark): Textual Precision (OCR), Entity Integrity (missing primitives), Colorimetric Accuracy, Spatial Layout.

### Render-Diff-Loop
- Playwright `toHaveScreenshot()` + pixelmatch (expected/actual/diff), established through BackstopJS/Lost Pixel. LLM loop: render → capture screenshot → return diff + console errors as context → apply a targeted correction. Community consensus, with no canonical reference implementation.

### Provenance/Confidence
- DTCG permits arbitrary `$extensions` keys but does not prescribe any → a custom schema is required, e.g. `$extensions.provenance = { source: "llm-vision"|"css-static"|"figma-variables"|"manual-verified", confidence: 0–1 }`.

## Recommended Bootstrap Pipeline (Worst Case: Screenshots Only)
1. Crop screenshots at the component level → the vision LLM extracts candidates (color/typography/spacing/radius/shadow).
2. If a live site exists, run Project Wallace in parallel as ground truth and compare the LLM estimates against it.
3. Store everything in DTCG JSON with `$extensions.provenance` (source + confidence).
4. Render loop: render components with tokens → Playwright screenshot → pixelmatch against the original → return the diff to the LLM → iterate until the threshold is met.
5. Once consistently below the threshold → promote provenance to "verified." This produces a trustworthy set incrementally instead of relying on a one-time estimate.

## Sources
- https://codia.ai/visual-struct · https://superdesign.dev/blog/extract-design-system-from-website
- https://github.com/arvindrk/extract-design-system
- https://www.projectwallace.com/design-tokens · https://github.com/projectwallace/css-design-tokens
- https://github.com/abi/screenshot-to-code/blob/main/blog/evaluating-claude.md
- https://www.digitalapplied.com/blog/screenshot-driven-ui-development-vision-models-2026
- https://arxiv.org/pdf/2603.17508
- https://www.augmentcode.com/guides/visual-regression-testing-ai-generated-uis
- https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
