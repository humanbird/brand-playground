# Recherche: DS-Bootstrap aus Screenshots/Live-Sites (Stand 2026-08)

## Kernbefund
Kein etablierter Einzelstandard, aber ein konvergenter Vier-Baustein-Stack:
1. Statische CSS/DOM-Extraktion, wenn Live-Site verfügbar (deterministisch, schlägt LLM-Schätzung immer)
2. Multimodale LLM-Extraktion für reine Screenshots
3. Render-Diff-Korrekturloop (Playwright + pixelmatch)
4. DTCG-Tokens mit eigenem Provenance/Confidence-Feld (`$extensions` — kein Standardvokabular vorgeschrieben)

## Details

### Screenshot → Tokens
- Codia AI VisualStruct API (Farben/Spacing/Typo aus Screenshots), superdesign-Extraction (rekonstruiert Regeln statt Seite zu kopieren), extract-design-system (GitHub arvindrk, CLI/Agent-Skill), abi/screenshot-to-code als Referenzimplementierung.

### Live-Website → DS
- Project Wallace (`@projectwallace/css-analyzer`, `css-design-tokens`): statische CSS-Analyse → DTCG-JSON, Farb-/Font-Histogramme, 200+ Konsistenzmetriken.
- Computed-styles-Scraping: kein dediziertes Tool gefunden → selbst bauen (Playwright `getComputedStyle` + Clustering).

### Vision-LLM-Grenzen
- Claude tokenisiert Bilder in 28×28-Patches, Cap 1568px — Full-Page-Screenshots werden downgescaled, kleine Schrift fällt unter die Genauigkeitsschwelle. **Cropping auf Komponentenebene ist kritisch.**
- Fehlerkategorien (Omni-I2C-Benchmark): Textual Precision (OCR), Entity Integrity (fehlende Primitives), Colorimetric Accuracy, Spatial Layout.

### Render-Diff-Loop
- Playwright `toHaveScreenshot()` + pixelmatch (expected/actual/diff), etabliert via BackstopJS/Lost Pixel. LLM-Loop: rendern → screenshotten → Diff + Konsolenfehler als Kontext zurück → gezielte Korrektur. Community-Konsens, keine kanonische Referenzimplementierung.

### Provenance/Confidence
- DTCG erlaubt beliebige `$extensions`-Keys, schreibt aber nichts vor → eigenes Schema nötig, z.B. `$extensions.provenance = { source: "llm-vision"|"css-static"|"figma-variables"|"manual-verified", confidence: 0–1 }`.

## Empfohlene Bootstrap-Pipeline (Worst Case: nur Screenshots)
1. Screenshots auf Komponentenebene croppen → Vision-LLM extrahiert Kandidaten (Farbe/Typo/Spacing/Radius/Shadow).
2. Falls Live-Site existiert: Project Wallace parallel als Ground Truth, LLM-Schätzung dagegen abgleichen.
3. Alles in DTCG-JSON mit `$extensions.provenance` (source + confidence).
4. Render-Loop: Komponenten mit Tokens rendern → Playwright-Screenshot → pixelmatch gegen Original → Diff zurück ans LLM → iterieren bis Threshold.
5. Stabil unter Threshold → Provenance auf „verified" hochstufen. So wächst ein vertrauenswürdiges Set statt Einmalschätzung.

## Quellen
- https://codia.ai/visual-struct · https://superdesign.dev/blog/extract-design-system-from-website
- https://github.com/arvindrk/extract-design-system
- https://www.projectwallace.com/design-tokens · https://github.com/projectwallace/css-design-tokens
- https://github.com/abi/screenshot-to-code/blob/main/blog/evaluating-claude.md
- https://www.digitalapplied.com/blog/screenshot-driven-ui-development-vision-models-2026
- https://arxiv.org/pdf/2603.17508
- https://www.augmentcode.com/guides/visual-regression-testing-ai-generated-uis
- https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
