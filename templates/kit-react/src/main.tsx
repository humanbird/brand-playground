import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Reihenfolge ist bedeutsam:
// 1. Fonts   — selbst gehostete @font-face-Regeln (kein CDN)
// 2. Tokens  — die eingefrorenen Werte des Designsystems
// 3. Tailwind + @theme — bildet die Tokens auf Utilities ab
// 4. Fixes   — dokumentierte Korrekturen, gewinnen zuletzt
import '../design/fonts.css'
import '../design/tokens.css'
import './styles.css'
import '../design/fixes.css'

import { AppRouter } from './router'

const container = document.getElementById('root')
if (!container) throw new Error('#root fehlt in index.html')

createRoot(container).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
