/*
 * Auto-Routing, nicht anfassen.
 *
 * Die Routen entstehen aus der Ordnerstruktur unter src/prototypes/ (siehe
 * src/prototypes.ts). Hier wird nichts eingetragen, hier wird nichts gepflegt.
 *
 * Hash-History statt History-API, damit der Einzeldatei-Export
 * (`pnpm export` → export/index.html) ohne Server funktioniert: Routen leben
 * hinter dem #, das Dateisystem sieht nur eine index.html.
 *
 * Der Scroll-Reset beim Routenwechsel sitzt ebenfalls hier — einmal für alle
 * Prototypen. Sonst startet der nächste Screen mittendrin. In Vue ist das
 * `scrollBehavior` des Routers die dafür vorgesehene Stelle; es braucht keine
 * eigene Komponente.
 */

import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

import HomeView from './HomeView.vue'
import NotFound from './NotFound.vue'
import { screens } from './prototypes'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  ...screens.map(
    (screen): RouteRecordRaw => ({
      path: screen.path,
      component: screen.component,
    }),
  ),
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // Jeder Screen beginnt oben. Ankersprünge gibt es im Hash-Modus ohnehin nicht.
  scrollBehavior: () => ({ top: 0 }),
})
