<!--
  Gemeinsame Shell der Screens von `beispiel`.

  Liegt bewusst in _shared/ — und ist deshalb KEINE Route, obwohl es eine
  .vue-Datei mit Default-Export ist. Genau das ist die Probe auf die Konvention:
  geroutet wird nur, was direkt in src/prototypes/<slug>/ liegt.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const { titel, zurueck } = defineProps<{
  titel: string
  zurueck?: { to: string; label: string }
}>()
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <header class="border-b border-line">
      <div class="mx-auto flex max-w-4xl flex-wrap items-baseline gap-4 px-6 py-4">
        <RouterLink
          :to="zurueck?.to ?? '/'"
          class="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline"
        >
          ← {{ zurueck?.label ?? 'Übersicht' }}
        </RouterLink>
        <h1 class="text-lg font-medium text-ink">{{ titel }}</h1>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-6 py-8"><slot /></main>
  </div>
</template>
