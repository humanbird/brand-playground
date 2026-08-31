# Recherche: AI-Prototyping-Tool-Landschaft (Stand 2026-08)

## Kernbefunde

### v0 / Lovable / Bolt / Replit
- **v0 (Vercel)**: reifste DS-Integration — eigene shadcn-Registries als „AI-Native Design System" (MCP-basiert), Custom-Tailwind-Config, Figma-Import. Funktioniert auch in Cursor/Windsurf.
- **Lovable, Bolt, Replit**: shadcn+Tailwind-optimiert, aber kein Custom-Registry-Konzept — DS-Grounding nur informell über Prompt/Style-Docs.

### Figma Make
- Juli 2026: visuelles Editing + Annotations. **Kein Beleg**, dass Team-Libraries direkt als Grounding-Quelle für Codegen konsumiert werden — offene Lücke, nur Marketing-Nähe.

### Nischentools
- **Polymet**: Figma-Import + Round-Trip, am ehesten DS-nativ gedacht.
- **Onlook**: DS-Konsistenz über globale Styles/Tokens.
- **Subframe**: generiert eher eigenes DS, wenig Import.
- **Magic Patterns**: Figma-Import + Re-Export-Plugin.
- **superdesign.dev**: kein Tool, aber beste Analyse des Drift-Problems (siehe unten).

### Claude Design / Claude Code
- **Claude Design** (Launch 17.04.2026): klickbare Prototypen im Browser; **jedes Projekt verlangt ein angehängtes/erstelltes Designsystem** — strukturell sehr nah an unserem Vorhaben. Empfohlener Workflow: Exploration in Claude Design → Doku → Claude Code implementiert im Repo.
- Keine etablierten Dritt-Rezepte für „Claude Code + Enterprise-CD als Prototyping-Framework" gefunden — die Nische ist offen.

### Design-Drift (dokumentierte Schwächen)
- Modelle ohne Zugriff auf reale Tokens/Komponenten „raten aus dem Durchschnitt aller trainierten UIs": fabrizierte Tokens, Drift innerhalb einer Session, Amnesie zwischen Sessions, stille Breaking Changes.
- Mitigation (superdesign): Tokens in eingefrorener, nie regenerierter Datei; Modell auf Assemblierung realer Komponenten beschränken; Lint + Screenshot-Diff-Loop vor Shipping.

## Bewertung (Scout)
**Übernehmen:** v0-Registry-Pattern (DS als Registry/eingefrorene Referenz statt Prompt-Beschreibung); superdesign-Checkliste (Tokens einfrieren, Lint+Diff); Claude-Design-UX („kein Projekt ohne DS").
**Eigenes Claude-Code-Framework lohnt, weil:** kein Vendor-Lock, beliebige DS-Formate jenseits shadcn (Konzern-CD!), Drift-Mitigation direkt in Skills/Subagenten verankerbar. Konzern-CDs mit eigenem CSS/Web-Components sind bei v0/Lovable/Bolt strukturell schlecht unterstützt.

## Quellen
- https://vercel.com/blog/working-with-figma-and-custom-design-systems-in-v0
- https://v0.app/docs/design-systems-legacy · https://github.com/vercel/registry-starter
- https://www.designsystemscollective.com/design-systems-lovable-bolt-v0-and-replit-50a0a197bc35
- https://docs.polymet.ai/academy/figma-integration
- https://www.magicpatterns.com/docs/documentation/importing/import-from-figma
- https://superdesign.dev/blog/ai-design-system-drift
- https://www.designsystemscollective.com/claude-design-the-complete-setup-workflow-guide-2026-5de41e62fd4c
- https://www.mindstudio.ai/blog/claude-design-vs-claude-code-ui-prototypes
