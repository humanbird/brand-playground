import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Order matters:
// 1. Fonts   — self-hosted @font-face rules (no CDN)
// 2. Tokens  — frozen design-system values
// 3. Tailwind + @theme — maps tokens to utilities
// 4. Kit     — scaffold styles (overview, device frame), generator-owned
// 5. Fixes   — documented corrections loaded last
import '../design/fonts.css'
import '../design/tokens.css'
import './styles.css'
import './kit.css'
import '../design/fixes.css'

import { AppRouter } from './router'

const container = document.getElementById('root')
if (!container) throw new Error('#root is missing from index.html')

createRoot(container).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
