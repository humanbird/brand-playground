# Handwerk — gilt in jedem Kit, unabhängig vom Designsystem

Quellen (destilliert, keine wörtliche Übernahme; Lizenzen der Quellen beachten):

- [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) (Anthropic, Apache-2.0)
- [impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0)
- [emil-design-eng](https://github.com/emilkowalski/skills) (MIT)
- [userinterface-wiki](https://github.com/raphaelsalaja/userinterface-wiki) (MIT)

Das CD bestimmt WIE es aussieht; diese Datei bestimmt, WAS gutes UI-Handwerk ist. Wird vom
Generator unverändert mitkopiert.

## Zustände & Bedienbarkeit

- Jede interaktive Komponente hat hover-, focus-, disabled-, loading-, error- und
  empty-Zustand — sichtbarer Keyboard-Focus ist Pflicht.
- Interaktive Ziele mindestens 32px Hit-Area; zu kleine Ziele per Pseudo-Element vergrößern.
- Unter 400ms fühlt sich eine Reaktion „sofort" an — dauert es länger, Skeleton oder
  Optimistic UI zeigen statt nichts.
- Ein Prototyp ohne Leer-, Lade- und Fehlerzustand sieht fertiger aus, als er ist.

## Motion

- UI-Animationen unter 300ms. Hochfrequente Aktionen (Tippen, Tastatur-Navigation,
  Listen-Hovers) bekommen **keine** Animation.
- `ease-out` für alles, was erscheint; nie `ease-in` für UI (wirkt träge).
- Nur `transform` und `opacity` animieren. Nie von `scale(0)` starten — `scale(0.95)` +
  Opacity reicht.
- Pro Seite höchstens **ein** bewusst gestalteter Motion-Moment — nicht überall dieselbe
  Entrance-Animation streuen.
- `prefers-reduced-motion` respektieren: Bewegung entfernen, Opacity-/Farbwechsel behalten.

## Typografie-Mechanik

- Fließtext-Zeilenlänge 65–75 Zeichen.
- Datenspalten und Zahlen-Vergleiche: `font-variant-numeric: tabular-nums`.
- `text-wrap: balance` für Headlines, `text-wrap: pretty` für Absätze.
- Mehr Raum **über** einer Überschrift als darunter — Luft gruppiert.

## Fläche & Tiefe

- Abstände nur aus der Spacing-Skala der Tokens, nie Freihand-Pixel.
- Schatten: Offset + Blur statt gleichmäßigem Halo; eine Lichtrichtung für die ganze Seite;
  nie reines Schwarz.
- Gruppieren durch Weißraum, Typografie und Divider — nicht durch Rahmen um alles.

## Refuse-Liste (Anti-Slop)

Diese Muster sind verbrauchte Defaults. Nur einsetzen, wenn das CD oder der Auftrag sie
ausdrücklich vorsieht:

| Nicht | Stattdessen |
|---|---|
| Grids gleich großer Icon+Titel+Text-Cards als Seitenstruktur | Struktur aus dem Inhalt: Listen, Abschnitte, ungleiche Gewichtung |
| Hero-Metrik-Template (große Zahl + Label + Akzentfarbe) | Zahlen im Kontext zeigen, wo sie eine Aussage tragen |
| Kicker/Eyebrow-Zeile über jeder Überschrift | Überschrift, die für sich steht |
| 01/02/03-Nummerierung ohne echte Reihenfolge | nummerieren nur, wenn Reihenfolge Information ist |
| Gradient-Text | Emphase über Gewicht und Größe |
| Emoji/Unicode-Glyphen als Icons | die Icon-Quelle des Kits |
| Verschachtelte Cards | eine Ebene Karte, innen Fläche und Typo |

## UX-Daumenregeln

- **Hick**: Auswahlmöglichkeiten pro Schritt minimieren.
- **Miller**: in Gruppen von 5–9 chunken.
- **Jakob**: bekannte Muster verwenden — Nutzer verbringen ihre Zeit auf anderen Seiten.
- **Tesler**: unvermeidbare Komplexität übernimmt das System, nicht der Nutzer.
- **Peak-End**: Abschlussmomente (Bestätigung, Erfolg) bewusst gestalten.

## Browser-Details

Das billigste Signal für „gebaut statt zusammengesteckt": Focus-Ring in CD-Farbe,
`::selection` abgestimmt, `underline-offset` gesetzt, Scrollbar nicht vergessen,
Formular-Caret-Farbe passend.
