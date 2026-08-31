<!--
  Shared shell for the `example` screens.

  It intentionally lives in _shared/ and is therefore NOT a route, even though
  it is a .vue file with a default export. This verifies the convention: only
  files directly under src/prototypes/<slug>/ are routed.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const { title, back } = defineProps<{
  title: string
  back?: { to: string; label: string }
}>()
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <header class="border-b border-line">
      <div class="mx-auto flex max-w-4xl flex-wrap items-baseline gap-4 px-6 py-4">
        <RouterLink
          :to="back?.to ?? '/'"
          class="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline"
        >
          ← {{ back?.label ?? 'Overview' }}
        </RouterLink>
        <h1 class="text-lg font-medium text-ink">{{ title }}</h1>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-6 py-8"><slot /></main>
  </div>
</template>
