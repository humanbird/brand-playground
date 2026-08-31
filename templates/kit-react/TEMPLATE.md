# Template `kit-react` — was der Generator füllt

Der generische Kern eines Prototyping-Kits: Vite + React + TypeScript + Tailwind v4,
ein einziges pnpm-Paket. Solo lauffähig — mit neutralen Platzhalter-Tokens und einem
Beispiel-Prototyp, damit sich Konvention und Aufbau ohne Designsystem prüfen lassen.

`/basis` kopiert diesen Ordner und füllt die unten markierten Stellen. Alles, was hier
nicht genannt ist, wird unverändert übernommen.

## Was ersetzt wird

| Stelle | Was hinein muss |
|---|---|
| `package.json` → `name`, `.claude/launch.json` → `name` | Platzhalter `{{KIT_NAME}}` durch den Kit-Namen ersetzen (npm-tauglich: klein, keine Leerzeichen). Der Platzhalter ist die **einzige** Textersetzung im Template — er steht an genau diesen zwei Stellen. |
| Port (nur bei Abweichung vom Default 5300) | In `vite.config.ts`, `.claude/launch.json` und der Befehlstabelle der Kit-CLAUDE.md **synchron** ändern — sonst laufen Doku und Server auseinander. |
| `AGENTS.md` (neu anlegen) | Identischer Inhalt wie die Kit-CLAUDE.md — Cursor/Copilot/andere Agenten lesen diese Datei; bei Änderungen beide synchron halten. |
| `llms.txt` (neu anlegen) | Einstiegs-Index für beliebige Tools: ein Satz Zweck + Pfade (tokens.css, components-meta.json, Skill, Komponenten, Befehle) mit je einer Zeile. |
| Diese Datei (`TEMPLATE.md`) | Nach dem Füllen aus dem Kit **löschen** — Generator-Doku gehört nicht ins Konsumenten-Repo. |
| `design/tokens.css` | Die eingefrorenen Tokens des Ziel-Designsystems. Datei wird komplett ersetzt. Werden Token-**Namen** geändert, muss der `@theme`-Block in `src/styles.css` mitziehen. |
| `design/tokens.json` | DTCG-Quelle aus dem Ingest, jedes Token mit `$extensions.provenance`. Datei wird komplett ersetzt; das Gerüst zeigt die erwartete Form. |
| `design/components-meta.json` | Das Komponenteninventar des Ziel-DS (Props, Varianten, Slots, Beschreibung) — **plus `extends` je Komponente**: welche HTML-Attribute durchgereicht werden und wo `className` landet (z.B. `"InputHTMLAttributes<HTMLInputElement> ohne placeholder und className — Rest an das <input>, className an den Feldrahmen"`, oder `"— keine Rest-Props"`). Ohne dieses Feld rät jeder Prototyp-Agent bei jedem Feld neu. Das Array wird komplett ersetzt — der `DsButton`-Eintrag ist nur das Formbeispiel. |
| `src/components/` | Die Komponenten des Ziel-DS (übernommen oder generiert), flach als `src/components/<Name>.tsx`. `DsButton.tsx` fliegt raus, sobald es einen echten Button gibt. |
| `src/components/index.ts` | Der Barrel — jede Komponente mit Wert- und Typ-Exporten. Prototypen importieren ausschließlich darüber (`from '../../components'`). |
| `src/icons/index.tsx` | Das Icon-Set des Ziel-DS, eingefroren als React-Komponenten (`ICONS`-Objekt austauschen, `DsIcon` bleibt). Die zwei Symbole im Template sind nur das Formbeispiel. Konvention: `fill="currentColor"`, Größe über Utilities, nie ein zweites Set dazumischen. |
| `design/fonts.css` | Die `@font-face`-Blöcke des Ziel-DS. Im Template leer (System-Font-Stack). Nur lokale `url()` — der Einzeldatei-Export bettet sie als data-URI ein; Lizenzlage und ggf. der Ersatzfont werden im Kopf der Datei dokumentiert. |
| `src/styles.css` → `@theme`-Block plus ggf. Breakpoints, Resets und `@layer components` für die Layoutsprache des DS | Der `@theme`-Block spiegelt die Token-Namen; die `*: initial`-Guards bleiben in jedem Namespace stehen und nur die Listen darunter werden ersetzt. Hat das DS eine eigene Layoutsprache (Container, Vertikalrhythmus, Full-Bleed), kommt sie als `@layer components` dazu. Die generischen Farb-Aliasse (`canvas`, `surface`, `line`, `ink`, `ink-muted`, `accent`, `accent-hover`, `on-accent`, `success`, `danger`) bleiben erhalten — die nicht gepflegten Gerüstdateien (`HomeView`, `router`) benutzen sie. |
| `CLAUDE.md` | Nicht im Template. Der Generator legt sie an: Zweck, Loop, Befehle, Arbeitsweise, „Fertig heißt". |
| `.claude/skills/<ds>/SKILL.md` | Nicht im Template. Der Generator legt genau **eine** Skill pro Designsystem an. |
| `src/prototypes/beispiel/` | Löschen, sobald der erste echte Prototyp steht. Bis dahin ist er die lebende Doku der Konvention. |
| `index.html` → `<title>` | Optional auf den Projektnamen setzen. |

## Was der Generator NICHT anfassen darf

- `src/router.tsx`, `src/prototypes.ts` — Auto-Routing. Keine Registry, kein Eintrag.
- `src/HomeView.tsx` — liest, was da ist. Wird nie gepflegt.
- `src/main.tsx` — die Stylesheet-Reihenfolge ist bedeutsam und steht fest:
  `design/fonts.css` → `design/tokens.css` → `src/styles.css` → `design/fixes.css`.
  Fonts vor Tokens, Fixes zuletzt (sie sollen gewinnen). Der Generator füllt die
  vier Dateien, er ändert die Imports nicht.
- `vite.config.ts`, `tsconfig.json` — außer bei begründeten Stack-Abweichungen.
- `design/fixes.css` — bleibt leer, bis eine konkrete Falle dokumentiert wird.

## Konvention (gilt im generierten Kit)

```
src/prototypes/<slug>/index.tsx     →  /p/<slug>
src/prototypes/<slug>/<Name>.tsx    →  /p/<slug>/<name>      (klein geschrieben)
src/prototypes/<slug>/_shared/…     →  keine Route (Shell, Mockdaten, Helfer)
src/prototypes/idea-<slug>/…        →  auf der Übersicht als „Ideen" gruppiert
```

Ordner anlegen heißt: Route existiert. Kein Config-File, keine Registrierung.

## Befehle

| Befehl | Wirkung |
|---|---|
| `pnpm install` | einmalig |
| `pnpm dev` | Dev-Server auf festem Port **5300** (`strictPort`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm export` | statischer **Einzeldatei**-Export nach `export/index.html` — per Doppelklick im Browser lauffähig, deshalb HashRouter und `base: './'` |

`.claude/launch.json` beschreibt denselben Dev-Server für die Browser-Vorschau des Agenten
(`pnpm dev`, Port 5300). Ohne die Datei kann er den Prototyp nicht selbst ansehen.

## Stolpersteine

- **kit-vue pinnt TypeScript `^6`, weil `vue-tsc` TS 7 nicht unterstützt — kein Versehen.**
- **Spacing-Namen kollidieren.** In Tailwind v4 beschattet der `--spacing-*`-Namespace
  die container-Skala: `--spacing-2xl: 3rem` macht aus `max-w-2xl` stillschweigend 3rem
  statt 42rem. Deshalb mappt `src/styles.css` nur `--spacing` (die Grundeinheit); die
  numerische Skala `p-4`, `gap-6` … leitet sich daraus ab und ist damit token-gebunden.
  Hat das Ziel-DS eine nicht-lineare Spacing-Skala, gehören deren Stufen unter einen
  kollisionsfreien Präfix (z.B. `--spacing-ds-200`).
- **Schriftgrößen** heißen wie in Tailwind (`--text-xs/sm/base/lg/xl/2xl`), damit es
  keine zwei Namen für dieselbe Stufe gibt. Führt das Ziel-DS eigene Stufennamen
  (`xs · s · m · l · xl · xxl · xxxl` statt `sm/base/lg/2xl`), darf der Generator sie
  übernehmen — dann aber KONSEQUENT, inklusive der Gerüstdateien (`HomeView.tsx`,
  `router.tsx` benutzen `text-base`, `text-2xl`, `font-bold`, `rounded-lg`, `shadow-sm`,
  `sm:`, `lg:`, `max-w-2xl`, `max-w-5xl`). Zwei Namenssysteme nebeneinander sind schlimmer
  als ein fremdes: der Prototyp-Agent rät dann bei jeder Klasse.
- **Die `--spacing`-Grundeinheit skaliert AUCH `w-*` und `h-*`.** Setzt der Generator sie
  auf die Einheit des Ziel-DS (z.B. `0.3125rem` für eine 5px-Skala), sind `h-6` plötzlich
  30px statt 24 und `w-52` 260px statt 208. Das trifft jede Icon- und Bedienelement-Größe
  und fällt nur auf, wenn man misst — der Screen sieht „fast richtig" aus. Die gemessenen
  Maße des DS (Icon 24px, Bedienhöhe 44px …) liegen fast nie auf der Spacing-Skala, weil
  DS sie in `em` relativ zur Schrift rechnen. Lösung: eigene `@utility`-Regeln am Ende von
  `src/styles.css` mit sprechenden Namen, die der Skill dann als Vokabular dienen:

      @utility icon-m   { width: 1.5rem; height: 1.5rem; }   /* 24px */
      @utility control-m { height: 2.75rem; width: 2.75rem; } /* 44px */

  Das ist besser, als arbitrary values (`h-[1.5rem]`) über das ganze Kit zu streuen —
  und es hält die Prüfung „kein px-Wert im Diff" ehrlich.
- **Tailwind-Default-Paletten driften stillschweigend ein.** `src/styles.css` löscht
  sie deshalb pro Namespace mit `--color-*: initial`, `--radius-*: initial`,
  `--shadow-*: initial`, `--text-*: initial`, `--breakpoint-*: initial`. Ohne diese
  Zeilen erzeugt Tailwind `bg-gray-100`, `rounded-3xl` oder `2xl:` klaglos weiter — der
  Screen sieht plausibel aus und hat trotzdem Fremdfarben im Build. Die Guards bleiben
  stehen; ersetzt werden nur die Listen darunter.
- **`-*/` in einem CSS-Kommentar beendet ihn vorzeitig.** Wer in `src/styles.css` oder
  `design/tokens.css` Token-Namensmuster im Fließtext erwähnt (`--fgColor-*/--bgColor-*`),
  schließt damit versehentlich den Kommentarblock: Tailwind bricht danach mit einem
  `CssSyntaxError` ab, dessen Meldung den deutschen Kommentartext zitiert und nicht im
  Entferntesten auf die Ursache zeigt. In Kommentaren die Muster durch Komma trennen
  (`--fgColor-*, --bgColor-*`) oder in Backticks setzen. Betrifft jedes DS, dessen
  Token-Namen auf `*` enden können — also jedes.
- **Breakpoints in `@theme` MÜSSEN Literale sein.** `--breakpoint-md: var(--ds-breakpoint-md)`
  wird zu einer `@media`-Bedingung mit einer CSS-Variablen — die ist ungültig, Tailwind
  erzeugt die Variante gar nicht erst, und `md:` fällt aus, ohne dass irgendwo ein Fehler
  auftaucht. Der Screen sieht dann bei jeder Breite gleich aus, und man sucht den Fehler im
  Layout statt in der Theme-Datei. Nur Media Queries sind davon betroffen — Farben, Radien,
  Schriftgrößen und Schatten dürfen weiterhin auf `var()` zeigen. Die Werte gehören trotzdem
  in `design/tokens.css` (Dokumentation und Herkunft) und werden in `src/styles.css`
  ausgeschrieben wiederholt; der Generator vermerkt das dort als Kommentar.
  **Prüfbar:** eine Seite bei zwei Breiten laden und ein Element messen, das an einer
  Breakpoint-Variante hängt.
- **Tailwind erkennt nur vollständig geschriebene Klassennamen.** `` `text-${stufe}` ``,
  `` `shadow-level${n}` `` oder `` `rounded-${r}` `` erzeugen nichts. Das trifft vor allem
  Komponenten-Matrizen und Referenz-Screens, die über Varianten iterieren — dort die
  fertigen Klassen in einer Tabelle ausschreiben und nur die Tabelle durchlaufen.
- **Keine externen Ressourcen.** Der Einzeldatei-Export muss offline funktionieren:
  keine Google Fonts per `<link>`, keine CDN-Skripte, Bilder als Data-URI oder in
  `public/` (dann ist der Export aber nicht mehr eine Datei).
- **Frisch veröffentlichte Pakete brechen `pnpm install`.** pnpm 11 lehnt per
  `minimumReleaseAge` (Default 24 h) Versionen ab, die zu jung sind, und legt sonst
  ungefragt eine `pnpm-workspace.yaml` mit einer Ausnahmeliste an. Deshalb werden im
  Template nur ausgereifte Versionen gelockt (`react-router` steht bewusst auf 8.3.0
  statt 8.3.1). Wer Abhängigkeiten hochzieht: eine Version wählen, die älter als einen
  Tag ist — keine Ausnahmeliste committen.

## Verifiziert am 2026-08-29

- Clean-Room: Kopie ohne `node_modules`, dann `pnpm install` (mit `name: {{KIT_NAME}}`),
  `pnpm typecheck` (exit 0), `pnpm export` (exit 0) — Node 26.8.1 / pnpm 11.24.0
- `export/index.html` ist self-contained: eine Datei, ein inline `<script>`, ein inline
  `<style>`, keine externen `src`/`href`, kein `url()`/`@import` in CSS
- In Chrome per `file://` geöffnet: Übersicht und Deep-Link
  `…/export/index.html#/p/beispiel/detail?id=A-2477` rendern, Tokens greifen
  (Button `rgb(47,111,237)`, Radius 8px), keine Konsolenmeldungen
- `_shared/Shell.tsx` wird trotz Default-Export nicht geroutet
- Neuer Ordner `idea-*` erscheint ohne Config-Änderung in der Gruppe „Ideen"
