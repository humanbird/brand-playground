import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `pnpm dev`    → Development server on fixed port 5300
// `pnpm export` → Static single-file export to export/index.html
//                 (opens directly in the browser via double-click, hence hash history + base './')
export default defineConfig({
  plugins: [vue(), tailwindcss(), viteSingleFile()],
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
