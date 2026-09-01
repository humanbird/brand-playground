#!/usr/bin/env node
/*
 * Preflight: checks the machine before the dev server starts and says, in plain
 * words, what to do if something is missing. Runs via `pnpm preflight` and
 * automatically before `pnpm dev`. Do not edit.
 *
 *   node scripts/preflight.mjs            all checks
 *   node scripts/preflight.mjs --no-port  skip the port check (used by export)
 *
 * Exit code 1 if anything blocks; every failure comes with its fix.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const MIN_NODE = [22, 22]
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** Port from vite.config.ts, so this script never disagrees with the server. */
export function readPort() {
  const config = readFileSync(resolve(root, 'vite.config.ts'), 'utf8')
  const match = /port:\s*(\d+)/.exec(config)
  return match ? Number(match[1]) : 5173
}

function portFree(port, host) {
  return new Promise((done) => {
    const server = createServer()
    server.unref()
    server.once('error', (error) => done(error.code !== 'EADDRINUSE'))
    server.listen({ port, host, exclusive: true }, () => server.close(() => done(true)))
  })
}

/**
 * Runs the checks and prints one line per check.
 * @param {{ checkPort?: boolean }} options
 * @returns {Promise<boolean>} true when nothing blocks
 */
export async function preflight({ checkPort = true } = {}) {
  const results = []
  const ok = (what) => results.push({ ok: true, what })
  const fail = (what, fix) => results.push({ ok: false, what, fix })

  // Node
  const [major, minor] = process.versions.node.split('.').map(Number)
  const nodeOk = major > MIN_NODE[0] || (major === MIN_NODE[0] && minor >= MIN_NODE[1])
  if (nodeOk) ok(`Node ${process.versions.node}`)
  else
    fail(
      `Node ${process.versions.node} is too old (needs ${MIN_NODE.join('.')} or newer)`,
      'Install a current Node from https://nodejs.org, then run the command again.',
    )

  // pnpm
  const agent = process.env.npm_config_user_agent ?? ''
  if (agent.startsWith('pnpm/')) ok(`pnpm ${agent.split(' ')[0].slice(5)}`)
  else {
    const probe = spawnSync('pnpm', ['--version'], { encoding: 'utf8', shell: process.platform === 'win32' })
    if (probe.status === 0) ok(`pnpm ${probe.stdout.trim()}`)
    else fail('pnpm is not installed', 'Install pnpm: npm i -g pnpm')
  }

  // Dependencies
  if (existsSync(resolve(root, 'node_modules', 'vite', 'package.json'))) ok('dependencies installed')
  else fail('dependencies are not installed', 'Install them: pnpm install')

  // Port
  if (checkPort) {
    const port = readPort()
    const free = (await portFree(port, '127.0.0.1')) && (await portFree(port, '::1'))
    if (free) ok(`port ${port} is free`)
    else
      fail(
        `port ${port} is already in use (another kit's dev server?)`,
        `Stop the other server, or give this kit its own port in vite.config.ts AND .claude/launch.json (keep both in sync).`,
      )
  }

  for (const result of results) {
    console.log(`${result.ok ? '  ok ' : ' FAIL'}  ${result.what}`)
    if (!result.ok) console.log(`        → ${result.fix}`)
  }

  const failures = results.filter((r) => !r.ok).length
  if (failures) console.log(`\npreflight: ${failures} problem${failures === 1 ? '' : 's'} to fix first.`)
  return failures === 0
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const checkPort = !process.argv.includes('--no-port')
  preflight({ checkPort }).then((passed) => process.exit(passed ? 0 : 1))
}
