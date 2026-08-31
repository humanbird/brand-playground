/*
 * Sammelexport aller Komponenten des Designsystems.
 *
 *   import { DsButton } from '../../components'
 *
 * Ein Import pro Screen statt einer Zeile pro Komponente. Prototypen
 * importieren IMMER über diesen Barrel, nie über den Dateipfad — so bleibt
 * der Screen-Code auch dann gültig, wenn eine Komponente umzieht.
 *
 * GENERATOR-DATEI: `/basis` schreibt hier alle Komponenten des Ziel-DS hin,
 * je Komponente Wert- und Typ-Exporte (die Typen brauchen Prototypen für
 * eigene Props). Die maschinenlesbare API-Wahrheit steht in
 * design/components-meta.json — Props und Varianten dort nachschlagen, nicht
 * aus dem Gedächtnis schreiben.
 *
 * Vue-Eigenheit: eine SFC hat immer genau einen Default-Export. Der Barrel
 * benennt ihn um (`export { default as X }`); Typen kommen aus dem normalen
 * <script lang="ts">-Block derselben Datei und werden separat re-exportiert.
 *
 * Nutzt das Kit eine fertige Komponentenbibliothek (z.B. sit-onyx), zeigt
 * dieser Barrel auf das Paket statt auf eigene Dateien — Prototypen merken
 * den Unterschied nicht.
 */

export { default as DsButton } from './DsButton.vue'
export type { DsButtonProps, DsButtonSize, DsButtonVariant } from './DsButton.vue'
