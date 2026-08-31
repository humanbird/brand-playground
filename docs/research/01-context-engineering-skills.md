# Recherche: Context Engineering & Skills (Stand 2026-08)

## Kernbefunde

### Skills/SKILL.md — offizielle Anthropic-Best-Practices
- Drei Ladestufen: (1) `name`+`description` (~30–50 Tokens) immer im System-Prompt, (2) volle SKILL.md bei Task-Match, (3) Referenzdateien/Scripts erst bei Bedarf.
- Frontmatter: `description` max 1024 Zeichen, dritte Person, muss „was" UND „wann triggern" enthalten — vage Beschreibungen → Under-Triggering.
- SKILL.md-Body unter 500 Zeilen, ideal unter 150. Darüber: in Referenzdateien aufteilen.
- Progressive Disclosure: SKILL.md = Inhaltsverzeichnis/Navigation, Details in `reference/*.md`. **Referenzen nur eine Ebene tief** — verschachtelte Referenzen führen zu Partial-Reads (`head -100`).
- Domain-Split explizit empfohlen (BigQuery-Beispiel mit `reference/finance.md` etc.) — übertragbar: `reference/tokens.md`, `components.md`, `patterns.md`, `accessibility.md`.
- Referenzdateien >100 Zeilen brauchen ein TOC oben.
- Skripte statt Freitext für deterministische Operationen (Token-Validierung, Lint-Checks).
- Evaluation-driven: erst 3 Testszenarien, dann Skill schreiben.

### Push vs. Pull
- Push (immer im Kontext): System-Prompt, CLAUDE.md, Skill-Descriptions. Pull (on-demand): Skill-Body, Referenzdateien, MCP-Calls, Registry-Queries, Reads.
- Faustregel: nur so viel pushen, dass Claude weiß, DASS eine Fähigkeit existiert (Trigger-Signal); Inhalt gehört ins Pull-Layer.
- MCP komplementär zu Skills: MCP = Capabilities/Live-Daten, Skills = wiederholbare Workflows/Wissen.
- Für Designsystem: CLAUDE.md nur knappe Verweise + Trigger („Bei UI-Arbeit: DS-Skill nutzen"), keine Token-Tabellen.

### Struktur für DS-Knowledge-Base (Referenzbeispiele)
- **shadcn/ui** (reifstes öffentliches Beispiel Ende 2026): `llms.txt` + JSON-Descriptor pro Komponente (Name, Version, Stability, a11y, Props, Usage), 313 Komponenten maschinenlesbar; eigener MCP-Server für Registry-Suche; „Skills"-Paket injiziert Projekt-Kontext dynamisch (liest components.json, Tailwind-Config).
- Empfohlenes Muster: **kein einzelnes großes DESIGN.md**, sondern SKILL.md als Overview + domain-gesplittete Referenzen + maschinenlesbares Registry-Format (JSON/llms.txt) für exakte Fakten.
- daisyUI „Blueprint" MCP: Grounding via Live-Query realer Komponentenmuster.
- Claude Design (claude.ai/design): validiert Output gegen echte DS-Komponenten vor Anzeige — Verifikationsschleife.

## Empfehlung (Scout)
- CLAUDE.md minimal: Trigger-Sätze + Verweis auf Skills/MCP.
- Ein Skill `designsystem-usage` mit SKILL.md als TOC, Referenzen (Tokens, Komponenten, Patterns, A11y), max. eine Ebene tief.
- Exakte Fakten (Props, Varianten, Farbwerte) strukturiert (JSON-Registry/llms.txt) statt Prosa — reduziert Halluzination.
- MCP-Server nur bei vielen Komponenten/Live-Registry nötig; sonst Skill + Referenzdateien.
- Typische Fehler: zu ausführlich (jeder Token muss sich rechtfertigen), vage Descriptions, tiefe Verschachtelung, zeitabhängige Aussagen ohne Legacy-Marker.

## Offene Lücken
- Anthropic „Context Engineering"-Publikation nur über Sekundärquellen bestätigt.

## Quellen
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://ui.shadcn.com/docs/skills · https://ui.shadcn.com/llms.txt · https://ui.shadcn.com/docs/registry
- https://ui.shadcn.com/docs/changelog/2026-03-cli-v4
- https://www.anthropic.com/engineering/code-execution-with-mcp
- https://daisyui.com/claude-code/ui-design-mcp-server/
- https://github.com/e-brokenc0de/claude-design-mcp
- https://support.claude.com/en/articles/14604416-get-started-with-claude-design
- https://www.designsystemscollective.com/design-systems-in-2026-turn-your-system-into-a-claude-skill-3dd4d8bf5feb
