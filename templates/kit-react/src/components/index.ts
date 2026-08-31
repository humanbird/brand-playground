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
 */

export { DsButton, type DsButtonProps, type DsButtonSize, type DsButtonVariant } from './DsButton'
