import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Node's `process` without pulling @types/node into the kit's type space.
declare const process: { env: Record<string, string | undefined> }

/**
 * `pnpm export --only <slug>` (scripts/export.mjs) sets VITE_ONLY. Before Vite
 * expands the discovery globs in src/prototypes.ts, this plugin narrows them to
 * that one folder, so the single file contains just that prototype and its
 * _shared/. Vite also exposes the variable to the app as import.meta.env.VITE_ONLY,
 * which is how the router knows to open the prototype instead of the overview.
 * Unset (dev, plain `pnpm export`), the plugin does nothing.
 */
function onlyPrototype(): Plugin {
  const only = process.env.VITE_ONLY
  return {
    name: 'kit:only-prototype',
    enforce: 'pre',
    transform(code, id) {
      if (!only || !id.endsWith('/src/prototypes.ts')) return
      return code.replaceAll("'./prototypes/*/", `'./prototypes/${only}/`)
    },
  }
}

// `pnpm dev`    → Development server on fixed port 5300 (after scripts/preflight.mjs)
// `pnpm export` → Static single-file export to export/index.html
//                 (opens directly in the browser via double-click, hence HashRouter + base './')
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), onlyPrototype()],
  base: './',
  server: {
    port: 5300,
    strictPort: true,
  },
  build: {
    outDir: 'export',
    emptyOutDir: true,
  },
})
