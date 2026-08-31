# Recherche: Ähnliche Projekte, Markt und Übernahme-Kandidaten (Stand 2026-09)

Groß angelegte Recherche über 7 parallele Läufe: OSS-Landschaft, Hands-on-Code-Inspektion (6 Repos geklont und gelesen), Produkt-Konkurrenz, Team-Praktiken, DS-Hersteller-Seite, Wissenschaft, Markt/Positionierung.

## Kernbefund

**Niemand baut unsere volle Kette.** Der Markt ist fragmentiert in drei Lager, die jeweils EIN Segment lösen:

| Lager | Vertreter | Was sie lösen |
|---|---|---|
| Ingest-Tools | arvindrk/extract-design-system, DESIGN.md-Generatoren (design.dev, getdesign.md), Project Wallace | Live-CSS → Tokens/Markdown — aber kein Kit, keine Komponenten, kein Loop |
| Konsum-Formate | shadcn registry.json (149 Registries, De-facto-Standard), Storybook Component-Manifest + MCP | maschinenlesbare Komponenten-Wahrheit — aber kein Ingest, kein Prototyp-Loop |
| SaaS-Plattformen | Claude Design, v0 (Custom Registries), Figma Make (Make Kits), Subframe, Polymet, Lovable (Brand Kit), neu: Figr/Alloy (Live-Capture) | End-to-End, aber gehostet, Editor-gebunden, Lock-in |

Unsere Lücke (durch Markt-Scout bestätigt): **lokal, CLI-nativ, bring-your-own-Designsystem in beliebiger Form, eigenständige Kits ohne Hosting — bis zum Prototyp aus einem Satz.** Kein Wettbewerber kombiniert Multi-Input-Ingest + eingefrorenes Kit-Repo + eine destillierte Skill + Auto-Routing-Loop.

**Wissenschaftliche Bestätigung der Architektur:** CHI-2026-Studie „Design System-Compliant UI Generation with LLM Agents" ([ACM](https://dl.acm.org/doi/10.1145/3772363.3798616)) vergleicht Styleguide-im-Prompt vs. Kontext-Fragmente vs. **registry-based** (fertige Komponenten) — registry-based erreicht **95 % Compliance** und schlägt beide Prompt-Varianten. Genau unser Kit-Modell. „Compliance Rate" (Anteil generierter UI aus echten Kit-Komponenten) wäre die validierte Metrik, falls je gemessen werden soll.

Zweite Bestätigung: „Eine Skill pro Designsystem, die jede Session vorlädt" ist 2026 Branchenkonvention geworden (Anthropic-eigene Doku, Community-Praxis) — unser Modell, unabhängig erfunden.

## Die interessantesten Mechaniken im Detail (Hands-on)

- **extract-design-system**: sauberes Zod-Schema für normalisierte Extraktion; **`audit`-Kommando** matcht Code-Rohwerte fuzzy gegen die Token-Palette → `coveragePct`. Skill-und-MCP als zwei Interfaces über derselben Logik; „Safety Boundaries"-Abschnitt in der SKILL.md.
- **Google Labs `design.md`** (seit 04/2026, mit `npx @google/design.md lint`): EIN Markdown mit YAML-Frontmatter, feste Sektionsfolge, **`omitted`-Feld** deklariert bewusst fehlende Sektionen mit Begründung — Anti-Halluzinations-Muster für Lücken. Kandidat für einen künftigen Standard; beobachten.
- **Storybook MCP**: react-docgen-Manifeste + zweistufiger Discovery-Flow; zentrale Instruktion **„Never hallucinate component properties"** als First-Class-Regel; eigener `eval/`-Ordner mit ~50 standardisierten Agent-Tasks als Benchmark.
- **Project Wallace css-design-tokens**: **stabile Hash-IDs pro Token** (diffbar über Läufe) + `$extensions` mit usage-count und Fundstellen — Provenienz-Vorbild.
- **v0/registry-starter**: Tokens+Komponenten+Blocks in einem Registry-Format über HTTP/MCP — Cross-Tool-Konsum (auch Cursor/Windsurf) ohne Repo-Zugriff.
- **Claude Design**: prüft Output aktiv gegen das importierte DS und **korrigiert automatisch nach**; Admin kann ein DS als verbindlich sperren; `/design-sync` als bidirektionale Brücke. (Herstelleraussagen, keine unabhängige Prüfung gefunden.)
- **DESIGN.md-Community-Muster**: „Token, Regel und **Rationale** in derselben Datei" + expliziter Do's/Don'ts-Abschnitt — damit Agenten bei fehlenden Patterns systemkonform extrapolieren statt zu driften.

## DS-Hersteller-Seite (woran wir andocken)

Kein großes DS ist voll „agent-ready" (bestes Audit-Ergebnis: shadcn 3/5). Konvergenzpunkte: **DTCG v2025.10** für Tokens (lesen wir schon), **registry.json** für Komponenten-Distribution, **llms.txt** (selten — nur Atlassian; also Differenzierungschance), MCP-Server vereinzelt (Carbon, Polaris, Atlassian). Empfehlung: bevorzugt LESEN: DTCG, Figma-MCP, registry.json, llms.txt; zusätzlich ERZEUGEN im Kit: llms.txt (billig, selten, anschlussfähig), optional registry.json bei React-Kits, DTCG bleibt ohnehin unser Format.

## Wissenschaft (Kurzfassung)

- Registry-Ansatz > Prompt-Kontext (CHI 2026, s.o.).
- Screenshot-to-code-Benchmarks 2026 (DesignBench, WebGen-V, WebMMU): Konsens tendiert zu „Screenshots + Tokens kombiniert" — Tokens allein erfassen Rhythmus/Dichte/Hierarchie nicht.
- Strukturierte Schemas schlagen Prosa bei API-Treue deutlich, kosten aber 40–60 % Token-Overhead — spricht für unsere Trennung „Fakten maschinenlesbar, Konzept als Prosa-Skill".
- Keine publizierte Studie zu „Story-Code vs. Prop-Listen" gefunden; unser Primer-Praxisbefund (Story-Code ersetzt Raten) bleibt Praxiswissen.

## Markt/Publishing

- Rezeption vergleichbarer Publishes: positiv, wenn ein realer Schmerz getroffen wird („AI baut hässliche UIs ohne DS-Standard"); Standard-Kritik an Claude-gebundenen Tools: „warum nicht generisch/MCP?" — Antwort vorbereiten (bewusste Ein-Agent-Tiefe statt Cross-Tool-Breite; Kits selbst sind tool-neutral lesbar).
- Kommerzielle Anbieter monetarisieren alle über gehostete Editoren/Canvas + Sync-Lock-in → unsere OSS-Lücke ist glaubwürdig.
- Naming: „Prototype Builder"/„RapidPrototype" sind generisch vorbelastet; **„Design System Compiler" ist als Begriff frei** und präzise (gut als Tagline unter einem eigenständigen Namen). Vor Publish: npm-/Trademark-Check.
- Marken-Tokens aus öffentlichem CSS in Beispielen: gängige, deklarierte Praxis („reverse-engineered, nicht autorisiert") — Beispiel-Kits vor Publish entsprechend kennzeichnen oder ausschließen; keine Rechtsberatung.
- Lizenz: MIT (Vertrauenssignal, OpenCode-Vorbild) oder Apache 2.0 (Patent-Grant) — Owner-Entscheid.

## Übernahme-Backlog (priorisiert)

**P1 — billig, sofort:**
1. Anti-Halluzinations-Regel wörtlich in die Skill-Vorlage: „Prop nicht in components-meta.json → nicht verwenden" (Storybook-Muster).
2. `omitted`-Konzept: fehlende Token-Kategorien/Sektionen im Kit explizit deklarieren mit Begründung, statt still leer (design.md-Muster; erweitert unser „Angenommen, nicht belegt").
3. Rationale neben Token: die Skill nennt bei Token-Rollen das WARUM (DESIGN.md-Muster) — steht teilweise schon drin, als Pflicht in die Vorlage.

**P2 — nächster Ausbauschritt:**
4. Kit-Exporte für Ökosystem-Anschluss: `llms.txt` immer, `registry.json` optional bei React-Kits.
5. Token-Provenienz erweitern: usage-count + Fundstelle + stabile IDs (Wallace-Muster) — macht das Nachschärfen diffbar.
6. Nachschärfen-Befehl formalisieren: Re-Ingest → Diff gegen eingefrorene Tokens → Owner entscheidet (Muster southleft-MCP/`/design-sync`; passt zu unserem bestehenden Nachschärfen-Abschnitt).
7. Zero-Setup-Onboarding für Nicht-Entwickler im Kit-README (ein Befehl, keine Env-Kenntnis) — bestätigter Schmerzpunkt.

**Bewusst NICHT übernommen:**
- `audit`/Coverage als Gate und Claude-Designs Auto-Korrektur-Schleife — kollidiert mit dem No-Gates-Entscheid (Explorations-Werkzeug). Höchstens als freiwilliger Einmal-Check beim Nachschärfen denkbar, Owner-Entscheid.
- Registry-Hosting/HTTP-Endpunkte (v0-Muster) — wir sind bewusst lokal.
- Mono-DESIGN.md statt Kit — skaliert nicht über Komponentenzahl; wir bleiben bei Skill + Meta getrennt, können aber DESIGN.md als Export-Projektion ergänzen, falls der Google-Standard Zugkraft bekommt.

## Quellen (Auswahl)
CHI 2026: https://dl.acm.org/doi/10.1145/3772363.3798616 · extract-design-system: https://github.com/arvindrk/extract-design-system · Google design.md: google-labs-code/design.md · Storybook MCP: https://github.com/storybookjs/mcp · Wallace: https://github.com/projectwallace/css-design-tokens · registry-starter: https://github.com/vercel/registry-starter · shadcn registry: https://ui.shadcn.com/docs/registry · awesome-design-md: https://github.com/VoltAgent/awesome-design-md · southleft/design-systems-mcp · v0: https://vercel.com/blog/ai-powered-prototyping-with-design-systems · Subframe: https://www.subframe.com/design-systems · Lovable Brand Kit: https://docs.lovable.dev/features/design-systems · DS-Audit: designsystems.one · DTCG: https://www.designtokens.org/
