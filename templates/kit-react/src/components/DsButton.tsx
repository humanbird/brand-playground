/*
 * DsButton: template example component.
 *
 * GENERATOR FOLDER: `/basis` replaces src/components/ with the target design
 * system's components (adopted from a code library or generated).
 * DsButton remains only when the target design system has no button component.
 *
 * Pattern for generated components:
 *  - no hex or px values; use only token utilities from src/styles.css
 *  - variants as a string union, not a collection of booleans
 *  - forward native attributes so prototype types remain compatible
 *  - the design/components-meta.json entry is part of the component
 */

import type { ButtonHTMLAttributes } from 'react'

export type DsButtonVariant = 'primary' | 'secondary' | 'ghost'
export type DsButtonSize = 'sm' | 'md'

export type DsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: DsButtonVariant
  size?: DsButtonSize
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variants: Record<DsButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-line bg-canvas text-ink hover:bg-surface',
  ghost: 'text-accent hover:bg-surface',
}

const sizes: Record<DsButtonSize, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
}

export function DsButton({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  ...rest
}: DsButtonProps) {
  const classes = [base, variants[variant], sizes[size], className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...rest} />
}

export default DsButton
