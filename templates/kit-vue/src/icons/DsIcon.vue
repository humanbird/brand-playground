<!--
  An icon from the set in src/icons/icons.ts.

  Size comes from utilities (`h-5 w-5`) and color from the text context
  (currentColor), never from a fill prop.

      <DsIcon name="Close" />
      <DsIcon name="Arrow-Right" title="Continue" class="h-5 w-5" />

  This file remains unchanged during generation; only the adjacent ICONS object
  is replaced.
-->

<script lang="ts">
export type DsIconProps = {
  name: DsIconName
  /**
   * Accessible label for screen readers. Without one, the icon is decorative
   * and hidden with aria-hidden, which is the normal case beside a text label.
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
    <!-- eslint-disable-next-line vue/no-v-html -- Content comes exclusively from ICONS -->
    <g v-html="icon.body" />
  </svg>
</template>
