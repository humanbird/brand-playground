<!--
  Fallback route. Never maintained; do not edit.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="mx-auto max-w-2xl px-6 py-12">
    <h1 class="text-xl font-bold text-ink">This route does not exist</h1>
    <p class="mt-3 text-base text-ink-muted">
      Routes are generated from files under <code class="font-mono">src/prototypes/</code>.
      If a route is missing, its file is missing.
    </p>
    <RouterLink
      to="/"
      class="mt-6 inline-block text-base text-accent underline underline-offset-4"
    >
      Back to overview
    </RouterLink>
  </main>
</template>
