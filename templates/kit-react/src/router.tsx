/*
 * Auto-Routing, nicht anfassen.
 *
 * Die Routen entstehen aus der Ordnerstruktur unter src/prototypes/ (siehe
 * src/prototypes.ts). Hier wird nichts eingetragen, hier wird nichts gepflegt.
 *
 * HashRouter statt BrowserRouter, damit der Einzeldatei-Export
 * (`pnpm export` → export/index.html) ohne Server funktioniert: Routen leben
 * hinter dem #, das Dateisystem sieht nur eine index.html.
 *
 * Der Scroll-Reset beim Routenwechsel sitzt ebenfalls hier — einmal für alle
 * Prototypen. Sonst startet der nächste Screen mittendrin.
 */

import { useEffect } from 'react'
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router'

import { HomeView } from './HomeView'
import { screens } from './prototypes'

function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-xl font-bold text-ink">Diese Route gibt es nicht</h1>
      <p className="mt-3 text-base text-ink-muted">
        Routen entstehen aus Dateien unter <code className="font-mono">src/prototypes/</code>.
        Fehlt eine, fehlt die Datei.
      </p>
      <Link to="/" className="mt-6 inline-block text-base text-accent underline underline-offset-4">
        Zur Übersicht
      </Link>
    </main>
  )
}

/**
 * Der HashRouter behält die Scrollposition über Routenwechsel hinweg. Jeder
 * Screen soll aber oben beginnen — Ankersprünge gibt es im Hash-Modus ohnehin
 * nicht. Gehört in den Router, nicht in die AppShell eines Prototyps.
 */
function ScrollReset() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname, search])

  return null
}

export function AppRouter() {
  return (
    <HashRouter>
      <ScrollReset />
      <Routes>
        <Route path="/" element={<HomeView />} />
        {screens.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}
