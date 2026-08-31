# brand-playground

**Turn any design system into your brand's playground.**

The design system compiler: vorne kommt Designsystem-Input in beliebiger Form rein (Figma-Library, Code-Library, Live-Website, Specs, Screenshots — auch gemischt), hinten fällt eine AI-ready Basis raus, mit der sich schnell CI-treue Prototypen bauen lassen.

Status: **M1+M2 stehen** und wurden über vier reale Szenarien getestet: an einer öffentlichen Konzern-Website erprobt, Code-first Onyx sowie Figma lückenhaft/reich — inkl. Blindtests und E2E-Läufen. Konzept in `docs/konzept.md`, Recherche in `docs/research/`.

## Aufsetzen

Es gibt nichts zu installieren außer dem Repo selbst — der Generator ist eine projektlokale Claude-Code-Skill (`.claude/skills/basis/`), die Templates liegen daneben.

**Voraussetzungen** (einmalig pro Rechner):
- [Claude Code](https://claude.com/claude-code) installiert und eingeloggt
- Node.js >= 22.22 (aktuelles LTS empfohlen) und pnpm (`corepack enable`)
- Nur für Figma-Input: der offizielle Figma-MCP-Server, verbunden mit einem Account, der das Ziel-File lesen kann — Hauptweg: `claude mcp add --transport http figma-remote-mcp https://mcp.figma.com/mcp`

**Setup:**

```bash
git clone https://github.com/humanbird/brand-playground.git
cd brand-playground
claude
```

Das ist alles. In dieser Session steht `/basis` zur Verfügung, weil die Skill im Repo liegt.

## Benutzen

**1. Basis generieren** — in der Framework-Session den Input benennen, egal in welcher Form:

```
/basis Unser Designsystem: https://www.beispiel.de — bau mir die Basis. Ziel ~/dev/beispiel-rapidprototype.
```

Input ist alles, was du im Satz benennst oder in die Session gibst — auch gemischt, und was fehlt, fragt Claude nach:

| Form | So gießt du sie rein |
|---|---|
| Live-Website | URL in den Satz: `/basis https://www.beispiel.de …` |
| Figma | File-Link einfügen (Figma-MCP muss verbunden sein und das File lesen dürfen) |
| Code-Library | Repo-Pfad oder npm-Paketname nennen |
| Specs/MD | Dateipfad nennen oder die Datei ins Terminal ziehen |
| Screenshots | Bilder in einen Ordner legen und den Pfad nennen, oder direkt ins Terminal ziehen/pasten |

Heraus fällt ein eigenständiges Kit-Repo (Tokens eingefroren, Komponenten, eine DS-Skill, Referenz-Screen). Am Ende steht deine visuelle Abnahme: Referenz-Screen neben Original, Korrekturen fließen zurück, dann ist die Basis eingefroren.

**2. Prototypen bauen** — ab jetzt arbeitest du nur noch im Kit, das Framework-Repo brauchst du erst wieder bei neuem DS-Input:

```bash
cd ~/dev/beispiel-rapidprototype
claude
```

Ein Satz genügt — „Baue mir einen Prototyp für …" (proto) oder „Ich will Ideen sammeln zu …" (ideate). `pnpm dev` zeigt alles unter einem Port, `pnpm export` baut eine teilbare Einzeldatei.

Das Kit ist self-contained (eigene CLAUDE.md, eigene Skill, gepinnte Dependencies) — es funktioniert auch auf einem anderen Rechner, auf dem nur Claude Code + Node/pnpm installiert sind; das Framework-Repo muss dort nicht liegen.

## Struktur

```
.claude/skills/basis/   der Generator (/basis)
templates/kit-react/    Kit-Template (Default)
templates/kit-vue/      Kit-Template für Vue-Designsysteme
templates/kit-common/   CLAUDE.md-/SKILL.md-Vorlagen + craft.md (DS-unabhängiges Handwerk)
docs/                   Konzept + Recherche
```

[MIT License](LICENSE)
