/*
 * src/icons/icons.ts: the frozen design-system icon set.
 *
 * GENERATOR FILE: `/basis` replaces `ICONS` with the target design system's
 * actual set (from the SVG sprite, icon library, or Figma components), frozen as
 * path markup. No external requests, no `<use>` reference to a sprite file, and
 * no runtime icon npm package: the single-file export must work offline. The two
 * symbols below only demonstrate the expected structure.
 *
 * Vue detail: symbols are stored as SVG markup strings (React would use JSX
 * fragments). `DsIcon.vue` inserts them into the <svg> with `v-html`. This is
 * safe while the content comes from THIS file. Never pass a name from user input
 * into `ICONS`.
 *
 * Conventions for EVERY set:
 *  - Paths use `fill="currentColor"`; color ALWAYS comes from the text context
 *    (`text-ink`, `text-accent`). Never add a `fill` prop or a hex value to a
 *    path, or the icon becomes the only prototype element that ignores tokens.
 *  - Set size with utilities (`h-5 w-5`), not width/height attributes.
 *  - ONE set, one style. Never mix in a second set (Lucide, Feather, Material),
 *    because the inconsistency is immediately visible. Add missing symbols in
 *    the set's own style.
 *  - Keep the original names so the ingest report and kit use the same terms.
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

/** All symbol names in the set. */
export type DsIconName = keyof typeof ICONS

/** Runtime name list for icon overviews, pickers, and tests. */
export const dsIconNames = Object.keys(ICONS) as DsIconName[]
