/*
 * DsButton — Beispiel-Komponente des Templates.
 *
 * GENERATOR-ORDNER: `/basis` ersetzt src/components/ durch die Komponenten des
 * Ziel-Designsystems (übernommen aus einer Code-Library oder generiert).
 * DsButton bleibt nur, wenn das Ziel-DS keine eigene Button-Komponente hat.
 *
 * Muster, an das sich generierte Komponenten halten:
 *  - keine Hex-, keine px-Werte — ausschliesslich Token-Utilities aus src/styles.css
 *  - Varianten als String-Union, nicht als Boolean-Schwarm
 *  - native Attribute durchreichen, damit Prototypen nicht am Typ scheitern
 *  - der Eintrag in design/components-meta.json ist Teil der Komponente
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
