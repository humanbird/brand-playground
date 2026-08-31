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
 */

export { DsButton, type DsButtonProps, type DsButtonSize, type DsButtonVariant } from './DsButton'
