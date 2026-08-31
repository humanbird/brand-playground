/*
 * Automatic routing. Do not edit.
 *
 * Routes are derived from the folder structure under src/prototypes/ (see
 * src/prototypes.ts). Nothing is registered or maintained here.
 *
 * HashRouter is used instead of BrowserRouter so the single-file export
 * (`pnpm export` → export/index.html) works without a server: routes live after
 * the #, while the file system only sees one index.html.
 *
 * The scroll reset on route changes also lives here, once for all prototypes.
 * Otherwise, the next screen could open halfway down the page.
 */

import { useEffect } from 'react'
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router'

import { HomeView } from './HomeView'
import { screens } from './prototypes'

function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-xl font-bold text-ink">This route does not exist</h1>
      <p className="mt-3 text-base text-ink-muted">
        Routes are generated from files under <code className="font-mono">src/prototypes/</code>.
        If a route is missing, its file is missing.
      </p>
      <Link to="/" className="mt-6 inline-block text-base text-accent underline underline-offset-4">
        Back to overview
      </Link>
    </main>
  )
}

/**
 * HashRouter retains the scroll position across route changes, but every screen
 * should start at the top. Anchor navigation is unavailable in hash mode anyway.
 * This belongs in the router, not in a prototype's AppShell.
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
