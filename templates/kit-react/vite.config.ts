import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `pnpm dev`    → Dev-Server auf festem Port 5300
// `pnpm export` → statischer Einzeldatei-Export nach export/index.html
//                 (per Doppelklick im Browser lauffähig, daher HashRouter + base './')
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
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
