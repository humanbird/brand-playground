/*
 * Automatic routing. Do not edit.
 *
 * Routes are derived from the folder structure under src/prototypes/ (see
 * src/prototypes.ts). Nothing is registered or maintained here.
 *
 * Hash history is used instead of the History API so the single-file export
 * (`pnpm export` → export/index.html) works without a server: routes live after
 * the #, while the file system only sees one index.html.
 *
 * The scroll reset on route changes also lives here, once for all prototypes.
 * Otherwise, the next screen could open halfway down the page. In Vue, the
 * router's `scrollBehavior` is the intended place for this; no separate
 * component is required.
 */

import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

import DeviceFrame from './DeviceFrame.vue'
import HomeView from './HomeView.vue'
import NotFound from './NotFound.vue'
import { exportedOnly, screens } from './prototypes'
import { FRAME_PREFIX, openPath, resolveViewport } from './viewport'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    // A `pnpm export --only <slug>` build contains one prototype; the overview
    // would list exactly that one, so open it directly at its declared viewport.
    beforeEnter: () =>
      exportedOnly
        ? openPath(exportedOnly.path, resolveViewport(exportedOnly.judgeAt, 'auto'))
        : true,
  },
  ...screens.map(
    (screen): RouteRecordRaw => ({
      path: screen.path,
      component: screen.component,
    }),
  ),
  { path: `${FRAME_PREFIX}/:target(.*)`, name: 'frame', component: DeviceFrame },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // Every screen starts at the top. Anchor navigation is unavailable in hash mode anyway.
  scrollBehavior: () => ({ top: 0 }),
})
