# Konzept: Prototype Builder Framework (final, v1)

Stand 2026-08-29. Basis: Recherche `docs/research/01–06` + Vorbild eines internen Vue-Prototyping-Repos (destilliert).

## Zweck in einem Satz

**Ein Satz Anforderung rein, laufender Prototyp im Ziel-CD raus — für jedes Designsystem, egal in welcher Form es vorliegt.**

Das handgebaute Vorbild-Repo eines Kollegen für ein internes Vue-DS ist das Zielbild im Kleinen: ein Repo, das genau das für EIN Designsystem kann — handgebaut, weil das Vue-DS fertig im Code vorlag (Komponenten, component-meta.json, MCP-Server). Unser Framework ist der **Generator, der so ein Repo für beliebige Designsysteme erzeugt**, auch wenn der Input nur eine Live-Site, Specs oder Screenshots sind. Es baut also auch die Teile, die das Vorbild bereits mitbrachte.

## Drei Hauptfunktionen

1. **`/basis` — Design-Basis generieren.** Der Generator: DS-Input in beliebiger Qualität rein, ein lauffähiges Prototyping-Repo raus (Struktur unten). Läuft einmal pro Designsystem, wird bei neuem Input oder neuen Erkenntnissen nachgeschärft. Die einzige Stelle, wo Gründlichkeit sich lohnt — alles danach erbt davon.
2. **`/proto` — Prototypen bauen.** Konvergent, lebt im generierten Repo: ein Satz Anforderung wird zum durchklickbaren Prototyp (Ordner anlegen = Route existiert). Bei Abläufen mehrere verlinkte Screens.
3. **`/ideate` — Ideen generieren.** Divergent, lebt ebenfalls im generierten Repo: zu einer Fragestellung mehrere unterschiedliche Richtungen als grobe Varianten, nebeneinander auf der Auto-Übersicht. Die beste Richtung wandert in `/proto`.

`/proto` und `/ideate` teilen sich Repo und Loop — sie unterscheiden sich in der Haltung (ein Strang sauber vs. Breite und Tempo), nicht in der Mechanik.

## Das generierte Prototyping-Repo (das Kit)

Struktur nach dem Vorbild-Muster, verallgemeinert:

```
CLAUDE.md                        kurz: Zweck, Loop, Befehle, Arbeitsweise, „Fertig heißt"
.claude/skills/<ds>/SKILL.md     DIE eine Skill (Konzeptebene, siehe unten)
.claude/skills/<ds>/craft.md     DS-unabhängiges Handwerk (Zustände, Motion, Anti-Patterns),
                                 unverändert aus templates/kit-common/ kopiert
design/tokens.css                eingefrorene Tokens als CSS-Variablen — wird NIE regeneriert,
                                 nur bewusst editiert
design/tokens.json               DTCG-Quelle mit provenance-Feld (belegt vs. geraten)
design/components-meta.json      maschinenlesbares Komponenteninventar: Props, Varianten,
                                 Slots — das Pendant zur component-meta.json des Vorbilds
design/fonts.css                 @font-face der DS-Schriften, lokal (Export = eine Datei)
src/components/<Name>.tsx        DS-Komponenten im Code (open code, editierbar),
                                 flach, Sammelexport in src/components/index.ts
src/icons/index.tsx              das eingefrorene Icon-Set als React-Komponenten
src/prototypes/<slug>/*.vue|tsx  Ordner = Prototyp = Route; _shared/ für Shell + Mockdaten
src/Home…                        Auto-Übersicht aller Prototypen (ideate-Varianten gruppiert)
design/fixes.css                 dokumentierte Mini-Korrekturen, kommentiert
design/ingest/                   das Ingest-Ergebnis (tokens.json, report.md, assets.md) —
                                 lebt im Kit, nicht im Framework-Repo
```

Befehle: `dev` (fester Port), `typecheck`, `export` (statischer Einzeldatei-Export — Teilbarkeit per Datei/Link ist Pflicht-Feature, Stakeholder klicken ohne Setup).

### Die eine Skill
Vom Vorbild übernommen: **genau eine Skill pro Designsystem** — „wenn Wissen fehlt, gehört es dort hinein, nicht in eine zweite." Sie erklärt das System, nicht die Komponenten:
- Seiten-Anatomie: welche Regionen hat eine typische Anwendung/Seite im Ziel-CD, welche Komponente füllt sie, ein funktionierendes Gerüst-Beispiel
- Layout/Grid-Regeln inkl. der nicht-offensichtlichen Fallen
- Token-Regeln: „Tokens statt Werte" — Hex/px sind Fehler, keine Abkürzungen
- Komponentenwahl: native Elemente → DS-Komponente, Tabelle typischer Kompositionen
- Der Weg zur exakten API: components-meta.json abfragen, echte Verwendung ansehen — **nie aus dem Gedächtnis**
- Stolpersteine (wächst mit der Nutzung — jede gefundene Falle wird eingetragen)
- Haltung: links ausrichten, Weißraum statt Rahmen, realistische Inhalte, Zustände mitdenken
- „Fertig heißt": Text-Checkliste (typecheck grün, im Browser bei realistischer Breite geprüft, keine Konsolenfehler, keine hartkodierten Werte, Abläufe durchgeklickt)

Das ersetzt den früher angedachten reference/-Dateibaum: konzeptuelles Wissen in einer Skill, exakte Fakten maschinenlesbar daneben (tokens.json, components-meta.json). Erst wenn eine Skill die 500-Zeilen-Grenze sprengt, wird ausgelagert.

### Wissens-Hierarchie (nie raten)
1. `components-meta.json` + Komponenten-Quellcode — versionsgenau, belegt
2. `tokens.css` — eingefroren, die einzige Wahrheit für Werte
3. SKILL.md — Konzept und Regeln
4. Provenance in tokens.json markiert, was aus Screenshots geraten wurde — dort ist Nachprompten normal, kein Bug

## Kernentscheidungen

1. **Framework = Skills + Templates**, kein SaaS. Claude ist das Brain; die Extraktion macht ein Subagent mit Standardwerkzeug (`curl`, `grep`, Browser-MCP) statt vorgefertigter Scripts — bei heterogenem Input trägt ein Script nicht weit genug. Stand heute sind es **projektlokale Skills** (`.claude/skills/`); die Paketierung als Claude-Code-Plugin ist offen (Roadmap).
2. **Normalisierte Mitte**: DTCG-Token-JSON + Komponenteninventar. Alle Input-Adapter (Code, Figma, Live-Site, Specs, Screenshots) mappen darauf; daraus wird das Repo generiert.
3. **Stack folgt dem Ziel-DS**: Existiert DS-Code (Vue, React, Web Components), wird dessen Framework verwendet und exakt gepinnt — wie beim Vorbild. Ohne Code-Basis: Vite + React + TS + Tailwind als Default, Komponenten werden generiert.
4. **SSOT = Code.** Figma ist Input (Live-Pull via Dev Mode MCP) und später optionale generierte Ansicht — nie zweite Wahrheit, kein bidirektionaler Sync.
5. **Keine Gates, kein QA.** Explorations-Werkzeug; Treue entsteht vorne (eingefrorene Tokens, echte Komponenten, eine gute Skill). „Fertig heißt" ist eine Checkliste im Skill-Text, keine Infrastruktur. Statt Gates: **eine menschliche Abnahme am Ende von `/basis`** — der Generator baut einen Referenz-Screen nach, Owner vergleicht mit dem Original, Korrekturen fließen in Tokens/Skill.
6. **Arbeitsweise im Kit** (vom Vorbild übernommen, wörtlich als Haltung ins generierte CLAUDE.md): nicht nachfragen — bauen; Annahmen sichtbar machen und danach benennen; **der Prototyp ist die Frage, nicht die Antwort**; Abläufe als verlinkte Screens; realistische Inhalte.

## Input-Qualitätsstufen

| Input | Verfahren | Confidence |
|---|---|---|
| Code-Library | pinnen, meta.json extrahieren, direkt nutzen | hoch |
| Figma Variables/Library | Live-Pull via Dev Mode MCP, ersatzweise DTCG-Export | hoch |
| Live-Website | CSS-Analyse (Project-Wallace-artig) + computed-styles-Scan | hoch (deterministisch) |
| Specs/MD | parsen, gegen andere Quellen abgleichen | mittel |
| Screenshots | Vision-LLM (Komponenten-Crops), beim Ingest per Render-Abgleich geschärft | niedrig, markiert |

Mischinput ist der Normalfall: beste Quelle gewinnt pro Token/Komponente.

## Was `/basis` konkret tut

1. **Ingest**: Input-Adapter füllen die normalisierte Mitte (Tokens + Inventar).
2. **Generate**: Repo aus Template — Scaffold, Tokens einfrieren, Komponenten übernehmen/generieren, components-meta.json schreiben.
3. **Destill**: Claude schreibt die eine Skill — Anatomie, Regeln, Kompositionen — aus dem, was Ingest belegt hat.
4. **Abnahme**: einen Referenz-Screen des Originals nachbauen, Owner vergleicht visuell, Deltas fließen zurück (Tokens/Skill/fixes.css). Danach ist die Basis „eingefroren".

## Roadmap

- **M1 — Repo-Template + Generator-Gerüst**: das Vorbild-Muster als parametrisierbares Template (React-Default-Variante), die `/basis`-Skill, Live-Site- und Code-Adapter. Realprobe: an einer öffentlichen Konzern-Website erprobt, Referenz-Screen-Abnahme. Die Paketierung als Plugin (statt projektlokaler Skills) steht noch aus.
- **M2 — `/proto` + `/ideate`**: die beiden Modi im Template inkl. Auto-Übersicht und Export.
- **M3 — Screenshot-Adapter**: Vision-Extraktion mit Crops, Render-Abgleich beim Ingest.
- **M4 — Figma-Adapter**: Live-Pull via Dev Mode MCP; optional Figma-Ansichten aus Prototypen (generate_figma_design) für Stakeholder.
