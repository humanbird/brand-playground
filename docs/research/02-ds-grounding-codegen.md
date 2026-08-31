# Recherche: Designsystem-Grounding für AI-Codegen (Stand 2026-08)

## Kernbefunde

### Design Tokens: DTCG ist der De-facto-Standard
- DTCG Format Module 2025.10 seit Okt. 2025 stabil (W3C Community Group, kein offizieller Standard, aber industrieweit adoptiert: Figma, Penpot, Sketch, Tokens Studio, Style Dictionary, Terrazzo). Format: JSON mit `$value`, `$type`, `$description`, `$extensions`.
- Style Dictionary v4 unterstützt DTCG nativ (Alias-Resolution, Transformer-Pipeline).
- Empfehlung: DTCG-JSON als kanonisches Austauschformat, Style Dictionary als Build zu CSS-Variablen/JS/Tailwind.

### Figma MCP + Code Connect
- Offizieller Figma Dev Mode MCP Server: 14 Tools, liefert Komponenten-Metadaten, Variablen, Layer-Tree, Spacing direkt in den Agenten-Kontext.
- **Code Connect** = Schlüssel für treue Codegen: mappt Figma-Node → reale Code-Komponente (Import-Pfad, Props, Snippet). Ohne Mapping generiert der Agent Duplikate. Seit Nov. 2025 KI-gestützte Mapping-Vorschläge in der Code-Connect-UI.

### Komponenten-Distribution
- shadcn registry.json: „open code" — Komponenten werden in den eigenen Code kopiert, keine Blackbox → für LLMs lesbar und editierbar. Private Registries für interne DS sind Standard-Praxis.
- Storybook MCP (`@storybook/addon-mcp`, ab Storybook 10.3): Doku-Discovery + Story-Erzeugung + Story-Tests = „generate → test → fix"-Schleife. Stand 03/2026 nur React.
- Komponenten-Docs als Markdown bleiben der robusteste Kanal ohne Tooling.

### Stack-Empfehlung: React + Tailwind + shadcn-Muster
- Marktkonsens 2026. Gründe: Trainingsdaten-Dominanz von React, Copy-Paste/open-code ohne Abstraktionslayer, Tailwind-Utilities zuverlässiger für LLMs als tiefe Prop-Hierarchien. TypeScript verbessert Agenten-Erfolg messbar (Constraints).
- Plain HTML+CSS-Variablen: nicht als Best Practice belegt, aber auch nicht widerlegt — offene Frage für sehr einfache Protos.

### Drei Säulen „AI-readable DS" (aus Case-Study-Aggregaten)
1. Maschinenlesbare Tokens (semantische Namen → deutlich bessere Codegen-Genauigkeit)
2. MCP-/Registry-Zugriff
3. Komponenten-Contracts (Varianten/States/Kombinationsregeln als Metadaten)
- Kernthese: 2026 lautet die Frage nicht mehr „kann KI UI generieren?", sondern „konsumiert das DS, was generiert wird, ohne Drift?"

## Empfohlene Pipeline (Scout)
Figma Variables/Tokens Studio → DTCG-JSON → Style Dictionary → CSS-Vars/Tailwind/TS-Types → Komponenten-Registry (shadcn-Format) + Code Connect + Storybook-MCP → Agent generiert gegen reale Komponenten.

## Quellen
- https://styledictionary.com/info/dtcg/ · https://www.designtokens.org/tr/drafts/format/
- https://docs.tokens.studio/manage-settings/token-format
- https://developers.figma.com/docs/code-connect/code-connect-ui-setup/
- https://github.com/figma/mcp-server-guide
- https://ui.shadcn.com/docs/registry · https://ui.shadcn.com/docs/registry/registry-json
- https://storybook.js.org/docs/ai/mcp/overview
- https://www.builder.io/blog/react-ai-stack-2026
- https://mohitphogat.medium.com/your-design-system-isnt-ai-readable-yet-168aca6d2e13
- https://www.designsystems.one/ai-ready
