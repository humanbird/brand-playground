<!--
  Device frame: renders a prototype inside an iframe of a fixed width so it
  can be judged at a mobile viewport on a desktop browser. Do not edit.

  Route: /frame/p/<slug>[/<screen>][?query]. The iframe loads this very page
  (same index.html, same single-file export) at the wrapped route, so it works
  in `pnpm dev` and in the offline export alike. The prototype inside knows
  nothing about the frame.
-->

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { exportedOnly, prototypes, type Viewport } from './prototypes'
import { FRAME_PREFIX, frameWidth, viewportLabel } from './viewport'

const route = useRoute()

const routePath = computed(() => route.path.slice(FRAME_PREFIX.length))
const target = computed(() => route.fullPath.slice(FRAME_PREFIX.length))
const prototype = computed(() =>
  prototypes.find((p) => p.screens.some((s) => s.path === routePath.value)),
)
// A declared width wins; otherwise the frame is the mobile viewport.
const viewport = computed<Viewport>(() =>
  typeof prototype.value?.judgeAt === 'number' ? prototype.value.judgeAt : 'mobile',
)
const width = computed(() => frameWidth(viewport.value))
const title = computed(() => prototype.value?.title ?? routePath.value)
const src = computed(
  () => `${window.location.pathname}${window.location.search}#${target.value}`,
)
</script>

<template>
  <div class="kit-frame-page">
    <header class="kit-bar">
      <RouterLink v-if="!exportedOnly" to="/" class="kit-link">← Overview</RouterLink>
      <span class="kit-bar-title">{{ title }}</span>
      <nav class="kit-toggle" aria-label="Viewport">
        <RouterLink :to="target" class="kit-toggle-option">Desktop</RouterLink>
        <span class="kit-toggle-option" aria-current="true">{{ viewportLabel(viewport) }}</span>
      </nav>
    </header>

    <div class="kit-frame" :style="{ '--kit-frame-width': `${width}px` }">
      <iframe :src="src" :title="title" />
    </div>
  </div>
</template>
