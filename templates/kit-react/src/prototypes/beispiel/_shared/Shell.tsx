/*
 * Gemeinsame Shell der Screens von `beispiel`.
 *
 * Liegt bewusst in _shared/ — und ist deshalb KEINE Route, obwohl es eine
 * .tsx-Datei mit Default-Export ist. Genau das ist die Probe auf die Konvention:
 * geroutet wird nur, was direkt in src/prototypes/<slug>/ liegt.
 */

import type { ReactNode } from 'react'
import { Link } from 'react-router'

export function Shell({
  titel,
  zurueck,
  children,
}: {
  titel: string
  zurueck?: { to: string; label: string }
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-4xl flex-wrap items-baseline gap-4 px-6 py-4">
          <Link
            to={zurueck?.to ?? '/'}
            className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline"
          >
            ← {zurueck?.label ?? 'Übersicht'}
          </Link>
          <h1 className="text-lg font-medium text-ink">{titel}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  )
}

export default Shell
