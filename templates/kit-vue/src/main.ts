import { createApp } from 'vue'

// Reihenfolge ist bedeutsam:
// 1. Fonts   — selbst gehostete @font-face-Regeln (kein CDN)
// 2. Tokens  — die eingefrorenen Werte des Designsystems
// 3. Tailwind + @theme — bildet die Tokens auf Utilities ab
// 4. Fixes   — dokumentierte Korrekturen, gewinnen zuletzt
import '../design/fonts.css'
import '../design/tokens.css'
import './styles.css'
import '../design/fixes.css'

import App from './App.vue'
import { router } from './router'

const container = document.getElementById('app')
if (!container) throw new Error('#app fehlt in index.html')

createApp(App).use(router).mount(container)
