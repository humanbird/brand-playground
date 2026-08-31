---
name: basis
description: Generiert aus Designsystem-Input (Code-Library, Figma, Live-Website, Specs, Screenshots — auch gemischt) ein lauffähiges Prototyping-Kit-Repo nach dem RapidPrototype-Muster. Nutze diese Skill, wenn in diesem Repo eine Design-Basis erzeugt oder nachgeschärft werden soll (/basis, „Basis bauen", „Kit generieren", neuer DS-Input).
---

# /basis — Design-Basis generieren

Aus DS-Input in beliebiger Qualität ein Repo machen, in dem gilt: ein Satz Anforderung rein, laufender Prototyp im Ziel-CD raus. Gründlichkeit lohnt sich nur hier — alles danach erbt davon.

## Grundregeln

- **Nichts erfinden.** Jeder Token-Wert braucht eine Quelle. Deterministische Quellen (CSS, Code, Figma Variables) schlagen LLM-Schätzung. Geschätztes wird in `tokens.json` als solches markiert (`$extensions.provenance`), nie stillschweigend eingefroren.
- **Beste Quelle gewinnt pro Token/Komponente.** Mischinput ist der Normalfall.
- **Eine DS-Skill pro Kit.** Wenn Wissen fehlt, gehört es dort hinein — nicht in eine zweite.
- Latest Majors bei allen Dependencies; DS-Pakete exakt pinnen.

## Ablauf

### 0. Input entgegennehmen
Der Nutzer benennt Quellen im Auftrag (URL, Figma-Link, Repo-Pfad/Paketname, Spec-Datei, Screenshot-Ordner — auch gemischt). Fehlt etwas Entscheidendes (keine Quelle, unklares Zielverzeichnis, Figma-Link ohne MCP-Zugriff), in interaktiven Sessions kurz nachfragen statt raten; nur in Läufen ohne Rückkanal konservative Defaults wählen und sie im Ergebnis benennen.

### 1. Ingest → `<kit>/design/ingest/`
Arbeitsdateien (Roh-CSS, Downloads) gehören ins temporäre Arbeitsverzeichnis; das Ergebnis wandert ins Kit unter `design/ingest/` und wird DORT committet — **nie ins Framework-Repo** (das ist das Produkt, keine Arbeitsfläche, und Kits müssen ohne Framework-Repo funktionieren). Ergebnis immer: `tokens.json` (DTCG, mit Provenance — pro Token zusätzlich `usage` (wie oft der Wert in der Quelle vorkam) und eine stabile `id` (Kurz-Hash aus Rolle+Wert), damit spätere Re-Ingests manuell diffbar sind), `report.md` (Stilreport: Farben+Rollen, Typo-System, Spacing-Logik, Radius/Schatten, Breakpoints, Komponenteninventar mit Werten, Seitenanatomie), `assets.md` (Logos, Fonts, Icon-Stil).

| Input | Weg |
|---|---|
| Code-Library | Paket pinnen, Props/Varianten maschinell extrahieren (vue/react-docgen, component-meta, d.ts) |
| Figma | Live-Pull via Figma-MCP (`get_variable_defs`, `get_design_context`), Skill `figma-use` bei Schreibzugriff |
| Live-Website | per Subagent: Stylesheets laden, konkatenieren, Deklarations-Histogramme + Custom Properties auswerten (`curl` + `grep`/`sort`/`uniq -c` reicht), HTML-Komponenteninventar aus dem gerenderten DOM. Vorher prüfen, ob die Site ein eigenes Token-/Theme-CSS ausliefert — dann ist der Ingest deterministisch wie bei Code |
| Specs/MD | parsen, gegen andere Quellen abgleichen |
| Screenshots | Vision auf Komponenten-Crops (nie Full-Page — Downscaling), Kandidaten niedrig-konfident markieren, per Nachbau-Abgleich schärfen |

Delegiere Ingest-Läufe an einen Subagenten (Agent-Tool, Typ general-purpose; nimm das stärkste verfügbare Modell), und destilliere das Ergebnis zurück. In Headless-Läufen (`claude -p`) vorher `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0` sicherstellen — sonst wird die Session nach 600 s getötet, während Subagenten noch laufen; im Zweifel dort inline statt im Hintergrund arbeiten. Lauf-Pläne in einer temporären Datei außerhalb des Repos führen (vermeidet Kollisionen mit parallelen Sessions).

### 2. Generate → Ziel-Repo
1. Zielverzeichnis mit dem Nutzer klären (Default: `~/dev/<ds>-rapidprototype`), `templates/kit-react/` dorthin kopieren, Platzhalter laut `TEMPLATE.md` ersetzen (inkl. Port, falls abweichend: vite.config.ts, `.claude/launch.json` und CLAUDE.md-Befehlstabelle synchron). Danach `TEMPLATE.md` und den `beispiel/`-Prototyp aus dem Kit löschen — Generator-Doku gehört nicht ins Konsumenten-Repo. Existiert DS-Code in Vue/anderem Framework, Template-Entscheidung dem Nutzer vorlegen.
2. **Tokens einfrieren**: die kuratierte DTCG-`tokens.json` aus dem Ingest nach `design/tokens.json` kopieren (ersetzt das Gerüst) und daraus die `design/tokens.css` schreiben (semantische CSS-Variablen). Ab jetzt wird sie nur noch bewusst editiert, nie regeneriert.
3. **Komponenten**: pro Inventar-Eintrag eine Komponente als `src/components/<Name>.tsx` (flach, eine Datei je Komponente) — nutzt ausschließlich Tokens, deckt die belegten Varianten/Zustände ab. Bei vorhandener Code-Library: original übernehmen statt nachbauen. Alle Komponenten in `src/components/index.ts` exportieren (Wert- und Typ-Exporte); Prototypen importieren nur über diesen Barrel.
4. **Icon-Set als React-Komponenten einfrieren** (`src/icons/index.tsx`): das Set der Quelle (Sprite, Icon-Library, Figma-Komponenten) in das `ICONS`-Objekt übernehmen, `fill="currentColor"` durchsetzen, Originalnamen behalten. Nennt die Quelle nur eine Bibliothek ohne Subset (z.B. „Lucide, 20px"): die 20–30 gängigsten UI-Symbole einfrieren, Rest wächst bei Bedarf. Kein Laufzeit-Paket, kein `<use>` auf eine Sprite-Datei — der Einzeldatei-Export muss offline laufen. Nie ein zweites Set dazumischen.
5. **`design/components-meta.json`** schreiben: alle Komponenten mit Props, Varianten, Slots — inkl. `extends` (durchgereichte HTML-Attribute bzw. „keine Rest-Props") und `className` (wo genau es landet). Objekt-Props nicht nur benennen: Struktur expandieren (`{min, max}`) oder auf die Typquelle im Repo verweisen. Die Datei ist die API-Wahrheit; was hier fehlt, wird beim Bauen geraten.
6. Fonts aus `assets.md` als `@font-face` nach `design/fonts.css` (nur lokale `url()`, damit der Export sie als data-URI einbettet; Lizenz beachten — im Zweifel freier Ersatzfont, im Dateikopf dokumentiert). Logos als SVG nach `src/assets/`.

### 3. Destill → die DS-Skill
`templates/kit-common/SKILL.md.template` füllen — nur mit belegtem Wissen aus Ingest und den tatsächlich gebauten Komponenten. Die Skill darf ausschließlich auf repo-lokale Quellen verweisen (node_modules eingeschlossen) — Pfade außerhalb des Kits sind im Blindtest und auf fremden Rechnern tot. Die Skill erklärt das System (Anatomie, Grid, Token-Regeln, Komponentenwahl, Kompositionen, Haltung), nie einzelne APIs — für APIs verweist sie auf `components-meta.json`. Ebenso `CLAUDE.md.template` → Kit-CLAUDE.md.

Bei kit-vue: alle React-/`.tsx`-Nennungen in beiden Vorlagen gegen die Vue-Entsprechungen aus `templates/kit-vue/TEMPLATE.md` §Abweichungen tauschen (Dateiendungen, router/HomeView-Dateinamen, Icon-Struktur icons.ts/DsIcon.vue/index.ts).

`templates/kit-common/craft.md` unverändert nach `.claude/skills/<ds>/craft.md` kopieren — das DS-unabhängige Handwerk. SKILL.md und CLAUDE.md verweisen darauf; ohne die Kopie zeigen beide Verweise ins Leere.

**Multi-Agent-Support**: Zusätzlich zwei Dateien ins Kit-Root schreiben, damit auch Cursor/Copilot/andere Agenten das Kit nutzen können:
- `AGENTS.md` — identischer Inhalt wie die Kit-CLAUDE.md (eine Wahrheit, zwei Dateinamen; beide bei Änderungen synchron halten). Skill und craft.md dort als normale Datei-Pfade referenzieren („lies .claude/skills/<ds>/SKILL.md") — fremde Agenten kennen kein Skill-Konzept, können aber Dateien lesen.
- `llms.txt` — kurzer Einstiegs-Index: ein Satz was das Kit ist, dann Pfade mit je einer Zeile Zweck (tokens.css, components-meta.json, SKILL.md, craft.md, src/components/, src/prototypes/, Befehle).

### 4. Referenz-Screen (Abschluss der Generator-Arbeit)
Einen repräsentativen Referenz-Screen als `src/prototypes/referenz-<name>/` bauen und im Browser prüfen (typecheck, Konsole, realistische Breite). Was er zeigt, hängt von der Quelle ab:
- Original existiert (Live-Site, Figma-Screens): das Original nachbauen.
- Code-Library: eine typische Anwendungsseite aus den offiziellen Beispielen des Pakets.
- Quellenlose Inputs (Specs/MD, reine Komponenten-Files): ein **Spec-Belegungs-Screen** — jede Regel der Quelle einmal sichtbar angewendet — plus ggf. eine Komponenten-Matrix.

### 5. Abnahme (einziger menschlicher Kontrollpunkt — der Nutzer, nicht ein Agent)
Referenz-Screen(s) neben das Original bzw. die Spec legen, der Nutzer vergleicht. Deltas fließen in tokens.css / Komponenten / Skill / `design/fixes.css`. Danach gilt die Basis als eingefroren.

**Empfohlen vor der Abnahme: ein Blindtest-Prototyp** (ob er läuft, entscheidest du — er gehört nicht automatisch zur /basis-Lieferung). Ein frischer Agent baut allein mit Kit-Wissen (CLAUDE.md, Skill, `components-meta.json`, Quellcode — ohne Ingest-Kontext und ohne Rückfragen) einen mehrschrittigen Prototyp und protokolliert jede Reibung. Was er raten musste, fehlt im Kit: die Befunde fließen als Komponente, Meta-Feld, Skill-Absatz oder Stolperstein zurück. Nichts deckt Lücken so zuverlässig auf wie die erste fremde Nutzung.

## Sonderweg Code-first (DS liegt als gepflegtes Paket vor)

Belegt durch die Onyx-Realprobe — der Ablauf schrumpft, und drei Vertragspunkte ändern die Rolle:
- **Ingest** = Paket exakt pinnen + Meta maschinell extrahieren (component-meta/docgen/d.ts + Alias-Auflösung der Exporte); alles eine Quelle, hohe Confidence, kein Provenance-Abwägen.
- **Komponenten/Icons entfallen**: direkt aus dem Paket importieren — `src/components/` und `src/icons/` existieren nicht. CLAUDE.md/SKILL-Formulierungen („Import über src/components/") auf den Paket-Zweig umschreiben.
- **Export-Auflösung gegen die Typdefinitionen prüfen, nicht gegen die Metadatei des Pakets.** Ein DS kann für eine Komponente einen Import-Pfad behaupten, der nicht stimmt, und der Subpfad sagt nichts über Aktualität (bei Primer liegt die *veraltete* `SelectPanel`-Variante unter `/experimental`, die aktuelle im Hauptpfad). `components-meta.json` führt deshalb zwei Felder: den geprüften `import` und die Behauptung der Quelle. Gleichnamige Komponenten in mehreren Pfaden über `id`+`status` unterscheiden.
- **Bleibt Tailwind drin oder nicht?** Das entscheidet, was das DS für Layout mitbringt. Onyx liefert Grid und Utilities selbst — Tailwind flog raus. Primer 38 kennt weder `Box` noch `sx` und liefert nur Komponenten — Tailwind bleibt, aber ausdrücklich als *Layout*-Werkzeug, mit Breakpoints auf den DS-Stufen und der Regel „Farben/Typo nie aus Tailwind". Die Entscheidung gehört begründet in CLAUDE.md und die Skill.
- **`tokens.css` wird Landkarte statt Wahrheit**: Namensmuster, Rollen, feste Zuordnungen — KEINE Wertkopien (Theme-abhängige Werte wie `light-dark()` wären in einem Modus falsch). „Nie regenerieren" gilt dann nicht — die Wahrheit versioniert das Paket. Bringt das Paket seine Tokens als CSS mit, gehört der `@import` darauf ebenfalls hierher — plus, wenn das Template Tailwind behält, eine **Alias-Brücke**: `--ds-color-ink: var(--fgColor-default)` usw. Damit laufen die nie gepflegten Gerüstdateien weiter, ohne dass ein einziger Wert kopiert wird, und sie ziehen bei einem Theme-Wechsel mit.
- **Theme-Schaltung ist Teil des Setup-Vertrags.** Hängen die Farbvariablen an Attributselektoren (`[data-color-mode]`, `.dark`, `:root[data-theme]`), gehören die Attribute an das `<html>` in `index.html` — nicht nur an einen Provider-Wrapper, sonst bleibt `<body>` ungetönt. Und: viele DS setzen in ihrer Komponenten-CSS Fallback-Werte (`var(--bgColor-default,#fff)`). Fehlt dann der Theme-Import, sieht der Prototyp *fast* richtig aus und nur eigene `var()`-Regeln brechen — der Fehler zeigt sich nicht dort, wo er entsteht. Das Kit muss den Prüfbefehl dafür mitliefern.
- **components-meta.json** darf die Form wechseln: `$`-Kopf (source, regenerate-Anleitung, missing/Alias-Hinweise) + `components[]`; sie ist regenerierbar, grep-bar, wird nie am Stück geladen.
- **Abnahme**: es gibt kein externes Original — der Referenz-Screen belegt Anatomie und Komposition aus den offiziellen Beispielen des Pakets.
- **Layout-Modell erfragen, nicht Breakpoints**: manche DS sind container-basiert statt viewport-basiert — die Skill beschreibt das Modell des DS, nicht das des Templates.

## Nachschärfen
Neuer Input (z.B. später Figma-Zugang) läuft wieder durch Ingest; Konflikte mit eingefrorenen Tokens werden dem Nutzer als Diff vorgelegt, nicht still überschrieben.
