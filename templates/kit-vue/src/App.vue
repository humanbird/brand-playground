<!--
  Wurzelkomponente. Enthält bewusst nichts außer dem RouterView — jede Shell,
  jede Navigation, jeder Rahmen gehört in den jeweiligen Prototyp
  (src/prototypes/<slug>/_shared/), nicht hierher.

  Nicht anfassen.
-->

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>
