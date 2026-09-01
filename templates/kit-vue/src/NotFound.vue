<!--
  Fallback route. Never maintained; do not edit.
  Styling uses only the `.kit-*` classes from src/kit.css.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="kit-page kit-page-narrow kit-stack">
    <h1 class="kit-heading">This route does not exist</h1>
    <p class="kit-muted">
      Routes are generated from files under <code class="kit-code">src/prototypes/</code>.
      If a route is missing, its file is missing.
    </p>
    <p>
      <RouterLink to="/" class="kit-link">Back to overview</RouterLink>
    </p>
  </main>
</template>
