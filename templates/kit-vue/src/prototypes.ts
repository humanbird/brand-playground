/*
 * Auto-Discovery der Prototypen. Nicht anfassen.
 *
 * Die Konvention — Ordner anlegen heisst Route existiert:
 *
 *   src/prototypes/<slug>/index.vue     →  /p/<slug>
 *   src/prototypes/<slug>/<Name>.vue    →  /p/<slug>/<name>   (klein geschrieben)
 *   src/prototypes/<slug>/_shared/…     →  wird NICHT geroutet
 *                                          (gemeinsame Shell, Mockdaten, Helfer)
 *
 * Es gibt keine Registry und kein Config-File. Wer eine Route will, legt eine
 * Datei an; wer sie loswerden will, löscht sie.
 *
 * Slugs mit dem Präfix `idea-` gelten als divergente Varianten (/ideate) und
 * werden auf der Übersicht getrennt gelistet.
 */

import type { Component } from 'vue'

/** Slug-Präfix, das einen Prototyp als Idee (divergente Variante) markiert. */
export const IDEA_PREFIX = 'idea-'

export type Screen = {
  /** Dateiname ohne Endung, z.B. "Detail" bzw. "index". */
  name: string
  /** Anzeigename in der Übersicht. */
  label: string
  /** Vollständige Route, z.B. "/p/beispiel/detail". */
  path: string
  /** true für die index.vue eines Prototyps. */
  isIndex: boolean
  component: Component
}

export type Prototype = {
  slug: string
  /** Route des Einstiegs-Screens. */
  path: string
  screens: Screen[]
  /** Slug beginnt mit `idea-`. */
  isIdea: boolean
  /** true, wenn keine index.vue existiert — dann ist der Einstieg der erste Screen. */
  missingIndex: boolean
}

type ScreenModule = { default?: Component }

// Genau eine Ebene unterhalb von prototypes/ — dadurch fällt _shared/ heraus,
// ohne dass es ausgeschlossen werden müsste.
const modules = import.meta.glob<ScreenModule>('./prototypes/*/*.vue', { eager: true })

const FILE_PATTERN = /^\.\/prototypes\/([^/]+)\/([^/]+)\.vue$/

function collect(): Prototype[] {
  const bySlug = new Map<string, Screen[]>()

  for (const [file, mod] of Object.entries(modules)) {
    const match = FILE_PATTERN.exec(file)
    if (!match) continue

    const slug = match[1]!
    const name = match[2]!

    // Unterstriche markieren Nicht-Routen (z.B. ein _shared-Ordner auf Slug-Ebene).
    if (slug.startsWith('_') || name.startsWith('_')) continue

    const component = mod.default
    if (!component) {
      console.warn(`[prototypes] ${file} hat keinen Default-Export und wird nicht geroutet.`)
      continue
    }

    const isIndex = name === 'index'
    const path = isIndex ? `/p/${slug}` : `/p/${slug}/${name.toLowerCase()}`

    const screens = bySlug.get(slug) ?? []
    screens.push({ name, label: isIndex ? 'Start' : name, path, isIndex, component })
    bySlug.set(slug, screens)
  }

  return [...bySlug.entries()]
    .map(([slug, screens]) => {
      screens.sort((a, b) => {
        if (a.isIndex !== b.isIndex) return a.isIndex ? -1 : 1
        return a.name.localeCompare(b.name, 'de')
      })
      const first = screens[0]!
      return {
        slug,
        path: first.path,
        screens,
        isIdea: slug.startsWith(IDEA_PREFIX),
        missingIndex: !first.isIndex,
      }
    })
    .sort((a, b) => a.slug.localeCompare(b.slug, 'de'))
}

export const prototypes: Prototype[] = collect()

/** Konvergente Prototypen (/proto). */
export const protoPrototypes = prototypes.filter((p) => !p.isIdea)

/** Divergente Varianten (/ideate) — Slug beginnt mit `idea-`. */
export const ideaPrototypes = prototypes.filter((p) => p.isIdea)

/** Alle Screens flach, in Routen-Reihenfolge. */
export const screens: Screen[] = prototypes.flatMap((p) => p.screens)
