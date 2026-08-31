# Recherche: Code ↔ Figma Single Source of Truth (Stand 2026-08)

## Kernbefund
Für einen einzelnen UX Designer mit Ziel HTML-Prototypen ist bidirektionale Figma-Sync 2026 **Overkill**. Branchentrend: **Code als Source of Truth, Figma als Input/Downstream-Ansicht** — umgekehrt zur klassischen Annahme.

## Details

### Code → Figma (generate_figma_design & Co.)
Brauchbar für einfache bis mittlere Screens, aber: kein Feedback-Loop (sieht das gerenderte Ergebnis nicht), erfindet ohne Code-Connect-Mappings Ad-hoc-Styles, reduziert Logik auf einen statischen Frame-Zustand, Auto-Layout/Variants oft manuell nachzuziehen.

### Figma → Code (Tokens)
Lücke 2026 weitgehend geschlossen: Figma Variables → DTCG-JSON-Export („Export to JSON" pro Collection) → Style Dictionary v4 → CSS-Vars/Tailwind. Round-Trip mit vernünftiger Fidelity möglich.

### Wer ist Source of Truth?
- JumpCloud dokumentiert öffentlich den Wechsel: Figma wurde „upstream input, not downstream truth" — das DS im Code ist der Vertrag.
- Figma bleibt wertvoll für Token-Management, visuelle Exploration, Stakeholder-Kommunikation — verliert aber die Rolle als alleinige Wahrheit.
- Praxisberichte (UX Collective): Solo-Designer wechseln zu Prototyping direkt in Code, weil der Figma-Sync-und-Rebuild-Loop „strukturell unnötig" wurde.

## Empfehlung mit Ausbaustufen (Scout)
- **MVP: keine Sync-Pipeline.** HTML-Prototypen als primäres Artefakt; Figma nur punktuell als Input; gelegentlich generate_figma_design für Stakeholder-Ansichten, ohne Konsistenz-Garantie.
- **Stufe 2** (wenn Zielsystem/Team entsteht): unidirektionale Token-Pipeline Figma Variables → DTCG → Style Dictionary → CSS-Vars.
- **Stufe 3** (nur bei echtem Team-Handoff): Code Connect für gemeinsames Vokabular. Volle bidirektionale Sync bleibt fragil — Hilfsmittel, keine verlässliche Automatisierung.

## Quellen
- https://www.builder.io/blog/figma-mcp-server · https://developers.figma.com/docs/figma-mcp-server/
- https://levelup.gitconnected.com/how-to-build-a-figma-to-code-design-token-pipeline-part-1-8b66ef9a45d4
- https://medium.com/@jc-design/figma-is-no-longer-the-source-of-truth-adb89feabafb
- https://superdesign.dev/blog/figma-to-code
- https://uxdesign.cc/why-i-skipped-figma-and-prototyped-in-code-instead-8d1dab51c07d
- https://uxmag.com/articles/your-design-system-works-in-figma-does-it-work-in-code
