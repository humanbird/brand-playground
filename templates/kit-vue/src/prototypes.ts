/*
 * Automatic prototype discovery. Do not edit.
 *
 * Convention: creating a folder creates a route.
 *
 *   src/prototypes/<slug>/index.vue        →  /p/<slug>
 *   src/prototypes/<slug>/<Name>.vue       →  /p/<slug>/<name>   (lowercase)
 *   src/prototypes/<slug>/_shared/…        →  NOT routed
 *                                             (shared shell, mock data, helpers)
 *   src/prototypes/<slug>/_shared/meta.ts  →  optional metadata (see PrototypeMeta)
 *
 * There is no registry or config file. To create a route, add a file; to remove
 * the route, delete the file.
 *
 * Slugs with the `idea-` prefix are treated as divergent variants (/ideate) and
 * listed separately on the overview page. Slugs with the `reference-` prefix
 * (or `meta.reference: true`) mark the kit's reference screen.
 *
 * `pnpm export --only <slug>` narrows the two globs below to one folder at
 * build time (see vite.config.ts); nothing else changes.
 */

import type { Component } from 'vue'

/** Slug prefix that marks a prototype as an idea (divergent variant). */
export const IDEA_PREFIX = 'idea-'

/** Slug prefix that marks the kit's reference screen. */
export const REFERENCE_PREFIX = 'reference-'

/** Viewport a prototype is meant to be judged at: desktop, mobile (375 px), or a width in px. */
export type Viewport = 'desktop' | 'mobile' | number

/**
 * Optional metadata a prototype declares in `_shared/meta.ts` (`export const meta`)
 * or as a named `meta` export of its index screen.
 */
export type PrototypeMeta = {
  /** Human title on the overview. Fallback: the humanized slug. */
  title?: string
  /** One or two sentences: the question this prototype answers. */
  description?: string
  /** Viewport to judge at. Non-desktop prototypes open inside the device frame. Default: desktop. */
  judgeAt?: Viewport
  /** Marks the reference screen. Implied by the `reference-` slug prefix. */
  reference?: boolean
}

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
  /** Human title: meta.title or the humanized slug. */
  title: string
  description?: string
  judgeAt: Viewport
  /** Route to the entry screen. */
  path: string
  screens: Screen[]
  /** Slug starts with `idea-`. */
  isIdea: boolean
  /** Reference screen: `reference-` slug prefix or meta.reference. */
  isReference: boolean
  /** true when no index.vue exists; the first screen is then the entry screen. */
  missingIndex: boolean
}

type ScreenModule = { default?: Component; meta?: PrototypeMeta }
type MetaModule = { meta?: PrototypeMeta }

// Exactly one level below prototypes/, which naturally excludes _shared/
// without requiring an explicit filter.
const modules = import.meta.glob<ScreenModule>('./prototypes/*/*.vue', { eager: true })
const metaModules = import.meta.glob<MetaModule>('./prototypes/*/_shared/meta.ts', { eager: true })

const FILE_PATTERN = /^\.\/prototypes\/([^/]+)\/([^/]+)\.vue$/
const META_PATTERN = /^\.\/prototypes\/([^/]+)\/_shared\/meta\.ts$/

/** "idea-cartridge-reminder" → "Cartridge reminder". */
export function humanize(slug: string): string {
  const words = slug
    .replace(new RegExp(`^(${IDEA_PREFIX}|${REFERENCE_PREFIX})`), '')
    .split(/[-_]+/)
    .filter(Boolean)
    .join(' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function collect(): Prototype[] {
  const bySlug = new Map<string, Screen[]>()
  const metaBySlug = new Map<string, PrototypeMeta>()

  for (const [file, mod] of Object.entries(metaModules)) {
    const slug = META_PATTERN.exec(file)?.[1]
    if (slug && mod.meta) metaBySlug.set(slug, mod.meta)
  }

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
    if (isIndex && mod.meta && !metaBySlug.has(slug)) metaBySlug.set(slug, mod.meta)

    const path = isIndex ? `/p/${slug}` : `/p/${slug}/${name.toLowerCase()}`

    const screens = bySlug.get(slug) ?? []
    screens.push({ name, label: isIndex ? 'Start' : name, path, isIndex, component })
    bySlug.set(slug, screens)
  }

  return [...bySlug.entries()]
    .map(([slug, screens]): Prototype => {
      screens.sort((a, b) => {
        if (a.isIndex !== b.isIndex) return a.isIndex ? -1 : 1
        return a.name.localeCompare(b.name, 'en')
      })
      const first = screens[0]!
      const meta = metaBySlug.get(slug) ?? {}
      return {
        slug,
        title: meta.title?.trim() || humanize(slug),
        description: meta.description,
        judgeAt: meta.judgeAt ?? 'desktop',
        path: first.path,
        screens,
        isIdea: slug.startsWith(IDEA_PREFIX),
        isReference: meta.reference === true || slug.startsWith(REFERENCE_PREFIX),
        missingIndex: !first.isIndex,
      }
    })
    .sort((a, b) => {
      // The reference screen leads; everything else is alphabetical.
      if (a.isReference !== b.isReference) return a.isReference ? -1 : 1
      return a.slug.localeCompare(b.slug, 'en')
    })
}

export const prototypes: Prototype[] = collect()

/** Convergent prototypes (/proto). */
export const protoPrototypes = prototypes.filter((p) => !p.isIdea)

/** Divergent variants (/ideate): the slug starts with `idea-`. */
export const ideaPrototypes = prototypes.filter((p) => p.isIdea)

/** All screens flattened in route order. */
export const screens: Screen[] = prototypes.flatMap((p) => p.screens)

/**
 * Set by `pnpm export --only <slug>`: the single prototype this build contains.
 * The router then opens it directly instead of the overview.
 */
export const exportedOnly: Prototype | undefined = (() => {
  const slug: unknown = import.meta.env.VITE_ONLY
  return typeof slug === 'string' && slug ? prototypes.find((p) => p.slug === slug) : undefined
})()
