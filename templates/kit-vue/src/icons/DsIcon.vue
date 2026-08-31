<!--
  Ein Icon aus dem Set in src/icons/icons.ts.

  Größe kommt über Utilities (`h-5 w-5`), Farbe über den Textkontext
  (currentColor) — nie per fill-Prop.

      <DsIcon name="Close" />
      <DsIcon name="Arrow-Right" title="Weiter" class="h-5 w-5" />

  Diese Datei bleibt beim Generieren unverändert; ausgetauscht wird nur das
  ICONS-Objekt daneben.
-->

<script lang="ts">
export type DsIconProps = {
  name: DsIconName
  /**
   * Beschriftung für Screenreader. Fehlt sie, gilt das Icon als dekorativ und
   * wird mit aria-hidden ausgeblendet — das ist der Normalfall neben einem
   * Textlabel.
   */
  title?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { ICONS, type DsIconName } from './icons'

const { name, title } = defineProps<DsIconProps>()

const icon = computed(() => ICONS[name])
</script>

<template>
  <svg
    :viewBox="icon.viewBox"
    fill="currentColor"
    class="inline-block shrink-0"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : true"
    focusable="false"
  >
    <title v-if="title">{{ title }}</title>
    <!-- eslint-disable-next-line vue/no-v-html -- Inhalt stammt ausschliesslich aus ICONS -->
    <g v-html="icon.body" />
  </svg>
</template>
