/*
 * Viewport handling for the scaffold. Do not edit.
 *
 * A prototype declares the viewport it should be judged at in its meta
 * (`judgeAt`: 'desktop' | 'mobile' | width in px). The overview offers a
 * three-way choice on top of that: Auto (as declared), Desktop, Mobile. Any
 * non-desktop viewport opens the prototype inside the device frame route
 * (`/frame/p/<slug>…`, see DeviceFrame), which renders it in an iframe of the
 * chosen width. Prototypes never know whether they run framed or not.
 */

import type { Viewport } from './prototypes'

/** Route prefix of the device frame; the framed prototype's route follows it. */
export const FRAME_PREFIX = '/frame'

/** Width of the "mobile" viewport in CSS px. */
export const MOBILE_WIDTH = 375

/** What the overview's toggle can be set to. */
export type ViewportChoice = 'auto' | 'desktop' | 'mobile'

const STORAGE_KEY = 'kit.viewport'

/** The persisted toggle choice; 'auto' when nothing is stored or storage is unavailable. */
export function readViewportChoice(): ViewportChoice {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'desktop' || stored === 'mobile') return stored
  } catch {
    // Storage may be blocked (private mode, file://); the choice then lives per page load.
  }
  return 'auto'
}

export function writeViewportChoice(choice: ViewportChoice) {
  try {
    if (choice === 'auto') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // See readViewportChoice.
  }
}

/** The viewport a prototype effectively opens at, given the toggle choice. */
export function resolveViewport(judgeAt: Viewport | undefined, choice: ViewportChoice): Viewport {
  if (choice === 'auto') return judgeAt ?? 'desktop'
  return choice
}

/** Frame width in px for a viewport (desktop has no frame). */
export function frameWidth(viewport: Viewport): number {
  return typeof viewport === 'number' ? viewport : MOBILE_WIDTH
}

/** Route to a screen inside the device frame. */
export function framePath(path: string): string {
  return FRAME_PREFIX + path
}

/** Route to open a screen at the given viewport: direct for desktop, framed otherwise. */
export function openPath(path: string, viewport: Viewport): string {
  return viewport === 'desktop' ? path : framePath(path)
}

/** Short human label for a declared viewport, for the overview. */
export function viewportLabel(viewport: Viewport): string {
  if (viewport === 'desktop') return 'desktop'
  if (viewport === 'mobile') return `mobile · ${MOBILE_WIDTH} px`
  return `${viewport} px`
}
