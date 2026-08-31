/*
 * Automatic prototype discovery. Do not edit.
 *
 * Convention: creating a folder creates a route.
 *
 *   src/prototypes/<slug>/index.vue     →  /p/<slug>
 *   src/prototypes/<slug>/<Name>.vue    →  /p/<slug>/<name>   (lowercase)
 *   src/prototypes/<slug>/_shared/…     →  NOT routed
 *                                          (shared shell, mock data, helpers)
 *
 * There is no registry or config file. To create a route, add a file; to remove
 * the route, delete the file.
 *
 * Slugs with the `idea-` prefix are treated as divergent variants (/ideate) and
 * listed separately on the overview page.
 */

import type { Component } from 'vue'

/** Slug prefix that marks a prototype as an idea (divergent variant). */
export const IDEA_PREFIX = 'idea-'

export type Screen = {
  /** File name without its extension, for example "Detail" or "index". */
  name: string
  /** Display name on the overview page. */
  label: string
  /** Full route, for example "/p/example/detail". */
  path: string
  /** true for a prototype's index.vue. */
  isIndex: boolean
  component: Component
}

export type Prototype = {
  slug: string
  /** Route to the entry screen. */
  path: string
  screens: Screen[]
  /** Slug starts with `idea-`. */
  isIdea: boolean
  /** true when no index.vue exists; the first screen is then the entry screen. */
  missingIndex: boolean
}

type ScreenModule = { default?: Component }

// Exactly one level below prototypes/, which naturally excludes _shared/
// without requiring an explicit filter.
const modules = import.meta.glob<ScreenModule>('./prototypes/*/*.vue', { eager: true })

const FILE_PATTERN = /^\.\/prototypes\/([^/]+)\/([^/]+)\.vue$/

function collect(): Prototype[] {
  const bySlug = new Map<string, Screen[]>()

  for (const [file, mod] of Object.entries(modules)) {
    const match = FILE_PATTERN.exec(file)
    if (!match) continue

    const slug = match[1]!
    const name = match[2]!

    // Underscores mark non-routes, such as a _shared folder at the slug level.
    if (slug.startsWith('_') || name.startsWith('_')) continue

    const component = mod.default
    if (!component) {
      console.warn(`[prototypes] ${file} has no default export and will not be routed.`)
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

/** Convergent prototypes (/proto). */
export const protoPrototypes = prototypes.filter((p) => !p.isIdea)

/** Divergent variants (/ideate): the slug starts with `idea-`. */
export const ideaPrototypes = prototypes.filter((p) => p.isIdea)

/** All screens flattened in route order. */
export const screens: Screen[] = prototypes.flatMap((p) => p.screens)
