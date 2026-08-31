/*
 * Shared shell for the `example` screens.
 *
 * It intentionally lives in _shared/ and is therefore NOT a route, even though
 * it is a .tsx file with a default export. This verifies the convention: only
 * files directly under src/prototypes/<slug>/ are routed.
 */

import type { ReactNode } from 'react'
import { Link } from 'react-router'

export function Shell({
  title,
  back,
  children,
}: {
  title: string
  back?: { to: string; label: string }
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-4xl flex-wrap items-baseline gap-4 px-6 py-4">
          <Link
            to={back?.to ?? '/'}
            className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline"
          >
            ← {back?.label ?? 'Overview'}
          </Link>
          <h1 className="text-lg font-medium text-ink">{title}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  )
}

export default Shell
