/*
 * Device frame: renders a prototype inside an iframe of a fixed width so it
 * can be judged at a mobile viewport on a desktop browser. Do not edit.
 *
 * Route: /frame/p/<slug>[/<screen>][?query]. The iframe loads this very page
 * (same index.html, same single-file export) at the wrapped route, so it works
 * in `pnpm dev` and in the offline export alike. The prototype inside knows
 * nothing about the frame.
 */

import type { CSSProperties } from 'react'
import { Link, useLocation, useParams } from 'react-router'

import { exportedOnly, prototypes, type Prototype, type Viewport } from './prototypes'
import { frameWidth, viewportLabel } from './viewport'

function findPrototype(path: string): Prototype | undefined {
  return prototypes.find((p) => p.screens.some((s) => s.path === path))
}

export function DeviceFrame() {
  const params = useParams()
  const { search } = useLocation()
  const routePath = `/${params['*'] ?? ''}`
  const target = routePath + search

  const prototype = findPrototype(routePath)
  // A declared width wins; otherwise the frame is the mobile viewport.
  const viewport: Viewport = typeof prototype?.judgeAt === 'number' ? prototype.judgeAt : 'mobile'
  const width = frameWidth(viewport)
  const title = prototype?.title ?? routePath
  const src = `${window.location.pathname}${window.location.search}#${target}`

  return (
    <div className="kit-frame-page">
      <header className="kit-bar">
        {exportedOnly ? null : (
          <Link to="/" className="kit-link">
            ← Overview
          </Link>
        )}
        <span className="kit-bar-title">{title}</span>
        <nav className="kit-toggle" aria-label="Viewport">
          <Link to={target} className="kit-toggle-option">
            Desktop
          </Link>
          <span className="kit-toggle-option" aria-current="true">
            {viewportLabel(viewport)}
          </span>
        </nav>
      </header>

      <div className="kit-frame" style={{ '--kit-frame-width': `${width}px` } as CSSProperties}>
        <iframe src={src} title={title} />
      </div>
    </div>
  )
}

export default DeviceFrame
