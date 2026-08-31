/*
 * Sammelexport des Icon-Sets.
 *
 *   import { DsIcon, dsIconNames, type DsIconName } from '../../icons'
 *
 * Der Generator fasst nur `icons.ts` an (das ICONS-Objekt). `DsIcon.vue` und
 * diese Datei bleiben, wie sie sind.
 */

export { default as DsIcon } from './DsIcon.vue'
export type { DsIconProps } from './DsIcon.vue'
export { dsIconNames, ICONS, type DsIconName, type IconDef } from './icons'
