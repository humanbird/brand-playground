/*
 * Barrel export for all design-system components.
 *
 *   import { DsButton } from '../../components'
 *
 * One import per screen instead of one line per component. Prototypes ALWAYS
 * import from this barrel, never from a file path, so screen code remains valid
 * even when a component moves.
 *
 * GENERATOR FILE: `/basis` writes all target design-system components here,
 * with value and type exports for each component (prototypes need the types for
 * their own props). The machine-readable API source of truth is
 * design/components-meta.json. Look up props and variants there instead of
 * relying on memory.
 *
 * Vue detail: an SFC always has exactly one default export. The barrel renames
 * it (`export { default as X }`); types come from the regular
 * <script lang="ts"> block in the same file and are re-exported separately.
 *
 * If the kit uses an existing component library (such as sit-onyx), this barrel
 * points to the package instead of local files; prototypes do not need to know
 * the difference.
 */

export { default as DsButton } from './DsButton.vue'
export type { DsButtonProps, DsButtonSize, DsButtonVariant } from './DsButton.vue'
