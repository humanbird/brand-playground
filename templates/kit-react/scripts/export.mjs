#!/usr/bin/env node
/*
 * Single-file export. Do not edit.
 *
 *   pnpm export                 every prototype  → export/index.html
 *   pnpm export --only <slug>   one prototype    → export/index.html
 *
 * The result is one HTML file that opens by double-click, offline, and can be
 * sent as is. `--only` keeps just src/prototypes/<slug>/ (plus its _shared/)
 * and opens that prototype directly; the mechanism is the VITE_ONLY variable
 * read by vite.config.ts.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { preflight } from './preflight.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const prototypesDir = resolve(root, 'src', 'prototypes')

function slugs() {
  return readdirSync(prototypesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
    .sort()
}

function parseArgs(argv) {
  let only
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--') continue
    if (arg === '--only') only = argv[++i]
    else if (arg.startsWith('--only=')) only = arg.slice('--only='.length)
    else {
      console.error(`Unknown argument: ${arg}\nUsage: pnpm export [--only <slug>]`)
      process.exit(1)
    }
  }
  if (only !== undefined && !existsSync(resolve(prototypesDir, only))) {
    console.error(
      `No prototype "${only ?? ''}" under src/prototypes/.\nAvailable: ${slugs().join(', ') || '(none)'}`,
    )
    process.exit(1)
  }
  return { only }
}

const { only } = parseArgs(process.argv.slice(2))

if (!(await preflight({ checkPort: false }))) process.exit(1)

const build = spawnSync('pnpm', ['exec', 'vite', 'build'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, VITE_ONLY: only ?? '' },
})
if (build.status !== 0) process.exit(build.status ?? 1)

const file = resolve(root, 'export', 'index.html')
const kb = Math.round(statSync(file).size / 1024)
const included = only ? [only] : slugs()
console.log(`\nexport/index.html · ${kb} KB · ${included.length === 1 ? 'prototype' : 'prototypes'}: ${included.join(', ')}`)
console.log('One file, works offline by double-click. Share it as is, or publish it as a Claude Artifact for a private link.')
