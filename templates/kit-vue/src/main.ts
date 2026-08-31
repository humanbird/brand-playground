import { createApp } from 'vue'

// Order matters:
// 1. Fonts   — self-hosted @font-face rules (no CDN)
// 2. Tokens  — frozen design-system values
// 3. Tailwind + @theme — maps tokens to utilities
// 4. Fixes   — documented corrections loaded last
import '../design/fonts.css'
import '../design/tokens.css'
import './styles.css'
import '../design/fixes.css'

import App from './App.vue'
import { router } from './router'

const container = document.getElementById('app')
if (!container) throw new Error('#app is missing from index.html')

createApp(App).use(router).mount(container)
