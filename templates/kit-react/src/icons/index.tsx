/*
 * src/icons: the frozen design-system icon set.
 *
 * GENERATOR FILE: `/basis` replaces `ICONS` with the target design system's
 * actual set (from the SVG sprite, icon library, or Figma components), frozen as
 * React components. No external requests, no `<use>` reference to a sprite file,
 * and no runtime icon npm package: the single-file export must work offline.
 * The two symbols below only demonstrate the expected structure.
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

import type { JSX, SVGProps } from 'react'

type IconDef = { viewBox: string; body: JSX.Element }

const ICONS = {
  'Arrow-Right': {
    viewBox: '0 0 20 20',
    body: (
      <path
        d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L15.586 11H2a1 1 0 1 1 0-2h13.586l-4.293-4.293a1 1 0 0 1 0-1.414Z"
        fill="currentColor"
        fillRule="nonzero"
      />
    ),
  },
  Close: {
    viewBox: '0 0 20 20',
    body: (
      <path
        d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
        fill="currentColor"
        fillRule="nonzero"
      />
    ),
  },
} satisfies Record<string, IconDef>

/** All symbol names in the set. */
export type DsIconName = keyof typeof ICONS

/** Runtime name list for icon overviews, pickers, and tests. */
export const dsIconNames = Object.keys(ICONS) as DsIconName[]

export type DsIconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: DsIconName
  /**
   * Accessible label for screen readers. Without one, the icon is decorative
   * and hidden with aria-hidden, which is the normal case beside a text label.
   */
  title?: string
}

/**
 * An icon from the set. Size comes from utilities (`h-5 w-5`) and color from
 * the text context (currentColor), never from a fill prop.
 */
export function DsIcon({ name, title, className, ...rest }: DsIconProps) {
  const icon = ICONS[name]
  return (
    <svg
      viewBox={icon.viewBox}
      fill="currentColor"
      className={['inline-block shrink-0', className].filter(Boolean).join(' ')}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {icon.body}
    </svg>
  )
}

export default DsIcon
