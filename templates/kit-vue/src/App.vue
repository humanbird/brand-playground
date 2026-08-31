<!--
  Root component. Intentionally contains only RouterView. Each shell, navigation
  element, and frame belongs in its respective prototype
  (src/prototypes/<slug>/_shared/), not here.

  Do not edit.
-->

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>
