# Template `kit-vue` — was der Generator füllt

Der generische Kern eines Prototyping-Kits in Vue: Vite + Vue 3 + TypeScript + Tailwind v4,
ein einziges pnpm-Paket. Solo lauffähig — mit neutralen Platzhalter-Tokens und einem
Beispiel-Prototyp, damit sich Konvention und Aufbau ohne Designsystem prüfen lassen.

Dies ist die **1:1-Übertragung von `kit-react`**, keine zweite Design-Entscheidung: gleiche
Ordner, gleiche Konvention, gleiche Dateinamen, gleiche Kommentare. Wo Vue etwas anders
erzwingt, steht es unten unter „Abweichungen zu kit-react". Alles andere ist absichtlich
identisch — wer eines der beiden Templates ändert, prüft das andere mit.

`/basis` kopiert diesen Ordner und füllt die unten markierten Stellen. Alles, was hier
nicht genannt ist, wird unverändert übernommen.

## Wann dieses Template statt kit-react

Wenn das Ziel-Designsystem als **Vue-Code-Library** vorliegt (Onyx/`sit-onyx`, Vuetify,
PrimeVue …). Dann wird die Library gepinnt und **direkt benutzt**, nicht nachgebaut —
`src/components/index.ts` re-exportiert sie, Prototypen merken den Unterschied nicht.
Liegt kein DS-Code vor, gilt weiter `kit-react` als Default.

## Was ersetzt wird

| Stelle | Was hinein muss |
|---|---|
| `package.json` → `name`, `.claude/launch.json` → `name` | Platzhalter `{{KIT_NAME}}` durch den Kit-Namen ersetzen (npm-tauglich: klein, keine Leerzeichen). Der Platzhalter ist die **einzige** Textersetzung im Template — er steht an genau diesen zwei Stellen. |
| Port (nur bei Abweichung vom Default 5300) | In `vite.config.ts`, `.claude/launch.json` und der Befehlstabelle der Kit-CLAUDE.md **synchron** ändern — sonst laufen Doku und Server auseinander. |
| `AGENTS.md` (neu anlegen) | Identischer Inhalt wie die Kit-CLAUDE.md — Cursor/Copilot/andere Agenten lesen diese Datei; bei Änderungen beide synchron halten. |
| `llms.txt` (neu anlegen) | Einstiegs-Index für beliebige Tools: ein Satz Zweck + Pfade (tokens.css, components-meta.json, Skill, Komponenten, Befehle) mit je einer Zeile. |
| Diese Datei (`TEMPLATE.md`) | Nach dem Füllen aus dem Kit **löschen** — Generator-Doku gehört nicht ins Konsumenten-Repo. |
| `design/tokens.css` | Die eingefrorenen Tokens des Ziel-Designsystems. Datei wird komplett ersetzt. Werden Token-**Namen** geändert, muss der `@theme`-Block in `src/styles.css` mitziehen. Bringt das DS eigene CSS-Variablen mit (siehe „DS mit eigenem CSS" unten), enthält diese Datei nur noch die Zuordnung darauf. |
| `design/tokens.json` | DTCG-Quelle aus dem Ingest, jedes Token mit `$extensions.provenance`. Datei wird komplett ersetzt; das Gerüst zeigt die erwartete Form. |
| `design/components-meta.json` | Das Komponenteninventar des Ziel-DS (Props, **Events**, Varianten, Slots, Beschreibung) — **plus `extends` je Komponente**: welche Fallthrough-Attribute durchgereicht werden und wo `class` landet (bei `inheritAttrs: false`: an welches innere Element, sonst `"— keine Fallthrough-Attribute"`). Ohne dieses Feld rät jeder Prototyp-Agent bei jedem Feld neu. Das Array wird komplett ersetzt — der `DsButton`-Eintrag ist nur das Formbeispiel. |
| `src/components/` | Die Komponenten des Ziel-DS (übernommen oder generiert), flach als `src/components/<Name>.vue`. `DsButton.vue` fliegt raus, sobald es einen echten Button gibt. Bei einer fertigen Library: Ordner leer, nur der Barrel bleibt. |
| `src/components/index.ts` | Der Barrel — je Komponente Wert- und Typ-Export. Prototypen importieren ausschließlich darüber (`from '../../components'`). |
| `src/icons/icons.ts` | Das Icon-Set des Ziel-DS, eingefroren als SVG-Markup (`ICONS`-Objekt austauschen). `DsIcon.vue` und `src/icons/index.ts` bleiben. Die zwei Symbole im Template sind nur das Formbeispiel. Konvention: `fill="currentColor"`, Größe über Utilities, nie ein zweites Set dazumischen. |
| `design/fonts.css` | Die `@font-face`-Blöcke des Ziel-DS. Im Template leer (System-Font-Stack). Nur lokale `url()` — der Einzeldatei-Export bettet sie als data-URI ein; Lizenzlage und ggf. der Ersatzfont werden im Kopf der Datei dokumentiert. |
| `src/styles.css` → `@theme`-Block plus ggf. Breakpoints, Resets und `@layer components` | Der `@theme`-Block spiegelt die Token-Namen; die `*: initial`-Guards bleiben in jedem Namespace stehen und nur die Listen darunter werden ersetzt. Die generischen Farb-Aliasse (`canvas`, `surface`, `line`, `ink`, `ink-muted`, `accent`, `accent-hover`, `on-accent`, `success`, `danger`) bleiben erhalten — die nicht gepflegten Gerüstdateien (`HomeView`, `NotFound`) benutzen sie. |
| `CLAUDE.md` | Nicht im Template. Der Generator legt sie an: Zweck, Loop, Befehle, Arbeitsweise, „Fertig heißt". |
| `.claude/skills/<ds>/SKILL.md` | Nicht im Template. Der Generator legt genau **eine** Skill pro Designsystem an. |
| `src/prototypes/beispiel/` | Löschen, sobald der erste echte Prototyp steht. Bis dahin ist er die lebende Doku der Konvention. |
| `index.html` → `<title>` | Optional auf den Projektnamen setzen. |

## Was der Generator NICHT anfassen darf

- `src/router.ts`, `src/prototypes.ts` — Auto-Routing. Keine Registry, kein Eintrag.
- `src/HomeView.vue`, `src/NotFound.vue`, `src/App.vue` — Gerüst. Wird nie gepflegt.
- `src/icons/DsIcon.vue`, `src/icons/index.ts` — nur `icons.ts` wird gefüllt.
- `src/main.ts` — die Stylesheet-Reihenfolge ist bedeutsam und steht fest:
  `design/fonts.css` → `design/tokens.css` → `src/styles.css` → `design/fixes.css`.
  Fonts vor Tokens, Fixes zuletzt (sie sollen gewinnen). Der Generator füllt die
  vier Dateien, er ändert die Imports nicht. **Ausnahme:** bringt das DS ein eigenes
  Basis-Stylesheet mit, kommt dessen Import ganz an den Anfang (siehe unten) —
  die Reihenfolge der vier bleibt.
- `vite.config.ts`, `tsconfig.json` — außer bei begründeten Stack-Abweichungen.
- `design/fixes.css` — bleibt leer, bis eine konkrete Falle dokumentiert wird.

## Konvention (gilt im generierten Kit)

```
src/prototypes/<slug>/index.vue     →  /p/<slug>
src/prototypes/<slug>/<Name>.vue    →  /p/<slug>/<name>      (klein geschrieben)
src/prototypes/<slug>/_shared/…     →  keine Route (Shell, Mockdaten, Helfer)
src/prototypes/idea-<slug>/…        →  auf der Übersicht als „Ideen" gruppiert
```

Ordner anlegen heißt: Route existiert. Kein Config-File, keine Registrierung.

## Befehle

| Befehl | Wirkung |
|---|---|
| `pnpm install` | einmalig |
| `pnpm dev` | Dev-Server auf festem Port **5300** (`strictPort`) |
| `pnpm typecheck` | `vue-tsc --noEmit` (nicht `tsc` — sonst bleiben alle `.vue` ungeprüft) |
| `pnpm export` | statischer **Einzeldatei**-Export nach `export/index.html` — per Doppelklick im Browser lauffähig, deshalb Hash-History und `base: './'` |

Läuft im selben Netz schon ein anderes Kit auf 5300, bekommt das neue Kit einen eigenen
Port — in `vite.config.ts` **und** `.claude/launch.json`, sonst sieht der Agent den
falschen Server.

`.claude/launch.json` beschreibt denselben Dev-Server für die Browser-Vorschau des Agenten.
Ohne die Datei kann er den Prototyp nicht selbst ansehen.

## Abweichungen zu kit-react

Nur diese — alles andere ist deckungsgleich.

| Thema | kit-react | kit-vue | Warum |
|---|---|---|---|
| Screens | `.tsx`, Default-Export | `.vue` SFC, Default-Export | Glob-Muster entsprechend `./prototypes/*/*.vue`; Tiefe und `_shared`-Ausschluss identisch |
| Scroll-Reset | `<ScrollReset>`-Komponente im Router | `scrollBehavior: () => ({ top: 0 })` in `createRouter` | Vue-Router hat die Stelle eingebaut; eine Komponente dafür wäre Nachbau |
| Router-Datei | `src/router.tsx` mit JSX-Routen | `src/router.ts` + `src/App.vue` (`<RouterView />`) + `src/NotFound.vue` | Vue trennt Router-Instanz und Wurzelkomponente; NotFound ist eine Catch-all-Route `/:pathMatch(.*)*` |
| Typen aus Komponenten | direkt aus der `.tsx` | zusätzlicher `<script lang="ts">`-Block neben `<script setup>` | aus `<script setup>` heraus lässt sich nichts exportieren; der Barrel braucht die Typen aber |
| Icons | eine Datei `src/icons/index.tsx`, JSX-Body | drei Dateien: `icons.ts` (Markup-Strings), `DsIcon.vue` (`v-html`), `index.ts` (Barrel) | SFCs können kein JSX-Fragment als Datenfeld halten; `v-html` ist unbedenklich, weil der Inhalt ausschließlich aus `icons.ts` stammt |
| Props durchreichen | expliziter `...rest`-Spread | Vue-Fallthrough (`$attrs`), `class` wird automatisch gemerged | deshalb heißt das Meta-Feld `extends` hier „Fallthrough-Attribute"; `inheritAttrs: false` muss dort dokumentiert werden |
| Events | `onClick`-Props | native Listener via Fallthrough, eigene per `defineEmits` | `components-meta.json` hat deshalb ein zusätzliches `events`-Array |
| typecheck | `tsc --noEmit` | `vue-tsc --noEmit` | `tsc` sieht in `.vue` nichts |
| TypeScript | `^7.0.2` | `^6.0.3` | **Stolperstein, siehe unten** — `vue-tsc` 3.3.11 läuft nicht auf TS 7 |
| Mount-Ziel | `#root` | `#app` | Vue-Konvention; nur `index.html` und `main.ts` betroffen |

## DS mit eigenem CSS: wo der Tailwind-Layer entfällt

Das Template fährt Tailwind, weil es ohne Designsystem lauffähig sein muss. Bringt das
Ziel-DS **eigene Styles mit** (eigenes Basis-Stylesheet, eigene CSS-Variablen, eigenes
Grid — z.B. `sit-onyx`), ist Tailwind Ballast und ein zweites, konkurrierendes
Layoutsystem. Dann gilt:

1. `@tailwindcss/vite` und `tailwindcss` aus `package.json` und `vite.config.ts` entfernen.
2. `src/styles.css` behalten, aber ohne `@import "tailwindcss"` und ohne `@theme`: darin
   bleiben nur der Base-Layer (html/body/focus) und — falls nötig — die Layoutsprache des
   DS als normale Klassen.
3. Das Basis-Stylesheet des DS in `src/main.ts` **vor** den vier Kit-Stylesheets
   importieren, damit `design/fixes.css` weiterhin zuletzt gewinnt.
4. `design/tokens.css` dupliziert die DS-Variablen **nicht**. Sie dokumentiert die
   semantischen Gruppen und verweist auf die Paketquelle; die Wahrheit bleibt im Paket,
   sonst driftet das Kit beim nächsten Versionssprung stillschweigend auseinander.
5. Die Gerüstdateien (`HomeView.vue`, `NotFound.vue`) benutzen Tailwind-Utilities. Ohne
   Tailwind müssen ihre Klassen einmalig gegen DS-Klassen bzw. ein paar lokale Regeln in
   `src/styles.css` getauscht werden — das ist der einzige Handgriff am Gerüst, den ein
   DS-Wechsel erzwingt.

Beides ist vom Template aus erreichbar: die Tailwind-Kopplung sitzt vollständig in
`vite.config.ts`, `src/styles.css` und den Klassen der Gerüstdateien — nirgends sonst.

## Stolpersteine

- **`vue-tsc` und TypeScript 7 vertragen sich (noch) nicht.** `vue-tsc` ruft intern
  `typescript/lib/tsc` auf; TS 7 exportiert diesen Pfad nicht mehr, `pnpm typecheck`
  bricht mit `ERR_PACKAGE_PATH_NOT_EXPORTED` ab — obwohl `peerDependencies` `>=5.0.0`
  behauptet. Deshalb steht TypeScript hier auf `^6.0.3`. Beim Hochziehen: erst
  `pnpm typecheck` laufen lassen, nicht nur `pnpm install`.
- **`tsc` statt `vue-tsc` prüft nichts.** Ein grünes `tsc --noEmit` ist in einem Vue-Kit
  wertlos — `.vue` bleibt ungeprüft. Das Skript heißt deshalb bewusst `vue-tsc`.
- **Spacing-Namen kollidieren.** In Tailwind v4 beschattet der `--spacing-*`-Namespace
  die container-Skala: `--spacing-2xl: 3rem` macht aus `max-w-2xl` stillschweigend 3rem
  statt 42rem. Deshalb mappt `src/styles.css` nur `--spacing` (die Grundeinheit); die
  numerische Skala `p-4`, `gap-6` … leitet sich daraus ab und ist damit token-gebunden.
  Hat das Ziel-DS eine nicht-lineare Spacing-Skala, gehören deren Stufen unter einen
  kollisionsfreien Präfix (z.B. `--spacing-ds-200`).
- **Schriftgrößen** heißen wie in Tailwind (`--text-xs/sm/base/lg/xl/2xl`), damit es
  keine zwei Namen für dieselbe Stufe gibt.
- **Tailwind-Default-Paletten driften stillschweigend ein.** `src/styles.css` löscht
  sie deshalb pro Namespace mit `--color-*: initial`, `--radius-*: initial`,
  `--shadow-*: initial`, `--text-*: initial`, `--breakpoint-*: initial`. Ohne diese
  Zeilen erzeugt Tailwind `bg-gray-100`, `rounded-3xl` oder `2xl:` klaglos weiter — der
  Screen sieht plausibel aus und hat trotzdem Fremdfarben im Build. Die Guards bleiben
  stehen; ersetzt werden nur die Listen darunter.
- **Fast Refresh in SFCs.** Eine `.vue` unter `_shared/` exportiert nur die Komponente.
  Konstanten, Mockdaten und Helfer gehören in eine eigene `.ts` daneben — sonst lädt die
  Seite bei jeder Änderung komplett neu und ein Prototyp-Store ist wieder leer.
- **Keine externen Ressourcen.** Der Einzeldatei-Export muss offline funktionieren:
  keine Google Fonts per `<link>`, keine CDN-Skripte, Bilder als Data-URI oder in
  `public/` (dann ist der Export aber nicht mehr eine Datei).
- **Frisch veröffentlichte Pakete brechen `pnpm install`.** pnpm 11 lehnt per
  `minimumReleaseAge` (Default 24 h) Versionen ab, die zu jung sind, und legt sonst
  ungefragt eine `pnpm-workspace.yaml` mit einer Ausnahmeliste an. Wer Abhängigkeiten
  hochzieht: eine Version wählen, die älter als einen Tag ist — keine Ausnahmeliste
  committen.

## Verifiziert am 2026-08-29

- `pnpm install` (mit `name: {{KIT_NAME}}`), `pnpm typecheck` (exit 0), `pnpm export`
  (exit 0) — Node 26.8.1 / pnpm 11.24.0, aufgelöst: Vue 3.5.42, vue-router 5.3.0,
  vue-tsc 3.3.11, TypeScript 6.0.3, Vite 8.2.2
- `export/index.html` ist self-contained: eine Datei (109 kB), keine externen
  `src`/`href`, kein `url()`/`@import` in CSS
- In Chrome per `file://` geöffnet: Übersicht rendert, Klickstrecke
  Übersicht → `beispiel` → Detail (`?id=A-2481`) läuft, Tokens greifen (Button-Blau,
  Radius), Leerzustand bei fehlender `id` erscheint, **keine Konsolenmeldungen**
- `_shared/Shell.vue` wird trotz Default-Export nicht geroutet (Prototyp meldet
  „2 Screens", nicht 3)
- Neuer Ordner `idea-probe/` erschien ohne Config-Änderung in der Gruppe „Ideen“;
  danach wieder entfernt
