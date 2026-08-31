<!--
  Fallback-Route. Wird nie gepflegt, nicht anfassen.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="mx-auto max-w-2xl px-6 py-12">
    <h1 class="text-xl font-bold text-ink">Diese Route gibt es nicht</h1>
    <p class="mt-3 text-base text-ink-muted">
      Routen entstehen aus Dateien unter <code class="font-mono">src/prototypes/</code>.
      Fehlt eine, fehlt die Datei.
    </p>
    <RouterLink
      to="/"
      class="mt-6 inline-block text-base text-accent underline underline-offset-4"
    >
      Zur Übersicht
    </RouterLink>
  </main>
</template>
