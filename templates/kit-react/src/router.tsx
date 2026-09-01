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
 *
 * Styling uses only the `.kit-*` classes from src/kit.css.
 */

import { useEffect } from 'react'
import { HashRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router'

import { DeviceFrame } from './DeviceFrame'
import { HomeView } from './HomeView'
import { exportedOnly, screens } from './prototypes'
import { FRAME_PREFIX, openPath, resolveViewport } from './viewport'

function NotFound() {
  return (
    <main className="kit-page kit-page-narrow kit-stack">
      <h1 className="kit-heading">This route does not exist</h1>
      <p className="kit-muted">
        Routes are generated from files under <code className="kit-code">src/prototypes/</code>.
        If a route is missing, its file is missing.
      </p>
      <p>
        <Link to="/" className="kit-link">
          Back to overview
        </Link>
      </p>
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

/**
 * A `pnpm export --only <slug>` build contains one prototype; the overview
 * would list exactly that one, so open it directly at its declared viewport.
 */
function Start() {
  if (!exportedOnly) return <HomeView />
  const viewport = resolveViewport(exportedOnly.judgeAt, 'auto')
  return <Navigate to={openPath(exportedOnly.path, viewport)} replace />
}

export function AppRouter() {
  return (
    <HashRouter>
      <ScrollReset />
      <Routes>
        <Route path="/" element={<Start />} />
        {screens.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path={`${FRAME_PREFIX}/*`} element={<DeviceFrame />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}
