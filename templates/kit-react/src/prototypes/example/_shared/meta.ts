/*
 * Optional metadata for the `example` prototype. Read by src/prototypes.ts and
 * shown on the overview instead of the raw slug. Without this file the overview
 * falls back to a humanized slug ("Example") and the desktop viewport.
 */

import type { PrototypeMeta } from '../../../prototypes'

export const meta: PrototypeMeta = {
  title: 'Work orders',
  description: 'Can a field technician find and complete this week’s work orders without a search box?',
  judgeAt: 'desktop',
}
