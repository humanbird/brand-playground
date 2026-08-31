/*
 * src/icons/icons.ts — das eingefrorene Icon-Set des Designsystems.
 *
 * GENERATOR-DATEI: `/basis` ersetzt `ICONS` durch das echte Set des Ziel-DS
 * (aus dem SVG-Sprite, der Icon-Library oder den Figma-Komponenten), eingefroren
 * als Pfad-Markup. Kein externer Request, kein `<use>` auf eine Sprite-Datei,
 * kein Icon-npm-Paket zur Laufzeit — der Einzeldatei-Export muss offline laufen.
 * Die beiden Symbole unten sind nur das Formbeispiel.
 *
 * Vue-Eigenheit: die Symbole liegen als SVG-Markup-String vor (in React wären
 * es JSX-Fragmente). `DsIcon.vue` setzt sie per `v-html` in das <svg>. Das ist
 * unbedenklich, solange der Inhalt aus DIESER Datei kommt — nie einen Namen aus
 * Nutzereingaben in `ICONS` hineinreichen.
 *
 * Konventionen, die für JEDES Set gelten:
 *  - Pfade tragen `fill="currentColor"` — die Farbe kommt IMMER aus dem
 *    Textkontext (`text-ink`, `text-accent`). Nie eine `fill`-Prop, nie ein
 *    Hex im Pfad: sonst ist das Icon das einzige Element im Prototyp, das
 *    nicht auf Tokens hört.
 *  - Größe über Utilities (`h-5 w-5`), nicht über width/height-Attribute.
 *  - EIN Set, ein Stil. Nie ein zweites (Lucide, Feather, Material)
 *    dazumischen — der Bruch fällt sofort auf. Fehlt ein Symbol, wird es im
 *    Stil des Sets ergänzt.
 *  - Die Namen sind die des Originals, damit Ingest-Report und Kit dieselbe
 *    Sprache sprechen.
 */

export type IconDef = { viewBox: string; body: string }

export const ICONS = {
  'Arrow-Right': {
    viewBox: '0 0 20 20',
    body: '<path d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L15.586 11H2a1 1 0 1 1 0-2h13.586l-4.293-4.293a1 1 0 0 1 0-1.414Z" fill="currentColor" fill-rule="nonzero"/>',
  },
  Close: {
    viewBox: '0 0 20 20',
    body: '<path d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z" fill="currentColor" fill-rule="nonzero"/>',
  },
} satisfies Record<string, IconDef>

/** Alle Symbolnamen des Sets. */
export type DsIconName = keyof typeof ICONS

/** Namensliste zur Laufzeit (für Icon-Übersichten, Picker, Tests). */
export const dsIconNames = Object.keys(ICONS) as DsIconName[]
